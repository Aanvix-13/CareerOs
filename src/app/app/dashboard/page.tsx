'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase, Calendar, CheckCircle, Clock, ChevronRight, Loader2,
  AlertTriangle, Flame, Check, Sparkles, Trophy, Target, FileText,
  HeartPulse, TrendingUp, Award, Bell, Plus, Trash2, Edit2, X, ExternalLink
} from 'lucide-react';
import apiClient from '../../../lib/api-client';
import useReminderStore from '../../../hooks/useReminderStore';
import useAuthStore from '../../../hooks/useAuthStore';
import useResumeStore from '../../../hooks/useResumeStore';
import useApplicationStore from '../../../hooks/useApplicationStore';
import useInterviewStore from '../../../hooks/useInterviewStore';
import { Card, Button, Badge, Modal, Input, Select, Textarea } from '../../../components/ui';
import { useUser } from '@clerk/nextjs';

export default function DashboardPage() {
  const { user: clerkUser } = useUser();
  const { profile, user: authUser } = useAuthStore();
  const { resumes, fetchResumes, uploadResume } = useResumeStore();
  const { reminders, fetchReminders, createReminder, updateReminder, completeReminder, deleteReminder } = useReminderStore();
  const { applications, fetchApplications, createApplication } = useApplicationStore();
  const { scheduleInterview } = useInterviewStore();

  // Loading and State management
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [greeting, setGreeting] = useState('Good Morning');
  const [currentDate, setCurrentDate] = useState('');

  // Modals state
  const [activeModal, setActiveModal] = useState<'addApp' | 'uploadResume' | 'scheduleInterview' | 'createReminder' | 'viewInterview' | 'viewApp' | 'editReminder' | null>(null);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [selectedReminderForEdit, setSelectedReminderForEdit] = useState<any>(null);
  const [dailyBriefingOpen, setDailyBriefingOpen] = useState(false);

  // Form states
  const [appForm, setAppForm] = useState({
    companyName: '', jobTitle: '', department: '', jobType: 'Full-time',
    workMode: 'Remote', location: '', source: 'Job Board', recruiterName: '',
    recruiterEmail: '', salary: '', jobUrl: '', notes: '', currentStatus: 'Wishlist',
    applicationDate: new Date().toISOString().split('T')[0], resumeId: ''
  });

  const [resumeForm, setResumeForm] = useState({
    name: '', targetRole: '', version: '1.0', notes: '', file: null as File | null
  });

  const [interviewForm, setInterviewForm] = useState({
    applicationId: '', interviewRound: 'Technical', interviewType: 'Video Call',
    status: 'Scheduled', scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '10:00', timeZone: 'IST', meetingPlatform: 'Zoom',
    meetingLink: '', preparationNotes: ''
  });

  const [reminderForm, setReminderForm] = useState({
    applicationId: '', title: '', description: '', reminderType: 'Follow-up',
    priority: 'Medium', dueDate: new Date().toISOString().split('T')[0],
    dueTime: '12:00'
  });

  const [actionLoading, setActionLoading] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response: any = await apiClient.get('/dashboard');
      setDashboardData(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchResumes();
    fetchReminders();
    fetchApplications();

    // Greeting based on client local hours
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Date formatting
    const formattedDate = new Date().toLocaleDateString(undefined, {
      weekday: 'long', month: 'short', day: 'numeric', year: 'numeric'
    });
    setCurrentDate(formattedDate);
  }, []);

  // Check and trigger Daily Briefing Modal automatically on mount
  useEffect(() => {
    if (dashboardData && !sessionStorage.getItem('hasOpenedDailyBriefing')) {
      const hasInterviewsToday = getInterviewsToday().length > 0;
      const hasRemindersToday = getRemindersToday().length > 0;
      const hasOverdue = getOverdueReminders().length > 0;

      if (hasInterviewsToday || hasRemindersToday || hasOverdue) {
        setDailyBriefingOpen(true);
        sessionStorage.setItem('hasOpenedDailyBriefing', 'true');
      }
    }
  }, [dashboardData]);

  // Daily Schedule helpers
  const getInterviewsToday = () => {
    if (!dashboardData?.upcomingInterviews) return [];
    const todayStr = new Date().toISOString().split('T')[0];
    return dashboardData.upcomingInterviews.filter((i: any) => {
      const iDate = new Date(i.scheduledDate).toISOString().split('T')[0];
      return iDate === todayStr;
    });
  };

  const getRemindersToday = () => {
    if (!dashboardData?.upcomingReminders) return [];
    const todayStr = new Date().toISOString().split('T')[0];
    return dashboardData.upcomingReminders.filter((r: any) => {
      const rDate = new Date(r.dueDate).toISOString().split('T')[0];
      return rDate === todayStr;
    });
  };

  const getOverdueReminders = () => {
    if (!dashboardData?.upcomingReminders) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dashboardData.upcomingReminders.filter((r: any) => {
      const rDate = new Date(r.dueDate);
      rDate.setHours(0,0,0,0);
      return rDate < today && r.status !== 'Completed';
    });
  };

  const handleCreateApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await createApplication({
        ...appForm,
        salary: appForm.salary ? parseFloat(appForm.salary) : null
      });
      setActiveModal(null);
      fetchDashboard();
    } catch (err: any) {
      alert(err.message || 'Failed to create application.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUploadResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeForm.file) return alert('Please select a resume file.');
    setActionLoading(true);
    try {
      const data = new FormData();
      data.append('name', resumeForm.name);
      data.append('targetRole', resumeForm.targetRole);
      data.append('version', resumeForm.version);
      data.append('notes', resumeForm.notes);
      data.append('file', resumeForm.file);

      await uploadResume(data);
      setActiveModal(null);
      fetchDashboard();
    } catch (err: any) {
      alert(err.message || 'Failed to upload resume.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewForm.applicationId) return alert('Please select an application.');
    setActionLoading(true);
    try {
      await scheduleInterview(interviewForm);
      setActiveModal(null);
      fetchDashboard();
    } catch (err: any) {
      alert(err.message || 'Failed to schedule interview.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await createReminder({
        ...reminderForm,
        applicationId: reminderForm.applicationId || null
      });
      setActiveModal(null);
      fetchDashboard();
    } catch (err: any) {
      alert(err.message || 'Failed to create reminder.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditReminderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReminderForEdit) return;
    setActionLoading(true);
    try {
      await updateReminder(selectedReminderForEdit.id, selectedReminderForEdit);
      setActiveModal(null);
      fetchDashboard();
    } catch (err: any) {
      alert(err.message || 'Failed to update reminder.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleReminder = async (id: string) => {
    try {
      await completeReminder(id);
      fetchDashboard();
    } catch (err) {
      // Ignored
    }
  };

  const handleDeleteReminderClick = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteReminder(id);
      fetchDashboard();
    } catch (err) {
      // Ignored
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center bg-[#FAFAFA]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#6D5EF5]" />
          <p className="text-[#6B7280] text-sm font-semibold font-[--font-sans]">Preparing your command center...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[24px] bg-[#FEF2F2] border border-[#FECACA] p-8 text-center max-w-lg mx-auto mt-12 font-[--font-sans]">
        <AlertTriangle className="h-10 w-10 text-[#EF4444] mx-auto mb-3" />
        <h3 className="font-bold text-[#111827] mb-1">Failed to load data</h3>
        <p className="text-[#4B5563] text-sm mb-6">{error}</p>
        <Button variant="danger" size="sm" onClick={fetchDashboard}>Try again</Button>
      </div>
    );
  }

  const {
    totalApplications = 0,
    activeApplications = 0,
    applicationsByStatus = {},
    upcomingInterviews = [],
    upcomingReminders = [],
    recentApplications = [],
  } = dashboardData || {};

  const userName = clerkUser?.firstName || profile?.fullName?.split(' ')[0] || authUser?.email?.split('@')[0] || 'User';

  // Metrics
  const interviewsCount = (applicationsByStatus['TechnicalInterview'] || 0) +
                         (applicationsByStatus['HRInterview'] || 0) +
                         (applicationsByStatus['FinalInterview'] || 0);
  const offersCount = (applicationsByStatus['OfferReceived'] || 0) + (applicationsByStatus['OfferAccepted'] || 0);
  const responseRate = totalApplications > 0 ? Math.round(((interviewsCount + offersCount) / totalApplications) * 100) : 0;

  // Pipeline Counts
  const appliedCount = applicationsByStatus['Applied'] || 0;
  const interviewPipelineCount = interviewsCount;
  const offerPipelineCount = applicationsByStatus['OfferReceived'] || 0;
  const acceptedPipelineCount = applicationsByStatus['OfferAccepted'] || 0;

  // Profile completion percent
  const hasResume = resumes.length > 0;
  const hasEducation = !!(profile?.college && profile?.degree);
  const hasSkills = !!profile?.preferredRole;
  const hasLinkedIn = !!profile?.bio;
  const hasPortfolio = !!profile?.specialization;
  let profileCompletion = 20;
  if (hasEducation) profileCompletion += 20;
  if (hasSkills) profileCompletion += 20;
  if (hasLinkedIn) profileCompletion += 20;
  if (hasPortfolio) profileCompletion += 20;
  if (hasResume) profileCompletion += 20;
  profileCompletion = Math.min(profileCompletion, 100);

  // Smart action helper logic
  let nextAction = {
    title: 'Browse job postings and apply',
    desc: 'Submit another application to keep your pipeline active.',
    link: '/app/applications',
    btnText: 'Add Application'
  };
  if (totalApplications === 0) {
    nextAction = {
      title: 'Add your first application',
      desc: 'Add a job listing to start tracking your search pipeline.',
      link: '/app/applications',
      btnText: 'Add Application'
    };
  } else if (!hasResume) {
    nextAction = {
      title: 'Upload your first resume',
      desc: 'Add your master resume version to match with job listings.',
      link: '/app/resumes',
      btnText: 'Upload Resume'
    };
  } else if (profileCompletion < 60) {
    nextAction = {
      title: 'Complete your profile details',
      desc: 'Add target role, bio and education credentials to complete setup.',
      link: '/app/profile',
      btnText: 'Complete Profile'
    };
  } else if (upcomingInterviews.length > 0) {
    const nextInt = upcomingInterviews[0];
    nextAction = {
      title: `Prepare for ${nextInt.interviewRound} interview`,
      desc: `Review target specs and study prep notes for ${nextInt.application.companyName}.`,
      link: '/app/interviews',
      btnText: 'View Details'
    };
  }

  return (
    <div className="space-y-10 font-[--font-sans] max-w-7xl mx-auto pb-12">
      
      {/* ── 1. WELCOME HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E5E7EB] pb-6">
        <div>
          <h1 className="text-3xl font-black text-[#111827] tracking-tight">Good Morning, {userName} 👋</h1>
          <p className="text-sm text-[#6B7280] font-semibold mt-1">Let's get you closer to your next opportunity.</p>
        </div>
        <div className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs font-bold text-[#4B5563] shadow-sm">
          📅 {currentDate}
        </div>
      </div>

      {/* ── 2. DAILY BRIEFING (HIGHEST PRIORITY) ── */}
      <Card className="p-8 border-l-4 border-l-[#6D5EF5] shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-black text-[#111827]">Today's Career Briefing</h2>
            <p className="text-xs text-[#6B7280] font-semibold mt-1">Direct priorities and schedules for your workspace today.</p>
          </div>
          <Link href="/app/reminders" className="text-xs font-bold bg-[#F3F1FF] hover:bg-[#E5E1FF] text-[#6D5EF5] px-4 py-2 rounded-xl transition">
            View Schedule
          </Link>
        </div>

        {getInterviewsToday().length === 0 && getRemindersToday().length === 0 && getOverdueReminders().length === 0 ? (
          <div className="text-center py-6 text-sm text-[#6B7280] font-semibold">
            No scheduled tasks today.
          </div>
        ) : (
          <div className="space-y-4">
            {/* Interviews Today */}
            {getInterviewsToday().map((int: any) => (
              <div key={int.id} className="flex items-center justify-between p-4 bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#F0FDF4] text-[#166534] flex items-center justify-center font-bold">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#111827]">{int.application.companyName} — {int.interviewRound} Round</h4>
                    <p className="text-xs text-[#6B7280] mt-0.5">{int.interviewType} • Platform: {int.meetingPlatform || 'General'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-[#6D5EF5]">{int.scheduledTime}</span>
                  <p className="text-[10px] text-[#6B7280] font-bold mt-0.5">{int.timeZone}</p>
                </div>
              </div>
            ))}

            {/* Reminders / Follow-ups Today */}
            {getRemindersToday().map((rem: any) => (
              <div key={rem.id} className="flex items-center justify-between p-4 bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#F3F1FF] text-[#6D5EF5] flex items-center justify-center font-bold">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#111827]">{rem.title}</h4>
                    <p className="text-xs text-[#6B7280] mt-0.5">Type: {rem.reminderType} {rem.application ? `• ${rem.application.companyName}` : ''}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="warning">{rem.priority}</Badge>
                </div>
              </div>
            ))}

            {/* Overdue Items */}
            {getOverdueReminders().map((rem: any) => (
              <div key={rem.id} className="flex items-center justify-between p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#FEF2F2] text-[#991B1B] flex items-center justify-center font-bold">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#991B1B]">{rem.title} (Overdue)</h4>
                    <p className="text-xs text-[#991B1B]/75 mt-0.5">Due date: {new Date(rem.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <Badge variant="danger">Overdue</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ── 3. QUICK ACTIONS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <button onClick={() => setActiveModal('addApp')}
          className="flex flex-col items-start p-6 bg-white border border-[#E5E7EB] rounded-[24px] text-left hover:-translate-y-1 hover:shadow-md transition duration-200 cursor-pointer group">
          <div className="h-12 w-12 rounded-2xl bg-[#F3F1FF] text-[#6D5EF5] flex items-center justify-center mb-4 transition duration-200 group-hover:scale-105">
            <Briefcase className="h-6 w-6" />
          </div>
          <h4 className="font-black text-sm text-[#111827]">Add Application</h4>
          <p className="text-xs text-[#6B7280] font-semibold mt-1">Track a new job listing and hiring stage details.</p>
        </button>

        <button onClick={() => setActiveModal('uploadResume')}
          className="flex flex-col items-start p-6 bg-white border border-[#E5E7EB] rounded-[24px] text-left hover:-translate-y-1 hover:shadow-md transition duration-200 cursor-pointer group">
          <div className="h-12 w-12 rounded-2xl bg-[#F3F1FF] text-[#6D5EF5] flex items-center justify-center mb-4 transition duration-200 group-hover:scale-105">
            <FileText className="h-6 w-6" />
          </div>
          <h4 className="font-black text-sm text-[#111827]">Upload Resume</h4>
          <p className="text-xs text-[#6B7280] font-semibold mt-1">Store a new resume version or PDF variation.</p>
        </button>

        <button onClick={() => setActiveModal('scheduleInterview')}
          className="flex flex-col items-start p-6 bg-white border border-[#E5E7EB] rounded-[24px] text-left hover:-translate-y-1 hover:shadow-md transition duration-200 cursor-pointer group">
          <div className="h-12 w-12 rounded-2xl bg-[#F3F1FF] text-[#6D5EF5] flex items-center justify-center mb-4 transition duration-200 group-hover:scale-105">
            <Calendar className="h-6 w-6" />
          </div>
          <h4 className="font-black text-sm text-[#111827]">Schedule Interview</h4>
          <p className="text-xs text-[#6B7280] font-semibold mt-1">Log a new interview date and details checklist.</p>
        </button>

        <button onClick={() => setActiveModal('createReminder')}
          className="flex flex-col items-start p-6 bg-white border border-[#E5E7EB] rounded-[24px] text-left hover:-translate-y-1 hover:shadow-md transition duration-200 cursor-pointer group">
          <div className="h-12 w-12 rounded-2xl bg-[#F3F1FF] text-[#6D5EF5] flex items-center justify-center mb-4 transition duration-200 group-hover:scale-105">
            <Clock className="h-6 w-6" />
          </div>
          <h4 className="font-black text-sm text-[#111827]">Create Reminder</h4>
          <p className="text-xs text-[#6B7280] font-semibold mt-1">Schedule a follow-up, preparation task or deadline.</p>
        </button>
      </div>

      {/* ── 4 & 5. CAREER PROGRESS + APPLICATION PIPELINE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Career Progress */}
        <Card className="p-6 space-y-6 lg:col-span-1">
          <div>
            <h3 className="font-bold text-base text-[#111827]">Career Search Progress</h3>
            <p className="text-xs text-[#6B7280] mt-0.5">Your target search milestone tracking.</p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-[#4B5563]">
                <span>Applications (Target: 30)</span>
                <span className="text-[#111827] font-black">{totalApplications}/30</span>
              </div>
              <div className="h-2 w-full bg-[#F3F1FF] rounded-full overflow-hidden">
                <div className="h-full bg-[#6D5EF5] rounded-full" style={{ width: `${Math.min((totalApplications/30)*100, 100)}%` }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-[#4B5563]">
                <span>Interviews Achieved</span>
                <span className="text-[#111827] font-black">{interviewsCount}</span>
              </div>
              <div className="h-2 w-full bg-[#F3F1FF] rounded-full overflow-hidden">
                <div className="h-full bg-[#6D5EF5] rounded-full" style={{ width: `${Math.min((interviewsCount/5)*100, 100)}%` }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-[#4B5563]">
                <span>Offers Received</span>
                <span className="text-[#111827] font-black">{offersCount}</span>
              </div>
              <div className="h-2 w-full bg-[#F3F1FF] rounded-full overflow-hidden">
                <div className="h-full bg-[#6D5EF5] rounded-full" style={{ width: `${Math.min((offersCount/1)*100, 100)}%` }} />
              </div>
            </div>
          </div>
        </Card>

        {/* Application Pipeline */}
        <Card className="p-6 space-y-6 lg:col-span-2">
          <div>
            <h3 className="font-bold text-base text-[#111827]">Application Pipeline</h3>
            <p className="text-xs text-[#6B7280] mt-0.5">Visual representation of your active application stages.</p>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Applied', count: appliedCount, color: 'border-l-blue-500' },
              { label: 'Interview', count: interviewPipelineCount, color: 'border-l-amber-500' },
              { label: 'Offer', count: offerPipelineCount, color: 'border-l-emerald-500' },
              { label: 'Accepted', count: acceptedPipelineCount, color: 'border-l-indigo-500' },
            ].map(stage => (
              <div key={stage.label} className={`p-4 bg-[#FAFAFA] border border-[#E5E7EB] border-l-4 ${stage.color} rounded-2xl flex flex-col justify-between h-24`}>
                <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">{stage.label}</span>
                <span className="text-3xl font-black text-[#111827]">{stage.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── 6 & 7. UPCOMING INTERVIEWS + RECENT APPLICATIONS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Interviews */}
        <Card className="p-6 flex flex-col justify-between min-h-[360px]">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-[#111827]">Upcoming Interviews</h3>
              <Link href="/app/interviews" className="text-xs font-bold text-[#6D5EF5] hover:underline">
                View All Interviews
              </Link>
            </div>

            {upcomingInterviews.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10 space-y-3">
                <p className="text-xs text-[#6B7280] font-semibold">No upcoming interviews.</p>
                <Button variant="secondary" size="sm" onClick={() => setActiveModal('scheduleInterview')}>
                  Schedule Interview
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingInterviews.slice(0, 5).map((int: any) => (
                  <button key={int.id} onClick={() => { setSelectedInterview(int); setActiveModal('viewInterview'); }}
                    className="w-full flex items-center justify-between p-3.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl hover:border-[#6D5EF5] transition text-left cursor-pointer outline-none">
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-sm text-[#111827]">{int.application.companyName}</h4>
                      <p className="text-xs text-[#6B7280]">{int.application.jobTitle} • {int.interviewRound} Round</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-[#6D5EF5]">
                        {new Date(int.scheduledDate).toLocaleDateString()}
                      </span>
                      <p className="text-[10px] text-[#6B7280] font-bold mt-0.5">{int.scheduledTime}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Recent Applications */}
        <Card className="p-6 flex flex-col justify-between min-h-[360px]">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-[#111827]">Recent Applications</h3>
              <Link href="/app/applications" className="text-xs font-bold text-[#6D5EF5] hover:underline">
                View All Applications
              </Link>
            </div>

            {recentApplications.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10 space-y-3">
                <p className="text-xs text-[#6B7280] font-semibold">No applications yet.</p>
                <Button variant="secondary" size="sm" onClick={() => setActiveModal('addApp')}>
                  Add Application
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentApplications.slice(0, 5).map((app: any) => (
                  <button key={app.id} onClick={() => { setSelectedApp(app); setActiveModal('viewApp'); }}
                    className="w-full flex items-center justify-between p-3.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl hover:border-[#6D5EF5] transition text-left cursor-pointer outline-none">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-[#F3F1FF] text-[#6D5EF5] flex items-center justify-center font-bold text-sm">
                        {app.companyName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-[#111827]">{app.companyName}</h4>
                        <p className="text-xs text-[#6B7280]">{app.jobTitle}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant="neutral">{app.currentStatus}</Badge>
                      <p className="text-[9px] text-[#6B7280] font-bold">
                        {new Date(app.applicationDate).toLocaleDateString()}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* ── 8 & 9. PENDING TASKS + RESUME OVERVIEW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pending Tasks */}
        <Card className="p-6 space-y-6 lg:col-span-2">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-base text-[#111827]">Pending Tasks Checklist</h3>
              <p className="text-xs text-[#6B7280] mt-0.5">Quickly complete, edit or delete follow-ups and priorities.</p>
            </div>
            <button onClick={() => setActiveModal('createReminder')} className="p-2 bg-[#F3F1FF] text-[#6D5EF5] rounded-xl hover:bg-[#E5E1FF] transition">
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2.5">
            {reminders.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#6B7280] font-semibold">
                No reminders today. <button onClick={() => setActiveModal('createReminder')} className="text-[#6D5EF5] font-black underline cursor-pointer">Create Reminder</button>
              </div>
            ) : (
              reminders.slice(0, 5).map(rem => (
                <div key={rem.id} className="flex items-center justify-between p-3.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl">
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleToggleReminder(rem.id)} className={`h-5 w-5 rounded border flex items-center justify-center transition-all cursor-pointer ${
                      rem.status === 'Completed' ? 'bg-[#22C55E] border-[#22C55E] text-white' : 'border-[#D1D5DB] bg-white'
                    }`}>
                      {rem.status === 'Completed' && <Check className="h-3.5 w-3.5" />}
                    </button>
                    <div>
                      <span className={`text-xs font-bold ${rem.status === 'Completed' ? 'text-[#6B7280] line-through' : 'text-[#111827]'}`}>
                        {rem.title}
                      </span>
                      <p className="text-[10px] text-[#6B7280] font-semibold mt-0.5">Due: {new Date(rem.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => { setSelectedReminderForEdit(rem); setActiveModal('editReminder'); }} className="p-1.5 text-[#6B7280] hover:text-[#6D5EF5] rounded-lg transition cursor-pointer">
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handleDeleteReminderClick(rem.id)} className="p-1.5 text-[#6B7280] hover:text-[#EF4444] rounded-lg transition cursor-pointer">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Resume Overview */}
        <Card className="p-6 space-y-6 lg:col-span-1 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-base text-[#111827]">Resume Overview</h3>
              <p className="text-xs text-[#6B7280] mt-0.5">Track variation and upload details.</p>
            </div>

            <div className="space-y-3 bg-[#FAFAFA] p-4 border border-[#E5E7EB] rounded-2xl text-xs font-semibold text-[#4B5563]">
              <div className="flex justify-between">
                <span>Total Uploads</span>
                <span className="text-[#111827] font-black">{resumes.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Default Resume</span>
                <span className="text-[#6D5EF5] font-black truncate max-w-[125px]">
                  {resumes.find(r => r.isDefault)?.name || 'None Set'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated</span>
                <span className="text-[#111827] font-black">
                  {resumes[0] ? new Date(resumes[0].createdAt).toLocaleDateString() : '—'}
                </span>
              </div>
            </div>
          </div>

          <Link href="/app/resumes" className="inline-flex items-center justify-center gap-1.5 w-full rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] hover:bg-[#F1F5F9] py-2.5 text-xs font-bold text-[#111827] transition mt-4">
            Manage Resumes
          </Link>
        </Card>
      </div>

      {/* ── 10 & 11. ANALYTICS SNAPSHOT + RECENT ACTIVITY ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Analytics Snapshot */}
        <Card className="p-6 space-y-6 lg:col-span-1">
          <div>
            <h3 className="font-bold text-base text-[#111827]">Analytics Snapshot</h3>
            <p className="text-xs text-[#6B7280] mt-0.5">General workspace health indicators.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl text-center">
              <div className="text-2xl font-black text-[#111827]">{totalApplications}</div>
              <div className="text-[10px] text-[#6B7280] font-bold mt-1">Applications</div>
            </div>
            <div className="p-3.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl text-center">
              <div className="text-2xl font-black text-[#111827]">{interviewsCount}</div>
              <div className="text-[10px] text-[#6B7280] font-bold mt-1">Interviews</div>
            </div>
            <div className="p-3.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl text-center">
              <div className="text-2xl font-black text-[#111827]">{offersCount}</div>
              <div className="text-[10px] text-[#6B7280] font-bold mt-1">Offers</div>
            </div>
            <div className="p-3.5 bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl text-center">
              <div className="text-2xl font-black text-[#111827]">{responseRate}%</div>
              <div className="text-[10px] text-[#6B7280] font-bold mt-1">Response Rate</div>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6 space-y-6 lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-[#111827] mb-4">Recent Activity</h3>
            
            <div className="space-y-4">
              {recentApplications.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#6B7280] font-semibold">
                  No recent activities recorded.
                </div>
              ) : (
                recentApplications.slice(0, 5).map((app: any) => (
                  <div key={app.id} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-[#F3F1FF] text-[#6D5EF5] flex items-center justify-center">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-bold text-[#111827]">Application Added</span>
                        <p className="text-[10px] text-[#6B7280]">{app.companyName} • {app.jobTitle}</p>
                      </div>
                    </div>
                    <span className="text-[9px] text-[#6B7280] font-semibold">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <Link href="/app/analytics" className="inline-flex items-center justify-center gap-1.5 w-full rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] hover:bg-[#F1F5F9] py-2.5 text-xs font-bold text-[#111827] transition mt-6">
            View Activity
          </Link>
        </Card>
      </div>

      {/* ── DAILY BRIEFING AUTO-MODAL ── */}
      <Modal open={dailyBriefingOpen} onClose={() => setDailyBriefingOpen(false)} title="Good Morning 👋" size="md">
        <div className="space-y-5 py-2 font-[--font-sans]">
          <p className="text-sm text-[#4B5563]">Here is your schedule breakdown and pending checklist overview for today:</p>
          
          <div className="space-y-3">
            {/* Interviews checklist */}
            {getInterviewsToday().map((int: any) => (
              <div key={int.id} className="flex gap-2 items-start text-xs">
                <span className="text-[#6D5EF5] font-black">•</span>
                <span className="font-bold text-[#111827]">
                  {int.application.companyName} Technical Interview at {int.scheduledTime}
                </span>
              </div>
            ))}

            {/* Reminders checklist */}
            {getRemindersToday().map((rem: any) => (
              <div key={rem.id} className="flex gap-2 items-start text-xs">
                <span className="text-[#6D5EF5] font-black">•</span>
                <span className="font-bold text-[#111827]">
                  {rem.title} ({rem.reminderType})
                </span>
              </div>
            ))}

            {/* Overdue notifications count */}
            {getOverdueReminders().length > 0 && (
              <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-xs font-bold text-[#991B1B] mt-2">
                ⚠️ You have {getOverdueReminders().length} overdue reminders.
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-[#F1F5F9]">
            <Button variant="secondary" onClick={() => setDailyBriefingOpen(false)}>Dismiss</Button>
            <Button onClick={() => setDailyBriefingOpen(false)}>Go to Dashboard</Button>
          </div>
        </div>
      </Modal>

      {/* ── QUICK ACTION MODAL: ADD APPLICATION ── */}
      <Modal open={activeModal === 'addApp'} onClose={() => setActiveModal(null)} title="Add Job Application">
        <form onSubmit={handleCreateApp} className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Company Name" required value={appForm.companyName} onChange={e => setAppForm({...appForm, companyName: e.target.value})} />
            <Input label="Job Title" required value={appForm.jobTitle} onChange={e => setAppForm({...appForm, jobTitle: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Job Type" value={appForm.jobType} onChange={e => setAppForm({...appForm, jobType: e.target.value})}>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </Select>
            <Select label="Work Mode" value={appForm.workMode} onChange={e => setAppForm({...appForm, workMode: e.target.value})}>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Location" value={appForm.location} onChange={e => setAppForm({...appForm, location: e.target.value})} />
            <Select label="Hiring Status" value={appForm.currentStatus} onChange={e => setAppForm({...appForm, currentStatus: e.target.value})}>
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
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Application Date" type="date" value={appForm.applicationDate} onChange={e => setAppForm({...appForm, applicationDate: e.target.value})} />
            <Select label="Linked Resume" value={appForm.resumeId} onChange={e => setAppForm({...appForm, resumeId: e.target.value})}>
              <option value="">Select a resume...</option>
              {resumes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </Select>
          </div>
          <Textarea label="Notes / Comments" value={appForm.notes} onChange={e => setAppForm({...appForm, notes: e.target.value})} />
          
          <div className="flex justify-end gap-3 pt-3">
            <Button variant="secondary" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button type="submit" disabled={actionLoading}>
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Application'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── QUICK ACTION MODAL: UPLOAD RESUME ── */}
      <Modal open={activeModal === 'uploadResume'} onClose={() => setActiveModal(null)} title="Upload Resume PDF">
        <form onSubmit={handleUploadResume} className="space-y-4 text-sm">
          <Input label="Resume Name" required value={resumeForm.name} onChange={e => setResumeForm({...resumeForm, name: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Target Role" value={resumeForm.targetRole} onChange={e => setResumeForm({...resumeForm, targetRole: e.target.value})} />
            <Input label="Version" value={resumeForm.version} onChange={e => setResumeForm({...resumeForm, version: e.target.value})} />
          </div>
          <Textarea label="Notes" value={resumeForm.notes} onChange={e => setResumeForm({...resumeForm, notes: e.target.value})} />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#111827]">Select PDF File</label>
            <input type="file" accept=".pdf" required onChange={e => setResumeForm({...resumeForm, file: e.target.files ? e.target.files[0] : null})}
              className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[#F3F1FF] file:text-[#6D5EF5] file:font-semibold file:hover:bg-[#E5E1FF] cursor-pointer" />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="secondary" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button type="submit" disabled={actionLoading}>
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Upload'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── QUICK ACTION MODAL: SCHEDULE INTERVIEW ── */}
      <Modal open={activeModal === 'scheduleInterview'} onClose={() => setActiveModal(null)} title="Schedule Interview Round">
        <form onSubmit={handleScheduleInterview} className="space-y-4 text-sm">
          <Select label="Link to Application" required value={interviewForm.applicationId} onChange={e => setInterviewForm({...interviewForm, applicationId: e.target.value})}>
            <option value="">Select an application...</option>
            {applications.map(app => <option key={app.id} value={app.id}>{app.companyName} — {app.jobTitle}</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Round" value={interviewForm.interviewRound} onChange={e => setInterviewForm({...interviewForm, interviewRound: e.target.value})}>
              <option value="Technical">Technical</option>
              <option value="HR Round">HR Round</option>
              <option value="Finals">Finals</option>
            </Select>
            <Select label="Type" value={interviewForm.interviewType} onChange={e => setInterviewForm({...interviewForm, interviewType: e.target.value})}>
              <option value="Video Call">Video Call</option>
              <option value="Phone Call">Phone Call</option>
              <option value="On-site">On-site</option>
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Scheduled Date" type="date" value={interviewForm.scheduledDate} onChange={e => setInterviewForm({...interviewForm, scheduledDate: e.target.value})} />
            <Input label="Time" type="time" value={interviewForm.scheduledTime} onChange={e => setInterviewForm({...interviewForm, scheduledTime: e.target.value})} />
            <Input label="TimeZone" value={interviewForm.timeZone} onChange={e => setInterviewForm({...interviewForm, timeZone: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Platform (Zoom, Meets)" value={interviewForm.meetingPlatform} onChange={e => setInterviewForm({...interviewForm, meetingPlatform: e.target.value})} />
            <Input label="Meeting Link" value={interviewForm.meetingLink} onChange={e => setInterviewForm({...interviewForm, meetingLink: e.target.value})} />
          </div>
          <Textarea label="Preparation Notes" value={interviewForm.preparationNotes} onChange={e => setInterviewForm({...interviewForm, preparationNotes: e.target.value})} />

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="secondary" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button type="submit" disabled={actionLoading}>
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Schedule'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── QUICK ACTION MODAL: CREATE REMINDER ── */}
      <Modal open={activeModal === 'createReminder'} onClose={() => setActiveModal(null)} title="Create Task Reminder">
        <form onSubmit={handleCreateReminder} className="space-y-4 text-sm">
          <Input label="Reminder Title" required value={reminderForm.title} onChange={e => setReminderForm({...reminderForm, title: e.target.value})} />
          <Select label="Link to Application (Optional)" value={reminderForm.applicationId} onChange={e => setReminderForm({...reminderForm, applicationId: e.target.value})}>
            <option value="">Do not link...</option>
            {applications.map(app => <option key={app.id} value={app.id}>{app.companyName} — {app.jobTitle}</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Type" value={reminderForm.reminderType} onChange={e => setReminderForm({...reminderForm, reminderType: e.target.value})}>
              <option value="Follow-up">Follow-up</option>
              <option value="Preparation">Preparation</option>
              <option value="Application Deadline">Application Deadline</option>
              <option value="Offer Deadline">Offer Deadline</option>
            </Select>
            <Select label="Priority" value={reminderForm.priority} onChange={e => setReminderForm({...reminderForm, priority: e.target.value})}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Due Date" type="date" value={reminderForm.dueDate} onChange={e => setReminderForm({...reminderForm, dueDate: e.target.value})} />
            <Input label="Time" type="time" value={reminderForm.dueTime} onChange={e => setReminderForm({...reminderForm, dueTime: e.target.value})} />
          </div>
          <Textarea label="Task description" value={reminderForm.description} onChange={e => setReminderForm({...reminderForm, description: e.target.value})} />

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="secondary" onClick={() => setActiveModal(null)}>Cancel</Button>
            <Button type="submit" disabled={actionLoading}>
              {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Reminder'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── MODAL: VIEW INTERVIEW DETAILS ── */}
      <Modal open={activeModal === 'viewInterview'} onClose={() => setActiveModal(null)} title="Interview Specifications">
        {selectedInterview && (
          <div className="space-y-4 text-xs font-semibold text-[#4B5563]">
            <div className="flex justify-between items-center border-b border-[#F1F5F9] pb-2">
              <span className="text-sm font-black text-[#111827]">{selectedInterview.application.companyName}</span>
              <Badge variant="primary">{selectedInterview.status}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-[#6B7280] uppercase">Role</p>
                <p className="text-xs text-[#111827] mt-0.5">{selectedInterview.application.jobTitle}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#6B7280] uppercase">Interview Round</p>
                <p className="text-xs text-[#111827] mt-0.5">{selectedInterview.interviewRound}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#6B7280] uppercase">Scheduled Time</p>
                <p className="text-xs text-[#111827] mt-0.5">{new Date(selectedInterview.scheduledDate).toLocaleDateString()} at {selectedInterview.scheduledTime}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#6B7280] uppercase">Meeting Platform</p>
                <p className="text-xs text-[#111827] mt-0.5">{selectedInterview.meetingPlatform || '—'}</p>
              </div>
            </div>
            {selectedInterview.meetingLink && (
              <div>
                <p className="text-[10px] text-[#6B7280] uppercase">Meeting Link</p>
                <a href={selectedInterview.meetingLink} target="_blank" rel="noreferrer" className="text-[#6D5EF5] hover:underline flex items-center gap-1 mt-0.5">
                  Launch Meeting <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
            {selectedInterview.preparationNotes && (
              <div>
                <p className="text-[10px] text-[#6B7280] uppercase">Prep Notes</p>
                <p className="text-xs text-[#111827] bg-[#FAFAFA] border border-[#E5E7EB] p-3 rounded-xl mt-1 leading-relaxed whitespace-pre-line">{selectedInterview.preparationNotes}</p>
              </div>
            )}
            <div className="flex justify-end pt-3 border-t border-[#F1F5F9]">
              <Button onClick={() => setActiveModal(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── MODAL: VIEW APPLICATION DETAILS ── */}
      <Modal open={activeModal === 'viewApp'} onClose={() => setActiveModal(null)} title="Application Details">
        {selectedApp && (
          <div className="space-y-4 text-xs font-semibold text-[#4B5563]">
            <div className="flex justify-between items-center border-b border-[#F1F5F9] pb-2">
              <span className="text-sm font-black text-[#111827]">{selectedApp.companyName}</span>
              <Badge variant="neutral">{selectedApp.currentStatus}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-[#6B7280] uppercase">Job Title</p>
                <p className="text-xs text-[#111827] mt-0.5">{selectedApp.jobTitle}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#6B7280] uppercase">Job Type</p>
                <p className="text-xs text-[#111827] mt-0.5">{selectedApp.jobType}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#6B7280] uppercase">Work Mode</p>
                <p className="text-xs text-[#111827] mt-0.5">{selectedApp.workMode} ({selectedApp.location || 'Remote'})</p>
              </div>
              <div>
                <p className="text-[10px] text-[#6B7280] uppercase">Applied Date</p>
                <p className="text-xs text-[#111827] mt-0.5">{new Date(selectedApp.applicationDate).toLocaleDateString()}</p>
              </div>
            </div>
            {selectedApp.jobUrl && (
              <div>
                <p className="text-[10px] text-[#6B7280] uppercase">Listing URL</p>
                <a href={selectedApp.jobUrl} target="_blank" rel="noreferrer" className="text-[#6D5EF5] hover:underline flex items-center gap-1 mt-0.5">
                  View Posting <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
            {selectedApp.notes && (
              <div>
                <p className="text-[10px] text-[#6B7280] uppercase">Notes</p>
                <p className="text-xs text-[#111827] bg-[#FAFAFA] border border-[#E5E7EB] p-3 rounded-xl mt-1 leading-relaxed whitespace-pre-line">{selectedApp.notes}</p>
              </div>
            )}
            <div className="flex justify-end pt-3 border-t border-[#F1F5F9]">
              <Button onClick={() => setActiveModal(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── MODAL: EDIT PENDING REMINDER/TASK ── */}
      <Modal open={activeModal === 'editReminder'} onClose={() => setActiveModal(null)} title="Edit Task Reminder">
        {selectedReminderForEdit && (
          <form onSubmit={handleEditReminderSubmit} className="space-y-4 text-sm">
            <Input label="Reminder Title" required value={selectedReminderForEdit.title} onChange={e => setSelectedReminderForEdit({...selectedReminderForEdit, title: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <Select label="Type" value={selectedReminderForEdit.reminderType} onChange={e => setSelectedReminderForEdit({...selectedReminderForEdit, reminderType: e.target.value})}>
                <option value="Follow-up">Follow-up</option>
                <option value="Preparation">Preparation</option>
                <option value="Application Deadline">Application Deadline</option>
                <option value="Offer Deadline">Offer Deadline</option>
              </Select>
              <Select label="Priority" value={selectedReminderForEdit.priority} onChange={e => setSelectedReminderForEdit({...selectedReminderForEdit, priority: e.target.value})}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Due Date" type="date" value={selectedReminderForEdit.dueDate.split('T')[0]} onChange={e => setSelectedReminderForEdit({...selectedReminderForEdit, dueDate: e.target.value})} />
              <Input label="Time" type="time" value={selectedReminderForEdit.dueTime || ''} onChange={e => setSelectedReminderForEdit({...selectedReminderForEdit, dueTime: e.target.value})} />
            </div>
            <Textarea label="Task description" value={selectedReminderForEdit.description || ''} onChange={e => setSelectedReminderForEdit({...selectedReminderForEdit, description: e.target.value})} />

            <div className="flex justify-end gap-3 pt-3">
              <Button variant="secondary" onClick={() => setActiveModal(null)}>Cancel</Button>
              <Button type="submit" disabled={actionLoading}>
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Reminder'}
              </Button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
}
