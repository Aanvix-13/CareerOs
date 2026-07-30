'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  Briefcase,
  Calendar,
  Filter,
  Plus,
  Search,
  Trash2,
  Clock,
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
  ChevronDown,
  SlidersHorizontal,
} from 'lucide-react';
import useApplicationStore from '../../../hooks/useApplicationStore';
import useResumeStore from '../../../hooks/useResumeStore';
import useInterviewStore from '../../../hooks/useInterviewStore';

const PIPELINE_COLUMNS = [
  { key: 'Wishlist', label: 'Wishlist', color: 'border-gray-200' },
  { key: 'Preparing', label: 'Preparing', color: 'border-orange-500/20' },
  { key: 'Applied', label: 'Applied', color: 'border-indigo-600/20' },
  { key: 'OnlineAssessment', label: 'OA Exam', color: 'border-cyan-600/20' },
  { key: 'TechnicalInterview', label: 'Technical', color: 'border-purple-600/20' },
  { key: 'HRInterview', label: 'HR Round', color: 'border-fuchsia-600/20' },
  { key: 'FinalInterview', label: 'Finals', color: 'border-pink-500/20' },
  { key: 'OfferReceived', label: 'Offer', color: 'border-emerald-600/20 glow-emerald' },
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
    isLoading,
  } = useApplicationStore();

  const { resumes, fetchResumes } = useResumeStore();
  const { scheduleInterview } = useInterviewStore();

  // Search & Expanded Filter states
  const [search, setSearch] = useState('');
  const [jobType, setJobType] = useState('');
  const [workMode, setWorkMode] = useState('');
  const [source, setSource] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  
  // Search Suggestions State
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [appHistory, setAppHistory] = useState<any[]>([]);
  const [isStatusEditOpen, setIsStatusEditOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

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

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update suggestions on search input change
  useEffect(() => {
    if (!search) {
      setSuggestions([]);
      return;
    }
    const uniqCompanies = Array.from(new Set(applications.map(a => a.companyName)));
    const filtered = uniqCompanies.filter(c => c.toLowerCase().includes(search.toLowerCase()) && c.toLowerCase() !== search.toLowerCase());
    setSuggestions(filtered.slice(0, 5));
  }, [search, applications]);

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

  // 6. Better Search: Multi-field matching
  const filteredApps = applications.filter((app) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      !search ||
      app.companyName.toLowerCase().includes(searchLower) ||
      app.jobTitle.toLowerCase().includes(searchLower) ||
      (app.location && app.location.toLowerCase().includes(searchLower)) ||
      (app.notes && app.notes.toLowerCase().includes(searchLower)) ||
      (app.recruiterName && app.recruiterName.toLowerCase().includes(searchLower));

    const matchesJobType = !jobType || app.jobType === jobType;
    const matchesWorkMode = !workMode || app.workMode === workMode;
    
    // Support Referral filtering
    let matchesSource = true;
    if (source === 'Referral') {
      matchesSource = !!app.source && app.source.toLowerCase().includes('referral');
    } else if (source === 'Other') {
      matchesSource = !!app.source && !app.source.toLowerCase().includes('referral');
    } else if (source) {
      matchesSource = !!app.source && app.source.toLowerCase().includes(source.toLowerCase());
    }

    return matchesSearch && matchesJobType && matchesWorkMode && matchesSource;
  });

  // 7. Better Filtering: Sort By handler
  const sortedApps = [...filteredApps].sort((a, b) => {
    if (sortBy === 'Newest') {
      return new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime();
    }
    if (sortBy === 'Oldest') {
      return new Date(a.applicationDate).getTime() - new Date(b.applicationDate).getTime();
    }
    if (sortBy === 'CompanyName') {
      return a.companyName.localeCompare(b.companyName);
    }
    if (sortBy === 'Status') {
      return a.currentStatus.localeCompare(b.currentStatus);
    }
    if (sortBy === 'Deadline') {
      // Use updatedAt as a sorting fallback for deadlines
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
    return 0;
  });

  if (isLoading && applications.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center bg-[#FAFAFA]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#6D5EF5]" />
          <p className="text-[#6B7280] text-sm font-semibold font-[--font-sans]">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters Header */}
      <div className="bg-white backdrop-blur border border-gray-200/80 p-4 rounded-2xl space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Search field with suggestions */}
          <div className="flex-1 relative" ref={suggestionRef}>
            <div className="relative">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by company, title, location, notes..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white/80 text-gray-900 placeholder-zinc-500 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 text-sm"
              />
            </div>
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-1.5 rounded-xl border border-gray-200 bg-white text-sm overflow-hidden z-20 shadow-2xl">
                {suggestions.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setSearch(c);
                      setShowSuggestions(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-gray-600 hover:bg-white hover:text-gray-900 transition"
                  >
                    Suggest company: <span className="font-bold text-gray-900">{c}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="lg:hidden flex items-center justify-center gap-1.5 border border-gray-200 rounded-xl bg-white/80 px-4 py-3 text-sm font-semibold text-gray-600 hover:text-gray-900 transition"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>

            <button
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-indigo-600 transition duration-150 shadow-lg glow-indigo w-full sm:w-auto cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add Application
            </button>
          </div>
        </div>

        {/* Collapsible expanded filter row */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-gray-200/40 lg:grid ${showFiltersMobile ? 'grid' : 'hidden lg:grid'}`}>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider pl-1">Job Type</span>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 text-gray-600 px-3 py-2.5 focus:border-indigo-600 focus:outline-none text-xs cursor-pointer"
            >
              <option value="">All Job Types</option>
              <option value="FullTime">Full Time</option>
              <option value="Internship">Internship</option>
              <option value="PartTime">Part Time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider pl-1">Work Mode</span>
            <select
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 text-gray-600 px-3 py-2.5 focus:border-indigo-600 focus:outline-none text-xs cursor-pointer"
            >
              <option value="">All Work Modes</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="OnSite">Onsite</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider pl-1">Origin / Source</span>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 text-gray-600 px-3 py-2.5 focus:border-indigo-600 focus:outline-none text-xs cursor-pointer"
            >
              <option value="">All Origins</option>
              <option value="Referral">Referral Only</option>
              <option value="Other">Non-Referrals</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider pl-1">Sort By</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 text-gray-600 px-3 py-2.5 focus:border-indigo-600 focus:outline-none text-xs cursor-pointer"
            >
              <option value="Newest">Newest First</option>
              <option value="Oldest">Oldest First</option>
              <option value="CompanyName">Company Name (A-Z)</option>
              <option value="Status">Current Stage</option>
              <option value="Deadline">Last Updated</option>
            </select>
          </div>
        </div>
      </div>

      {/* 8. Better Empty States */}
      {sortedApps.length === 0 ? (
        <div className="bg-white shadow-sm border border-gray-200 rounded-3xl border border-dashed border-gray-200 p-16 text-center max-w-xl mx-auto mt-12 animate-fade-in">
          <Briefcase className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="font-bold text-gray-900 text-lg">You haven't started your job search yet</h3>
          <p className="text-gray-500 text-sm mt-1.5 mb-6 max-w-sm mx-auto leading-relaxed">
            Add your first application and CareerOS will automatically begin tracking your pipeline.
          </p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-indigo-600 transition duration-150 shadow-lg glow-indigo w-fit mx-auto cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add Application
          </button>
        </div>
      ) : (
        /* Kanban Board View */
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1280px] px-1">
            {PIPELINE_COLUMNS.map((column) => {
              const columnApps = sortedApps.filter((app) => app.currentStatus === column.key);
              return (
                <div key={column.key} className="flex-1 min-w-[310px] bg-white/10 rounded-2xl border border-gray-200 p-3 flex flex-col min-h-[65vh]">
                  {/* Column Header */}
                  <div className={`flex items-center justify-between border-b pb-2.5 mb-4 ${column.color}`}>
                    <span className="font-bold text-sm text-gray-700">{column.label}</span>
                    <span className="h-5 w-5 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[10px] text-gray-500 font-bold">
                      {columnApps.length}
                    </span>
                  </div>

                  {/* 1. Improved Kanban Cards with hover translate and rich fields */}
                  <div className="flex-1 space-y-3 overflow-y-auto max-h-[62vh] scrollbar-thin">
                    {columnApps.length === 0 ? (
                      <div className="h-16 border border-dashed border-gray-200/60 rounded-xl flex items-center justify-center text-[11px] text-gray-400">
                        Drag applications here
                      </div>
                    ) : (
                      columnApps.map((app) => (
                        <div
                          key={app.id}
                          onClick={() => handleOpenDetail(app)}
                          className="p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 hover:-translate-y-1 hover:shadow-lg transition duration-200 cursor-pointer flex flex-col gap-3.5 group relative"
                        >
                          {/* Header: Logo placeholder & Company name */}
                          <div className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-lg bg-gray-100 text-gray-600 border border-gray-300/50 flex items-center justify-center font-extrabold text-sm shrink-0 uppercase">
                              {app.companyName.charAt(0)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-bold text-gray-900 text-xs group-hover:text-indigo-600 transition duration-150 truncate">
                                {app.companyName}
                              </h4>
                              <p className="text-[10px] text-gray-500 truncate">{app.jobTitle}</p>
                            </div>
                          </div>

                          {/* Expanded Fields */}
                          <div className="text-[10px] space-y-1.5 border-t border-gray-200/40 pt-2.5">
                            <div className="flex justify-between items-center text-gray-400">
                              <span>Location & Mode</span>
                              <span className="text-gray-600 font-medium truncate max-w-[120px]">
                                {app.location || 'Remote'} ({app.workMode})
                              </span>
                            </div>

                            <div className="flex justify-between items-center text-gray-400">
                              <span>Job Type</span>
                              <span className="text-gray-600 font-medium">
                                {app.jobType === 'FullTime' ? 'Full-time' : app.jobType}
                              </span>
                            </div>

                            {app.salary && (
                              <div className="flex justify-between items-center text-gray-400">
                                <span>Salary</span>
                                <span className="text-emerald-600 font-semibold">
                                  {parseFloat(app.salary.toString()).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                                </span>
                              </div>
                            )}

                            {app.resume && (
                              <div className="flex justify-between items-center text-gray-400">
                                <span>Resume Version</span>
                                <span className="text-indigo-600 truncate max-w-[120px]" title={app.resume.name}>
                                  {app.resume.name}
                                </span>
                              </div>
                            )}

                            <div className="flex justify-between items-center text-gray-400">
                              <span>Applied On</span>
                              <span className="text-gray-500">
                                {new Date(app.applicationDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                          </div>

                          {/* Quick Actions Footer */}
                          <div className="flex items-center justify-between border-t border-gray-200/40 pt-2.5 mt-0.5 gap-2">
                            <span className="inline-flex items-center rounded-full bg-gray-100 border border-gray-300/60 px-2 py-0.5 text-[8px] font-semibold text-gray-500 uppercase">
                              {app.currentStatus}
                            </span>

                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <button
                                title="Edit Application"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenDetail(app);
                                }}
                                className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition"
                              >
                                <Settings className="h-3 w-3" />
                              </button>
                              <button
                                title="Schedule Interview"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedApp(app);
                                  setIsScheduleOpen(true);
                                }}
                                className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition"
                              >
                                <CalendarRange className="h-3 w-3" />
                              </button>
                              <button
                                title="Delete"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteApp(app.id);
                                }}
                                className="p-1 rounded bg-rose-950/20 hover:bg-rose-900/40 text-rose-600 transition"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
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
      )}

      {/* CREATE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-bold text-lg text-gray-900">Add Job Application</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-gray-500 hover:text-gray-900">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleCreateSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  {...register('companyName', { required: true })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  placeholder="e.g. Google"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  {...register('jobTitle', { required: true })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  placeholder="e.g. Software Engineer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Department</label>
                <input
                  type="text"
                  {...register('department')}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  placeholder="e.g. Cloud Team"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Job Type</label>
                <select
                  required
                  {...register('jobType', { required: true })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 focus:border-indigo-600 focus:outline-none"
                >
                  <option value="FullTime">Full Time</option>
                  <option value="Internship">Internship</option>
                  <option value="PartTime">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Work Mode</label>
                <select
                  required
                  {...register('workMode', { required: true })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 focus:border-indigo-600 focus:outline-none"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="OnSite">Onsite</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Location</label>
                <input
                  type="text"
                  {...register('location')}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  placeholder="e.g. Bangalore"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Application Date</label>
                <input
                  type="date"
                  required
                  defaultValue={new Date().toISOString().split('T')[0]}
                  {...register('applicationDate', { required: true })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Source / Referral</label>
                <input
                  type="text"
                  required
                  {...register('source', { required: true })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-indigo-600 focus:outline-none"
                  placeholder="e.g. LinkedIn, Referral"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Salary (Annual, INR)</label>
                <input
                  type="number"
                  {...register('salary')}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-indigo-600 focus:outline-none"
                  placeholder="e.g. 1200000"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Link Resume</label>
                <select
                  required
                  {...register('resumeId', { required: true })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 focus:border-indigo-600 focus:outline-none"
                >
                  <option value="">Select a Resume</option>
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} {r.isDefault ? '(Default)' : ''}
                    </option>
                  ))}
                </select>
                {resumes.length === 0 && (
                  <p className="text-[10px] text-amber-600 mt-1">
                    No Resumes found. Please upload a Resume in the Resumes page first.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Initial Status</label>
                <select
                  required
                  {...register('currentStatus', { required: true })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 focus:border-indigo-600 focus:outline-none"
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
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Job URL</label>
                <input
                  type="text"
                  {...register('jobUrl')}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:border-indigo-600 focus:outline-none"
                  placeholder="e.g. https://careers.google.com/jobs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Recruiter Contact Info</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    {...register('recruiterName')}
                    placeholder="Name (e.g. Jane)"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-indigo-600 focus:outline-none"
                  />
                  <input
                    type="email"
                    {...register('recruiterEmail')}
                    placeholder="Email (e.g. jane@company.com)"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Notes</label>
                <textarea
                  rows={3}
                  {...register('notes')}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-indigo-600 focus:outline-none"
                  placeholder="Paste description or write application notes..."
                />
              </div>

              <div className="sm:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-850 hover:bg-zinc-750 text-gray-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-600 text-gray-900 font-semibold shadow-lg glow-indigo"
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
          <div className="bg-white border-l border-gray-200 w-full max-w-lg h-full flex flex-col p-6 space-y-6 overflow-y-auto animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <h3 className="font-bold text-xl text-gray-900">{selectedApp.companyName}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{selectedApp.jobTitle}</p>
              </div>
              <button onClick={() => setIsDetailOpen(false)} className="text-gray-500 hover:text-gray-900 cursor-pointer">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Actions Quick Row */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setIsStatusEditOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-805 bg-gray-100/40 hover:bg-gray-100/80 px-2 py-2 text-xs font-semibold text-gray-900 transition cursor-pointer"
              >
                <Settings className="h-3.5 w-3.5" />
                Change Status
              </button>
              <button
                onClick={() => setIsScheduleOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-indigo-600/20 bg-indigo-600/10 hover:bg-indigo-600/20 px-2 py-2 text-xs font-semibold text-indigo-600 transition cursor-pointer"
              >
                <CalendarRange className="h-3.5 w-3.5" />
                Schedule Round
              </button>
              <button
                onClick={() => handleDeleteApp(selectedApp.id)}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-rose-600/20 bg-rose-600/10 hover:bg-rose-600/20 px-2 py-2 text-xs font-semibold text-rose-600 transition cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>

            {/* Metadata Fields */}
            <div className="space-y-4 text-sm bg-gray-50/40 border border-gray-100 p-4 rounded-xl">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Job Type</span>
                  <span className="text-gray-600 font-medium">{selectedApp.jobType}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Work Mode</span>
                  <span className="text-gray-600 font-medium">{selectedApp.workMode}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Location</span>
                  <span className="text-gray-600 font-medium flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-gray-400" /> {selectedApp.location || 'Remote'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Applied Date</span>
                  <span className="text-gray-600 font-medium">
                    {new Date(selectedApp.applicationDate).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Source</span>
                  <span className="text-gray-600 font-medium">{selectedApp.source}</span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Salary</span>
                  <span className="text-gray-600 font-medium flex items-center gap-0.5">
                    <DollarSign className="h-3.5 w-3.5 text-gray-400" /> {selectedApp.salary ? selectedApp.salary.toString() : 'Not provided'}
                  </span>
                </div>
                {selectedApp.recruiterName && (
                  <div className="col-span-2">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Recruiter Contact</span>
                    <span className="text-gray-600 font-medium flex items-center gap-1.5 mt-0.5">
                      <User className="h-3.5 w-3.5 text-gray-400" /> {selectedApp.recruiterName} 
                      {selectedApp.recruiterEmail && (
                        <>
                          <span className="text-gray-400">|</span>
                          <Mail className="h-3.5 w-3.5 text-gray-400" /> {selectedApp.recruiterEmail}
                        </>
                      )}
                    </span>
                  </div>
                )}
                {selectedApp.jobUrl && (
                  <div className="col-span-2">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">Job Link</span>
                    <a
                      href={selectedApp.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-300 font-medium flex items-center gap-1 mt-0.5 truncate"
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
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Internal Notes</span>
                <p className="text-sm text-gray-600 bg-gray-50/40 border border-gray-100 p-3 rounded-xl whitespace-pre-wrap">
                  {selectedApp.notes}
                </p>
              </div>
            )}

            {/* Status History Timeline */}
            <div className="space-y-3 flex-1 flex flex-col min-h-0">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Status History Timeline</span>
              <div className="flex-1 overflow-y-auto border border-gray-100 bg-white/20 p-4 rounded-xl space-y-4 max-h-[30vh]">
                {appHistory.length === 0 ? (
                  <div className="text-center py-6 text-xs text-gray-400">No timeline entries.</div>
                ) : (
                  appHistory.map((item, idx) => (
                    <div key={item.id} className="relative flex gap-3 pl-1 text-xs">
                      {idx !== appHistory.length - 1 && (
                        <div className="absolute top-4 bottom-0 left-[5px] w-[1px] bg-gray-100" />
                      )}
                      <div className="h-2.5 w-2.5 rounded-full bg-indigo-600 mt-1 shrink-0" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{item.newStatus}</span>
                          <span className="text-[9px] text-gray-400">
                            {new Date(item.changedAt).toLocaleString()}
                          </span>
                        </div>
                        {item.notes && <p className="text-gray-500">{item.notes}</p>}
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
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-bold text-lg text-gray-900">Update Status</h3>
              <button onClick={() => setIsStatusEditOpen(false)} className="text-gray-500 hover:text-gray-900">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatusSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">New Status</label>
                <select
                  required
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 focus:border-indigo-600 focus:outline-none"
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
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status Notes</label>
                <textarea
                  rows={2}
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-indigo-600 focus:outline-none"
                  placeholder="e.g. Received email response from hiring manager"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsStatusEditOpen(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-850 hover:bg-zinc-750 text-gray-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newStatus}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-600 text-gray-900 font-semibold"
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
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-bold text-lg text-gray-900">Schedule Interview Round</h3>
              <button onClick={() => setIsScheduleOpen(false)} className="text-gray-500 hover:text-gray-900">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4 text-sm max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 font-bold">Round Title</label>
                <input
                  type="text"
                  required
                  value={interviewRound}
                  onChange={(e) => setInterviewRound(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:border-indigo-600 focus:outline-none"
                  placeholder="e.g. Technical Coding Round"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Type</label>
                  <select
                    required
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 focus:border-indigo-600 focus:outline-none"
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Phone">Phone</option>
                    <option value="Video">Video</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Timezone</label>
                  <input
                    type="text"
                    required
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 font-bold">Scheduled Date</label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 font-bold">Scheduled Time</label>
                  <input
                    type="time"
                    required
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Platform</label>
                  <input
                    type="text"
                    value={meetingPlatform}
                    onChange={(e) => setMeetingPlatform(e.target.value)}
                    placeholder="e.g. Google Meet"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Meeting Link</label>
                  <input
                    type="text"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="e.g. https://meet.google.com/..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Interviewer Name</label>
                  <input
                    type="text"
                    value={interviewerName}
                    onChange={(e) => setInterviewerName(e.target.value)}
                    placeholder="e.g. John Smith"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Interviewer Email</label>
                  <input
                    type="email"
                    value={interviewerEmail}
                    onChange={(e) => setInterviewerEmail(e.target.value)}
                    placeholder="e.g. john@company.com"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Prep Notes</label>
                <textarea
                  rows={2}
                  value={preparationNotes}
                  onChange={(e) => setPreparationNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-indigo-600 focus:outline-none"
                  placeholder="Key concepts to review, questions to ask..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsScheduleOpen(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-850 hover:bg-zinc-750 text-gray-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-600 text-gray-900 font-semibold"
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
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-gray-500 text-sm ml-2">Loading applications board...</p>
      </div>
    }>
      <ApplicationsContent />
    </Suspense>
  );
}
