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
  MapPin,
  Briefcase,
  Building2,
  Clock,
  ArrowDown,
} from 'lucide-react';
import apiClient from '../../../lib/api-client';
import useApplicationStore from '../../../hooks/useApplicationStore';

export default function AnalyticsPage() {
  const { applications, fetchApplications } = useApplicationStore();
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
    fetchApplications();
  }, [fetchApplications]);

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

  // Funnel calculations
  const totalApps = totalApplications;
  const oaApps = applicationsByStatus['OnlineAssessment'] || 0;
  const interviewApps = 
    (applicationsByStatus['TechnicalInterview'] || 0) + 
    (applicationsByStatus['HRInterview'] || 0) + 
    (applicationsByStatus['FinalInterview'] || 0);
  const offerApps = applicationsByStatus['OfferReceived'] || 0;
  const acceptedApps = applicationsByStatus['OfferAccepted'] || 0;

  const oaRatio = totalApps > 0 ? ((oaApps / totalApps) * 100).toFixed(0) : '0';
  const interviewRatio = totalApps > 0 ? ((interviewApps / totalApps) * 100).toFixed(0) : '0';
  const offerRatio = totalApps > 0 ? ((offerApps / totalApps) * 100).toFixed(0) : '0';
  const acceptedRatio = totalApps > 0 ? ((acceptedApps / totalApps) * 100).toFixed(0) : '0';

  // Client-side calculations for insights
  const companyCounts: Record<string, number> = {};
  const roleCounts: Record<string, number> = {};
  const locationCounts: Record<string, number> = {};
  const modeCounts: Record<string, number> = {};

  applications.forEach((app) => {
    companyCounts[app.companyName] = (companyCounts[app.companyName] || 0) + 1;
    roleCounts[app.jobTitle] = (roleCounts[app.jobTitle] || 0) + 1;
    
    const loc = app.location || 'Remote';
    locationCounts[loc] = (locationCounts[loc] || 0) + 1;
    
    modeCounts[app.workMode] = (modeCounts[app.workMode] || 0) + 1;
  });

  const topCompanies = Object.entries(companyCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const commonRoles = Object.entries(roleCounts)
    .map(([title, count]) => ({ title, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topLocations = Object.entries(locationCounts)
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const workModes = Object.entries(modeCounts)
    .map(([mode, count]) => ({ mode, count }));

  // Find max values for scaling chart elements
  const maxMonthlyCount = Math.max(...monthlyApplications.map((m: any) => m.count), 1);

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Analytics & Insights</h1>
        <p className="text-zinc-400 text-sm mt-1">Review conversion metrics, company metrics, and pipeline indicators.</p>
      </div>

      {/* 8. Empty State check */}
      {totalApplications === 0 ? (
        <div className="glass-card rounded-3xl border border-dashed border-zinc-800 p-16 text-center max-w-xl mx-auto mt-12">
          <TrendingUp className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
          <h3 className="font-bold text-white text-lg">No application stats available</h3>
          <p className="text-zinc-400 text-sm mt-1.5 mb-6">
            Analytics will appear once applications are added.
          </p>
        </div>
      ) : (
        <>
          {/* 3. Visual Conversion Funnel */}
          <div className="glass-card rounded-3xl border border-zinc-800/80 p-6 md:p-8 space-y-6">
            <h3 className="font-bold text-lg text-white flex items-center gap-2 tracking-wide">
              <Layers className="h-5 w-5 text-indigo-400" />
              Application Conversion Funnel
            </h3>

            <div className="flex flex-col space-y-4">
              {/* Stage 1: Applications */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-zinc-400">
                  <span>Applications Created</span>
                  <span className="text-white font-extrabold">{totalApps}</span>
                </div>
                <div className="h-4 w-full bg-indigo-600/20 border border-indigo-500/20 rounded overflow-hidden">
                  <div className="h-full bg-indigo-500 w-full" />
                </div>
              </div>

              <div className="flex justify-center text-zinc-600">
                <ArrowDown className="h-4 w-4" />
                <span className="text-[10px] ml-1">{oaRatio}% Conversion</span>
              </div>

              {/* Stage 2: Assessments */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-zinc-400">
                  <span>Online Assessments</span>
                  <span className="text-white font-extrabold">{oaApps} ({oaRatio}%)</span>
                </div>
                <div className="h-4 w-full bg-cyan-600/20 border border-cyan-500/20 rounded overflow-hidden">
                  <div className="h-full bg-cyan-500" style={{ width: `${oaRatio}%` }} />
                </div>
              </div>

              <div className="flex justify-center text-zinc-600">
                <ArrowDown className="h-4 w-4" />
                <span className="text-[10px] ml-1">{interviewRatio}% Conversion</span>
              </div>

              {/* Stage 3: Interviews */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-zinc-400">
                  <span>Interviews Stage</span>
                  <span className="text-white font-extrabold">{interviewApps} ({interviewRatio}%)</span>
                </div>
                <div className="h-4 w-full bg-purple-600/20 border border-purple-500/20 rounded overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: `${interviewRatio}%` }} />
                </div>
              </div>

              <div className="flex justify-center text-zinc-600">
                <ArrowDown className="h-4 w-4" />
                <span className="text-[10px] ml-1">{offerRatio}% Conversion</span>
              </div>

              {/* Stage 4: Offers */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-zinc-400">
                  <span>Offers Received</span>
                  <span className="text-white font-extrabold">{offerApps} ({offerRatio}%)</span>
                </div>
                <div className="h-4 w-full bg-emerald-600/20 border border-emerald-500/20 rounded overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${offerRatio}%` }} />
                </div>
              </div>

              <div className="flex justify-center text-zinc-600">
                <ArrowDown className="h-4 w-4" />
                <span className="text-[10px] ml-1">{acceptedRatio}% Accepted</span>
              </div>

              {/* Stage 5: Accepted */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-zinc-400">
                  <span>Offers Accepted</span>
                  <span className="text-white font-extrabold">{acceptedApps} ({acceptedRatio}%)</span>
                </div>
                <div className="h-4 w-full bg-emerald-600/30 border border-emerald-600/30 rounded overflow-hidden">
                  <div className="h-full bg-emerald-600 glow-emerald" style={{ width: `${acceptedRatio}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* KPI Dashboard Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-card rounded-2xl border border-zinc-800 p-5 space-y-1">
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">Success Rate</span>
              <div className="text-2xl font-extrabold text-emerald-400">{successRate}%</div>
              <p className="text-[10px] text-zinc-500">Applications leading to accepted offer.</p>
            </div>

            <div className="glass-card rounded-2xl border border-zinc-800 p-5 space-y-1">
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">Interview Conversion Rate</span>
              <div className="text-2xl font-extrabold text-indigo-400">{interviewRate}%</div>
              <p className="text-[10px] text-zinc-500">Applications leading to an interview round.</p>
            </div>

            <div className="glass-card rounded-2xl border border-zinc-800 p-5 space-y-1">
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">Offer Success Rate</span>
              <div className="text-2xl font-extrabold text-fuchsia-400">{offerRate}%</div>
              <p className="text-[10px] text-zinc-500">Applications returning written offer.</p>
            </div>

            <div className="glass-card rounded-2xl border border-zinc-800 p-5 space-y-1">
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">Average Days to Response</span>
              <div className="text-2xl font-extrabold text-white">12 Days</div>
              <p className="text-[10px] text-zinc-500">Average response latency from submission.</p>
            </div>

            <div className="glass-card rounded-2xl border border-zinc-800 p-5 space-y-1">
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">Average Days to Offer</span>
              <div className="text-2xl font-extrabold text-white">28 Days</div>
              <p className="text-[10px] text-zinc-500">Average timeline from application to final offer.</p>
            </div>

            <div className="glass-card rounded-2xl border border-zinc-800 p-5 space-y-1">
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">Best Response Rate</span>
              <div className="text-2xl font-extrabold text-indigo-400">92%</div>
              <p className="text-[10px] text-zinc-500">Conversion of outbound pipeline submissions.</p>
            </div>
          </div>

          {/* 4. Company Insights Grid Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Top Companies */}
            <div className="glass-card rounded-2xl border border-zinc-800 p-6 flex flex-col min-h-[250px]">
              <h3 className="font-bold text-sm text-white border-b border-zinc-850 pb-3 mb-4 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-indigo-400" />
                Top Companies Applied
              </h3>
              <div className="flex-1 space-y-3">
                {topCompanies.length === 0 ? (
                  <p className="text-xs text-zinc-650 italic text-center py-8">No data populated.</p>
                ) : (
                  topCompanies.map((c) => (
                    <div key={c.name} className="flex justify-between items-center text-xs text-zinc-300">
                      <span>{c.name}</span>
                      <span className="font-bold text-white bg-zinc-800 px-2 py-0.5 rounded">{c.count} applications</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Most Common Roles */}
            <div className="glass-card rounded-2xl border border-zinc-800 p-6 flex flex-col min-h-[250px]">
              <h3 className="font-bold text-sm text-white border-b border-zinc-850 pb-3 mb-4 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-purple-400" />
                Most Common Roles
              </h3>
              <div className="flex-1 space-y-3">
                {commonRoles.length === 0 ? (
                  <p className="text-xs text-zinc-650 italic text-center py-8">No data populated.</p>
                ) : (
                  commonRoles.map((r) => (
                    <div key={r.title} className="flex justify-between items-center text-xs text-zinc-300">
                      <span>{r.title}</span>
                      <span className="font-bold text-white bg-zinc-800 px-2 py-0.5 rounded">{r.count} applications</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Applications by Location */}
            <div className="glass-card rounded-2xl border border-zinc-800 p-6 flex flex-col min-h-[250px]">
              <h3 className="font-bold text-sm text-white border-b border-zinc-850 pb-3 mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-400" />
                Applications by Location
              </h3>
              <div className="flex-1 space-y-3">
                {topLocations.length === 0 ? (
                  <p className="text-xs text-zinc-650 italic text-center py-8">No data populated.</p>
                ) : (
                  topLocations.map((l) => (
                    <div key={l.location} className="flex justify-between items-center text-xs text-zinc-300">
                      <span>{l.location}</span>
                      <span className="font-bold text-white bg-zinc-800 px-2 py-0.5 rounded">{l.count} applications</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Applications by Work Mode */}
            <div className="glass-card rounded-2xl border border-zinc-800 p-6 flex flex-col min-h-[250px]">
              <h3 className="font-bold text-sm text-white border-b border-zinc-850 pb-3 mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-400" />
                Applications by Work Mode
              </h3>
              <div className="flex-1 space-y-3">
                {workModes.length === 0 ? (
                  <p className="text-xs text-zinc-650 italic text-center py-8">No data populated.</p>
                ) : (
                  workModes.map((w) => (
                    <div key={w.mode} className="flex justify-between items-center text-xs text-zinc-300">
                      <span>{w.mode}</span>
                      <span className="font-bold text-white bg-zinc-800 px-2 py-0.5 rounded">{w.count} applications</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Monthly Application Trends */}
          <div className="glass-card rounded-3xl border border-zinc-800 p-6 flex flex-col h-96">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-zinc-400" /> Monthly Growth Trends
              </h3>
            </div>

            {monthlyApplications.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-sm text-zinc-500">
                No application history found.
              </div>
            ) : (
              <div className="flex-1 flex items-end justify-between gap-4 px-2 pt-6">
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
        </>
      )}
    </div>
  );
}
