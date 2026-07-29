'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Bell,
  Send,
  Loader2,
  AlertCircle,
  History,
  Users,
  Calendar,
  Check,
} from 'lucide-react';

interface NotificationHistoryItem {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  status: string;
  user: {
    email: string;
    profile: {
      fullName: string;
    } | null;
  };
}

interface UserListItem {
  id: string;
  email: string;
  profile: {
    fullName: string;
  } | null;
}

export default function AdminAnnouncementsPage() {
  const [history, setHistory] = useState<NotificationHistoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  // Form states
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
    setLoadingHistory(true);
    setHistoryError(null);
    try {
      const res = await axios.get('/api/admin_careeros/notifications?limit=25');
      setHistory(res.data.data.notifications);
      setTotal(res.data.data.total);
    } catch (err: any) {
      setHistoryError(err.response?.data?.error?.message || err.message || 'Failed to load announcement history.');
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axios.get('/api/admin_careeros/users?limit=100');
      setUserList(res.data.data.users);
    } catch (err: any) {
      console.error('Failed to fetch user list:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (audience === 'Selected Users') {
      fetchUsers();
    }
  }, [audience]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    // Form validations
    if (!title || !message) {
      setErrorMessage('Please fill in all fields.');
      return;
    }
    if (audience === 'Selected Users' && selectedUserIds.length === 0) {
      setErrorMessage('Please select at least one recipient user.');
      return;
    }

    setSendLoading(true);
    try {
      const res = await axios.post('/api/admin_careeros/notifications', {
        title,
        message,
        audience,
        targetUserIds: audience === 'Selected Users' ? selectedUserIds : undefined,
      });

      setSuccessMessage(`Announcement sent successfully to ${res.data.data.count} users.`);
      setTitle('');
      setMessage('');
      setSelectedUserIds([]);
      setAudience('All Users');
      fetchHistory();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.error?.message || err.message || 'Failed to send announcement.');
    } finally {
      setSendLoading(false);
    }
  };

  const handleUserSelectToggle = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">System Announcements</h1>
        <p className="text-sm text-zinc-400 mt-1">Broadcast in-app notifications and announcements to platform users.</p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-400 text-sm font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            {successMessage}
          </span>
          <button onClick={() => setSuccessMessage(null)} className="hover:text-white">✕</button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/20 text-rose-400 text-sm font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {errorMessage}
          </span>
          <button onClick={() => setErrorMessage(null)} className="hover:text-white">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Announcement Form (Left) */}
        <div className="lg:col-span-1 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-6 backdrop-blur-sm h-fit">
          <div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Bell className="h-5 w-5 text-indigo-500" />
              Compose Message
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">Send a real-time notification block to users.</p>
          </div>

          <form onSubmit={handleSend} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Announcement Title</label>
              <input
                type="text"
                required
                maxLength={100}
                placeholder="e.g. System Maintenance Update"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/40 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Audience</label>
              <select
                value={audience}
                onChange={(e: any) => setAudience(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/40 text-sm text-zinc-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="All Users">All Registered Users</option>
                <option value="New Users">New Users (Last 7 Days)</option>
                <option value="Selected Users">Specific Users (Select Below)</option>
              </select>
            </div>

            {/* User Checklist if Selected Users */}
            {audience === 'Selected Users' && (
              <div className="space-y-2 border-t border-zinc-900 pt-3">
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">Recipients ({selectedUserIds.length})</label>
                {loadingUsers ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                  </div>
                ) : (
                  <div className="max-h-48 overflow-y-auto border border-zinc-800 rounded-xl bg-zinc-950/40 p-2 space-y-1.5">
                    {userList.map((user) => (
                      <label
                        key={user.id}
                        className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-zinc-850 cursor-pointer text-xs"
                      >
                        <input
                          type="checkbox"
                          checked={selectedUserIds.includes(user.id)}
                          onChange={() => handleUserSelectToggle(user.id)}
                          className="rounded border-zinc-800 bg-zinc-950 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate">{user.profile?.fullName || 'User'}</p>
                          <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Message Content</label>
              <textarea
                required
                rows={6}
                maxLength={1000}
                placeholder="Write the announcement body here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 rounded-xl border border-zinc-800 bg-zinc-950/40 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={sendLoading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20"
            >
              {sendLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Broadcast Announcement
                </>
              )}
            </button>
          </form>
        </div>

        {/* Announcement History (Right) */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-6 backdrop-blur-sm">
          <div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <History className="h-5 w-5 text-indigo-500" />
              Broadcast History
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">Timeline of past system-generated announcements.</p>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
            {loadingHistory ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
              </div>
            ) : historyError ? (
              <div className="p-4 text-center text-zinc-500 text-xs border border-zinc-800 rounded-xl bg-zinc-950/20">
                {historyError}
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-16 text-zinc-500 text-sm">
                No announcement history available.
              </div>
            ) : (
              history.map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-zinc-950/20 border border-zinc-900 space-y-2">
                  <div className="flex items-center justify-between gap-3 border-b border-zinc-900 pb-2">
                    <h4 className="font-bold text-white text-sm leading-snug">{item.title}</h4>
                    <span className="text-[10px] text-zinc-500 flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-medium">{item.message}</p>
                  <p className="text-[10px] text-zinc-500">
                    Audience Type: <span className="font-bold text-indigo-400">System Announcement</span> • Recipient:{' '}
                    <span className="text-zinc-300 font-semibold">{item.user.profile?.fullName || item.user.email}</span>
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
