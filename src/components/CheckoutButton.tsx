'use client';

import React, { useState } from 'react';
import { Button } from './ui';
import { CreditCard } from 'lucide-react';

interface CheckoutButtonProps {
  plan: 'PRO' | 'ELITE';
  billingCycle: 'MONTHLY' | 'YEARLY';
  amount: number;
  className?: string;
  onSuccess?: () => void;
  children?: React.ReactNode;
}

export const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  plan,
  billingCycle,
  amount,
  className = '',
  onSuccess,
  children
}) => {
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // 1. Create order on backend
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, billingCycle })
      });

      if (!orderRes.ok) {
        const errorData = await orderRes.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to create checkout order');
      }

      const orderData = await orderRes.json();
      const { orderId, currency, keyId } = orderData.data;

      // 2. Load script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      // 3. Open Razorpay checkout options
      const options = {
        key: keyId,
        amount: amount * 100, // paise
        currency: currency || 'INR',
        name: 'CareerOS Subscriptions',
        description: `Upgrade to ${plan} (${billingCycle.toLowerCase()})`,
        order_id: orderId,
        handler: async (response: any) => {
          setLoading(true);
          try {
            // 4. Verify payment signature on backend
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                plan,
                billingCycle,
                amount
              })
            });

            if (!verifyRes.ok) {
              const verifyErr = await verifyRes.json().catch(() => ({}));
              throw new Error(verifyErr.error?.message || 'Payment signature verification failed.');
            }

            alert(`Payment successful! Your account has been upgraded to ${plan}.`);
            
            if (onSuccess) {
              onSuccess();
            } else {
              window.location.reload();
            }
          } catch (verifyError: any) {
            console.error('Verify error:', verifyError);
            alert(verifyError.message || 'Payment verification failed. Please contact support.');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          }
        },
        prefill: {
          name: '',
          email: '',
        },
        theme: {
          color: '#6D5EF5' // Brand primary color
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error('Checkout initialization failed:', err);
      alert(err.message || 'Unable to open checkout modal. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      loading={loading}
      variant="primary"
      className={className}
      icon={<CreditCard className="w-4 h-4" />}
    >
      {children || `Upgrade now for ₹${amount}`}
    </Button>
  );
};

export default CheckoutButton;
