'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Send, Loader2, AlertCircle, History, Check } from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui';

interface NotificationHistoryItem {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  status: string;
  user: { email: string; profile: { fullName: string } | null };
}

interface UserListItem {
  id: string;
  email: string;
  profile: { fullName: string } | null;
}

export default function AdminAnnouncementsPage() {
  const [history, setHistory] = useState<NotificationHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState<'All Users' | 'New Users' | 'Selected Users'>('All Users');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [userList, setUserList] = useState<UserListItem[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoadingHistory(true); setHistoryError(null);
    try {
      const res = await axios.get('/api/admin_careeros/notifications?limit=25');
      setHistory(res.data.data.notifications);
    } catch (err: any) {
      setHistoryError(err.response?.data?.error?.message || 'Failed to load history.');
    } finally { setLoadingHistory(false); }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axios.get('/api/admin_careeros/users?limit=100');
      setUserList(res.data.data.users);
    } catch { /* silent */ } finally { setLoadingUsers(false); }
  };

  useEffect(() => { fetchHistory(); fetchUsers(); }, []);
  useEffect(() => { if (audience === 'Selected Users') fetchUsers(); }, [audience]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null); setErrorMessage(null);
    if (!title || !message) { setErrorMessage('Please fill in all fields.'); return; }
    if (audience === 'Selected Users' && selectedUserIds.length === 0) {
      setErrorMessage('Please select at least one recipient.'); return;
    }
    setSendLoading(true);
    try {
      const res = await axios.post('/api/admin_careeros/notifications', {
        title, message, audience,
        targetUserIds: audience === 'Selected Users' ? selectedUserIds : undefined,
      });
      setSuccessMessage(`Announcement sent to ${res.data.data.count} users.`);
      setTitle(''); setMessage(''); setSelectedUserIds([]); setAudience('All Users');
      fetchHistory();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error?.message || 'Failed to send announcement.');
    } finally { setSendLoading(false); }
  };

  const handleUserSelectToggle = (id: string) =>
    setSelectedUserIds(prev => prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]);

  const inputCls = "w-full px-3 h-10 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111827] focus:outline-none focus:border-[#6D5EF5] focus:ring-2 focus:ring-[#6D5EF5]/10 transition";
  const labelCls = "text-xs text-[#6B7280] font-bold uppercase tracking-wider block mb-1";

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-[--font-sans]">
      <div>
        <h1 className="text-3xl font-black text-[#111827] tracking-tight">System Announcements</h1>
        <p className="text-sm text-[#6B7280] font-semibold mt-1">Broadcast in-app notifications and announcements to platform users.</p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] text-sm font-bold flex items-center justify-between">
          <span className="flex items-center gap-2"><Check className="h-4 w-4" />{successMessage}</span>
          <button onClick={() => setSuccessMessage(null)} className="text-[#166534] hover:text-[#14532D]">✕</button>
        </div>
      )}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-sm font-bold flex items-center justify-between">
          <span className="flex items-center gap-2"><AlertCircle className="h-4 w-4" />{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-[#991B1B] hover:text-[#7F1D1D]">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Compose Panel */}
        <Card className="lg:col-span-1 p-6 space-y-5 h-fit">
          <div>
            <h3 className="font-bold text-lg text-[#111827] flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#6D5EF5]" /> Compose Message
            </h3>
            <p className="text-xs text-[#6B7280] font-semibold mt-0.5">Send a real-time notification to users.</p>
          </div>
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className={labelCls}>Announcement Title</label>
              <input type="text" required maxLength={100} placeholder="e.g. System Maintenance Update"
                value={title} onChange={e => setTitle(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Audience</label>
              <select value={audience} onChange={e => setAudience(e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111827] focus:outline-none focus:border-[#6D5EF5] cursor-pointer">
                <option value="All Users">All Registered Users</option>
                <option value="New Users">New Users (Last 7 Days)</option>
                <option value="Selected Users">Specific Users</option>
              </select>
            </div>

            {audience === 'Selected Users' && (
              <div className="border-t border-[#F1F5F9] pt-3 space-y-2">
                <label className={labelCls}>Recipients ({selectedUserIds.length} selected)</label>
                {loadingUsers ? (
                  <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-[#6D5EF5]" /></div>
                ) : (
                  <div className="max-h-48 overflow-y-auto border border-[#E5E7EB] rounded-xl bg-[#FAFAFA] p-2 space-y-1">
                    {userList.map(user => (
                      <label key={user.id} className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-[#F3F1FF] cursor-pointer text-xs">
                        <input type="checkbox" checked={selectedUserIds.includes(user.id)}
                          onChange={() => handleUserSelectToggle(user.id)}
                          className="rounded border-[#E5E7EB] text-[#6D5EF5] focus:ring-[#6D5EF5]" />
                        <div className="min-w-0">
                          <p className="font-bold text-[#111827] truncate">{user.profile?.fullName || 'User'}</p>
                          <p className="text-[10px] text-[#6B7280] truncate">{user.email}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div>
              <label className={labelCls}>Message Content</label>
              <textarea required rows={6} maxLength={1000} placeholder="Write the announcement here..."
                value={message} onChange={e => setMessage(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111827] focus:outline-none focus:border-[#6D5EF5] focus:ring-2 focus:ring-[#6D5EF5]/10 transition resize-none" />
            </div>

            <Button type="submit" disabled={sendLoading} className="w-full justify-center gap-2">
              {sendLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4" /> Broadcast Announcement</>}
            </Button>
          </form>
        </Card>

        {/* History Panel */}
        <Card className="lg:col-span-2 p-6 space-y-5">
          <div>
            <h3 className="font-bold text-lg text-[#111827] flex items-center gap-2">
              <History className="h-5 w-5 text-[#6D5EF5]" /> Broadcast History
            </h3>
            <p className="text-xs text-[#6B7280] font-semibold mt-0.5">Timeline of past system announcements.</p>
          </div>
          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
            {loadingHistory ? (
              <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-[#6D5EF5]" /></div>
            ) : historyError ? (
              <div className="p-4 text-center text-[#6B7280] text-xs border border-[#E5E7EB] rounded-xl bg-[#FAFAFA]">{historyError}</div>
            ) : history.length === 0 ? (
              <div className="text-center py-16 text-[#6B7280] text-sm font-semibold">No announcements sent yet.</div>
            ) : (
              history.map(item => (
                <div key={item.id} className="p-4 rounded-xl bg-[#FAFAFA] border border-[#E5E7EB] space-y-2">
                  <div className="flex items-center justify-between gap-3 border-b border-[#F1F5F9] pb-2">
                    <h4 className="font-bold text-[#111827] text-sm">{item.title}</h4>
                    <span className="text-[10px] text-[#6B7280] font-semibold shrink-0">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-[#4B5563] leading-relaxed">{item.message}</p>
                  <p className="text-[10px] text-[#6B7280]">
                    Recipient: <span className="font-bold text-[#4B5563]">{item.user.profile?.fullName || item.user.email}</span>
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
