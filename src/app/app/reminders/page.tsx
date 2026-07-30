'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  CheckSquare,
  Clock,
  Plus,
  Trash2,
  AlertTriangle,
  Loader2,
  X,
  Calendar,
  Tag,
  CheckCircle,
  Link,
  SlidersHorizontal,
} from 'lucide-react';
import useReminderStore from '../../../hooks/useReminderStore';
import useApplicationStore from '../../../hooks/useApplicationStore';

export default function RemindersPage() {
  const { reminders, fetchReminders, createReminder, completeReminder, deleteReminder, error } = useReminderStore();
  const { applications, fetchApplications } = useApplicationStore();

  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Filter states
  const [status, setStatus] = useState('Pending');
  const [priority, setPriority] = useState('');
  const [reminderType, setReminderType] = useState('');

  const { register, handleSubmit, reset } = useForm();

  const loadReminders = async (silent = false) => {
    if (!silent) setLoading(true);
    await fetchReminders({
      status: status || undefined,
      priority: priority || undefined,
      reminderType: reminderType || undefined,
    });
    if (!silent) setLoading(false);
  };

  useEffect(() => {
    loadReminders();
  }, [status, priority, reminderType, fetchReminders]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleCreateSubmit = async (formData: any) => {
    setLocalError(null);
    setSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description || null,
        reminderType: formData.reminderType,
        priority: formData.priority,
        dueDate: new Date(formData.dueDate).toISOString().split('T')[0],
        dueTime: formData.dueTime || null,
        applicationId: formData.applicationId || null,
      };

      await createReminder(payload);
      setIsCreateOpen(false);
      reset();
      loadReminders();
    } catch (err: any) {
      setLocalError(err.message || 'Failed to create reminder.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await completeReminder(id);
      loadReminders(true);
    } catch (err: any) {
      alert(err.message || 'Failed to complete task.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reminder?')) return;
    try {
      await deleteReminder(id);
      loadReminders(true);
    } catch (err: any) {
      alert(err.message || 'Failed to delete reminder.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Reminders</h1>
          <p className="text-gray-500 text-sm mt-1">Keep track of interview slots, application follow-ups, and offers.</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-indigo-600 transition duration-150 shadow-lg glow-indigo cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Reminder
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-600/10 border border-rose-600/20 p-4 text-sm text-rose-600 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Options Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white backdrop-blur border border-gray-200/80 p-4 rounded-2xl">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-xl bg-white p-1 border border-gray-200">
            <button
              onClick={() => setStatus('Pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                status === 'Pending' ? 'bg-indigo-600 text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatus('Completed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                status === 'Completed' ? 'bg-indigo-600 text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setStatus('')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                status === '' ? 'bg-indigo-600 text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              All
            </button>
          </div>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white/80 text-gray-600 px-3 py-2 focus:border-indigo-600 focus:outline-none text-xs cursor-pointer"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>

          <select
            value={reminderType}
            onChange={(e) => setReminderType(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white/80 text-gray-600 px-3 py-2 focus:border-indigo-600 focus:outline-none text-xs cursor-pointer"
          >
            <option value="">All Types</option>
            <option value="FollowUp">Follow-up</option>
            <option value="Interview">Interview</option>
            <option value="Assessment">Assessment</option>
            <option value="DocumentSubmission">Documents</option>
            <option value="OfferDeadline">Offer Deadline</option>
            <option value="Personal">Personal</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Reminders List */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
        </div>
      ) : reminders.length === 0 ? (
        <div className="bg-white shadow-sm border border-gray-200 rounded-2xl border border-dashed border-gray-200 p-12 text-center max-w-lg mx-auto">
          <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="font-bold text-gray-900 text-base">No reminders found</h3>
          <p className="text-gray-500 text-xs mt-1">
            Create reminders to ensure you follow up on active job applications!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className={`bg-white shadow-sm border border-gray-200 rounded-2xl p-4 border flex items-start justify-between gap-4 transition duration-150 ${
                reminder.status === 'Completed' ? 'border-gray-200 bg-white/20' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-4">
                {reminder.status === 'Pending' ? (
                  <button
                    onClick={() => handleComplete(reminder.id)}
                    className="mt-1 h-5 w-5 rounded-md border border-gray-300 hover:border-indigo-600 transition duration-150 flex items-center justify-center text-indigo-600 shrink-0 cursor-pointer"
                  >
                    <div className="h-2.5 w-2.5 rounded bg-transparent hover:bg-indigo-600/20" />
                  </button>
                ) : (
                  <CheckCircle className="mt-1 h-5 w-5 text-emerald-600 shrink-0" />
                )}

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-bold text-sm ${reminder.status === 'Completed' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                      {reminder.title}
                    </h4>
                    <span className={`inline-flex items-center rounded-full px-1.5 py-0.2 text-[9px] font-semibold uppercase tracking-wider ${
                      reminder.priority === 'Critical'
                        ? 'bg-rose-600/10 text-rose-600 border border-rose-600/20 glow-rose'
                        : reminder.priority === 'High'
                        ? 'bg-rose-600/10 text-rose-600'
                        : reminder.priority === 'Medium'
                        ? 'bg-amber-600/10 text-amber-600'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {reminder.priority}
                    </span>
                    <span className="text-[9px] text-gray-400 bg-gray-100 px-1.5 py-0.2 rounded-full border border-gray-300">
                      {reminder.reminderType}
                    </span>
                  </div>

                  {reminder.description && (
                    <p className={`text-xs ${reminder.status === 'Completed' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {reminder.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-[10px] text-gray-400 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Due Date: {new Date(reminder.dueDate).toLocaleDateString()} {reminder.dueTime ? `at ${reminder.dueTime}` : ''}
                    </span>
                    {reminder.application && (
                      <span className="flex items-center gap-1 text-indigo-600">
                        <Link className="h-3 w-3" />
                        Job: {reminder.application.companyName} ({reminder.application.jobTitle})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDelete(reminder.id)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-950/10 border border-transparent hover:border-rose-600/10 transition cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* CREATE REMINDER MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-bold text-lg text-gray-900">Create Reminder</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-gray-500 hover:text-gray-900">
                <X className="h-5 w-5" />
              </button>
            </div>

            {localError && (
              <div className="rounded-lg bg-rose-600/10 border border-rose-600/20 p-3 text-xs text-rose-600">
                {localError}
              </div>
            )}

            <form onSubmit={handleSubmit(handleCreateSubmit)} className="space-y-4 text-sm max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 font-bold">Reminder Title</label>
                <input
                  type="text"
                  required
                  {...register('title', { required: true })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-indigo-600 focus:outline-none"
                  placeholder="e.g. Call recruiter Jane"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  rows={2}
                  {...register('description')}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-indigo-600 focus:outline-none"
                  placeholder="Details about follow-up content, questions..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Reminder Type</label>
                  <select
                    required
                    {...register('reminderType', { required: true })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 focus:border-indigo-600 focus:outline-none"
                  >
                    <option value="FollowUp">Follow-up</option>
                    <option value="Interview">Interview</option>
                    <option value="Assessment">Assessment</option>
                    <option value="DocumentSubmission">Documents</option>
                    <option value="OfferDeadline">Offer Deadline</option>
                    <option value="Personal">Personal</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Priority</label>
                  <select
                    required
                    {...register('priority', { required: true })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 focus:border-indigo-600 focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 font-bold">Due Date</label>
                  <input
                    type="date"
                    required
                    defaultValue={new Date().toISOString().split('T')[0]}
                    {...register('dueDate', { required: true })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-zinc-350 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Due Time (Optional)</label>
                  <input
                    type="time"
                    {...register('dueTime')}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-zinc-350 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Link Job Application (Optional)</label>
                <select
                  {...register('applicationId')}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 focus:border-indigo-600 focus:outline-none"
                >
                  <option value="">None</option>
                  {applications.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.companyName} - {app.jobTitle}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-600 text-gray-900 font-semibold flex items-center gap-2 shadow-lg glow-indigo"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
