'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TrendingUp,
  FileSpreadsheet,
  Loader2,
  AlertCircle,
  Calendar,
  Layers,
  MessageSquare,
  CalendarDays,
  Briefcase,
} from 'lucide-react';

interface DataPoint {
  name: string;
  value: number;
}

interface AnalyticsData {
  userGrowth: DataPoint[];
  applicationGrowth: DataPoint[];
  interviewActivity: DataPoint[];
  feedbackDistribution: DataPoint[];
}

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '12months'>('7days');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState(false);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/admin_careeros/analytics', {
        params: { timeRange },
      });
      setData(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to fetch analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const handleExport = async () => {
    setExportLoading(true);
    try {
      window.open('/api/admin_careeros/analytics/export', '_blank');
    } catch (err: any) {
      alert('Failed to export CSV: ' + err.message);
    } finally {
      setExportLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-zinc-400 text-sm">Loading system analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-6 text-center text-rose-400 max-w-xl mx-auto mt-12">
        <AlertCircle className="h-10 w-10 mx-auto mb-3 text-rose-500" />
        <h3 className="font-semibold text-white mb-1">Failed to load analytics</h3>
        <p className="text-sm text-zinc-400 mb-4">{error}</p>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { userGrowth, applicationGrowth, interviewActivity, feedbackDistribution } = data;

  const maxUsers = Math.max(...userGrowth.map((d) => d.value), 1);
  const maxApps = Math.max(...applicationGrowth.map((d) => d.value), 1);
  const maxInterviews = Math.max(...interviewActivity.map((d) => d.value), 1);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Platform Analytics</h1>
          <p className="text-sm text-zinc-400 mt-1">Audit statistics, conversion metrics, and system usage graphs.</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <select
            value={timeRange}
            onChange={(e: any) => setTimeRange(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-sm text-zinc-300 focus:outline-none cursor-pointer"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="12months">Last 12 Months</option>
          </select>

          <button
            onClick={handleExport}
            disabled={exportLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-white rounded-xl text-sm font-semibold transition cursor-pointer"
          >
            {exportLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
            ) : (
              <FileSpreadsheet className="h-4 w-4 text-green-400" />
            )}
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Growth Chart */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 flex flex-col h-96">
          <h3 className="font-bold text-sm text-white border-b border-zinc-850 pb-3 mb-6 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-400" />
            User Registrations Growth
          </h3>
          {userGrowth.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-sm text-zinc-500">
              No registration activity recorded.
            </div>
          ) : (
            <div className="flex-1 flex items-end justify-between gap-2 px-2 pt-6">
              {userGrowth.map((item) => {
                const pct = (item.value / maxUsers) * 100;
                return (
                  <div key={item.name} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[9px] text-zinc-400 font-bold opacity-0 group-hover:opacity-100 transition">
                      {item.value}
                    </span>
                    <div
                      className="w-full bg-blue-500 hover:bg-blue-400 rounded-t transition-all duration-200"
                      style={{ height: `${pct * 0.7}%` }}
                    />
                    <span className="text-[8px] text-zinc-500 font-semibold truncate max-w-[45px]">
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Application Growth Chart */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 flex flex-col h-96">
          <h3 className="font-bold text-sm text-white border-b border-zinc-850 pb-3 mb-6 flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-indigo-400" />
            Applications Created Trends
          </h3>
          {applicationGrowth.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-sm text-zinc-500">
              No job applications added.
            </div>
          ) : (
            <div className="flex-1 flex items-end justify-between gap-2 px-2 pt-6">
              {applicationGrowth.map((item) => {
                const pct = (item.value / maxApps) * 100;
                return (
                  <div key={item.name} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[9px] text-zinc-400 font-bold opacity-0 group-hover:opacity-100 transition">
                      {item.value}
                    </span>
                    <div
                      className="w-full bg-indigo-500 hover:bg-indigo-400 rounded-t transition-all duration-200"
                      style={{ height: `${pct * 0.7}%` }}
                    />
                    <span className="text-[8px] text-zinc-500 font-semibold truncate max-w-[45px]">
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Interview Activity Chart */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 flex flex-col h-96">
          <h3 className="font-bold text-sm text-white border-b border-zinc-850 pb-3 mb-6 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-purple-400" />
            Interviews Scheduled Timeline
          </h3>
          {interviewActivity.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-sm text-zinc-500">
              No interview slots scheduled.
            </div>
          ) : (
            <div className="flex-1 flex items-end justify-between gap-2 px-2 pt-6">
              {interviewActivity.map((item) => {
                const pct = (item.value / maxInterviews) * 100;
                return (
                  <div key={item.name} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[9px] text-zinc-400 font-bold opacity-0 group-hover:opacity-100 transition">
                      {item.value}
                    </span>
                    <div
                      className="w-full bg-purple-500 hover:bg-purple-400 rounded-t transition-all duration-200"
                      style={{ height: `${pct * 0.7}%` }}
                    />
                    <span className="text-[8px] text-zinc-500 font-semibold truncate max-w-[45px]">
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Feedback Categories Distribution */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 flex flex-col h-96">
          <h3 className="font-bold text-sm text-white border-b border-zinc-850 pb-3 mb-6 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-emerald-400" />
            Feedback Category Distribution
          </h3>
          {feedbackDistribution.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-sm text-zinc-500">
              No feedback submissions categorised yet.
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center space-y-4">
              {feedbackDistribution.map((item) => {
                const totalVal = feedbackDistribution.reduce((acc, curr) => acc + curr.value, 0);
                const pct = totalVal > 0 ? ((item.value / totalVal) * 100).toFixed(0) : '0';
                return (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-zinc-300">
                      <span>{item.name}</span>
                      <span className="text-white font-extrabold">{item.value} ({pct}%)</span>
                    </div>
                    <div className="h-3 w-full bg-zinc-950/40 rounded border border-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
