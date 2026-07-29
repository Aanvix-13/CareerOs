'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users,
  UserCheck,
  UserX,
  Briefcase,
  FileText,
  CalendarRange,
  MessageSquare,
  AlertCircle,
  Loader2,
  ArrowRight,
  TrendingUp,
  Settings,
  Bell,
  Activity,
  History,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';

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
      <div className="flex h-[60vh] items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-zinc-400 text-sm">Loading dashboard statistics...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-6 text-center text-rose-400 max-w-xl mx-auto my-12">
        <AlertTriangle className="h-10 w-10 mx-auto mb-3 text-rose-500" />
        <h3 className="font-semibold text-lg text-white mb-1">Failed to Load Dashboard</h3>
        <p className="text-sm text-zinc-400 mb-4">{error || 'An unexpected error occurred.'}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    { title: 'Active Users', value: stats.activeUsers, icon: UserCheck, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    { title: 'Suspended Users', value: stats.suspendedUsers, icon: UserX, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
    { title: 'New Today', value: stats.newUsersToday, icon: TrendingUp, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
    { title: 'Applications', value: stats.totalApplications, icon: Briefcase, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { title: 'Resumes', value: stats.totalResumes, icon: FileText, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
    { title: 'Interviews', value: stats.totalInterviews, icon: CalendarRange, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
    { title: 'Pending Feedback', value: stats.pendingFeedback, icon: AlertCircle, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-zinc-400 mt-1">Real-time application health monitoring and statistics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className={`p-6 rounded-2xl border ${card.bg} flex items-center justify-between`}>
              <div className="space-y-1">
                <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">{card.title}</p>
                <p className="text-2xl font-bold text-white">{card.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-zinc-950/40 ${card.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-6">
          <div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Settings className="h-5 w-5 text-indigo-400" />
              Quick Actions
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">Shortcuts to manage dashboard modules.</p>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/admin_careeros/users"
              className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-950/20 hover:bg-zinc-950/50 hover:border-zinc-700 transition group text-sm font-semibold"
            >
              <span className="flex items-center gap-3 text-zinc-300 group-hover:text-white">
                <Users className="h-4 w-4 text-indigo-400" />
                Manage Users
              </span>
              <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:translate-x-1 group-hover:text-white transition" />
            </Link>

            <Link
              href="/admin_careeros/feedback"
              className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-950/20 hover:bg-zinc-950/50 hover:border-zinc-700 transition group text-sm font-semibold"
            >
              <span className="flex items-center gap-3 text-zinc-300 group-hover:text-white">
                <MessageSquare className="h-4 w-4 text-emerald-400" />
                Review Feedback
              </span>
              <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:translate-x-1 group-hover:text-white transition" />
            </Link>

            <Link
              href="/admin_careeros/notifications"
              className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-950/20 hover:bg-zinc-950/50 hover:border-zinc-700 transition group text-sm font-semibold"
            >
              <span className="flex items-center gap-3 text-zinc-300 group-hover:text-white">
                <Bell className="h-4 w-4 text-amber-400" />
                Send Announcement
              </span>
              <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:translate-x-1 group-hover:text-white transition" />
            </Link>

            <Link
              href="/admin_careeros/settings"
              className="flex items-center justify-between p-4 rounded-xl border border-zinc-800 bg-zinc-950/20 hover:bg-zinc-950/50 hover:border-zinc-700 transition group text-sm font-semibold"
            >
              <span className="flex items-center gap-3 text-zinc-300 group-hover:text-white">
                <Settings className="h-4 w-4 text-purple-400" />
                System Settings
              </span>
              <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:translate-x-1 group-hover:text-white transition" />
            </Link>
          </div>
        </div>

        {/* Audit Logs */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-6">
          <div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-500" />
              Recent System Activity
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">Timeline of recent administrator actions.</p>
          </div>

          <div className="max-h-[380px] overflow-y-auto space-y-4 pr-1">
            {activities.length === 0 ? (
              <div className="text-center py-12 text-sm text-zinc-500">
                No recent administrative activity found.
              </div>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="flex gap-4 p-3 rounded-xl bg-zinc-950/20 border border-zinc-900/80">
                  <div className="flex items-center justify-center p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0 h-10 w-10">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white px-2 py-0.5 bg-zinc-800 rounded">
                        {activity.action}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-300 font-medium">{activity.details}</p>
                    <p className="text-[10px] text-zinc-500">Resource: {activity.resource} • Admin: {activity.adminId}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
