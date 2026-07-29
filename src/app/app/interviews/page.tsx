'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarRange,
  Video,
  Phone,
  Building,
  User,
  ExternalLink,
  Edit3,
  CheckSquare,
  AlertTriangle,
  Loader2,
  Trash2,
  X,
  MapPin,
  Clock,
  Calendar,
} from 'lucide-react';
import useInterviewStore from '../../../hooks/useInterviewStore';

export default function InterviewsPage() {
  const { interviews, fetchInterviews, updateStatus, deleteInterview, error } = useInterviewStore();

  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [isOutcomeOpen, setIsOutcomeOpen] = useState(false);

  // Outcome Logging Form State
  const [status, setStatus] = useState('Completed');
  const [result, setResult] = useState('Passed');
  const [feedback, setFeedback] = useState('');
  const [questions, setQuestions] = useState('');

  const loadInterviews = async () => {
    setLoading(true);
    await fetchInterviews();
    setLoading(false);
  };

  useEffect(() => {
    loadInterviews();
  }, [fetchInterviews]);

  const handleOpenOutcome = (interview: any) => {
    setSelectedInterview(interview);
    setStatus(interview.status);
    setResult(interview.result);
    setFeedback(interview.interviewFeedback || '');
    setQuestions(interview.questionsAsked || '');
    setIsOutcomeOpen(true);
  };

  const handleOutcomeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInterview) return;

    try {
      await updateStatus(selectedInterview.id, {
        status,
        result,
        interviewFeedback: feedback || null,
        questionsAsked: questions || null,
      });
      setIsOutcomeOpen(false);
      loadInterviews();
    } catch (err) {
      // Handled
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to cancel or delete this interview round?')) return;
    try {
      await deleteInterview(id);
      loadInterviews();
    } catch (err: any) {
      alert(err.message || 'Failed to delete interview.');
    }
  };

  const getInterviewTypeIcon = (type: string) => {
    switch (type) {
      case 'Phone':
        return <Phone className="h-4 w-4" />;
      case 'Offline':
        return <Building className="h-4 w-4" />;
      case 'Online':
      case 'Video':
      default:
        return <Video className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-gray-500 text-sm">Loading interview schedules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Interview Tracker</h1>
        <p className="text-gray-500 text-sm mt-1">Manage scheduled interview rounds, log questions, and record interview feedback.</p>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-600/10 border border-rose-600/20 p-4 text-sm text-rose-600 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {interviews.length === 0 ? (
        <div className="bg-white shadow-sm border border-gray-200 rounded-2xl border border-dashed border-gray-200 p-12 text-center max-w-lg mx-auto mt-8">
          <CalendarRange className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="font-bold text-gray-900 text-base">No interviews scheduled</h3>
          <p className="text-gray-500 text-xs mt-1">
            Interviews are linked to applications. Go to your Applications Board, click on an application, and click "Schedule Round" to add one!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {interviews.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-sm border border-gray-200 rounded-2xl border border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-gray-300 transition duration-150 shadow-md"
            >
              {/* Left Column: Details */}
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600/10 px-3 py-0.5 text-xs font-semibold text-indigo-600 border border-indigo-600/20">
                    {getInterviewTypeIcon(item.interviewType)}
                    {item.interviewType}
                  </span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                    item.status === 'Scheduled'
                      ? 'bg-amber-600/10 text-amber-600 border-amber-600/20'
                      : item.status === 'Completed'
                      ? 'bg-emerald-600/10 text-emerald-600 border-emerald-600/20'
                      : 'bg-gray-100 text-gray-500 border-gray-300'
                  }`}>
                    {item.status}
                  </span>
                  {item.result !== 'Pending' && (
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                      item.result === 'Passed' || item.result === 'Selected'
                        ? 'bg-emerald-600/15 text-emerald-600 border-emerald-600/20'
                        : 'bg-rose-600/15 text-rose-600 border-rose-600/20'
                    }`}>
                      {item.result}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {item.application.companyName}
                  </h3>
                  <p className="text-sm text-gray-500">{item.application.jobTitle} • {item.interviewRound}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-1.5 gap-x-4 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>
                      {new Date(item.scheduledDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>
                      {new Date(item.scheduledTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })} ({item.timeZone})
                    </span>
                  </div>
                  {item.interviewerName && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{item.interviewerName}</span>
                    </div>
                  )}
                </div>

                {item.preparationNotes && (
                  <div className="text-xs text-gray-400 italic pt-1">
                    <span className="font-semibold block text-[10px] uppercase tracking-wider text-gray-500 mb-1 not-italic">Prep Notes</span>
                    {item.preparationNotes}
                  </div>
                )}

                {item.questionsAsked && (
                  <div className="text-xs bg-white/20 border border-gray-100 p-3 rounded-xl space-y-1">
                    <span className="font-semibold block text-[10px] uppercase tracking-wider text-gray-500">Questions Asked</span>
                    <p className="text-gray-600 whitespace-pre-wrap">{item.questionsAsked}</p>
                  </div>
                )}
              </div>

              {/* Right Column: Actions */}
              <div className="flex items-center gap-3 shrink-0">
                {item.meetingLink && (
                  <a
                    href={item.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-100 bg-white/40 hover:bg-zinc-850 px-3 py-2 text-xs font-bold text-indigo-600 hover:text-indigo-300 transition cursor-pointer"
                  >
                    Join {item.meetingPlatform || 'Video'}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                
                <button
                  onClick={() => handleOpenOutcome(item)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-600 px-3 py-2 text-xs font-bold text-gray-900 transition shadow-md cursor-pointer"
                >
                  <CheckSquare className="h-3.5 w-3.5" />
                  Log Outcome
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-lg border border-transparent hover:border-rose-600/10 text-gray-400 hover:text-rose-600 hover:bg-rose-950/10 transition cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LOG OUTCOME MODAL */}
      {isOutcomeOpen && selectedInterview && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-bold text-lg text-gray-900">Log Interview Outcome</h3>
              <button onClick={() => setIsOutcomeOpen(false)} className="text-gray-500 hover:text-gray-900">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleOutcomeSubmit} className="space-y-4 text-sm max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 focus:border-indigo-600 focus:outline-none"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Rescheduled">Rescheduled</option>
                    <option value="NoShow">No Show</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Result</label>
                  <select
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 focus:border-indigo-600 focus:outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Passed">Passed</option>
                    <option value="Failed">Failed</option>
                    <option value="Waiting">Waiting</option>
                    <option value="Selected">Selected</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Questions Asked</label>
                <textarea
                  rows={3}
                  value={questions}
                  onChange={(e) => setQuestions(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-indigo-600 focus:outline-none"
                  placeholder="Record questions asked during the round..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Feedback / Notes</label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-indigo-600 focus:outline-none"
                  placeholder="Notes on performance, things to study, how it went..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsOutcomeOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-600 text-gray-900 font-semibold"
                >
                  Save Logs
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
