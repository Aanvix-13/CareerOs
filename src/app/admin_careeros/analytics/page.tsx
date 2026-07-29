'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TrendingUp,
  FileSpreadsheet,
  AlertCircle,
  CalendarDays,
  Briefcase,
  MessageSquare,
} from 'lucide-react';
import { PageHeader, Card, Spinner, Alert, Button, Select } from '@/components/ui';

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
          <Spinner size="lg" />
          <p className="text-[#6B7280] text-sm font-semibold">Loading system analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto mt-12">
        <Alert variant="danger" title="Failed to load analytics" icon={<AlertCircle className="h-5 w-5" />}>
          <div className="mb-4">{error}</div>
          <Button variant="danger" size="sm" onClick={fetchAnalytics}>Try Again</Button>
        </Alert>
      </div>
    );
  }

  const { userGrowth, applicationGrowth, interviewActivity, feedbackDistribution } = data;

  const maxUsers = Math.max(...userGrowth.map((d) => d.value), 1);
  const maxApps = Math.max(...applicationGrowth.map((d) => d.value), 1);
  const maxInterviews = Math.max(...interviewActivity.map((d) => d.value), 1);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
      <PageHeader
        title="Platform Analytics"
        description="Audit statistics, conversion metrics, and system usage graphs."
        actions={
          <div className="flex items-center gap-3">
            <div className="w-40">
              <Select
                value={timeRange}
                onChange={(e: any) => setTimeRange(e.target.value)}
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="12months">Last 12 Months</option>
              </Select>
            </div>
            <Button
              variant="secondary"
              onClick={handleExport}
              loading={exportLoading}
              icon={<FileSpreadsheet className="h-4 w-4 text-[#166534]" />}
            >
              Export CSV
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Growth Chart */}
        <Card className="flex flex-col h-96">
          <h3 className="font-bold text-sm text-[#111827] border-b border-[#F1F5F9] pb-3 mb-6 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#3B82F6]" />
            User Registrations Growth
          </h3>
          {userGrowth.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-sm text-[#6B7280]">
              No registration activity recorded.
            </div>
          ) : (
            <div className="flex-1 flex items-end justify-between gap-2 px-2 pt-6">
              {userGrowth.map((item) => {
                const pct = (item.value / maxUsers) * 100;
                return (
                  <div key={item.name} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                    <span className="text-[10px] text-[#4B5563] font-bold opacity-0 group-hover:opacity-100 transition absolute -top-4">
                      {item.value}
                    </span>
                    <div
                      className="w-full bg-[#3B82F6] hover:bg-[#2563EB] rounded-t transition-all duration-200"
                      style={{ height: `${pct * 0.7}%` }}
                    />
                    <span className="text-[9px] text-[#6B7280] font-semibold truncate max-w-[45px]">
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Application Growth Chart */}
        <Card className="flex flex-col h-96">
          <h3 className="font-bold text-sm text-[#111827] border-b border-[#F1F5F9] pb-3 mb-6 flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-[#8B5CF6]" />
            Applications Created Trends
          </h3>
          {applicationGrowth.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-sm text-[#6B7280]">
              No job applications added.
            </div>
          ) : (
            <div className="flex-1 flex items-end justify-between gap-2 px-2 pt-6">
              {applicationGrowth.map((item) => {
                const pct = (item.value / maxApps) * 100;
                return (
                  <div key={item.name} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                    <span className="text-[10px] text-[#4B5563] font-bold opacity-0 group-hover:opacity-100 transition absolute -top-4">
                      {item.value}
                    </span>
                    <div
                      className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-t transition-all duration-200"
                      style={{ height: `${pct * 0.7}%` }}
                    />
                    <span className="text-[9px] text-[#6B7280] font-semibold truncate max-w-[45px]">
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Interview Activity Chart */}
        <Card className="flex flex-col h-96">
          <h3 className="font-bold text-sm text-[#111827] border-b border-[#F1F5F9] pb-3 mb-6 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[#6D5EF5]" />
            Interviews Scheduled Timeline
          </h3>
          {interviewActivity.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-sm text-[#6B7280]">
              No interview slots scheduled.
            </div>
          ) : (
            <div className="flex-1 flex items-end justify-between gap-2 px-2 pt-6">
              {interviewActivity.map((item) => {
                const pct = (item.value / maxInterviews) * 100;
                return (
                  <div key={item.name} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                    <span className="text-[10px] text-[#4B5563] font-bold opacity-0 group-hover:opacity-100 transition absolute -top-4">
                      {item.value}
                    </span>
                    <div
                      className="w-full bg-[#6D5EF5] hover:bg-[#5B4BE6] rounded-t transition-all duration-200"
                      style={{ height: `${pct * 0.7}%` }}
                    />
                    <span className="text-[9px] text-[#6B7280] font-semibold truncate max-w-[45px]">
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Feedback Categories Distribution */}
        <Card className="flex flex-col h-96">
          <h3 className="font-bold text-sm text-[#111827] border-b border-[#F1F5F9] pb-3 mb-6 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-[#22C55E]" />
            Feedback Category Distribution
          </h3>
          {feedbackDistribution.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-sm text-[#6B7280]">
              No feedback submissions categorised yet.
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center space-y-4">
              {feedbackDistribution.map((item) => {
                const totalVal = feedbackDistribution.reduce((acc, curr) => acc + curr.value, 0);
                const pct = totalVal > 0 ? ((item.value / totalVal) * 100).toFixed(0) : '0';
                return (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-[#6B7280]">
                      <span>{item.name}</span>
                      <span className="text-[#111827] font-extrabold">{item.value} ({pct}%)</span>
                    </div>
                    <div className="h-3 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#22C55E] rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
