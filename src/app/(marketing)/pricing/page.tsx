'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { CheckoutButton } from '@/components/CheckoutButton';
import { Button, Card } from '@/components/ui';
import { Check, HelpCircle, ArrowRight, Star, Sparkles, Zap } from 'lucide-react';

interface PlanDef {
  plan: 'FREE' | 'PRO' | 'ELITE';
  monthlyPrice: number;
  yearlyPrice: number;
  configuration: any;
}

export default function PricingPage() {
  const { isSignedIn, userId } = useAuth();
  const router = useRouter();
  
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [plans, setPlans] = useState<PlanDef[]>([]);
  const [currentPlan, setCurrentPlan] = useState<string>('FREE');
  const [loading, setLoading] = useState(true);

  // 1. Fetch plans & subscription details
  useEffect(() => {
    async function initPage() {
      try {
        const plansRes = await fetch('/api/payments/plans');
        if (plansRes.ok) {
          const plansData = await plansRes.json();
          setPlans(plansData.data);
        }

        if (isSignedIn) {
          const subRes = await fetch('/api/subscription');
          if (subRes.ok) {
            const subData = await subRes.json();
            setCurrentPlan(subData.data.plan);
          }
        }
      } catch (err) {
        console.error('Failed to load pricing details:', err);
      } finally {
        setLoading(false);
      }
    }
    initPage();
  }, [isSignedIn]);

  const handleLoggedOutRedirect = () => {
    router.push('/sign-in?redirect_url=/pricing');
  };

  const getPlanBenefits = (planName: string) => {
    if (planName === 'FREE') {
      return [
        '10 Job Applications tracker',
        '5 Resume Uploads limit',
        '10 Scheduled Interviews limit',
        '25 Active Reminders limit',
        '100 MB Secure Storage',
        'Basic Dashboard Analytics'
      ];
    }
    if (planName === 'PRO') {
      return [
        'Unlimited Job Applications',
        'Unlimited Resume Uploads',
        'Unlimited Scheduled Interviews',
        'Unlimited Reminders list',
        '2 GB Secure Storage capacity',
        'Advanced Placement Analytics',
        'Custom tags & categorizations',
        'Application Archive & CSV Export'
      ];
    }
    // ELITE
    return [
      'Everything in PRO plan',
      '10 GB Secure Storage capacity',
      '50 Gemini AI ATS Analysis / month',
      '50 Gemini AI Resume Match reviews',
      '30 Gemini AI Cover Letters / month',
      '50 Gemini AI Interview Preps / month',
      'Gemini AI Resume Rewrites & Insights'
    ];
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-8 h-8 border-4 border-[#6D5EF5] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm font-bold">Loading pricing tiers...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-16 px-4 sm:px-6 lg:px-8 font-[--font-sans]">
      {/* Headings */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">
          Accelerate your placements with <span className="text-[#6D5EF5]">CareerOS</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Choose a plan designed to streamline your job search, optimize your resumes, and unlock AI-powered placement insights.
        </p>

        {/* Billing Cycle Switch */}
        <div className="flex items-center justify-center gap-3 mt-8 bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-max mx-auto">
          <button
            onClick={() => setBillingCycle('MONTHLY')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              billingCycle === 'MONTHLY'
                ? 'bg-[#6D5EF5] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('YEARLY')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              billingCycle === 'YEARLY'
                ? 'bg-[#6D5EF5] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Yearly Billing
          </button>
        </div>
      </div>

      {/* Grid of Plans */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-16">
        {plans.map((p) => {
          const isCurrent = currentPlan === p.plan;
          const isPro = p.plan === 'PRO';
          const isElite = p.plan === 'ELITE';
          const isFree = p.plan === 'FREE';

          const price = billingCycle === 'MONTHLY' ? p.monthlyPrice : p.yearlyPrice;
          const priceDisplay = billingCycle === 'YEARLY' ? Math.round(price / 12) : price;

          return (
            <Card
              key={p.plan}
              className={`relative flex flex-col justify-between bg-white border rounded-2xl p-8 transition-all duration-300 ${
                isPro 
                  ? 'border-[#6D5EF5] shadow-lg md:scale-105 z-10' 
                  : 'border-slate-200 hover:shadow-md'
              }`}
            >
              {/* Recommended Badge */}
              {isPro && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-black bg-[#6D5EF5] text-white uppercase tracking-wider shadow-md">
                  <Star className="w-3 h-3 fill-white text-white" />
                  Recommended
                </span>
              )}

              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">{p.plan}</h2>
                  {isElite && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black bg-amber-50 text-amber-600 border border-amber-200 uppercase">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      Gemini AI
                    </span>
                  )}
                </div>

                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">
                  {isFree ? 'Get started for free' : isPro ? 'Perfect for search' : 'Unlimited & AI Powered'}
                </p>

                {/* Price */}
                <div className="mb-6 flex items-baseline">
                  <span className="text-4xl font-black text-slate-900 tracking-tight">₹{priceDisplay}</span>
                  <span className="text-slate-400 text-sm font-semibold">/mo</span>
                  {billingCycle === 'YEARLY' && !isFree && (
                    <span className="text-xs text-slate-400 font-bold block ml-2">Billed annually</span>
                  )}
                </div>

                <hr className="border-slate-100 my-6" />

                {/* Benefits */}
                <ul className="space-y-3.5 mb-8">
                  {getPlanBenefits(p.plan).map((b, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${isPro ? 'text-[#6D5EF5]' : 'text-slate-400'}`} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Call to Action Button */}
              <div>
                {isCurrent ? (
                  <Button variant="secondary" className="w-full justify-center cursor-default bg-slate-100 text-slate-500 hover:bg-slate-100 border-none" disabled>
                    Current Plan
                  </Button>
                ) : isFree ? (
                  <Button 
                    variant="secondary" 
                    className="w-full justify-center"
                    onClick={() => router.push('/sign-in')}
                  >
                    Start Free
                  </Button>
                ) : isSignedIn ? (
                  <CheckoutButton
                    plan={p.plan as 'PRO' | 'ELITE'}
                    billingCycle={billingCycle}
                    amount={price}
                    className="w-full justify-center"
                    onSuccess={() => {
                      setCurrentPlan(p.plan);
                      router.push('/app/dashboard');
                    }}
                  >
                    Upgrade to {p.plan}
                  </CheckoutButton>
                ) : (
                  <Button 
                    variant="primary" 
                    className="w-full justify-center"
                    onClick={handleLoggedOutRedirect}
                  >
                    Upgrade to {p.plan}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
