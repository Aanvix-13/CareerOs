'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  Loader2,
  Plus,
  Send,
  AlertTriangle,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import apiClient from '../../../lib/api-client';
import useReminderStore from '../../../hooks/useReminderStore';

export default function DashboardPage() {
  const { completeReminder } = useReminderStore();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response: any = await apiClient.get('/dashboard');
      setData(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleCompleteReminder = async (id: string) => {
    try {
      await completeReminder(id);
      // Reload dashboard state to update checklists
      fetchDashboard();
    } catch (err) {
      // Ignored
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-zinc-400 text-sm">Gathering dashboard statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-6 text-center max-w-lg mx-auto mt-12">
        <AlertTriangle className="h-10 w-10 text-rose-500 mx-auto mb-3" />
        <h3 className="font-semibold text-white mb-1">Failed to load data</h3>
        <p className="text-zinc-400 text-sm mb-4">{error}</p>
        <button
          onClick={fetchDashboard}
          className="rounded-lg bg-zinc-800 hover:bg-zinc-700 px-4 py-2 text-xs font-semibold text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  const {
    totalApplications = 0,
    activeApplications = 0,
    applicationsByStatus = {},
    upcomingInterviews = [],
    upcomingReminders = [],
    recentApplications = [],
  } = data || {};

  // Status mapping to displays
  const pipelineStatuses = [
    { key: 'Wishlist', label: 'Wishlist', color: 'bg-zinc-800 text-zinc-300 border-zinc-700/60' },
    { key: 'Preparing', label: 'Preparing', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
    { key: 'Applied', label: 'Applied', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
    { key: 'OnlineAssessment', label: 'OA Exam', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
    { key: 'TechnicalInterview', label: 'Technical', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    { key: 'HRInterview', label: 'HR Round', color: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20' },
    { key: 'FinalInterview', label: 'Finals', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
    { key: 'OfferReceived', label: 'Offer', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 glow-emerald' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Overview Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Your Pipeline</h1>
          <p className="text-zinc-400 text-sm mt-1">Real-time statistics of your active career applications.</p>
        </div>
        <Link
          href="/applications?create=true"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition duration-150 shadow-lg glow-indigo w-fit"
        >
          <Plus className="h-4 w-4" />
          Add Application
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-zinc-800">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Total Applications</span>
            <div className="p-1.5 rounded-lg bg-zinc-800/80 text-zinc-300">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mt-2">{totalApplications}</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-zinc-800">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Active Search</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white mt-2">{activeApplications}</div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-zinc-800">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Offers Received</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-emerald-400 mt-2">
            {applicationsByStatus['OfferReceived'] || 0}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-zinc-800">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Pending Interviews</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-amber-400 mt-2">
            {upcomingInterviews.length}
          </div>
        </div>
      </div>

      {/* Pipeline Status Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {pipelineStatuses.map((status) => {
          const count = applicationsByStatus[status.key] || 0;
          return (
            <div
              key={status.key}
              className="glass-card rounded-xl p-3 border border-zinc-800/80 text-center flex flex-col items-center justify-center min-h-[90px]"
            >
              <span className="text-[10px] font-semibold text-zinc-400 block truncate w-full max-w-[80px]">
                {status.label}
              </span>
              <span className={`text-xl font-bold mt-1 ${count > 0 ? 'text-white font-extrabold' : 'text-zinc-600'}`}>
                {count}
              </span>
            </div>
          );
        })}
      </div>

      {/* Grid: Upcoming Interviews & Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Interviews */}
        <div className="glass-card rounded-2xl border border-zinc-800 p-6 flex flex-col">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
            <h3 className="font-bold text-lg text-white">Upcoming Interviews</h3>
            <Link href="/interviews" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
              View Calendar <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          <div className="flex-1 space-y-4">
            {upcomingInterviews.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 text-sm">
                No interviews scheduled. Good luck preparing!
              </div>
            ) : (
              upcomingInterviews.map((interview: any) => (
                <div
                  key={interview.id}
                  className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:border-zinc-700/80 transition duration-150 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="inline-flex items-center rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-400 border border-indigo-500/20">
                      {interview.interviewRound}
                    </span>
                    <h4 className="font-bold text-white text-sm mt-1">{interview.application.companyName}</h4>
                    <p className="text-xs text-zinc-400">{interview.application.jobTitle}</p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-zinc-500">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(interview.scheduledDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(interview.scheduledTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
                      </span>
                    </div>
                  </div>

                  {interview.meetingLink && (
                    <a
                      href={interview.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition duration-150"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Reminders Checklist */}
        <div className="glass-card rounded-2xl border border-zinc-800 p-6 flex flex-col">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
            <h3 className="font-bold text-lg text-white">Pending Reminders</h3>
            <Link href="/reminders" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
              Add task <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          <div className="flex-1 space-y-3">
            {upcomingReminders.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 text-sm">
                Clean board! All follow-ups completed.
              </div>
            ) : (
              upcomingReminders.map((reminder: any) => (
                <div
                  key={reminder.id}
                  className="flex items-start justify-between p-3 rounded-xl border border-zinc-800/80 bg-zinc-950/20 hover:border-zinc-800 transition duration-150"
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      onChange={() => handleCompleteReminder(reminder.id)}
                      className="mt-1 h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-zinc-900 border"
                    />
                    <div>
                      <h4 className="font-semibold text-zinc-200 text-sm">{reminder.title}</h4>
                      {reminder.description && (
                        <p className="text-xs text-zinc-500 mt-0.5">{reminder.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-semibold text-rose-400 bg-rose-500/10 px-1.5 py-0.2 rounded">
                          Due: {new Date(reminder.dueDate).toLocaleDateString()}
                        </span>
                        {reminder.application && (
                          <span className="text-[9px] text-zinc-500">
                            ({reminder.application.companyName})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Applications table */}
      <div className="glass-card rounded-2xl border border-zinc-800 p-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
          <h3 className="font-bold text-lg text-white">Recent Applications</h3>
          <Link href="/applications" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
            See all applications <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          {recentApplications.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-sm">
              Your tracking history is empty. Submit your first application above!
            </div>
          ) : (
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="text-xs uppercase text-zinc-500 border-b border-zinc-850">
                <tr>
                  <th scope="col" className="pb-3 pr-4 font-semibold">Company</th>
                  <th scope="col" className="pb-3 px-4 font-semibold">Role</th>
                  <th scope="col" className="pb-3 px-4 font-semibold">Date</th>
                  <th scope="col" className="pb-3 px-4 font-semibold">Status</th>
                  <th scope="col" className="pb-3 pl-4 text-right font-semibold">Resume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850">
                {recentApplications.map((app: any) => {
                  const statusMap = pipelineStatuses.find((s) => s.key === app.currentStatus) || {
                    label: app.currentStatus,
                    color: 'bg-zinc-800 text-zinc-300 border-zinc-700',
                  };

                  return (
                    <tr key={app.id} className="hover:bg-zinc-900/20 transition duration-150">
                      <td className="py-4 pr-4 font-bold text-white text-sm">{app.companyName}</td>
                      <td className="py-4 px-4 text-zinc-400 text-sm">
                        <div className="flex flex-col">
                          <span>{app.jobTitle}</span>
                          <span className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3" /> {app.location || 'Remote'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-xs text-zinc-400">
                        {new Date(app.applicationDate).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusMap.color}`}>
                          {statusMap.label}
                        </span>
                      </td>
                      <td className="py-4 pl-4 text-right text-xs text-indigo-400 font-medium">
                        {app.resume.name}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
