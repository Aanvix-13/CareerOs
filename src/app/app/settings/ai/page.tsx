'use client';

import React, { useState, useEffect } from 'react';
import { Card, Badge, Button } from '@/components/ui';
import { Sparkles, Cpu, BarChart3, HelpCircle, AlertCircle, ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AIQuotaStats {
  used: number;
  limit: number;
}

interface SubscriptionDetails {
  plan: 'FREE' | 'PRO' | 'ELITE';
  billingCycle: 'MONTHLY' | 'YEARLY';
  expiresAt: string | null;
}

export default function AISettingsPage() {
  const router = useRouter();
  const [quota, setQuota] = useState<Record<string, AIQuotaStats>>({});
  const [sub, setSub] = useState<SubscriptionDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [usageRes, subRes] = await Promise.all([
          fetch('/api/subscription/usage'),
          fetch('/api/subscription')
        ]);

        if (usageRes.ok) {
          const usageJson = await usageRes.json();
          setQuota(usageJson.data);
        }
        if (subRes.ok) {
          const subJson = await subRes.json();
          setSub(subJson.data);
        }
      } catch (err) {
        console.error('Failed to load AI usage details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const aiFeatures = [
    { key: 'AI_ANALYSIS', name: 'ATS Review & Score', desc: 'Analyzes resume content, keywords, and typography parameters.' },
    { key: 'AI_MATCH', name: 'Resume Match Analysis', desc: 'Checks skill alignment percentages against target job descriptions.' },
    { key: 'AI_REWRITE', name: 'Professional Rewrite', desc: 'Optimizes resume sentences with strong bullet points and metrics.' },
    { key: 'AI_COVER_LETTER', name: 'Cover Letter Builder', desc: 'Generates tailored introduction cover letters matching specific jobs.' },
    { key: 'AI_INTERVIEW', name: 'Interview Prep Coach', desc: 'Conducts interactive chat question-and-answer training runs.' },
    { key: 'CAREER_INSIGHTS', name: 'Career Path Insights', desc: 'Suggests high-growth certifications and benchmark salary ranges.' }
  ];

  // Calculate aggregated totals
  let totalUsed = 0;
  let totalLimit = 0;
  let isUnlimited = false;

  aiFeatures.forEach(f => {
    const stats = quota[f.key] || { used: 0, limit: 0 };
    totalUsed += stats.used;
    if (stats.limit === -1) {
      isUnlimited = true;
    } else {
      totalLimit += stats.limit;
    }
  });

  const getPercent = (used: number, limit: number) => {
    if (limit === -1) return 100;
    if (limit === 0) return 0;
    return Math.min(100, Math.max(0, (used / limit) * 100));
  };

  const getQuotaColor = (pct: number) => {
    if (pct >= 90) return 'bg-[#EF4444]'; // red
    if (pct >= 70) return 'bg-amber-500'; // amber
    return 'bg-[#6D5EF5]'; // purple
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'End of active cycle';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 font-[--font-sans]">
        <div className="w-8 h-8 border-4 border-[#6D5EF5] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm font-semibold">Loading AI metrics...</p>
      </div>
    );
  }

  const isElite = sub?.plan === 'ELITE';

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto font-[--font-sans] bg-[#FAFAFA] min-h-screen">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-[#6D5EF5] fill-[#6D5EF5]/10" />
            Gemini AI Settings & Usage
          </h1>
          <p className="text-sm text-slate-500 mt-1">Monitor monthly AI workspace quotas, track model runs, and check available limits.</p>
        </div>

        {!isElite && (
          <Button
            variant="primary"
            icon={<ArrowUpRight className="w-4 h-4" />}
            onClick={() => router.push('/pricing')}
          >
            Unlock AI (Upgrade to Elite)
          </Button>
        )}
      </div>

      {/* Overview Card */}
      <Card className="bg-white border border-slate-200/80 p-6 md:p-8 rounded-2xl mb-8 flex flex-col md:flex-row justify-between gap-6 hover:shadow-sm transition-shadow">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Operations Status</span>
            <Badge variant={isElite ? 'success' : 'neutral'}>
              {isElite ? 'Elite Core Enabled' : 'Access Locked'}
            </Badge>
          </div>

          <h2 className="text-xl font-black text-slate-900 mt-1">
            {isElite ? 'Unlimited Premium AI Workspace' : 'Unlock Professional AI Career Assistants'}
          </h2>

          <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-xl">
            {isElite
              ? 'Your Elite subscription grants you access to our full suite of Gemini-powered resume matching, ATS scoring, and interview training assistants.'
              : 'Our AI features require a premium model run budget. Upgrade your workspace to the Elite plan to start optimizing resumes, preparing cover letters, and mock interviewing.'}
          </p>

          {isElite && (
            <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-slate-400" />
                Primary Models: <strong>Gemini 1.5 Pro & Flash</strong>
              </div>
              <div className="flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-slate-400" />
                Aggregated monthly resets: <strong>{formatDate(sub?.expiresAt)}</strong>
              </div>
            </div>
          )}
        </div>

        {isElite && (
          <div className="w-full md:w-[220px] bg-slate-50 p-6 rounded-xl border border-slate-100 flex flex-col justify-center items-center text-center shrink-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Month Total Used</span>
            <span className="text-3xl font-black text-slate-900">
              {totalUsed}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">
              Requests logged
            </span>
          </div>
        )}
      </Card>

      {/* Feature Breakdown Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-slate-400" />
          <h2 className="text-base font-black text-slate-900">Monthly AI Feature Quota Breakdowns</h2>
        </div>

        <div className="divide-y divide-slate-100">
          {aiFeatures.map((f) => {
            const stats = quota[f.key] || { used: 0, limit: 0 };
            const pct = getPercent(stats.used, stats.limit);
            const isNearLimit = stats.limit !== 0 && stats.limit !== -1 && pct >= 90;

            return (
              <div key={f.key} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/20 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-800 text-sm">{f.name}</h3>
                    {stats.limit > 0 && (
                      <span className="text-[9px] font-black bg-slate-100 text-slate-500 rounded px-1 py-0.5">
                        {stats.limit} max/mo
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-md">{f.desc}</p>
                </div>

                <div className="w-full sm:w-[200px] shrink-0">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1.5">
                    <span>Quota Consumption</span>
                    <span className="text-slate-900 font-black">
                      {stats.limit === 0 ? 'Locked' : `${stats.used} / ${stats.limit === -1 ? 'Unlimited' : stats.limit}`}
                    </span>
                  </div>

                  {stats.limit > 0 && (
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${getQuotaColor(pct)}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  )}

                  {isNearLimit && (
                    <span className="text-[9px] font-bold text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      Limit almost reached.
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
