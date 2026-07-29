'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ArrowLeft,
  Briefcase,
  FileText,
  CalendarRange,
  CheckSquare,
  MessageSquare,
  Loader2,
  AlertCircle,
  UserCheck,
  UserX,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

interface UserDetails {
  user: {
    id: string;
    email: string;
    createdAt: string;
    isSuspended: boolean;
    profile: {
      fullName: string;
      profileImageUrl: string | null;
      phone: string | null;
      college: string | null;
      degree: string | null;
      specialization: string | null;
      graduationYear: number | null;
      preferredRole: string | null;
      preferredLocation: string | null;
      bio: string | null;
    } | null;
  };
  applications: any[];
  resumes: any[];
  feedback: any[];
  notifications: any[];
  interviews: any[];
  reminders: any[];
}

type TabType = 'applications' | 'resumes' | 'interviews' | 'reminders' | 'feedback';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const [details, setDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('applications');
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const fetchUserDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/admin_careeros/users/${userId}`);
      setDetails(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to fetch user details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const handleToggleSuspend = async () => {
    if (!details) return;
    setActionLoading(true);
    const action = details.user.isSuspended ? 'activate' : 'suspend';
    try {
      await axios.patch(`/api/admin_careeros/users/${userId}/${action}`);
      await fetchUserDetails();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || err.message || `Failed to ${action} user.`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    setActionLoading(true);
    try {
      await axios.delete(`/api/admin_careeros/users/${userId}`);
      router.push('/admin_careeros/users');
    } catch (err: any) {
      alert(err.response?.data?.error?.message || err.message || 'Failed to delete user.');
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-6 text-center text-rose-400 max-w-xl mx-auto mt-12">
        <AlertCircle className="h-10 w-10 mx-auto mb-3 text-rose-500" />
        <h3 className="font-semibold text-lg text-white mb-1">Error Loading Details</h3>
        <p className="text-sm text-zinc-400 mb-4">{error || 'User not found.'}</p>
        <Link href="/admin_careeros/users" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline">
          Back to directory
        </Link>
      </div>
    );
  }

  const { user, applications, resumes, interviews, reminders, feedback } = details;

  const tabs: { type: TabType; name: string; count: number; icon: any }[] = [
    { type: 'applications', name: 'Applications', count: applications.length, icon: Briefcase },
    { type: 'resumes', name: 'Resumes', count: resumes.length, icon: FileText },
    { type: 'interviews', name: 'Interviews', count: interviews.length, icon: CalendarRange },
    { type: 'reminders', name: 'Reminders', count: reminders.length, icon: CheckSquare },
    { type: 'feedback', name: 'Feedback', count: feedback.length, icon: MessageSquare },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex items-center gap-3">
        <Link href="/admin_careeros/users" className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">User Profile Details</span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">{user.profile?.fullName || user.email}</h1>
        </div>
      </div>

      {/* Header Profile Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info Column */}
        <div className="md:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 flex flex-col sm:flex-row gap-6 items-start backdrop-blur-sm">
          <div className="h-20 w-20 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-2xl text-white overflow-hidden shrink-0 border border-zinc-800">
            {user.profile?.profileImageUrl ? (
              <img src={user.profile.profileImageUrl} alt="avatar" className="h-full w-full object-cover" />
            ) : (
              (user.profile?.fullName || user.email).charAt(0).toUpperCase()
            )}
          </div>
          <div className="space-y-4 flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Email Address</p>
                <p className="text-white font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">College</p>
                <p className="text-zinc-300 font-medium">{user.profile?.college || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Degree & Major</p>
                <p className="text-zinc-300 font-medium">
                  {user.profile?.degree} {user.profile?.specialization ? `(${user.profile.specialization})` : ''} {!user.profile?.degree && !user.profile?.specialization && '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Register Date</p>
                <p className="text-zinc-400 font-medium">
                  {new Date(user.createdAt).toLocaleString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
            {user.profile?.bio && (
              <div className="pt-2 border-t border-zinc-900">
                <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-1">Biography</p>
                <p className="text-sm text-zinc-400 font-medium leading-relaxed">{user.profile.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Column */}
        <div className="md:col-span-1 rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 flex flex-col justify-between backdrop-blur-sm">
          <div>
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-1">Account Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
              user.isSuspended
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                : 'bg-green-500/10 text-green-400 border border-green-500/20'
            }`}>
              {user.isSuspended ? 'Suspended' : 'Active Account'}
            </span>
          </div>

          <div className="space-y-3 pt-6 border-t border-zinc-900 mt-6">
            <button
              onClick={handleToggleSuspend}
              disabled={actionLoading}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition cursor-pointer ${
                user.isSuspended
                  ? 'bg-green-600/10 hover:bg-green-600/20 text-green-400 border-green-500/20'
                  : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/20'
              }`}
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : user.isSuspended ? (
                <>
                  <UserCheck className="h-4 w-4" />
                  Activate User
                </>
              ) : (
                <>
                  <UserX className="h-4 w-4" />
                  Suspend User
                </>
              )}
            </button>

            <button
              onClick={() => setDeleteConfirm(true)}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white transition cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.type;
          return (
            <button
              key={tab.type}
              onClick={() => setActiveTab(tab.type)}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 font-semibold text-sm transition shrink-0 cursor-pointer ${
                isActive
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                  : 'border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/10'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.name}
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${isActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-zinc-800 text-zinc-500'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/10 p-6 min-h-[300px]">
        {/* APPLICATIONS TAB */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            {applications.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 text-sm">No applications tracked.</div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-zinc-850 bg-zinc-950/20">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-950/40 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Job Title</th>
                      <th className="px-6 py-4">Company</th>
                      <th className="px-6 py-4">Applied Date</th>
                      <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/50">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-zinc-900/10 transition">
                        <td className="px-6 py-4 text-white font-semibold">{app.jobTitle}</td>
                        <td className="px-6 py-4 text-zinc-300">{app.companyName}</td>
                        <td className="px-6 py-4 text-zinc-400 text-xs">
                          {new Date(app.applicationDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            {app.currentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* RESUMES TAB */}
        {activeTab === 'resumes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resumes.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-zinc-500 text-sm">No resumes uploaded.</div>
            ) : (
              resumes.map((res) => (
                <div key={res.id} className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/20 flex flex-col justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-white text-sm">{res.name}</p>
                      {res.isDefault && (
                        <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                          DEFAULT
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500">Version: {res.version || '1.0'} • Size: {(res.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                    {res.notes && <p className="text-xs text-zinc-400 mt-2 italic">"{res.notes}"</p>}
                  </div>
                  <a
                    href={res.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold mt-2"
                  >
                    View File
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ))
            )}
          </div>
        )}

        {/* INTERVIEWS TAB */}
        {activeTab === 'interviews' && (
          <div className="space-y-4">
            {interviews.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 text-sm">No interviews scheduled.</div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-zinc-850 bg-zinc-950/20">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-950/40 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Round</th>
                      <th className="px-6 py-4">Company</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/50">
                    {interviews.map((int) => (
                      <tr key={int.id} className="hover:bg-zinc-900/10 transition">
                        <td className="px-6 py-4 text-white font-semibold">{int.interviewRound}</td>
                        <td className="px-6 py-4 text-zinc-300">{int.application.companyName}</td>
                        <td className="px-6 py-4 text-zinc-400 text-xs">{int.interviewType}</td>
                        <td className="px-6 py-4 text-zinc-400 text-xs">
                          {new Date(int.scheduledDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            int.result === 'Passed'
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                              : int.result === 'Failed'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                          }`}>
                            {int.result}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* REMINDERS TAB */}
        {activeTab === 'reminders' && (
          <div className="space-y-3">
            {reminders.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 text-sm">No reminders set.</div>
            ) : (
              reminders.map((rem) => (
                <div key={rem.id} className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/20 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-semibold text-white text-sm">{rem.title}</p>
                    <p className="text-xs text-zinc-500">
                      Due: {new Date(rem.dueDate).toLocaleDateString()} • Priority:{' '}
                      <span className={`font-semibold ${
                        rem.priority === 'Critical' || rem.priority === 'High' ? 'text-rose-400' : 'text-zinc-400'
                      }`}>{rem.priority}</span>
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    rem.status === 'Completed'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {rem.status}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* FEEDBACK TAB */}
        {activeTab === 'feedback' && (
          <div className="space-y-4">
            {feedback.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 text-sm">No feedback submitted.</div>
            ) : (
              feedback.map((feed) => (
                <div key={feed.id} className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/20 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white px-2 py-0.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded">
                        {feed.category}
                      </span>
                      <h4 className="font-bold text-white text-sm">{feed.title}</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-400">
                      {feed.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{feed.description}</p>
                  <p className="text-[10px] text-zinc-500">Submitted: {new Date(feed.submittedAt).toLocaleDateString()}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Delete User Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-6 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/20">
              <Trash2 className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-white">Delete User?</h3>
              <p className="text-sm text-zinc-400">
                This action is permanent and cannot be undone. All related user applications, resumes, interviews, and notes will be deleted.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="px-4 py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-semibold text-xs transition cursor-pointer"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
