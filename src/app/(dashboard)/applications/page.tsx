'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  Briefcase,
  Calendar,
  Filter,
  Plus,
  Search,
  Trash2,
  CalendarDays,
  Clock,
  ArrowRight,
  ChevronRight,
  Eye,
  Settings,
  X,
  FileText,
  MapPin,
  DollarSign,
  User,
  Mail,
  Link as LinkIcon,
  Loader2,
  CalendarRange,
} from 'lucide-react';
import useApplicationStore from '../../../hooks/useApplicationStore';
import useResumeStore from '../../../hooks/useResumeStore';
import useInterviewStore from '../../../hooks/useInterviewStore';
import useReminderStore from '../../../hooks/useReminderStore';

const PIPELINE_COLUMNS = [
  { key: 'Wishlist', label: 'Wishlist', color: 'border-zinc-800' },
  { key: 'Preparing', label: 'Preparing', color: 'border-orange-500/20' },
  { key: 'Applied', label: 'Applied', color: 'border-indigo-500/20' },
  { key: 'OnlineAssessment', label: 'OA Exam', color: 'border-cyan-500/20' },
  { key: 'TechnicalInterview', label: 'Technical', color: 'border-purple-500/20' },
  { key: 'HRInterview', label: 'HR Round', color: 'border-fuchsia-500/20' },
  { key: 'FinalInterview', label: 'Finals', color: 'border-pink-500/20' },
  { key: 'OfferReceived', label: 'Offer', color: 'border-emerald-500/20 glow-emerald' },
];

function ApplicationsContent() {
  const searchParams = useSearchParams();
  const {
    applications,
    fetchApplications,
    createApplication,
    updateApplication,
    updateStatus,
    deleteApplication,
    fetchHistory,
  } = useApplicationStore();

  const { resumes, fetchResumes } = useResumeStore();
  const { scheduleInterview } = useInterviewStore();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [jobType, setJobType] = useState('');
  const [workMode, setWorkMode] = useState('');
  const [source, setSource] = useState('');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [appHistory, setAppHistory] = useState<any[]>([]);
  const [isStatusEditOpen, setIsStatusEditOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  // Status Change form
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');

  // Schedule Interview form
  const [interviewRound, setInterviewRound] = useState('');
  const [interviewType, setInterviewType] = useState('Online');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [timeZone, setTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
  const [meetingPlatform, setMeetingPlatform] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [interviewerName, setInterviewerName] = useState('');
  const [interviewerEmail, setInterviewerEmail] = useState('');
  const [preparationNotes, setPreparationNotes] = useState('');

  // Add Application form Hook
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Initial loads
  useEffect(() => {
    fetchApplications();
    fetchResumes();
  }, [fetchApplications, fetchResumes]);

  // Check if query triggers create form (e.g. from Dashboard quick link)
  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      setIsCreateOpen(true);
    }
  }, [searchParams]);

  // Trigger details refresh
  const handleOpenDetail = async (app: any) => {
    setSelectedApp(app);
    setIsDetailOpen(true);
    try {
      const history = await fetchHistory(app.id);
      setAppHistory(history);
    } catch (err) {
      setAppHistory([]);
    }
  };

  const handleCreateSubmit = async (formData: any) => {
    try {
      const payload = {
        ...formData,
        salary: formData.salary ? parseFloat(formData.salary) : null,
        applicationDate: new Date(formData.applicationDate).toISOString(),
      };
      await createApplication(payload);
      setIsCreateOpen(false);
      reset();
      fetchApplications();
    } catch (err) {
      // Handled
    }
  };

  const handleUpdateStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatus || !selectedApp) return;

    try {
      await updateStatus(selectedApp.id, newStatus, statusNotes);
      setIsStatusEditOpen(false);
      setStatusNotes('');
      // Refresh current application view & list
      const updatedList: any = await useApplicationStore.getState().applications;
      const updatedItem = updatedList.find((a: any) => a.id === selectedApp.id);
      if (updatedItem) {
        setSelectedApp(updatedItem);
        const history = await fetchHistory(selectedApp.id);
        setAppHistory(history);
      }
      fetchApplications();
    } catch (err) {
      // Ignored
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      await scheduleInterview({
        applicationId: selectedApp.id,
        interviewRound,
        interviewType,
        scheduledDate,
        scheduledTime,
        timeZone,
        meetingPlatform: meetingPlatform || null,
        meetingLink: meetingLink || null,
        interviewerName: interviewerName || null,
        interviewerEmail: interviewerEmail || null,
        preparationNotes: preparationNotes || null,
      });

      setIsScheduleOpen(false);
      // Reset schedule form
      setInterviewRound('');
      setScheduledDate('');
      setScheduledTime('');
      setMeetingPlatform('');
      setMeetingLink('');
      setInterviewerName('');
      setInterviewerEmail('');
      setPreparationNotes('');

      // Refresh Detail Panel
      const history = await fetchHistory(selectedApp.id);
      setAppHistory(history);
      fetchApplications();
    } catch (err) {
      // Ignored
    }
  };

  const handleDeleteApp = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job application? This action cannot be undone.')) return;

    try {
      await deleteApplication(id);
      setIsDetailOpen(false);
      setSelectedApp(null);
    } catch (err) {
      // Handled
    }
  };

  // Run in-memory filters on the fetched application list for client Kanban display
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.companyName.toLowerCase().includes(search.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      (app.location && app.location.toLowerCase().includes(search.toLowerCase()));

    const matchesJobType = !jobType || app.jobType === jobType;
    const matchesWorkMode = !workMode || app.workMode === workMode;
    const matchesSource = !source || app.source.toLowerCase().includes(source.toLowerCase());

    return matchesSearch && matchesJobType && matchesWorkMode && matchesSource;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/30 backdrop-blur border border-zinc-800/80 p-4 rounded-2xl">
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search company, job role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/80 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
            />
          </div>

          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="rounded-xl border border-zinc-800 bg-zinc-950/80 text-zinc-300 px-3 py-2.5 focus:border-indigo-500 focus:outline-none text-sm cursor-pointer"
          >
            <option value="">All Job Types</option>
            <option value="FullTime">Full Time</option>
            <option value="Internship">Internship</option>
            <option value="PartTime">Part Time</option>
            <option value="Contract">Contract</option>
            <option value="Freelance">Freelance</option>
          </select>

          <select
            value={workMode}
            onChange={(e) => setWorkMode(e.target.value)}
            className="rounded-xl border border-zinc-800 bg-zinc-950/80 text-zinc-300 px-3 py-2.5 focus:border-indigo-500 focus:outline-none text-sm cursor-pointer"
          >
            <option value="">All Work Modes</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="OnSite">Onsite</option>
          </select>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition duration-150 shadow-lg glow-indigo w-full md:w-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Application
        </button>
      </div>

      {/* Kanban Board View */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1280px] px-1">
          {PIPELINE_COLUMNS.map((column) => {
            const columnApps = filteredApps.filter((app) => app.currentStatus === column.key);
            return (
              <div key={column.key} className="flex-1 min-w-[280px] bg-zinc-900/10 rounded-2xl border border-zinc-900 p-3 flex flex-col">
                {/* Column Header */}
                <div className={`flex items-center justify-between border-b pb-2.5 mb-4 ${column.color}`}>
                  <span className="font-bold text-sm text-zinc-200">{column.label}</span>
                  <span className="h-5 w-5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] text-zinc-400 font-bold">
                    {columnApps.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="flex-1 space-y-3 overflow-y-auto max-h-[60vh] scrollbar-thin">
                  {columnApps.length === 0 ? (
                    <div className="h-20 border border-dashed border-zinc-800/80 rounded-xl flex items-center justify-center text-xs text-zinc-600">
                      Empty
                    </div>
                  ) : (
                    columnApps.map((app) => (
                      <div
                        key={app.id}
                        onClick={() => handleOpenDetail(app)}
                        className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700/80 hover:bg-zinc-900/80 transition duration-150 cursor-pointer shadow-md group"
                      >
                        <h4 className="font-bold text-white text-sm group-hover:text-indigo-400 transition duration-150">
                          {app.companyName}
                        </h4>
                        <p className="text-xs text-zinc-400 mt-0.5">{app.jobTitle}</p>
                        
                        <div className="flex items-center justify-between gap-2 mt-4 text-[10px] text-zinc-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {app.location || 'Remote'}
                          </span>
                          <span className="font-semibold px-1.5 py-0.2 rounded bg-zinc-850 border border-zinc-800 text-[9px] uppercase">
                            {app.jobType === 'FullTime' ? 'FT' : app.jobType}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CREATE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-lg text-white">Add Job Application</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleCreateSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  {...register('companyName', { required: true })}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. Google"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  {...register('jobTitle', { required: true })}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. Software Engineer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Department</label>
                <input
                  type="text"
                  {...register('department')}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. Cloud Team"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Job Type</label>
                <select
                  required
                  {...register('jobType', { required: true })}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="FullTime">Full Time</option>
                  <option value="Internship">Internship</option>
                  <option value="PartTime">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Work Mode</label>
                <select
                  required
                  {...register('workMode', { required: true })}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="OnSite">Onsite</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Location</label>
                <input
                  type="text"
                  {...register('location')}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. Bangalore"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Application Date</label>
                <input
                  type="date"
                  required
                  defaultValue={new Date().toISOString().split('T')[0]}
                  {...register('applicationDate', { required: true })}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Source / Referral</label>
                <input
                  type="text"
                  required
                  {...register('source', { required: true })}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-white focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. LinkedIn, Referral"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Salary (Annual, INR)</label>
                <input
                  type="number"
                  {...register('salary')}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-white focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. 1200000"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Link Resume</label>
                <select
                  required
                  {...register('resumeId', { required: true })}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="">Select a Resume</option>
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} {r.isDefault ? '(Default)' : ''}
                    </option>
                  ))}
                </select>
                {resumes.length === 0 && (
                  <p className="text-[10px] text-amber-500 mt-1">
                    No Resumes found. Please upload a Resume in the Resumes page first.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Initial Status</label>
                <select
                  required
                  {...register('currentStatus', { required: true })}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Wishlist">Wishlist</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Applied">Applied</option>
                  <option value="OnlineAssessment">Online Assessment</option>
                  <option value="TechnicalInterview">Technical Interview</option>
                  <option value="HRInterview">HR Interview</option>
                  <option value="FinalInterview">Final Interview</option>
                  <option value="OfferReceived">Offer Received</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Job URL</label>
                <input
                  type="text"
                  {...register('jobUrl')}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-955 text-white focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. https://careers.google.com/jobs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Recruiter Contact Info</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    {...register('recruiterName')}
                    placeholder="Name (e.g. Jane)"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-white focus:border-indigo-500 focus:outline-none"
                  />
                  <input
                    type="email"
                    {...register('recruiterEmail')}
                    placeholder="Email (e.g. jane@company.com)"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Notes</label>
                <textarea
                  rows={3}
                  {...register('notes')}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-955 text-white focus:border-indigo-500 focus:outline-none"
                  placeholder="Paste description or write application notes..."
                />
              </div>

              <div className="sm:col-span-2 flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-850 hover:bg-zinc-750 text-zinc-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg glow-indigo"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAILS DRAWER / DRAWER DIALOG */}
      {isDetailOpen && selectedApp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-end z-50">
          <div className="bg-zinc-900 border-l border-zinc-800 w-full max-w-lg h-full flex flex-col p-6 space-y-6 overflow-y-auto animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="font-bold text-xl text-white">{selectedApp.companyName}</h3>
                <p className="text-sm text-zinc-400 mt-0.5">{selectedApp.jobTitle}</p>
              </div>
              <button onClick={() => setIsDetailOpen(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Actions Quick Row */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setIsStatusEditOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-805 bg-zinc-800/40 hover:bg-zinc-800/80 px-2 py-2 text-xs font-semibold text-white transition cursor-pointer"
              >
                <Settings className="h-3.5 w-3.5" />
                Change Status
              </button>
              <button
                onClick={() => setIsScheduleOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-indigo-500/20 bg-indigo-600/10 hover:bg-indigo-600/20 px-2 py-2 text-xs font-semibold text-indigo-400 transition cursor-pointer"
              >
                <CalendarRange className="h-3.5 w-3.5" />
                Schedule Round
              </button>
              <button
                onClick={() => handleDeleteApp(selectedApp.id)}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 px-2 py-2 text-xs font-semibold text-rose-400 transition cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>

            {/* Metadata Fields */}
            <div className="space-y-4 text-sm bg-zinc-955/40 border border-zinc-850 p-4 rounded-xl">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">Job Type</span>
                  <span className="text-zinc-300 font-medium">{selectedApp.jobType}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">Work Mode</span>
                  <span className="text-zinc-300 font-medium">{selectedApp.workMode}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">Location</span>
                  <span className="text-zinc-300 font-medium flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-zinc-500" /> {selectedApp.location || 'Remote'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">Applied Date</span>
                  <span className="text-zinc-300 font-medium">
                    {new Date(selectedApp.applicationDate).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">Source</span>
                  <span className="text-zinc-300 font-medium">{selectedApp.source}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">Salary</span>
                  <span className="text-zinc-300 font-medium flex items-center gap-0.5">
                    <DollarSign className="h-3.5 w-3.5 text-zinc-500" /> {selectedApp.salary ? selectedApp.salary.toString() : 'Not provided'}
                  </span>
                </div>
                {selectedApp.recruiterName && (
                  <div className="col-span-2">
                    <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">Recruiter Contact</span>
                    <span className="text-zinc-300 font-medium flex items-center gap-1.5 mt-0.5">
                      <User className="h-3.5 w-3.5 text-zinc-500" /> {selectedApp.recruiterName} 
                      {selectedApp.recruiterEmail && (
                        <>
                          <span className="text-zinc-600">|</span>
                          <Mail className="h-3.5 w-3.5 text-zinc-500" /> {selectedApp.recruiterEmail}
                        </>
                      )}
                    </span>
                  </div>
                )}
                {selectedApp.jobUrl && (
                  <div className="col-span-2">
                    <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">Job Link</span>
                    <a
                      href={selectedApp.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 mt-0.5 truncate"
                    >
                      <LinkIcon className="h-3.5 w-3.5" /> {selectedApp.jobUrl}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Notes Section */}
            {selectedApp.notes && (
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Internal Notes</span>
                <p className="text-sm text-zinc-300 bg-zinc-950/40 border border-zinc-850 p-3 rounded-xl whitespace-pre-wrap">
                  {selectedApp.notes}
                </p>
              </div>
            )}

            {/* Status History Timeline */}
            <div className="space-y-3 flex-1 flex flex-col min-h-0">
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Status History Timeline</span>
              <div className="flex-1 overflow-y-auto border border-zinc-850 bg-zinc-950/20 p-4 rounded-xl space-y-4 max-h-[30vh]">
                {appHistory.length === 0 ? (
                  <div className="text-center py-6 text-xs text-zinc-650">No timeline entries.</div>
                ) : (
                  appHistory.map((item, idx) => (
                    <div key={item.id} className="relative flex gap-3 pl-1 text-xs">
                      {idx !== appHistory.length - 1 && (
                        <div className="absolute top-4 bottom-0 left-[5px] w-[1px] bg-zinc-800" />
                      )}
                      <div className="h-2.5 w-2.5 rounded-full bg-indigo-500 mt-1 shrink-0" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{item.newStatus}</span>
                          <span className="text-[9px] text-zinc-500">
                            {new Date(item.changedAt).toLocaleString()}
                          </span>
                        </div>
                        {item.notes && <p className="text-zinc-400">{item.notes}</p>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STATUS EDIT MODAL */}
      {isStatusEditOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-lg text-white">Update Status</h3>
              <button onClick={() => setIsStatusEditOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatusSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">New Status</label>
                <select
                  required
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="">Select new status</option>
                  <option value="Wishlist">Wishlist</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Applied">Applied</option>
                  <option value="OnlineAssessment">Online Assessment</option>
                  <option value="TechnicalInterview">Technical Interview</option>
                  <option value="HRInterview">HR Interview</option>
                  <option value="FinalInterview">Final Interview</option>
                  <option value="OfferReceived">Offer Received</option>
                  <option value="OfferAccepted">Offer Accepted</option>
                  <option value="OfferDeclined">Offer Declined</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Withdrawn">Withdrawn</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Status Notes</label>
                <textarea
                  rows={2}
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-955 text-white focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. Received email response from hiring manager"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsStatusEditOpen(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-850 hover:bg-zinc-750 text-zinc-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newStatus}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCHEDULE INTERVIEW MODAL */}
      {isScheduleOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-lg text-white">Schedule Interview Round</h3>
              <button onClick={() => setIsScheduleOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4 text-sm max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 font-bold">Round Title</label>
                <input
                  type="text"
                  required
                  value={interviewRound}
                  onChange={(e) => setInterviewRound(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-white focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. Technical Coding Round"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Type</label>
                  <select
                    required
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Phone">Phone</option>
                    <option value="Video">Video</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Timezone</label>
                  <input
                    type="text"
                    required
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-955 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 font-bold">Scheduled Date</label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 font-bold">Scheduled Time</label>
                  <input
                    type="time"
                    required
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Platform</label>
                  <input
                    type="text"
                    value={meetingPlatform}
                    onChange={(e) => setMeetingPlatform(e.target.value)}
                    placeholder="e.g. Google Meet"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Meeting Link</label>
                  <input
                    type="text"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="e.g. https://meet.google.com/..."
                    className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-955 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Interviewer Name</label>
                  <input
                    type="text"
                    value={interviewerName}
                    onChange={(e) => setInterviewerName(e.target.value)}
                    placeholder="e.g. John Smith"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-955 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Interviewer Email</label>
                  <input
                    type="email"
                    value={interviewerEmail}
                    onChange={(e) => setInterviewerEmail(e.target.value)}
                    placeholder="e.g. john@company.com"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Prep Notes</label>
                <textarea
                  rows={2}
                  value={preparationNotes}
                  onChange={(e) => setPreparationNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-white focus:border-indigo-500 focus:outline-none"
                  placeholder="Key concepts to review, questions to ask..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsScheduleOpen(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-850 hover:bg-zinc-755 text-zinc-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <p className="text-zinc-400 text-sm ml-2">Loading applications board...</p>
      </div>
    }>
      <ApplicationsContent />
    </Suspense>
  );
}
