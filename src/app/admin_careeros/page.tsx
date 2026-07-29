'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users, UserCheck, UserX, Briefcase, FileText,
  CalendarRange, MessageSquare, AlertCircle, Loader2,
  ArrowRight, TrendingUp, Settings, Bell, Activity, AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import { Card, Badge, Button } from '@/components/ui';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  newUsersToday: number;
  totalApplications: number;
  totalResumes: number;
  totalInterviews: number;
  pendingFeedback: number;
}

interface ActivityLog {
  id: string;
  adminId: string;
  action: string;
  resource: string;
  details: string;
  timestamp: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, activityRes] = await Promise.all([
          axios.get('/api/admin_careeros/dashboard'),
          axios.get('/api/admin_careeros/activity'),
        ]);
        setStats(statsRes.data.data);
        setActivities(activityRes.data.data);
      } catch (err: any) {
        setError(err.response?.data?.error?.message || err.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#6D5EF5]" />
          <p className="text-[#6B7280] text-sm font-semibold">Loading dashboard statistics...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-[24px] border border-[#FECACA] bg-[#FEF2F2] p-8 text-center max-w-xl mx-auto my-12">
        <AlertTriangle className="h-10 w-10 mx-auto mb-3 text-[#EF4444]" />
        <h3 className="font-bold text-lg text-[#111827] mb-1">Failed to Load Dashboard</h3>
        <p className="text-sm text-[#4B5563] mb-4">{error || 'An unexpected error occurred.'}</p>
        <Button variant="danger" size="sm" onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Users',       value: stats.totalUsers,         icon: Users,         iconBg: 'bg-[#EFF6FF]', iconColor: 'text-[#3B82F6]' },
    { title: 'Active Users',      value: stats.activeUsers,        icon: UserCheck,     iconBg: 'bg-[#F0FDF4]', iconColor: 'text-[#22C55E]' },
    { title: 'Suspended',         value: stats.suspendedUsers,     icon: UserX,         iconBg: 'bg-[#FEF2F2]', iconColor: 'text-[#EF4444]' },
    { title: 'New Today',         value: stats.newUsersToday,      icon: TrendingUp,    iconBg: 'bg-[#FFFBEB]', iconColor: 'text-[#F59E0B]' },
    { title: 'Applications',      value: stats.totalApplications,  icon: Briefcase,     iconBg: 'bg-[#F3F1FF]', iconColor: 'text-[#6D5EF5]' },
    { title: 'Resumes',           value: stats.totalResumes,       icon: FileText,      iconBg: 'bg-[#FFF7ED]', iconColor: 'text-[#F97316]' },
    { title: 'Interviews',        value: stats.totalInterviews,    icon: CalendarRange, iconBg: 'bg-[#F3F1FF]', iconColor: 'text-[#8B5CF6]' },
    { title: 'Pending Feedback',  value: stats.pendingFeedback,    icon: AlertCircle,   iconBg: 'bg-[#F0FDF4]', iconColor: 'text-[#14B8A6]' },
  ];

  const quickActions = [
    { href: '/admin_careeros/users',         label: 'Manage Users',      icon: Users,         color: 'text-[#3B82F6]' },
    { href: '/admin_careeros/feedback',      label: 'Review Feedback',   icon: MessageSquare, color: 'text-[#22C55E]' },
    { href: '/admin_careeros/notifications', label: 'Send Announcement', icon: Bell,          color: 'text-[#F59E0B]' },
    { href: '/admin_careeros/settings',      label: 'System Settings',   icon: Settings,      color: 'text-[#8B5CF6]' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-[--font-sans]">
      <div>
        <h1 className="text-3xl font-black text-[#111827] tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-[#6B7280] font-semibold mt-1">Real-time application health monitoring and statistics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="p-5 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs text-[#6B7280] font-bold uppercase tracking-wider">{card.title}</p>
                <p className="text-2xl font-black text-[#111827]">{card.value}</p>
              </div>
              <div className={`h-11 w-11 rounded-[14px] ${card.iconBg} ${card.iconColor} flex items-center justify-center shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card className="p-6 space-y-5">
            <div>
              <h3 className="font-bold text-lg text-[#111827] flex items-center gap-2">
                <Settings className="h-5 w-5 text-[#6D5EF5]" />
                Quick Actions
              </h3>
              <p className="text-xs text-[#6B7280] font-semibold mt-0.5">Shortcuts to manage dashboard modules.</p>
            </div>

            <div className="flex flex-col gap-3">
              {quickActions.map(({ href, label, icon: Icon, color }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between p-4 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] hover:bg-[#F3F1FF] hover:border-[#6D5EF5]/30 transition duration-200 group text-sm font-bold"
                >
                  <span className={`flex items-center gap-3 text-[#4B5563] group-hover:text-[#6D5EF5] transition-colors`}>
                    <Icon className={`h-4 w-4 ${color}`} />
                    {label}
                  </span>
                  <ArrowRight className="h-4 w-4 text-[#D1D5DB] group-hover:translate-x-1 group-hover:text-[#6D5EF5] transition-all" />
                </Link>
              ))}
            </div>
          </Card>
        </div>

        {/* Audit / Activity Logs */}
        <div className="lg:col-span-2">
          <Card className="p-6 space-y-5">
            <div>
              <h3 className="font-bold text-lg text-[#111827] flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#6D5EF5]" />
                Recent System Activity
              </h3>
              <p className="text-xs text-[#6B7280] font-semibold mt-0.5">Timeline of recent administrator actions.</p>
            </div>

            <div className="max-h-[380px] overflow-y-auto space-y-3 pr-1">
              {activities.length === 0 ? (
                <div className="text-center py-12 text-sm text-[#6B7280] font-semibold">
                  No recent administrative activity found.
                </div>
              ) : (
                activities.map((activity) => (
                  <div key={activity.id} className="flex gap-4 p-4 rounded-xl bg-[#FAFAFA] border border-[#E5E7EB]">
                    <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-[#F3F1FF] text-[#6D5EF5] shrink-0">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="primary">{activity.action}</Badge>
                        <span className="text-[10px] text-[#6B7280] font-semibold">
                          {new Date(activity.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-[#111827] font-semibold">{activity.details}</p>
                      <p className="text-[10px] text-[#6B7280] font-medium">Resource: {activity.resource} • Admin: {activity.adminId}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
