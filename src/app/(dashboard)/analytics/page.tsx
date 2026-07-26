'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Percent,
  CheckCircle,
  FileText,
  AlertTriangle,
  Loader2,
  Calendar,
  Layers,
} from 'lucide-react';
import apiClient from '../../../lib/api-client';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response: any = await apiClient.get('/analytics');
      setData(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-zinc-400 text-sm">Gathering database KPIs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-6 text-center max-w-lg mx-auto mt-12">
        <AlertTriangle className="h-10 w-10 text-rose-500 mx-auto mb-3" />
        <h3 className="font-semibold text-white mb-1">Failed to calculate analytics</h3>
        <p className="text-zinc-400 text-sm mb-4">{error}</p>
        <button
          onClick={fetchAnalytics}
          className="rounded-lg bg-zinc-800 hover:bg-zinc-700 px-4 py-2 text-xs font-semibold text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  const {
    totalApplications = 0,
    interviewRate = 0,
    offerRate = 0,
    successRate = 0,
    monthlyApplications = [],
    applicationsBySource = [],
    applicationsByStatus = {},
  } = data || {};

  // Status mapping colors
  const statusColors: Record<string, string> = {
    Wishlist: 'bg-zinc-650',
    Preparing: 'bg-orange-500',
    Applied: 'bg-indigo-500',
    OnlineAssessment: 'bg-cyan-500',
    TechnicalInterview: 'bg-purple-500',
    HRInterview: 'bg-fuchsia-500',
    FinalInterview: 'bg-pink-500',
    OfferReceived: 'bg-emerald-500 glow-emerald',
    OfferAccepted: 'bg-emerald-600',
    OfferDeclined: 'bg-zinc-550',
    Rejected: 'bg-rose-500',
    Withdrawn: 'bg-zinc-700',
    Archived: 'bg-zinc-800',
  };

  // Find max monthly count for chart scaling
  const maxMonthlyCount = Math.max(...monthlyApplications.map((m: any) => m.count), 1);
  const maxSourceCount = Math.max(...applicationsBySource.map((s: any) => s.count), 1);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Analytics Dashboard</h1>
        <p className="text-zinc-400 text-sm mt-1">Review conversion metrics, monthly growth, and tracking conversions.</p>
      </div>

      {/* KPI Row (Circular indicators) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Success Rate */}
        <div className="glass-card rounded-2xl border border-zinc-800 p-6 flex items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Success Rate</span>
            <div className="text-3xl font-extrabold text-white">{successRate}%</div>
            <p className="text-[10px] text-zinc-500">Percentage of applications leading to an accepted offer.</p>
          </div>

          <div className="relative h-20 w-20 shrink-0">
            {/* SVG circle meter */}
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="40" cy="40" r="34" stroke="#27272a" strokeWidth="6" fill="transparent" />
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke="#10b981"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 34}
                strokeDashoffset={2 * Math.PI * 34 * (1 - successRate / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-emerald-400">
              {successRate}%
            </div>
          </div>
        </div>

        {/* Interview Rate */}
        <div className="glass-card rounded-2xl border border-zinc-800 p-6 flex items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Interview Conversion</span>
            <div className="text-3xl font-extrabold text-white">{interviewRate}%</div>
            <p className="text-[10px] text-zinc-500">Percentage of applications receiving at least one scheduled round.</p>
          </div>

          <div className="relative h-20 w-20 shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="40" cy="40" r="34" stroke="#27272a" strokeWidth="6" fill="transparent" />
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke="#6366f1"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 34}
                strokeDashoffset={2 * Math.PI * 34 * (1 - interviewRate / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-indigo-400">
              {interviewRate}%
            </div>
          </div>
        </div>

        {/* Offer Rate */}
        <div className="glass-card rounded-2xl border border-zinc-800 p-6 flex items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Offer Rate</span>
            <div className="text-3xl font-extrabold text-white">{offerRate}%</div>
            <p className="text-[10px] text-zinc-500">Percentage of applications receiving written or verbal offers.</p>
          </div>

          <div className="relative h-20 w-20 shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="40" cy="40" r="34" stroke="#27272a" strokeWidth="6" fill="transparent" />
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke="#d946ef"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 34}
                strokeDashoffset={2 * Math.PI * 34 * (1 - offerRate / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-fuchsia-400">
              {offerRate}%
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Trends & Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Applications Count Chart */}
        <div className="glass-card rounded-2xl border border-zinc-800 p-6 flex flex-col h-96">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-zinc-400" /> Monthly Trends
            </h3>
            <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Total: {totalApplications}</span>
          </div>

          {monthlyApplications.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-sm text-zinc-500">
              No application history found.
            </div>
          ) : (
            <div className="flex-1 flex items-end justify-between gap-3 px-2 pt-6">
              {monthlyApplications.map((item: any) => {
                const heightPercent = (item.count / maxMonthlyCount) * 100;
                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
                    <span className="text-[10px] text-zinc-400 font-bold opacity-0 group-hover:opacity-100 transition duration-150">
                      {item.count}
                    </span>
                    <div
                      className="w-full bg-indigo-600 hover:bg-indigo-500 rounded-t-lg transition duration-200 glow-indigo"
                      style={{ height: `${heightPercent * 0.7}%` }}
                    />
                    <span className="text-[10px] text-zinc-500 font-semibold truncate max-w-[50px]">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Source Breakdowns */}
        <div className="glass-card rounded-2xl border border-zinc-800 p-6 h-96 flex flex-col">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-zinc-400" /> Application Sources
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {applicationsBySource.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 text-sm">No source metadata.</div>
            ) : (
              applicationsBySource.map((item: any) => {
                const widthPercent = (item.count / maxSourceCount) * 100;
                return (
                  <div key={item.source} className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span className="text-zinc-300">{item.source}</span>
                      <span className="text-white">{item.count} ({((item.count / totalApplications) * 100).toFixed(0)}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-950 border border-zinc-850 overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full glow-indigo"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Status conversion metrics */}
      <div className="glass-card rounded-2xl border border-zinc-800 p-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-zinc-400" /> Funnel Stage Distribution
          </h3>
        </div>

        <div className="space-y-4">
          {Object.entries(applicationsByStatus).map(([status, count]: any) => {
            const widthPercent = (count / totalApplications) * 100;
            const barColor = statusColors[status] || 'bg-zinc-700';

            return (
              <div key={status} className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4 text-xs font-semibold">
                <span className="text-zinc-400 sm:col-span-1 truncate">{status}</span>
                <div className="sm:col-span-2 w-full h-3 rounded-full bg-zinc-950 border border-zinc-850 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${barColor}`}
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
                <span className="text-white text-left sm:text-right sm:col-span-1">
                  {count} apps ({widthPercent.toFixed(0)}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
