'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui';
import { AlertCircle, ShieldAlert, Sparkles } from 'lucide-react';

interface UsageItem {
  used: number;
  limit: number;
}

export default function UsageDashboard() {
  const [usage, setUsage] = useState<Record<string, UsageItem>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsage() {
      try {
        const res = await fetch('/api/subscription/usage');
        if (res.ok) {
          const result = await res.json();
          setUsage(result.data);
        }
      } catch (err) {
        console.error('Failed to load usage stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadUsage();
  }, []);

  const formatLimitLabel = (used: number, limit: number, isBytes = false) => {
    if (limit === -1) {
      if (isBytes) {
        const usedMB = (used / (1024 * 1024)).toFixed(1);
        return `${usedMB} MB / Unlimited`;
      }
      return `${used} / Unlimited`;
    }
    
    if (isBytes) {
      const usedMB = (used / (1024 * 1024)).toFixed(1);
      const limitMB = (limit / (1024 * 1024)).toFixed(0);
      return `${usedMB} MB / ${limitMB} MB`;
    }

    return `${used} / ${limit}`;
  };

  const getPercent = (used: number, limit: number) => {
    if (limit === -1) return 100;
    if (limit === 0) return 0;
    const pct = (used / limit) * 100;
    return Math.min(100, Math.max(0, pct));
  };

  const getProgressColor = (pct: number) => {
    if (pct >= 90) return 'bg-[#EF4444]'; // Red
    if (pct >= 70) return 'bg-amber-500'; // Amber
    return 'bg-[#6D5EF5]'; // Brand Purple
  };

  const usageCards = [
    {
      key: 'APPLICATIONS',
      name: 'Job Applications',
      description: 'Total job search submissions tracked in your kanban boards.',
      isBytes: false
    },
    {
      key: 'RESUMES',
      name: 'Resumes',
      description: 'Independent resume documents uploaded and active.',
      isBytes: false
    },
    {
      key: 'INTERVIEWS',
      name: 'Scheduled Interviews',
      description: 'Placement rounds and calendar interviews logged.',
      isBytes: false
    },
    {
      key: 'REMINDERS',
      name: 'Active Reminders',
      description: 'Outstanding tasks in Pending or Overdue status.',
      isBytes: false
    },
    {
      key: 'STORAGE',
      name: 'Cloud File Storage',
      description: 'Used space for resumes and associated profile images.',
      isBytes: true
    }
  ];

  const aiFeatures = [
    { key: 'AI_ANALYSIS', name: 'ATS Review' },
    { key: 'AI_MATCH', name: 'Match Analysis' },
    { key: 'AI_REWRITE', name: 'Resume Rewriter' },
    { key: 'AI_COVER_LETTER', name: 'Cover Letter Builder' },
    { key: 'AI_INTERVIEW', name: 'Interview Coach' },
    { key: 'CAREER_INSIGHTS', name: 'Career Insights' }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 font-[--font-sans]">
        <div className="w-8 h-8 border-4 border-[#6D5EF5] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm font-semibold">Loading usage metrics...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto font-[--font-sans] bg-[#FAFAFA] min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Usage Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Review resource limits, consumed quotes, and available storage tiers on your current plan.</p>
      </div>

      {/* Main Limits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {usageCards.map((c) => {
          const data = usage[c.key] || { used: 0, limit: 0 };
          const pct = getPercent(data.used, data.limit);
          const isNearLimit = data.limit !== -1 && pct >= 90;

          return (
            <Card key={c.key} className="p-6 bg-white border border-slate-200/80 rounded-2xl flex flex-col justify-between hover:shadow-sm transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-800 text-base">{c.name}</h3>
                  <span className="text-sm font-black text-slate-900">
                    {formatLimitLabel(data.used, data.limit, c.isBytes)}
                  </span>
                </div>
                
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">{c.description}</p>
              </div>

              <div>
                {/* Progress bar container */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(pct)}`} 
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {isNearLimit && (
                  <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-2.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Running low. Upgrade your plan to unlock more limits.
                  </span>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Premium AI Workspace Quota */}
      <div className="border border-slate-200/80 rounded-2xl bg-white p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-slate-950 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
            Gemini AI Workspace Quotas
          </h2>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black bg-amber-50 text-amber-600 border border-amber-200 uppercase tracking-wide">
            Elite Premium
          </span>
        </div>

        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          AI assistant operations count against your monthly billing cycle quota. This quota resets automatically at the start of each subscription month.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {aiFeatures.map((f) => {
            const data = usage[f.key] || { used: 0, limit: 0 };
            const pct = getPercent(data.used, data.limit);
            const isLocked = data.limit === 0;

            return (
              <div 
                key={f.key} 
                className={`p-4 rounded-xl border transition-all ${
                  isLocked 
                    ? 'bg-slate-50/50 border-slate-100 opacity-60' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-800">{f.name}</span>
                  {isLocked ? (
                    <span className="text-[9px] font-black text-slate-400 uppercase">Locked</span>
                  ) : (
                    <span className="text-xs font-black text-slate-900">
                      {data.used} / {data.limit}
                    </span>
                  )}
                </div>

                {!isLocked ? (
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${getProgressColor(pct)}`} 
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 font-medium">
                    Upgrade to Elite plan to unlock AI.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
