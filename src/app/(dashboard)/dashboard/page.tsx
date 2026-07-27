'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  Loader2,
  Plus,
  AlertTriangle,
  MapPin,
  TrendingUp,
  Award,
  Flame,
  Check,
  Zap,
  Trophy,
  Target,
  ChevronRight,
  Sparkles,
  Bell,
  ArrowRight,
  FileText,
  HeartPulse,
} from 'lucide-react';
import apiClient from '../../../lib/api-client';
import useReminderStore from '../../../hooks/useReminderStore';
import useAuthStore from '../../../hooks/useAuthStore';
import useResumeStore from '../../../hooks/useResumeStore';

// Achievements configuration
const ACHIEVEMENTS = [
  { id: 'first_app', label: 'First Application', desc: 'Added your first job application', icon: Target },
  { id: 'first_resume', label: 'First Resume', desc: 'Uploaded your first resume PDF', icon: FileText },
  { id: 'ten_apps', label: '10 Applications', desc: 'Added 10 applications in total', icon: Briefcase },
  { id: 'first_interview', label: 'First Interview', desc: 'Scheduled your first interview round', icon: Calendar },
  { id: 'first_offer', label: 'First Offer', desc: 'Received a written job offer', icon: Trophy },
];

export default function DashboardPage() {
  const { completeReminder } = useReminderStore();
  const { profile, user: authUser } = useAuthStore();
  const { resumes, fetchResumes } = useResumeStore();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [greeting, setGreeting] = useState('Welcome');
  const [currentDate, setCurrentDate] = useState('');
  
  // Interactive Focus Checklist State
  const [focusTasks, setFocusTasks] = useState([
    { id: 1, label: 'Apply to 3 companies', completed: false },
    { id: 2, label: 'Practice technical interview questions', completed: false },
    { id: 3, label: 'Tailor resume for target roles', completed: false },
    { id: 4, label: 'Follow up with recruiter contacts', completed: false },
    { id: 5, label: 'Complete missing profile details', completed: false },
  ]);

  // Quotes rotating daily
  const quotes = [
    "Every application brings you one step closer.",
    "Small progress every day leads to big results.",
    "Success comes from consistency and preparation.",
    "You are only one interview away from changing your career.",
    "Keep applying. Consistency wins in the end.",
    "Every rejection is just redirection to something better.",
  ];
  const [dailyQuote, setDailyQuote] = useState(quotes[0]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response: any = await apiClient.get('/dashboard');
      setData(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchResumes();

    // Dynamically calculate greeting based on local time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Date formatting
    const formattedDate = new Date().toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    setCurrentDate(formattedDate);

    // Dynamic quote calculation (rotates daily)
    const day = new Date().getDate();
    setDailyQuote(quotes[day % quotes.length]);
  }, []);

  const handleCompleteReminder = async (id: string) => {
    try {
      await completeReminder(id);
      fetchDashboard();
    } catch (err) {
      // Ignored
    }
  };

  const toggleFocusTask = (id: number) => {
    setFocusTasks(focusTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-zinc-400 text-sm">Gathering command center stats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-6 text-center max-w-lg mx-auto mt-12">
        <AlertTriangle className="h-10 w-10 text-rose-500 mx-auto mb-3" />
        <h3 className="font-semibold text-white mb-1">Failed to load data</h3>
        <p className="text-zinc-400 text-sm mb-4">{error}</p>
        <button
          onClick={fetchDashboard}
          className="rounded-lg bg-zinc-800 hover:bg-zinc-700 px-4 py-2 text-xs font-semibold text-white"
        >
          Try again
        </button>
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
  } = data || {};

  const userName = profile?.fullName || authUser?.email?.split('@')[0] || 'User';

  // --- Dynamic calculations for the Smart Career Assistant ---

  // 1. Recommended Next Action
  let nextAction = {
    title: 'Browse job postings and apply',
    desc: 'Submit another application to keep your pipeline active.',
    priority: 'Low',
    time: '15 mins',
    link: '/applications?create=true',
    btnText: 'Add Application'
  };

  const hasResume = resumes.length > 0;
  const hasEducation = !!(profile?.college && profile?.degree);
  const hasSkills = !!profile?.preferredRole;
  const hasLinkedIn = !!profile?.bio;
  const hasPortfolio = !!profile?.specialization;

  let profileCompletion = 20; // 20% for name initially
  if (hasEducation) profileCompletion += 20;
  if (hasSkills) profileCompletion += 20;
  if (hasLinkedIn) profileCompletion += 20;
  if (hasPortfolio) profileCompletion += 20;
  if (hasResume) profileCompletion += 20;
  profileCompletion = Math.min(profileCompletion, 100);

  if (totalApplications === 0) {
    nextAction = {
      title: 'Add your first application',
      desc: 'Add a job listing to start tracking your search pipeline.',
      priority: 'High',
      time: '5 mins',
      link: '/applications?create=true',
      btnText: 'Add Application'
    };
  } else if (!hasResume) {
    nextAction = {
      title: 'Upload your first resume',
      desc: 'Add your master resume version to match with job listings.',
      priority: 'High',
      time: '2 mins',
      link: '/resumes?upload=true',
      btnText: 'Upload Resume'
    };
  } else if (profileCompletion < 60) {
    nextAction = {
      title: 'Complete your profile details',
      desc: 'Add target role, bio and education credentials to complete setup.',
      priority: 'Medium',
      time: '3 mins',
      link: '/profile',
      btnText: 'Complete Profile'
    };
  } else if (upcomingInterviews.length > 0) {
    const nextInterview = upcomingInterviews[0];
    nextAction = {
      title: `Prepare for ${nextInterview.interviewRound} interview`,
      desc: `Study preparation notes for your upcoming round with ${nextInterview.application.companyName}.`,
      priority: 'Critical',
      time: '30 mins',
      link: '/interviews',
      btnText: 'View Interview Details'
    };
  } else if (upcomingReminders.length > 0) {
    nextAction = {
      title: 'Complete your pending checklist tasks',
      desc: `Check off remaining due items like "${upcomingReminders[0].title}".`,
      priority: 'Medium',
      time: '10 mins',
      link: '/reminders',
      btnText: 'Go to Reminders'
    };
  }

  // 2. Weekly Goal (Target 15 applications)
  const weeklyGoalTarget = 15;
  const weeklyGoalProgress = Math.min(totalApplications, weeklyGoalTarget);
  const weeklyGoalPercent = Math.round((weeklyGoalProgress / weeklyGoalTarget) * 100);

  // 3. Today's Progress Stats
  const todayStr = new Date().toISOString().split('T')[0];
  const appsToday = recentApplications.filter((app: any) => {
    const appDate = new Date(app.applicationDate).toISOString().split('T')[0];
    return appDate === todayStr;
  }).length;

  const interviewInvitesToday = upcomingInterviews.filter((i: any) => {
    const createDate = new Date(i.createdAt || new Date()).toISOString().split('T')[0];
    return createDate === todayStr;
  }).length;

  // 4. Career Health Score calculation (dynamic placeholder score)
  let healthScore = 50;
  if (totalApplications > 5) healthScore += 15;
  if (hasResume) healthScore += 15;
  if (profileCompletion >= 80) healthScore += 10;
  if (upcomingInterviews.length > 0) healthScore += 10;
  healthScore = Math.min(healthScore, 100);

  let healthGrade = 'Needs Improvement';
  if (healthScore >= 80) healthGrade = 'Excellent';
  else if (healthScore >= 60) healthGrade = 'Good';

  // 5. Achievements Unlock Mapping
  const unlockedAchievements = {
    first_app: totalApplications > 0,
    first_resume: hasResume,
    ten_apps: totalApplications >= 10,
    first_interview: upcomingInterviews.length > 0,
    first_offer: (applicationsByStatus['OfferReceived'] || 0) > 0,
  };

  // Funnel calculations
  const totalApps = totalApplications;
  const oaApps = applicationsByStatus['OnlineAssessment'] || 0;
  const interviewApps = 
    (applicationsByStatus['TechnicalInterview'] || 0) + 
    (applicationsByStatus['HRInterview'] || 0) + 
    (applicationsByStatus['FinalInterview'] || 0);
  const offerApps = applicationsByStatus['OfferReceived'] || 0;
  const acceptedApps = applicationsByStatus['OfferAccepted'] || 0;

  const oaRatio = totalApps > 0 ? Math.round((oaApps / totalApps) * 100) : 0;
  const interviewRatio = totalApps > 0 ? Math.round((interviewApps / totalApps) * 100) : 0;
  const offerRatio = totalApps > 0 ? Math.round((offerApps / totalApps) * 100) : 0;
  const acceptedRatio = totalApps > 0 ? Math.round((acceptedApps / totalApps) * 100) : 0;

  // Personalization statistics (placeholders)
  const appThisMonth = totalApplications;
  const topCompany = recentApplications[0]?.companyName || 'None yet';
  const favRole = profile?.preferredRole || 'Not specified';
  const activeDay = 'Wednesday';

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* --- GRID 1: HERO HEADER, HEALTH SCORE, STREAK --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. Redesigned Hero Welcome Card */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-6 md:p-8 flex flex-col justify-between">
          <div className="absolute right-0 top-0 h-64 w-64 bg-indigo-500/5 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none" />
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs text-zinc-500 font-semibold uppercase tracking-wider">
              <span>{greeting}, {userName}</span>
              <span>{currentDate}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Your Career Command Center
            </h1>
            
            <p className="text-sm md:text-base text-zinc-400 max-w-xl">
              Track applications, prepare interviews, manage resumes and never miss an opportunity.
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-zinc-800/60 pt-4">
            <div className="flex items-center gap-2 text-xs text-indigo-400 italic">
              <Sparkles className="h-4 w-4 shrink-0" />
              <span>"{dailyQuote}"</span>
            </div>
            {/* Future illustration placeholder */}
            <div className="hidden sm:block h-12 w-20 border border-dashed border-zinc-850 rounded-lg bg-zinc-950/20 text-[9px] text-zinc-650 flex items-center justify-center">
              Graphics Box
            </div>
          </div>
        </div>

        {/* Health Score & Streak Card */}
        <div className="lg:col-span-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
          {/* Career Health Score */}
          <div className="glass-card rounded-3xl border border-zinc-800 p-6 flex items-center justify-between gap-4">
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <HeartPulse className="h-3.5 w-3.5 text-zinc-500" />
                Career Health
              </h3>
              <div className="text-2xl font-extrabold text-white">{healthScore}%</div>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                healthGrade === 'Excellent' ? 'bg-emerald-500/10 text-emerald-400' :
                healthGrade === 'Good' ? 'bg-indigo-500/10 text-indigo-400' :
                'bg-amber-500/10 text-amber-400'
              }`}>
                {healthGrade}
              </span>
            </div>

            {/* Circular Progress Ring */}
            <div className="relative h-20 w-20 shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="34" stroke="#18181b" strokeWidth="6" fill="transparent" />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="#6366f1"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 34}
                  strokeDashoffset={2 * Math.PI * 34 * (1 - healthScore / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-white">
                {healthScore}%
              </div>
            </div>
          </div>

          {/* Job Search Streak */}
          <div className="glass-card rounded-3xl border border-zinc-800 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Search Streak</h3>
              <Flame className="h-5 w-5 text-orange-500 animate-pulse" />
            </div>
            
            <div className="mt-2">
              <div className="text-2xl font-black text-white">🔥 5 Days</div>
              <p className="text-[10px] text-zinc-400 mt-1">
                You've been active for 5 consecutive days.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* --- GRID 2: RECOMMENDED ACTION & TODAY'S GOALS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recommended Action & Funnel */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 2. Recommended Next Action */}
          <div className="glass-card rounded-3xl border border-zinc-800/80 p-6 md:p-8 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-2 max-w-lg">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-rose-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-rose-400 border border-rose-500/20">
                  {nextAction.priority} Priority
                </span>
                <span className="text-[10px] text-zinc-500">• Est. Time: {nextAction.time}</span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-wide">{nextAction.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{nextAction.desc}</p>
            </div>

            <Link
              href={nextAction.link}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-semibold text-white hover:bg-indigo-500 transition duration-150 shadow-lg glow-indigo shrink-0 w-full sm:w-auto text-center"
            >
              {nextAction.btnText}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* 3. Weekly Goal & 4. Daily Progress Widget */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Weekly Career Goal */}
            <div className="glass-card rounded-2xl border border-zinc-800 p-5 space-y-3 sm:col-span-1">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Weekly Goal</span>
                <span className="text-xs font-bold text-white">{weeklyGoalPercent}%</span>
              </div>
              
              <div className="text-sm text-zinc-200">
                Apply to <span className="font-bold text-white">{weeklyGoalTarget}</span> Jobs
              </div>
              
              <div className="space-y-1">
                <div className="h-2 w-full bg-zinc-950 border border-zinc-850 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                    style={{ width: `${weeklyGoalPercent}%` }} 
                  />
                </div>
                <div className="text-[10px] text-zinc-500 text-right">
                  {weeklyGoalProgress} / {weeklyGoalTarget} Completed
                </div>
              </div>
            </div>

            {/* Daily Progress Metrics */}
            <div className="glass-card rounded-2xl border border-zinc-800 p-5 sm:col-span-2 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[10px] text-zinc-400 uppercase tracking-wider">
                  <Briefcase className="h-3 w-3 text-indigo-400" />
                  <span>Submitted Today</span>
                </div>
                <div className="text-xl font-extrabold text-white">{appsToday}</div>
                <div className="text-[9px] text-zinc-500">Pipeline submissions</div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[10px] text-zinc-400 uppercase tracking-wider">
                  <Calendar className="h-3 w-3 text-purple-400" />
                  <span>Invites Received</span>
                </div>
                <div className="text-xl font-extrabold text-white">{interviewInvitesToday}</div>
                <div className="text-[9px] text-zinc-500">Interviews recorded</div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[10px] text-zinc-400 uppercase tracking-wider">
                  <Clock className="h-3 w-3 text-amber-400" />
                  <span>Due Checklist</span>
                </div>
                <div className="text-xl font-extrabold text-white">{upcomingReminders.length}</div>
                <div className="text-[9px] text-zinc-500">Unfinished followups</div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[10px] text-zinc-400 uppercase tracking-wider">
                  <FileText className="h-3 w-3 text-emerald-400" />
                  <span>Active Resumes</span>
                </div>
                <div className="text-xl font-extrabold text-white">{resumes.length}</div>
                <div className="text-[9px] text-zinc-500">Versions available</div>
              </div>
            </div>

          </div>

          {/* 5. Today's Focus Checklist */}
          <div className="glass-card rounded-3xl border border-zinc-800 p-6 md:p-8 space-y-4">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-indigo-400" />
              Today's Focus
            </h3>
            
            <div className="space-y-2.5">
              {focusTasks.map(task => (
                <button
                  key={task.id}
                  onClick={() => toggleFocusTask(task.id)}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-950/20 hover:border-zinc-700/60 hover:bg-zinc-900/10 transition text-left cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center transition-all ${
                      task.completed ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-zinc-700 bg-zinc-950'
                    }`}>
                      {task.completed && <Check className="h-3 w-3" />}
                    </div>
                    <span className={`text-xs font-semibold ${task.completed ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}>
                      {task.label}
                    </span>
                  </div>
                  
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                    {task.completed ? 'Done' : 'Active'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 8. Conversion Pipeline/Funnel Section */}
          <div className="glass-card rounded-3xl border border-zinc-800 p-6 space-y-4">
            <h3 className="font-bold text-lg text-white">Visual Pipeline Funnel</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-9 gap-3">
              {[
                { label: 'Wishlist', count: applicationsByStatus['Wishlist'] || 0 },
                { label: 'Preparing', count: applicationsByStatus['Preparing'] || 0 },
                { label: 'Applied', count: applicationsByStatus['Applied'] || 0 },
                { label: 'Assessment', count: oaApps },
                { label: 'Technical', count: applicationsByStatus['TechnicalInterview'] || 0 },
                { label: 'HR Round', count: applicationsByStatus['HRInterview'] || 0 },
                { label: 'Finals', count: applicationsByStatus['FinalInterview'] || 0 },
                { label: 'Offer', count: offerApps },
                { label: 'Accepted', count: acceptedApps },
              ].map((stage, idx) => {
                const heightPercent = totalApplications > 0 ? (stage.count / totalApplications) * 100 : 0;
                return (
                  <div 
                    key={stage.label} 
                    className="glass-card rounded-xl p-3 border border-zinc-850 text-center flex flex-col justify-between hover:border-zinc-700 transition duration-150 h-28"
                  >
                    <div className="text-[9px] font-bold text-zinc-500 uppercase truncate">{stage.label}</div>
                    
                    <div className="h-10 w-full flex items-end justify-center bg-zinc-950/20 rounded">
                      <div 
                        className="w-full bg-indigo-500 rounded-t transition-all duration-300"
                        style={{ height: `${Math.max(heightPercent, 5)}%` }}
                      />
                    </div>
                    
                    <div className="text-xs font-extrabold text-white mt-1">
                      {stage.count}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 9. Recent Activity Feed */}
          <div className="glass-card rounded-3xl border border-zinc-800 p-6">
            <h3 className="font-bold text-lg text-white border-b border-zinc-800 pb-4 mb-4">Recent Activity Feed</h3>
            
            <div className="space-y-4">
              {recentApplications.length === 0 ? (
                <div className="text-center py-8 text-xs text-zinc-600">
                  No activity yet. Start by adding your first application.
                </div>
              ) : (
                recentApplications.slice(0, 4).map((app: any, idx: number) => (
                  <div key={app.id} className="relative flex gap-3 text-xs pl-1">
                    {idx !== 3 && (
                      <div className="absolute top-5 bottom-0 left-[6px] w-[1px] bg-zinc-800" />
                    )}
                    <div className="h-3 w-3 rounded-full bg-indigo-500 mt-1 shrink-0" />
                    <div className="space-y-1 w-full">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white">Application added</span>
                        <span className="text-[10px] text-zinc-500">
                          {new Date(app.applicationDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-zinc-400">
                        Added application for <span className="text-white font-semibold">{app.companyName}</span> ({app.jobTitle}).
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Sidebar Widget Stack */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* 13. Profile Completion Card Widget */}
          <div className="glass-card rounded-3xl border border-zinc-800 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                <Award className="h-4 w-4 text-indigo-400" />
                Profile Completion
              </h4>
              <span className="text-xs font-extrabold text-indigo-400">{profileCompletion}%</span>
            </div>
            
            <div className="h-2 w-full bg-zinc-850 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                style={{ width: `${profileCompletion}%` }} 
              />
            </div>

            <ul className="text-[10px] space-y-2.5 pt-3 border-t border-zinc-850 text-zinc-400">
              <li className="flex items-center justify-between">
                <span>Upload Resume</span>
                {hasResume ? <span className="text-emerald-400 font-bold">✓ Done</span> : <span className="text-zinc-650">Pending</span>}
              </li>
              <li className="flex items-center justify-between">
                <span>Education credentials</span>
                {hasEducation ? <span className="text-emerald-400 font-bold">✓ Done</span> : <span className="text-zinc-650">Pending</span>}
              </li>
              <li className="flex items-center justify-between">
                <span>Add Target Skills</span>
                {hasSkills ? <span className="text-emerald-400 font-bold">✓ Done</span> : <span className="text-zinc-650">Pending</span>}
              </li>
              <li className="flex items-center justify-between">
                <span>Add LinkedIn Summary</span>
                {hasLinkedIn ? <span className="text-emerald-400 font-bold">✓ Done</span> : <span className="text-zinc-650">Pending</span>}
              </li>
              <li className="flex items-center justify-between">
                <span>Portfolio Details</span>
                {hasPortfolio ? <span className="text-emerald-400 font-bold">✓ Done</span> : <span className="text-zinc-650">Pending</span>}
              </li>
            </ul>

            <Link
              href="/profile"
              className="inline-flex items-center justify-center gap-1.5 w-full rounded-xl bg-zinc-800 hover:bg-zinc-700 py-2.5 text-xs font-semibold text-white transition mt-2 border border-zinc-700/60"
            >
              Complete Profile
            </Link>
          </div>

          {/* 10. Upcoming Deadlines Widget */}
          <div className="glass-card rounded-3xl border border-zinc-800 p-6 flex flex-col">
            <h3 className="font-bold text-sm text-white border-b border-zinc-850 pb-3 mb-4 flex items-center gap-2">
              <Bell className="h-4 w-4 text-rose-400" />
              Upcoming Deadlines
            </h3>

            <div className="space-y-4">
              {upcomingReminders.length === 0 && upcomingInterviews.length === 0 ? (
                <div className="text-center py-6 text-zinc-600 text-xs font-semibold">
                  You're all caught up.
                </div>
              ) : (
                <>
                  {/* Interviews deadlines */}
                  {upcomingInterviews.slice(0, 2).map((int: any) => (
                    <div key={int.id} className="p-3 rounded-xl bg-zinc-950/40 border border-zinc-850 space-y-1 text-xs">
                      <span className="text-[9px] font-bold text-purple-400 bg-purple-500/10 px-1.5 py-0.2 rounded border border-purple-500/20">
                        Interview: {int.interviewRound}
                      </span>
                      <h4 className="font-bold text-white mt-1.5">{int.application.companyName}</h4>
                      <p className="text-[10px] text-zinc-500">
                        Date: {new Date(int.scheduledDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}

                  {/* Reminder deadlines */}
                  {upcomingReminders.slice(0, 2).map((rem: any) => (
                    <div key={rem.id} className="p-3 rounded-xl bg-zinc-950/40 border border-zinc-850 space-y-1 text-xs">
                      <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                        Task: {rem.reminderType}
                      </span>
                      <h4 className="font-semibold text-white mt-1.5">{rem.title}</h4>
                      <p className="text-[10px] text-zinc-500">
                        Due: {new Date(rem.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* 12. Achievement System Widget */}
          <div className="glass-card rounded-3xl border border-zinc-800 p-6 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
              <Trophy className="h-4 w-4 text-amber-400" />
              Achievements Unlocked
            </h3>
            
            <div className="grid grid-cols-5 gap-3 justify-items-center">
              {ACHIEVEMENTS.map((ach) => {
                const isUnlocked = unlockedAchievements[ach.id as keyof typeof unlockedAchievements];
                const IconComponent = ach.icon;
                return (
                  <div 
                    key={ach.id} 
                    title={`${ach.label}: ${ach.desc}`}
                    className={`h-10 w-10 rounded-xl border flex items-center justify-center transition-all ${
                      isUnlocked 
                        ? 'bg-amber-500/10 border-amber-500/35 text-amber-400 shadow-md shadow-amber-500/5' 
                        : 'bg-zinc-950/40 border-zinc-850 text-zinc-650 cursor-not-allowed'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* 14. Dashboard Personalisation Stats */}
          <div className="glass-card rounded-3xl border border-zinc-800 p-6 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-indigo-400" />
              Job Search Activity
            </h3>
            
            <div className="text-xs space-y-3 text-zinc-400">
              <div className="flex justify-between items-center">
                <span>Applications this month</span>
                <span className="font-bold text-white">{appThisMonth}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Most applied company</span>
                <span className="font-bold text-white truncate max-w-[120px]">{topCompany}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Favorite job role</span>
                <span className="font-bold text-white truncate max-w-[120px]">{favRole}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Most active weekday</span>
                <span className="font-bold text-white">{activeDay}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
