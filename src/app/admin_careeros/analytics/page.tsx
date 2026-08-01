'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, TrendingUp, CreditCard, HardDrive, Cpu, Activity,
  DollarSign, ArrowUpRight, ArrowDownRight, AlertCircle, CheckCircle2,
  RefreshCw, Shield, Zap, BarChart3
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

/* ─── Types ────────────────────────────────────────────────────────────────── */
interface OverviewData {
  totalUsers: number;
  activeSubscriptions: number;
  totalApplications: number;
  totalResumes: number;
  totalInterviews: number;
  newUsersToday: number;
  proUsers: number;
  eliteUsers: number;
  avgResponseTimeMs: number;
}

interface RevenueData {
  mrr: number;
  arr: number;
  arpu: number;
  conversionRate: number;
  paymentSuccessRate: number;
  refundRate: number;
}

interface PlanDist {
  plan: string;
  count: number;
}

interface AIMetrics {
  totalAIRequests: number;
  tokensUsed: number;
  estimatedCost: number;
  cacheHitRate: number;
}

interface StorageMetrics {
  usedStorageBytes: number;
  totalStorageLimitBytes: number;
  remainingStorageBytes: number;
}

interface HealthStatus {
  status: string;
  database: { status: string; latencyMs: number };
  apiGateway: { status: string; latencyMs: number };
  providers: {
    gemini: { status: string; latencyMs: number };
    razorpay: { status: string; latencyMs: number };
    supabase: { status: string; latencyMs: number };
  };
  timestamp: string;
}

interface Transaction {
  id: string;
  email: string;
  amount: number;
  currency: string;
  plan: string;
  billingCycle: string;
  paidAt: string;
  invoiceNumber: string | null;
}

interface FeatureStat {
  feature: string;
  count: number;
}

interface DayActivity {
  date: string;
  activeUsers: number;
}

/* ─── Helpers ──────────────────────────────────────────────────────────────── */
const fmt = (n: number) => n.toLocaleString('en-IN');
const fmtBytes = (b: number) => {
  if (b >= 1073741824) return `${(b / 1073741824).toFixed(2)} GB`;
  if (b >= 1048576) return `${(b / 1048576).toFixed(2)} MB`;
  return `${(b / 1024).toFixed(2)} KB`;
};
const fmtCurrency = (n: number, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);

const PIE_COLORS = ['#6D5EF5', '#10B981', '#F59E0B'];
const HEALTH_COLORS: Record<string, string> = {
  connected: '#10B981', online: '#10B981', offline: '#EF4444', degraded: '#F59E0B'
};

/* ─── Sub-components ───────────────────────────────────────────────────────── */
function KpiCard({
  icon: Icon,
  label,
  value,
  subLabel,
  trend,
  color = '#6D5EF5'
}: {
  icon: any;
  label: string;
  value: string;
  subLabel?: string;
  trend?: { value: number; up?: boolean };
  color?: string;
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <p className="text-3xl font-black text-slate-900">{value}</p>
      {(subLabel || trend) && (
        <div className="flex items-center gap-2">
          {trend && (
            <span className={`text-xs font-bold flex items-center gap-0.5 ${trend.up === false ? 'text-red-500' : 'text-emerald-500'}`}>
              {trend.up === false ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
              {Math.abs(trend.value).toFixed(1)}%
            </span>
          )}
          {subLabel && <span className="text-xs text-slate-400">{subLabel}</span>}
        </div>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-3 w-24 bg-slate-100 rounded" />
        <div className="w-9 h-9 bg-slate-100 rounded-xl" />
      </div>
      <div className="h-8 w-32 bg-slate-100 rounded mb-2" />
      <div className="h-3 w-20 bg-slate-100 rounded" />
    </div>
  );
}

function HealthBadge({ label, status, latencyMs }: { label: string; status: string; latencyMs: number }) {
  const color = HEALTH_COLORS[status] || '#94A3B8';
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-sm font-semibold text-slate-700">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-400">{latencyMs}ms</span>
        <span className="text-xs font-bold" style={{ color }}>{status}</span>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────────────── */
export default function AdminAnalyticsDashboard() {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [revenue, setRevenue] = useState<RevenueData | null>(null);
  const [planDist, setPlanDist] = useState<PlanDist[]>([]);
  const [aiMetrics, setAiMetrics] = useState<AIMetrics | null>(null);
  const [featureStats, setFeatureStats] = useState<FeatureStat[]>([]);
  const [dau, setDau] = useState<DayActivity[]>([]);
  const [storage, setStorage] = useState<StorageMetrics | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [analyticsRes, subsRes, aiRes, storageRes, healthRes, paymentsRes] = await Promise.allSettled([
        fetch('/api/admin/analytics'),
        fetch('/api/admin/subscriptions'),
        fetch('/api/admin/ai'),
        fetch('/api/admin/storage'),
        fetch('/api/admin/system-health'),
        fetch('/api/admin/payments')
      ]);

      if (analyticsRes.status === 'fulfilled' && analyticsRes.value.ok) {
        const json = await analyticsRes.value.json();
        setOverview(json.data);
      }
      if (subsRes.status === 'fulfilled' && subsRes.value.ok) {
        const json = await subsRes.value.json();
        setPlanDist(json.data.distribution ?? []);
        setRevenue(json.data.revenue ?? null);
      }
      if (aiRes.status === 'fulfilled' && aiRes.value.ok) {
        const json = await aiRes.value.json();
        setAiMetrics(json.data.usage ?? null);
        setFeatureStats(json.data.featureBreakdown ?? []);
        setDau(json.data.dailyActivity ?? []);
      }
      if (storageRes.status === 'fulfilled' && storageRes.value.ok) {
        const json = await storageRes.value.json();
        setStorage(json.data.storage ?? null);
      }
      if (healthRes.status === 'fulfilled' && healthRes.value.ok) {
        const json = await healthRes.value.json();
        setHealth(json.data ?? null);
      }
      if (paymentsRes.status === 'fulfilled' && paymentsRes.value.ok) {
        const json = await paymentsRes.value.json();
        setTransactions(json.data.recentTransactions ?? []);
      }
    } finally {
      setLoading(false);
      setLastRefreshed(new Date());
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const storagePercent = storage
    ? Math.min(100, (storage.usedStorageBytes / storage.totalStorageLimitBytes) * 100)
    : 0;

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-[#6D5EF5]" />
            Admin Analytics
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Enterprise dashboard — Last refreshed: {lastRefreshed.toLocaleTimeString()}
          </p>
        </div>
        <button
          onClick={fetchAll}
          disabled={loading}
          className="flex items-center gap-2 bg-[#6D5EF5] text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-[#5a4de0] transition-colors disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* ── KPI Grid ── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <KpiCard icon={Users}      label="Total Users"      value={fmt(overview?.totalUsers ?? 0)}           subLabel="registered accounts" color="#6D5EF5" />
            <KpiCard icon={Users}      label="New Today"        value={fmt(overview?.newUsersToday ?? 0)}         subLabel="registrations today"  color="#10B981" />
            <KpiCard icon={Shield}     label="Pro Users"        value={fmt(overview?.proUsers ?? 0)}              subLabel="active Pro plan"      color="#F59E0B" />
            <KpiCard icon={Zap}        label="Elite Users"      value={fmt(overview?.eliteUsers ?? 0)}            subLabel="active Elite plan"    color="#EF4444" />
            <KpiCard icon={DollarSign} label="Monthly Revenue"  value={fmtCurrency(revenue?.mrr ?? 0)}            subLabel="MRR"                  color="#6D5EF5" trend={{ value: revenue?.conversionRate ?? 0 }} />
            <KpiCard icon={TrendingUp} label="Annual Revenue"   value={fmtCurrency(revenue?.arr ?? 0)}            subLabel="ARR"                  color="#10B981" />
            <KpiCard icon={CreditCard} label="Payment Success"  value={`${(revenue?.paymentSuccessRate ?? 100).toFixed(1)}%`} subLabel="of all invoices"  color="#F59E0B" />
            <KpiCard icon={Cpu}        label="AI Requests"      value={fmt(aiMetrics?.totalAIRequests ?? 0)}      subLabel="all time"             color="#8B5CF6" />
          </>
        )}
      </section>

      {/* ── Charts Row ── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Plan Distribution Pie */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6">
          <h2 className="text-base font-black text-slate-900 mb-4">Plan Distribution</h2>
          {loading ? (
            <div className="h-48 bg-slate-50 rounded-xl animate-pulse" />
          ) : planDist.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No subscription data</div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={planDist} dataKey="count" nameKey="plan" cx="50%" cy="50%" outerRadius={70} label={false} fontSize={11}>
                  {planDist.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: any, name: any) => [fmt(Number(v)), String(name)]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* DAU Area Chart */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 lg:col-span-2">
          <h2 className="text-base font-black text-slate-900 mb-4">Daily AI Activity (Last 7 Days)</h2>
          {loading ? (
            <div className="h-48 bg-slate-50 rounded-xl animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={dau}>
                <defs>
                  <linearGradient id="dauGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6D5EF5" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6D5EF5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="activeUsers" stroke="#6D5EF5" strokeWidth={2} fill="url(#dauGrad)" name="AI Requests" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      {/* ── AI Feature Usage & Storage Row ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Feature Usage Bar */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6">
          <h2 className="text-base font-black text-slate-900 mb-4">AI Feature Usage Breakdown</h2>
          {loading ? (
            <div className="h-48 bg-slate-50 rounded-xl animate-pulse" />
          ) : featureStats.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No AI usage recorded yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={featureStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="feature" type="category" tick={{ fontSize: 10 }} width={110} />
                <Tooltip />
                <Bar dataKey="count" fill="#6D5EF5" radius={[0, 4, 4, 0]} name="Requests" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Storage Gauge + AI Cost */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6">
            <h2 className="text-base font-black text-slate-900 mb-3 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-slate-400" /> Storage Consumption
            </h2>
            {loading ? (
              <div className="h-10 bg-slate-50 rounded-xl animate-pulse" />
            ) : (
              <>
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5">
                  <span>{storage ? fmtBytes(storage.usedStorageBytes) : '—'} used</span>
                  <span>{storage ? fmtBytes(storage.totalStorageLimitBytes) : '—'} total</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${storagePercent}%`,
                      backgroundColor: storagePercent > 85 ? '#EF4444' : storagePercent > 60 ? '#F59E0B' : '#6D5EF5'
                    }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1.5">{storagePercent.toFixed(1)}% of capacity used</p>
              </>
            )}
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex-1">
            <h2 className="text-base font-black text-slate-900 mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-slate-400" /> Gemini Cost Summary
            </h2>
            {loading ? (
              <div className="space-y-2">
                <div className="h-4 bg-slate-50 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-slate-50 rounded animate-pulse" />
              </div>
            ) : (
              <div className="space-y-2.5">
                {[
                  { label: 'Total Requests', value: fmt(aiMetrics?.totalAIRequests ?? 0) },
                  { label: 'Tokens Used', value: fmt(aiMetrics?.tokensUsed ?? 0) },
                  { label: 'Est. Cost (USD)', value: `$${(aiMetrics?.estimatedCost ?? 0).toFixed(4)}` },
                  { label: 'Cache Hit Rate', value: `${(aiMetrics?.cacheHitRate ?? 0).toFixed(1)}%` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-black text-slate-900">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Transactions + Health ── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden lg:col-span-2">
          <div className="p-6 border-b border-slate-50 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-slate-400" />
            <h2 className="text-base font-black text-slate-900">Recent Transactions</h2>
          </div>
          {loading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-slate-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No completed transactions yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left px-6 py-3 text-xs font-bold text-slate-400 uppercase">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase">Plan</th>
                    <th className="text-right px-4 py-3 text-xs font-bold text-slate-400 uppercase">Amount</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {transactions.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3 text-slate-700 font-medium truncate max-w-[160px]">{t.email}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded ${t.plan === 'ELITE' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'}`}>
                          {t.plan} {t.billingCycle === 'YEARLY' ? '(Y)' : '(M)'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-black text-slate-900">
                        {fmtCurrency(t.amount, t.currency)}
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        {new Date(t.paidAt).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* System Health */}
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-slate-400" />
              <h2 className="text-base font-black text-slate-900">System Health</h2>
            </div>
            {health && (
              health.status === 'healthy'
                ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                : <AlertCircle className="w-5 h-5 text-red-500" />
            )}
          </div>
          <div className="p-6">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-8 bg-slate-50 rounded animate-pulse" />
                ))}
              </div>
            ) : !health ? (
              <p className="text-sm text-slate-400 text-center py-4">Health data unavailable.</p>
            ) : (
              <>
                <HealthBadge label="Database"     status={health.database.status}          latencyMs={health.database.latencyMs} />
                <HealthBadge label="API Gateway"  status={health.apiGateway.status}        latencyMs={health.apiGateway.latencyMs} />
                <HealthBadge label="Gemini AI"    status={health.providers.gemini.status}  latencyMs={health.providers.gemini.latencyMs} />
                <HealthBadge label="Razorpay"     status={health.providers.razorpay.status} latencyMs={health.providers.razorpay.latencyMs} />
                <HealthBadge label="Supabase"     status={health.providers.supabase.status} latencyMs={health.providers.supabase.latencyMs} />
                <p className="text-[10px] text-slate-300 mt-3 text-center">
                  As of {new Date(health.timestamp).toLocaleTimeString()}
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
