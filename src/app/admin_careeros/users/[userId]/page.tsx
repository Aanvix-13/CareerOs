'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ArrowLeft, Briefcase, FileText, CalendarRange, CheckSquare,
  MessageSquare, Loader2, AlertCircle, UserCheck, UserX, Trash2, ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Card, Badge, Button } from '@/components/ui';

interface UserDetails {
  user: {
    id: string; email: string; createdAt: string; isSuspended: boolean;
    profile: {
      fullName: string; profileImageUrl: string | null; phone: string | null;
      college: string | null; degree: string | null; specialization: string | null;
      graduationYear: number | null; preferredRole: string | null;
      preferredLocation: string | null; bio: string | null;
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
    setLoading(true); setError(null);
    try {
      const res = await axios.get(`/api/admin_careeros/users/${userId}`);
      setDetails(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to fetch user details.');
    } finally { setLoading(false); }
  };

  useEffect(() => { if (userId) fetchUserDetails(); }, [userId]);

  const handleToggleSuspend = async () => {
    if (!details) return;
    setActionLoading(true);
    const action = details.user.isSuspended ? 'activate' : 'suspend';
    try {
      await axios.patch(`/api/admin_careeros/users/${userId}/${action}`);
      await fetchUserDetails();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || `Failed to ${action} user.`);
    } finally { setActionLoading(false); }
  };

  const handleDeleteUser = async () => {
    setActionLoading(true);
    try {
      await axios.delete(`/api/admin_careeros/users/${userId}`);
      router.push('/admin_careeros/users');
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to delete user.');
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#6D5EF5]" /></div>;
  }

  if (error || !details) {
    return (
      <div className="rounded-[24px] border border-[#FECACA] bg-[#FEF2F2] p-8 text-center max-w-xl mx-auto mt-12">
        <AlertCircle className="h-10 w-10 mx-auto mb-3 text-[#EF4444]" />
        <h3 className="font-bold text-lg text-[#111827] mb-1">Error Loading Details</h3>
        <p className="text-sm text-[#4B5563] mb-4">{error || 'User not found.'}</p>
        <Link href="/admin_careeros/users" className="text-sm font-bold text-[#6D5EF5] hover:underline">Back to directory</Link>
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

  const DetailField = ({ label, value }: { label: string; value: string }) => (
    <div>
      <p className="text-xs text-[#6B7280] font-bold uppercase tracking-wider">{label}</p>
      <p className="text-sm text-[#111827] font-semibold mt-0.5">{value || '—'}</p>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-[--font-sans]">
      {/* Back Nav */}
      <div className="flex items-center gap-3">
        <Link href="/admin_careeros/users"
          className="p-2 rounded-xl bg-white border border-[#E5E7EB] text-[#6B7280] hover:text-[#6D5EF5] hover:border-[#6D5EF5]/30 transition">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <span className="text-xs text-[#6B7280] font-bold uppercase tracking-widest">User Profile Details</span>
          <h1 className="text-2xl font-black text-[#111827] tracking-tight leading-tight">
            {user.profile?.fullName || user.email}
          </h1>
        </div>
      </div>

      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info */}
        <Card className="md:col-span-2 p-6 flex flex-col sm:flex-row gap-5 items-start">
          <div className="h-20 w-20 rounded-full bg-[#F3F1FF] text-[#6D5EF5] flex items-center justify-center font-black text-2xl overflow-hidden shrink-0 border border-[#E5E7EB]">
            {user.profile?.profileImageUrl ? (
              <img src={user.profile.profileImageUrl} alt="avatar" className="h-full w-full object-cover" />
            ) : (user.profile?.fullName || user.email).charAt(0).toUpperCase()}
          </div>
          <div className="space-y-4 flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              <DetailField label="Email Address" value={user.email} />
              <DetailField label="College" value={user.profile?.college || '—'} />
              <DetailField label="Degree & Major" value={[user.profile?.degree, user.profile?.specialization ? `(${user.profile.specialization})` : ''].filter(Boolean).join(' ') || '—'} />
              <DetailField label="Registered" value={new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })} />
            </div>
            {user.profile?.bio && (
              <div className="pt-3 border-t border-[#F1F5F9]">
                <p className="text-xs text-[#6B7280] font-bold uppercase tracking-wider mb-1">Biography</p>
                <p className="text-sm text-[#4B5563] leading-relaxed">{user.profile.bio}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Actions */}
        <Card className="md:col-span-1 p-6 flex flex-col justify-between gap-6">
          <div className="space-y-2">
            <p className="text-xs text-[#6B7280] font-bold uppercase tracking-wider">Account Status</p>
            <Badge variant={user.isSuspended ? 'danger' : 'success'}>
              {user.isSuspended ? 'Suspended' : 'Active Account'}
            </Badge>
          </div>
          <div className="space-y-3 pt-4 border-t border-[#F1F5F9]">
            <button onClick={handleToggleSuspend} disabled={actionLoading}
              className={`w-full py-2.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border transition cursor-pointer ${
                user.isSuspended
                  ? 'bg-[#F0FDF4] hover:bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]'
                  : 'bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]'
              }`}>
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : user.isSuspended ? <><UserCheck className="h-4 w-4" /> Activate User</> : <><UserX className="h-4 w-4" /> Suspend User</>}
            </button>
            <Button variant="danger" className="w-full justify-center gap-2" onClick={() => setDeleteConfirm(true)}>
              <Trash2 className="h-4 w-4" /> Delete Account
            </Button>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E5E7EB] overflow-x-auto scrollbar-none bg-white rounded-t-xl">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.type;
          return (
            <button key={tab.type} onClick={() => setActiveTab(tab.type)}
              className={`flex items-center gap-2 px-5 py-4 border-b-2 font-bold text-sm transition shrink-0 cursor-pointer ${
                isActive ? 'border-[#6D5EF5] text-[#6D5EF5] bg-[#F3F1FF]/60' : 'border-transparent text-[#6B7280] hover:text-[#111827] hover:bg-[#FAFAFA]'
              }`}>
              <Icon className="h-4 w-4" />
              {tab.name}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${isActive ? 'bg-[#6D5EF5] text-white' : 'bg-[#F1F5F9] text-[#6B7280]'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <Card className="p-6 min-h-[300px]">
        {/* Applications */}
        {activeTab === 'applications' && (
          applications.length === 0 ? <EmptyState msg="No applications tracked." /> : (
            <div className="ds-table-container overflow-x-auto">
              <table className="ds-table">
                <thead><tr><th>Job Title</th><th>Company</th><th>Applied Date</th><th className="text-right">Status</th></tr></thead>
                <tbody>
                  {applications.map(app => (
                    <tr key={app.id}>
                      <td className="font-bold text-[#111827]">{app.jobTitle}</td>
                      <td className="text-[#4B5563]">{app.companyName}</td>
                      <td className="text-xs text-[#6B7280]">{new Date(app.applicationDate).toLocaleDateString()}</td>
                      <td className="text-right"><Badge variant="primary">{app.currentStatus}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* Resumes */}
        {activeTab === 'resumes' && (
          resumes.length === 0 ? <EmptyState msg="No resumes uploaded." /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resumes.map(res => (
                <div key={res.id} className="p-4 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-[#111827] text-sm">{res.name}</p>
                    {res.isDefault && <Badge variant="primary">Default</Badge>}
                  </div>
                  <p className="text-xs text-[#6B7280]">Version: {res.version || '1.0'} • {(res.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                  {res.notes && <p className="text-xs text-[#4B5563] italic">"{res.notes}"</p>}
                  <a href={res.fileUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-[#6D5EF5] hover:text-[#5B4BE6] font-bold mt-auto">
                    View File <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ))}
            </div>
          )
        )}

        {/* Interviews */}
        {activeTab === 'interviews' && (
          interviews.length === 0 ? <EmptyState msg="No interviews scheduled." /> : (
            <div className="ds-table-container overflow-x-auto">
              <table className="ds-table">
                <thead><tr><th>Round</th><th>Company</th><th>Type</th><th>Date</th><th className="text-right">Result</th></tr></thead>
                <tbody>
                  {interviews.map(int => (
                    <tr key={int.id}>
                      <td className="font-bold text-[#111827]">{int.interviewRound}</td>
                      <td className="text-[#4B5563]">{int.application.companyName}</td>
                      <td className="text-xs text-[#6B7280]">{int.interviewType}</td>
                      <td className="text-xs text-[#6B7280]">{new Date(int.scheduledDate).toLocaleDateString()}</td>
                      <td className="text-right">
                        <Badge variant={int.result === 'Passed' ? 'success' : int.result === 'Failed' ? 'danger' : 'warning'}>{int.result}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* Reminders */}
        {activeTab === 'reminders' && (
          reminders.length === 0 ? <EmptyState msg="No reminders set." /> : (
            <div className="space-y-3">
              {reminders.map(rem => (
                <div key={rem.id} className="p-4 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-[#111827] text-sm">{rem.title}</p>
                    <p className="text-xs text-[#6B7280] mt-1">
                      Due: {new Date(rem.dueDate).toLocaleDateString()} • Priority:{' '}
                      <span className={`font-bold ${rem.priority === 'Critical' || rem.priority === 'High' ? 'text-[#EF4444]' : 'text-[#6B7280]'}`}>{rem.priority}</span>
                    </p>
                  </div>
                  <Badge variant={rem.status === 'Completed' ? 'success' : 'warning'}>{rem.status}</Badge>
                </div>
              ))}
            </div>
          )
        )}

        {/* Feedback */}
        {activeTab === 'feedback' && (
          feedback.length === 0 ? <EmptyState msg="No feedback submitted." /> : (
            <div className="space-y-4">
              {feedback.map(feed => (
                <div key={feed.id} className="p-4 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="primary">{feed.category}</Badge>
                      <h4 className="font-bold text-[#111827] text-sm">{feed.title}</h4>
                    </div>
                    <Badge variant="neutral">{feed.status}</Badge>
                  </div>
                  <p className="text-xs text-[#4B5563] leading-relaxed">{feed.description}</p>
                  <p className="text-[10px] text-[#6B7280]">Submitted: {new Date(feed.submittedAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )
        )}
      </Card>

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[24px] border border-[#E5E7EB] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)] p-8 space-y-6 text-center">
            <div className="w-12 h-12 rounded-[16px] bg-[#FEF2F2] text-[#EF4444] flex items-center justify-center mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-[#111827]">Delete User?</h3>
              <p className="text-sm text-[#4B5563]">This is permanent. All applications, resumes, and interviews will be deleted.</p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" size="sm" onClick={() => setDeleteConfirm(false)}>Cancel</Button>
              <Button variant="danger" size="sm" onClick={handleDeleteUser} disabled={actionLoading}>
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete User'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ msg }: { msg: string }) {
  return <div className="text-center py-12 text-sm text-[#6B7280] font-semibold">{msg}</div>;
}
