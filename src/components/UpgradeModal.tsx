'use client';

import React, { useState } from 'react';
import { CheckoutButton } from './CheckoutButton';
import { X, Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface UpgradeModalProps {
  featureName: string;
  currentUsage: number;
  planLimit: number;
  currentPlan: string;
  recommendedPlan: 'PRO' | 'ELITE';
  isOpen: boolean;
  onClose: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  featureName,
  currentUsage,
  planLimit,
  currentPlan,
  recommendedPlan,
  isOpen,
  onClose
}) => {
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');

  if (!isOpen) return null;

  // Plan Prices
  const prices = {
    PRO: { MONTHLY: 199, YEARLY: 1999 },
    ELITE: { MONTHLY: 499, YEARLY: 4999 }
  };

  const amount = prices[recommendedPlan][billingCycle];

  const freeBenefits = [
    '10 Job Applications limit',
    '5 Resume Uploads limit',
    '10 Interviews scheduling limit',
    '25 Active Reminders limit',
    '100 MB Secure File Storage',
    'No Premium AI features'
  ];

  const proBenefits = [
    'Unlimited Applications',
    'Unlimited Resumes',
    'Unlimited Interviews',
    'Unlimited Reminders',
    '2 GB Secure File Storage',
    'Advanced Analytics',
    'Application Archiving & Export'
  ];

  const eliteBenefits = [
    'Everything in PRO plan',
    '10 GB Secure File Storage',
    '50 Gemini AI ATS Analysis / month',
    '50 Gemini AI Resume Match reviews',
    '30 Gemini AI Cover Letters / month',
    '50 Gemini AI Interview Preps / month',
    'Gemini AI Resume Rewrites & Insights'
  ];

  const benefitsToShow = recommendedPlan === 'ELITE' ? eliteBenefits : proBenefits;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-2xl bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh] transition-all duration-300"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-full hover:bg-slate-100 z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Limit Message and Plan Comparison */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 overflow-y-auto">
          <div>
            {/* Warning Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200 mb-4">
              <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              Limit Reached
            </span>

            <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-snug">
              Unlock Unlimited potential on {recommendedPlan}!
            </h3>
            
            <p className="text-sm text-slate-500 mt-2">
              You've hit your limit of <strong>{planLimit} {featureName.toLowerCase()}</strong> on the <strong>{currentPlan}</strong> plan.
            </p>

            {/* Comparison Details */}
            <div className="mt-6 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Currently on {currentPlan}</span>
                <ul className="mt-1.5 space-y-1">
                  {freeBenefits.slice(0, 3).map((b, idx) => (
                    <li key={idx} className="text-xs text-slate-500 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-center text-slate-300">
                <ArrowRight className="w-5 h-5 rotate-90 md:rotate-0" />
              </div>

              <div className="p-4 bg-[#F3F1FF] rounded-xl border border-[#6D5EF5]/10">
                <span className="text-xs font-bold text-[#6D5EF5] block uppercase tracking-wider">Unlocks with {recommendedPlan}</span>
                <ul className="mt-2 space-y-2">
                  {benefitsToShow.slice(0, 4).map((b, idx) => (
                    <li key={idx} className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#6D5EF5] shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Secure payment processed by Razorpay.
          </div>
        </div>

        {/* Right Side: Checkout and Pricing Configuration */}
        <div className="w-full md:w-[260px] bg-slate-50/50 p-6 md:p-8 flex flex-col justify-between items-center text-center">
          <div className="w-full">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Choose Cycle</h4>
            
            {/* Cycle Selector Tabs */}
            <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl w-full mb-6">
              <button
                onClick={() => setBillingCycle('MONTHLY')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  billingCycle === 'MONTHLY'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('YEARLY')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  billingCycle === 'YEARLY'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Yearly
              </button>
            </div>

            {/* Price Display */}
            <div className="mb-6">
              <span className="text-3xl font-black text-slate-900">
                ₹{billingCycle === 'YEARLY' ? Math.round(amount / 12) : amount}
              </span>
              <span className="text-slate-400 text-xs font-bold"> / mo</span>
              {billingCycle === 'YEARLY' && (
                <span className="block text-[10px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5 mt-2 mx-auto w-max">
                  Billed annually at ₹{amount}
                </span>
              )}
            </div>
          </div>

          {/* Checkout Button */}
          <div className="w-full">
            <CheckoutButton
              plan={recommendedPlan}
              billingCycle={billingCycle}
              amount={amount}
              className="w-full justify-center"
              onSuccess={() => {
                onClose();
                window.location.reload();
              }}
            >
              Upgrade to {recommendedPlan}
            </CheckoutButton>
            
            <button
              onClick={onClose}
              className="mt-3 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
