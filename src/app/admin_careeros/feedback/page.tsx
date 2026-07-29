'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MessageSquare,
  Search,
  Filter,
  Eye,
  Trash2,
  AlertCircle,
  Loader2,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface FeedbackItem {
  id: string;
  userId: string;
  category: string;
  title: string;
  description: string;
  screenshotUrl: string | null;
  status: string;
  adminNotes: string | null;
  browser: string;
  device: string;
  appVersion: string;
  submittedAt: string;
  user: {
    email: string;
    profile: {
      fullName: string;
    } | null;
  };
}

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [status, setStatus] = useState<string>('all');

  // Selected feedback for detail view / editing
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [editStatus, setEditStatus] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchFeedback = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { page, limit };
      if (search) params.search = search;
      if (category !== 'all') params.category = category;
      if (status !== 'all') params.status = status;

      const res = await axios.get('/api/admin_careeros/feedback', { params });
      setFeedback(res.data.data.feedback);
      setTotal(res.data.data.total);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to fetch feedback.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [page, limit, category, status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchFeedback();
  };

  const handleSelectFeedback = (item: FeedbackItem) => {
    setSelectedFeedback(item);
    setEditStatus(item.status);
    setEditNotes(item.adminNotes || '');
  };

  const handleUpdateFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeedback) return;
    setUpdateLoading(true);
    try {
      await axios.patch(`/api/admin_careeros/feedback/${selectedFeedback.id}`, {
        status: editStatus,
        adminNotes: editNotes,
      });
      // Refresh current feedback item
      const updatedItem = {
        ...selectedFeedback,
        status: editStatus,
        adminNotes: editNotes,
      };
      setSelectedFeedback(updatedItem);
      // Refresh list
      fetchFeedback();
      alert('Feedback updated successfully.');
    } catch (err: any) {
      alert(err.response?.data?.error?.message || err.message || 'Failed to update feedback.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    try {
      await axios.delete(`/api/admin_careeros/feedback/${id}`);
      if (selectedFeedback?.id === id) {
        setSelectedFeedback(null);
      }
      setDeleteConfirmId(null);
      fetchFeedback();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || err.message || 'Failed to delete feedback.');
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">User Feedback</h1>
        <p className="text-sm text-zinc-400 mt-1">Review, categorize, and respond to user submissions.</p>
      </div>

      {/* Controls Card */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-4 backdrop-blur-sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by title, description, or user details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/40 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Category Filter */}
            <select
              value={category}
              onChange={(e: any) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/40 text-sm text-zinc-300 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="Bug Report">Bug Reports</option>
              <option value="Feature Request">Feature Requests</option>
              <option value="Improvement Suggestion">Suggestions</option>
              <option value="General Feedback">General</option>
            </select>

            {/* Status Filter */}
            <select
              value={status}
              onChange={(e: any) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/40 text-sm text-zinc-300 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Planned">Planned</option>
              <option value="Completed">Completed</option>
              <option value="Closed">Closed</option>
            </select>

            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Feedback List (Left) */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="flex h-[40vh] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
          ) : error ? (
            <div className="p-6 text-center border border-zinc-800 bg-zinc-900/20 text-zinc-400 rounded-2xl">
              <AlertCircle className="h-8 w-8 text-rose-500 mx-auto mb-2" />
              <p>{error}</p>
            </div>
          ) : feedback.length === 0 ? (
            <div className="p-12 text-center border border-zinc-800 bg-zinc-900/20 text-zinc-500 rounded-2xl">
              No feedback submissions found.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3">
                {feedback.map((item) => {
                  const isSelected = selectedFeedback?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectFeedback(item)}
                      className={`p-5 rounded-2xl border transition duration-150 cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-950/10'
                          : 'border-zinc-800 bg-zinc-900/10 hover:border-zinc-700'
                      }`}
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold text-white px-2 py-0.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded">
                            {item.category}
                          </span>
                          <span className="text-[10px] font-semibold text-zinc-500">
                            by {item.user.profile?.fullName || item.user.email}
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-sm leading-snug">{item.title}</h4>
                        <p className="text-xs text-zinc-400 line-clamp-2">{item.description}</p>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.status === 'Completed'
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : item.status === 'Closed'
                            ? 'bg-zinc-800 text-zinc-500 border border-zinc-700/50'
                            : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        }`}>
                          {item.status}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {new Date(item.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-zinc-500">
                    Showing Page {page} of {totalPages} ({total} items)
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-50 cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-50 cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Feedback Details / Action Panel (Right) */}
        <div className="lg:col-span-1">
          {selectedFeedback ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-6 sticky top-24 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-white px-2 py-0.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded">
                  {selectedFeedback.category}
                </span>
                <button
                  onClick={() => setDeleteConfirmId(selectedFeedback.id)}
                  className="p-2 rounded-lg bg-zinc-950/40 hover:bg-rose-500/20 text-zinc-500 hover:text-rose-500 border border-zinc-900 transition cursor-pointer"
                  title="Delete Feedback"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-lg text-white leading-snug">{selectedFeedback.title}</h3>
                <p className="text-xs text-zinc-500">Submitted by: {selectedFeedback.user.profile?.fullName} ({selectedFeedback.user.email})</p>
                <p className="text-xs text-zinc-500">Submitted at: {new Date(selectedFeedback.submittedAt).toLocaleString()}</p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-900 text-xs text-zinc-300 leading-relaxed max-h-48 overflow-y-auto">
                <p className="font-semibold text-white mb-2 text-xs">Description:</p>
                {selectedFeedback.description}
              </div>

              {selectedFeedback.screenshotUrl && (
                <a
                  href={selectedFeedback.screenshotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                >
                  View Attached Screenshot
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}

              <div className="border-t border-zinc-900 pt-4 space-y-2 text-[10px] text-zinc-500">
                <p>Browser: {selectedFeedback.browser}</p>
                <p>Device: {selectedFeedback.device}</p>
                <p>App Version: {selectedFeedback.appVersion}</p>
              </div>

              <form onSubmit={handleUpdateFeedback} className="border-t border-zinc-900 pt-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Update Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-800 bg-zinc-950/40 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Planned">Planned</option>
                    <option value="Completed">Completed</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Internal Admin Notes</label>
                  <textarea
                    rows={4}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Add administrator review details here. These notes are hidden from the user."
                    className="w-full p-3 rounded-xl border border-zinc-800 bg-zinc-950/40 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updateLoading}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {updateLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/10 p-12 text-center text-zinc-500 text-sm sticky top-24">
              Select a feedback item to view details, update status, and manage administrative notes.
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-6 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/20">
              <Trash2 className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-white">Delete Feedback?</h3>
              <p className="text-sm text-zinc-400">
                This action is permanent and cannot be undone. The feedback record will be permanently deleted from the database.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteConfirmId && handleDeleteFeedback(deleteConfirmId)}
                className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-semibold text-xs transition cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
