import { PlanType, BillingCycle } from '@prisma/client';
import crypto from 'crypto';
import { IPaymentProvider, CreateOrderResult, VerifyPaymentPayload, VerifyPaymentResult } from './payment.provider';

export class RazorpayProvider implements IPaymentProvider {
  name = 'Razorpay';

  private getKeyId(): string {
    const keyId = process.env.RAZORPAY_KEY_ID;
    if (!keyId) {
      console.warn("RAZORPAY_KEY_ID environment variable is missing.");
    }
    return keyId || 'placeholder_key_id';
  }

  private getKeySecret(): string {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.warn("RAZORPAY_KEY_SECRET environment variable is missing.");
    }
    return secret || 'placeholder_key_secret';
  }

  async createOrder(userId: string, plan: PlanType, billingCycle: BillingCycle, amount: number): Promise<CreateOrderResult> {
    const keyId = this.getKeyId();
    const keySecret = this.getKeySecret();
    
    const amountInPaise = Math.round(amount * 100);
    const receipt = `rec_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt,
        notes: {
          userId,
          subscriptionPlan: plan,
          billingCycle
        }
      })
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      console.error('Razorpay Create Order API Failed:', errBody);
      throw new Error(`Failed to create order on Razorpay: ${errBody.error?.description || response.statusText}`);
    }

    const data = await response.json();
    
    return {
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId
    };
  }

  async verifyPayment(payload: VerifyPaymentPayload): Promise<VerifyPaymentResult> {
    const keySecret = this.getKeySecret();
    const text = `${payload.razorpayOrderId}|${payload.razorpayPaymentId}`;
    
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(text)
      .digest('hex');

    const isValid = expectedSignature === payload.razorpaySignature;

    if (!isValid) {
      return {
        success: false,
        error: 'Signature mismatch. The payment could not be securely verified.'
      };
    }

    return { success: true };
  }

  async verifyWebhookSignature(rawBody: string, signature: string): Promise<boolean> {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.warn("RAZORPAY_WEBHOOK_SECRET environment variable is missing.");
      return false;
    }

    const expectedSig = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    return expectedSig === signature;
  }
}

export default new RazorpayProvider();
