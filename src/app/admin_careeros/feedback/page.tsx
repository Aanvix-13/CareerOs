'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MessageSquare,
  Search,
  Trash2,
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { PageHeader, Card, Spinner, Alert, Input, Select, Button, Badge, Modal, Textarea } from '@/components/ui';

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
      <PageHeader
        title="User Feedback"
        description="Review, categorize, and respond to user submissions."
      />

      {/* Controls Card */}
      <Card padding="sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <Input
              type="text"
              placeholder="Search by title, description, or user details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              iconLeft={<Search className="h-4 w-4" />}
            />
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <Select
              value={category}
              onChange={(e: any) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Categories</option>
              <option value="Bug Report">Bug Reports</option>
              <option value="Feature Request">Feature Requests</option>
              <option value="Improvement Suggestion">Suggestions</option>
              <option value="General Feedback">General</option>
            </Select>

            <Select
              value={status}
              onChange={(e: any) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Planned">Planned</option>
              <option value="Completed">Completed</option>
              <option value="Closed">Closed</option>
            </Select>

            <Button type="submit">Search</Button>
          </div>
        </form>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Feedback List (Left) */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="flex h-[40vh] items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <Alert variant="danger" title="Error" icon={<AlertCircle className="h-5 w-5" />}>
              {error}
            </Alert>
          ) : feedback.length === 0 ? (
            <div className="p-12 text-center border border-[#E5E7EB] bg-white text-[#6B7280] rounded-2xl">
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
                      className={`p-5 rounded-[20px] border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                        isSelected
                          ? 'border-[#6D5EF5] bg-[#F3F1FF] shadow-sm'
                          : 'border-[#E5E7EB] bg-white hover:border-[#D1D5DB] hover:shadow-[0_2px_8px_rgba(15,23,42,0.05)]'
                      }`}
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="primary">{item.category}</Badge>
                          <span className="text-xs font-semibold text-[#6B7280]">
                            by {item.user.profile?.fullName || item.user.email}
                          </span>
                        </div>
                        <h4 className="font-bold text-[#111827] text-sm leading-snug">{item.title}</h4>
                        <p className="text-xs text-[#4B5563] line-clamp-2">{item.description}</p>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                        <Badge variant={
                          item.status === 'Completed' ? 'success' :
                          item.status === 'Closed' ? 'neutral' : 'primary'
                        }>
                          {item.status}
                        </Badge>
                        <span className="text-xs text-[#6B7280]">
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
                  <span className="text-xs text-[#6B7280] font-semibold">
                    Showing Page {page} of {totalPages} ({total} items)
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-xl border border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-[#F8FAFC] disabled:opacity-50 cursor-pointer transition"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-2 rounded-xl border border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-[#F8FAFC] disabled:opacity-50 cursor-pointer transition"
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
            <Card className="sticky top-24 space-y-6">
              <div className="flex items-center justify-between">
                <Badge variant="primary">{selectedFeedback.category}</Badge>
                <button
                  onClick={() => setDeleteConfirmId(selectedFeedback.id)}
                  className="p-2 rounded-lg bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#EF4444] border border-[#FECACA] transition cursor-pointer"
                  title="Delete Feedback"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-lg text-[#111827] leading-snug">{selectedFeedback.title}</h3>
                <p className="text-xs text-[#6B7280]">Submitted by: <span className="font-semibold text-[#111827]">{selectedFeedback.user.profile?.fullName}</span> ({selectedFeedback.user.email})</p>
                <p className="text-xs text-[#6B7280]">Submitted at: {new Date(selectedFeedback.submittedAt).toLocaleString()}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] text-xs text-[#4B5563] leading-relaxed max-h-48 overflow-y-auto">
                <p className="font-bold text-[#111827] mb-2 text-xs">Description:</p>
                {selectedFeedback.description}
              </div>

              {selectedFeedback.screenshotUrl && (
                <a
                  href={selectedFeedback.screenshotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-[#6D5EF5] hover:text-[#5B4BE6] font-semibold cursor-pointer"
                >
                  View Attached Screenshot
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}

              <div className="border-t border-[#F1F5F9] pt-4 space-y-2 text-xs text-[#6B7280] font-medium">
                <p>Browser: <span className="text-[#111827]">{selectedFeedback.browser}</span></p>
                <p>Device: <span className="text-[#111827]">{selectedFeedback.device}</span></p>
                <p>App Version: <span className="text-[#111827]">{selectedFeedback.appVersion}</span></p>
              </div>

              <form onSubmit={handleUpdateFeedback} className="border-t border-[#F1F5F9] pt-6 space-y-4">
                <Select
                  label="Update Status"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Planned">Planned</option>
                  <option value="Completed">Completed</option>
                  <option value="Closed">Closed</option>
                </Select>

                <Textarea
                  label="Internal Admin Notes"
                  rows={4}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Add administrator review details here. These notes are hidden from the user."
                />

                <Button
                  type="submit"
                  className="w-full"
                  loading={updateLoading}
                  icon={<Check className="h-4 w-4" />}
                >
                  Save Changes
                </Button>
              </form>
            </Card>
          ) : (
            <div className="rounded-[24px] border border-dashed border-[#D1D5DB] bg-[#F8FAFC] p-12 text-center text-[#6B7280] text-sm font-semibold sticky top-24">
              Select a feedback item to view details, update status, and manage administrative notes.
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Feedback"
        description="This action is permanent and cannot be undone. The feedback record will be permanently deleted from the database."
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => deleteConfirmId && handleDeleteFeedback(deleteConfirmId)}>Delete</Button>
          </>
        }
      >
        <div className="flex flex-col items-center py-4">
          <div className="w-16 h-16 rounded-full bg-[#FEF2F2] text-[#EF4444] flex items-center justify-center mb-4">
            <Trash2 className="h-8 w-8" />
          </div>
          <p className="text-[#4B5563] text-center font-medium">Are you sure you want to delete this feedback?</p>
        </div>
      </Modal>
    </div>
  );
}
