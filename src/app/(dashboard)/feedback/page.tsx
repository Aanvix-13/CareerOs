'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  MessageSquare,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Bug,
  Lightbulb,
  X,
  Plus,
  Trash2,
} from 'lucide-react';
import apiClient from '../../../lib/api-client';

export default function FeedbackPage() {
  const [loading, setLoading] = useState(true);
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const loadFeedback = async () => {
    try {
      setLoading(true);
      const response: any = await apiClient.get('/feedback');
      setFeedbackList(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch feedback logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const handleCreateSubmit = async (formData: any) => {
    setSubmitting(true);
    try {
      await apiClient.post('/feedback', formData);
      setSuccess(true);
      setTimeout(() => {
        setIsSubmitOpen(false);
        setSuccess(false);
        reset();
        loadFeedback();
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Failed to submit feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    try {
      await apiClient.delete(`/feedback/${id}`);
      loadFeedback();
    } catch (err: any) {
      alert(err.message || 'Failed to delete submission.');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'BugReport':
        return <Bug className="h-4 w-4 text-rose-400" />;
      case 'FeatureRequest':
      case 'ImprovementSuggestion':
        return <Lightbulb className="h-4 w-4 text-amber-400" />;
      default:
        return <MessageSquare className="h-4 w-4 text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Product Feedback</h1>
          <p className="text-zinc-400 text-sm mt-1">Submit bugs, request features, or send general feedback.</p>
        </div>
        <button
          onClick={() => setIsSubmitOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition duration-150 shadow-lg glow-indigo cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Submit Feedback
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-sm text-rose-400">
          {error}
        </div>
      )}

      {/* Feedback Logs List */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
        </div>
      ) : feedbackList.length === 0 ? (
        <div className="glass-card rounded-2xl border border-dashed border-zinc-800 p-12 text-center max-w-lg mx-auto">
          <MessageSquare className="h-12 w-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="font-bold text-white text-base">No feedback submitted</h3>
          <p className="text-zinc-400 text-xs mt-1">
            Let us know if you find a bug or want a new feature scheduled!
          </p>
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl">
          {feedbackList.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-2xl p-5 border border-zinc-800 space-y-3 hover:border-zinc-700/80 transition duration-150"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-850 border border-zinc-800 px-2.5 py-0.5 text-[10px] font-semibold text-zinc-300">
                      {getCategoryIcon(item.category)}
                      {item.category}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider border ${
                      item.status === 'Completed'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
                        : item.status === 'Submitted'
                        ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20'
                        : 'bg-zinc-850 text-zinc-400 border-zinc-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{item.title}</h4>
                </div>

                {item.status === 'Submitted' && (
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/10 transition cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <p className="text-xs text-zinc-300 whitespace-pre-wrap">{item.description}</p>
              
              <div className="flex items-center gap-4 text-[9px] text-zinc-500 pt-2 border-t border-zinc-850">
                <span>Submitted: {new Date(item.submittedAt).toLocaleDateString()}</span>
                <span>System: {item.device} ({item.browser})</span>
                <span>App version: {item.appVersion}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE SUBMISSION MODAL */}
      {isSubmitOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-lg text-white">Submit Feedback</h3>
              <button onClick={() => setIsSubmitOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {success && (
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-400 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Feedback submitted successfully!</span>
              </div>
            )}

            {!success && (
              <form onSubmit={handleSubmit(handleCreateSubmit)} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Feedback Category</label>
                  <select
                    required
                    {...register('category', { required: true })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="BugReport">Bug Report</option>
                    <option value="FeatureRequest">Feature Request</option>
                    <option value="ImprovementSuggestion">Improvement Suggestion</option>
                    <option value="GeneralFeedback">General Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 font-bold">Summary / Title</label>
                  <input
                    type="text"
                    required
                    {...register('title', { required: true })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-white focus:border-indigo-500 focus:outline-none"
                    placeholder="Short description of the bug or suggestion..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 font-bold">Details (Min 10 characters)</label>
                  <textarea
                    rows={4}
                    required
                    {...register('description', { required: true, minLength: 10 })}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-white focus:border-indigo-500 focus:outline-none"
                    placeholder="Explain the details or steps to reproduce if reporting a bug..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Screenshot URL (Optional)</label>
                  <input
                    type="text"
                    {...register('screenshotUrl')}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-white focus:border-indigo-500 focus:outline-none"
                    placeholder="Paste a direct image link if available..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setIsSubmitOpen(false)}
                    className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-2 shadow-lg glow-indigo"
                  >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    Submit
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
