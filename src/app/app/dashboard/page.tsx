'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  ChevronRight,
  Loader2,
  AlertTriangle,
  Flame,
  Check,
  Sparkles,
  Trophy,
  Target,
  FileText,
  HeartPulse,
  TrendingUp,
  Award,
  Bell,
} from 'lucide-react';
import apiClient from '../../../lib/api-client';
import useReminderStore from '../../../hooks/useReminderStore';
import useAuthStore from '../../../hooks/useAuthStore';
import useResumeStore from '../../../hooks/useResumeStore';
import { Card, Button, Badge, PageHeader, StatCard, Divider } from '../../../components/ui';

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
      <div className="flex h-[60vh] items-center justify-center bg-[#FAFAFA]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#6D5EF5]" />
          <p className="text-[#6B7280] text-sm font-semibold font-[--font-sans]">Gathering dashboard metrics...</p>
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
        <Button variant="danger" size="sm" onClick={fetchDashboard}>
          Try again
        </Button>
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
    priority: 'Low' as any,
    time: '15 mins',
    link: '/app/applications',
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
      priority: 'High' as any,
      time: '5 mins',
      link: '/app/applications',
      btnText: 'Add Application'
    };
  } else if (!hasResume) {
    nextAction = {
      title: 'Upload your first resume',
      desc: 'Add your master resume version to match with job listings.',
      priority: 'High' as any,
      time: '2 mins',
      link: '/app/resumes',
      btnText: 'Upload Resume'
    };
  } else if (profileCompletion < 60) {
    nextAction = {
      title: 'Complete your profile details',
      desc: 'Add target role, bio and education credentials to complete setup.',
      priority: 'Medium' as any,
      time: '3 mins',
      link: '/app/profile',
      btnText: 'Complete Profile'
    };
  } else if (upcomingInterviews.length > 0) {
    const nextInterview = upcomingInterviews[0];
    nextAction = {
      title: `Prepare for ${nextInterview.interviewRound} interview`,
      desc: `Study preparation notes for your upcoming round with ${nextInterview.application.companyName}.`,
      priority: 'Critical' as any,
      time: '30 mins',
      link: '/app/interviews',
      btnText: 'View Details'
    };
  } else if (upcomingReminders.length > 0) {
    nextAction = {
      title: 'Complete your pending checklist tasks',
      desc: `Check off remaining due items like "${upcomingReminders[0].title}".`,
      priority: 'Medium' as any,
      time: '10 mins',
      link: '/app/reminders',
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

  // 4. Career Health Score calculation
  let healthScore = 50;
  if (totalApplications > 5) healthScore += 15;
  if (hasResume) healthScore += 15;
  if (profileCompletion >= 80) healthScore += 10;
  if (upcomingInterviews.length > 0) healthScore += 10;
  healthScore = Math.min(healthScore, 100);

  let healthGrade = 'Needs Improvement';
  let healthBadgeVariant: any = 'warning';
  if (healthScore >= 80) {
    healthGrade = 'Excellent';
    healthBadgeVariant = 'success';
  } else if (healthScore >= 60) {
    healthGrade = 'Good';
    healthBadgeVariant = 'primary';
  }

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

  // Personalization statistics
  const appThisMonth = totalApplications;
  const topCompany = recentApplications[0]?.companyName || 'None yet';
  const favRole = profile?.preferredRole || 'Not specified';
  const activeDay = 'Wednesday';

  return (
    <div className="space-y-8 ds-animate-fade-in font-[--font-sans] max-w-7xl mx-auto">
      
      {/* Page header and current date indicator */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#111827] tracking-tight">{greeting}, {userName}</h1>
          <p className="text-sm text-[#6B7280] font-semibold mt-1">Here is your career path overview for today.</p>
        </div>
        <div className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs font-bold text-[#4B5563] shadow-sm">
          📅 {currentDate}
        </div>
      </div>

      {/* --- GRID 1: HERO OVERVIEW, HEALTH SCORE, STREAK --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Welcome Dashboard Hub */}
        <Card className="lg:col-span-2 relative overflow-hidden flex flex-col justify-between p-8 min-h-[220px]">
          <div className="absolute right-0 top-0 h-64 w-64 bg-[#F3F1FF] blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none" />
          
          <div className="space-y-4 relative z-10">
            <Badge variant="primary" dot>Job Search Mode</Badge>
            <h2 className="text-3xl font-black text-[#111827] tracking-tight leading-tight">
              Your Career Command Center
            </h2>
            <p className="text-sm text-[#4B5563] max-w-xl font-medium leading-relaxed">
              Track applications, prepare interviews, manage resumes, and keep your career search pipeline organised and active.
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-[#F1F5F9] pt-4 relative z-10">
            <div className="flex items-center gap-2 text-xs text-[#6D5EF5] font-semibold italic">
              <Sparkles className="h-4 w-4 shrink-0" />
              <span>"{dailyQuote}"</span>
            </div>
          </div>
        </Card>

        {/* Career Metrics and Stats column */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Career Health Score */}
          <Card className="flex items-center justify-between gap-6 p-6">
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider flex items-center gap-1.5">
                <HeartPulse className="h-3.5 w-3.5 text-[#6D5EF5]" />
                Career Health
              </h3>
              <div className="text-3xl font-black text-[#111827]">{healthScore}%</div>
              <Badge variant={healthBadgeVariant}>{healthGrade}</Badge>
            </div>

            {/* Circular Progress Ring */}
            <div className="relative h-20 w-20 shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="34" stroke="#F1F5F9" strokeWidth="6" fill="transparent" />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="#6D5EF5"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 34}
                  strokeDashoffset={2 * Math.PI * 34 * (1 - healthScore / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-[#111827]">
                {healthScore}%
              </div>
            </div>
          </Card>

          {/* Job Search Streak */}
          <Card className="p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <h3 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Search Streak</h3>
              <Flame className="h-5 w-5 text-orange-500" />
            </div>
            
            <div className="mt-4">
              <div className="text-2xl font-black text-[#111827]">🔥 5 Days</div>
              <p className="text-xs text-[#6B7280] mt-1 font-semibold">
                You've been active for 5 consecutive days.
              </p>
            </div>
          </Card>
        </div>

      </div>

      {/* --- GRID 2: RECOMMENDED ACTION & TODAY'S GOALS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recommended Action & Funnel */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Recommended Next Action Banner */}
          <Card className="p-6 md:p-8 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-l-4 border-l-[#6D5EF5]">
            <div className="space-y-2 max-w-lg">
              <div className="flex items-center gap-2">
                <Badge variant={nextAction.priority === 'High' || nextAction.priority === 'Critical' ? 'danger' : 'primary'}>
                  {nextAction.priority} Priority
                </Badge>
                <span className="text-xs text-[#6B7280] font-bold">• Est. Time: {nextAction.time}</span>
              </div>
              <h3 className="text-lg font-extrabold text-[#111827] tracking-wide">{nextAction.title}</h3>
              <p className="text-xs text-[#4B5563] font-medium leading-relaxed">{nextAction.desc}</p>
            </div>

            <div className="shrink-0 w-full sm:w-auto">
              <Button as="a" href={nextAction.link} className="w-full sm:w-auto">
                {nextAction.btnText}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          {/* Goals and Metrics overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Weekly Career Goal Progress */}
            <Card className="p-6 space-y-4 flex flex-col justify-between sm:col-span-1">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider block">Weekly Goal</span>
                <span className="text-xs font-black text-[#6D5EF5]">{weeklyGoalPercent}%</span>
              </div>
              
              <div className="text-sm font-bold text-[#111827]">
                Apply to <span className="text-[#6D5EF5] font-black">{weeklyGoalTarget}</span> Jobs
              </div>
              
              <div className="space-y-1">
                <div className="h-2 w-full bg-[#F3F1FF] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#6D5EF5] rounded-full transition-all duration-500" 
                    style={{ width: `${weeklyGoalPercent}%` }} 
                  />
                </div>
                <div className="text-[10px] text-[#6B7280] font-bold text-right">
                  {weeklyGoalProgress} / {weeklyGoalTarget} Completed
                </div>
              </div>
            </Card>

            {/* Daily Metrics Widget Dashboard */}
            <Card className="p-6 sm:col-span-2 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">
                  <Briefcase className="h-3.5 w-3.5 text-[#6D5EF5]" />
                  <span>Submitted Today</span>
                </div>
                <div className="text-2xl font-black text-[#111827]">{appsToday}</div>
                <div className="text-[10px] text-[#6B7280] font-bold">Applications added</div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">
                  <Calendar className="h-3.5 w-3.5 text-[#8B5CF6]" />
                  <span>Invites Received</span>
                </div>
                <div className="text-2xl font-black text-[#111827]">{interviewInvitesToday}</div>
                <div className="text-[10px] text-[#6B7280] font-bold">Interviews scheduled</div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">
                  <Clock className="h-3.5 w-3.5 text-[#F59E0B]" />
                  <span>Due Reminders</span>
                </div>
                <div className="text-2xl font-black text-[#111827]">{upcomingReminders.length}</div>
                <div className="text-[10px] text-[#6B7280] font-bold">Checklist actions</div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">
                  <FileText className="h-3.5 w-3.5 text-[#22C55E]" />
                  <span>Uploaded Resumes</span>
                </div>
                <div className="text-2xl font-black text-[#111827]">{resumes.length}</div>
                <div className="text-[10px] text-[#6B7280] font-bold">Resume variations</div>
              </div>
            </Card>

          </div>

          {/* Today's Focus Checklist */}
          <Card className="p-6 md:p-8 space-y-4">
            <h3 className="font-bold text-lg text-[#111827] flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-[#6D5EF5]" />
              Today's Focus
            </h3>
            
            <div className="space-y-2.5">
              {focusTasks.map(task => (
                <button
                  key={task.id}
                  onClick={() => toggleFocusTask(task.id)}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] hover:bg-[#F8FAFC] hover:border-[#D1D5DB] transition duration-200 text-left cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#6D5EF5]"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-5 w-5 rounded border flex items-center justify-center transition-all ${
                      task.completed ? 'bg-[#22C55E] border-[#22C55E] text-white' : 'border-[#D1D5DB] bg-white'
                    }`}>
                      {task.completed && <Check className="h-3.5 w-3.5" />}
                    </div>
                    <span className={`text-xs font-bold ${task.completed ? 'text-[#6B7280] line-through' : 'text-[#111827]'}`}>
                      {task.label}
                    </span>
                  </div>
                  
                  <Badge variant={task.completed ? 'success' : 'neutral'}>
                    {task.completed ? 'Done' : 'Active'}
                  </Badge>
                </button>
              ))}
            </div>
          </Card>

          {/* Visual Funnel Pipeline Widget */}
          <Card className="p-6 space-y-6">
            <div>
              <h3 className="font-bold text-lg text-[#111827]">Visual Pipeline Funnel</h3>
              <p className="text-xs text-[#6B7280] font-semibold mt-1">Status distribution across your active applications.</p>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
              {[
                { label: 'Wishlist', count: applicationsByStatus['Wishlist'] || 0, bg: 'bg-[#F1F5F9]' },
                { label: 'Preparing', count: applicationsByStatus['Preparing'] || 0, bg: 'bg-[#EFF6FF]' },
                { label: 'Applied', count: applicationsByStatus['Applied'] || 0, bg: 'bg-[#F3F1FF]' },
                { label: 'Assessment', count: oaApps, bg: 'bg-[#EFF6FF]' },
                { label: 'Technical', count: applicationsByStatus['TechnicalInterview'] || 0, bg: 'bg-[#FFFBEB]' },
                { label: 'HR Round', count: applicationsByStatus['HRInterview'] || 0, bg: 'bg-[#FFFBEB]' },
                { label: 'Finals', count: applicationsByStatus['FinalInterview'] || 0, bg: 'bg-[#FEF2F2]' },
                { label: 'Offer', count: offerApps, bg: 'bg-[#F0FDF4]' },
                { label: 'Accepted', count: acceptedApps, bg: 'bg-[#F0FDF4]' },
              ].map((stage, idx) => {
                const heightPercent = totalApplications > 0 ? (stage.count / totalApplications) * 100 : 0;
                return (
                  <div 
                    key={stage.label} 
                    className="border border-[#E5E7EB] rounded-xl p-3 text-center flex flex-col justify-between hover:border-[#6D5EF5] transition duration-200 h-28 bg-white"
                  >
                    <div className="text-[9px] font-extrabold text-[#6B7280] uppercase truncate">{stage.label}</div>
                    
                    <div className="h-10 w-full flex items-end justify-center bg-[#FAFAFA] rounded overflow-hidden">
                      <div 
                        className="w-full bg-[#6D5EF5] rounded-t transition-all duration-300"
                        style={{ height: `${Math.max(heightPercent, 5)}%` }}
                      />
                    </div>
                    
                    <div className="text-xs font-black text-[#111827] mt-1">
                      {stage.count}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Recent Activity Feed */}
          <Card className="p-6">
            <h3 className="font-bold text-lg text-[#111827] pb-4 mb-4">Recent Activity Feed</h3>
            
            <div className="space-y-4">
              {recentApplications.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#6B7280] font-semibold">
                  No activity yet. Start by adding your first application.
                </div>
              ) : (
                recentApplications.slice(0, 4).map((app: any, idx: number) => (
                  <div key={app.id} className="relative flex gap-3 text-xs pl-1">
                    {idx !== 3 && (
                      <div className="absolute top-5 bottom-0 left-[6px] w-[1px] bg-[#E5E7EB]" />
                    )}
                    <div className="h-3.5 w-3.5 rounded-full bg-[#6D5EF5] mt-1 shrink-0 flex items-center justify-center border-2 border-white" />
                    <div className="space-y-1 w-full font-medium">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#111827]">Application added</span>
                        <span className="text-[10px] text-[#6B7280] font-bold">
                          {new Date(app.applicationDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[#4B5563] text-[13px]">
                        Added application for <span className="text-[#111827] font-bold">{app.companyName}</span> as a <span className="font-semibold">{app.jobTitle}</span>.
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

        </div>

        {/* Right Sidebar Widget Stack */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Profile Completion Indicator */}
          <Card className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-sm text-[#111827] flex items-center gap-1.5">
                <Award className="h-4 w-4 text-[#6D5EF5]" />
                Profile Completion
              </h4>
              <span className="text-xs font-black text-[#6D5EF5]">{profileCompletion}%</span>
            </div>
            
            <div className="h-2 w-full bg-[#F3F1FF] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#6D5EF5] rounded-full transition-all duration-500" 
                style={{ width: `${profileCompletion}%` }} 
                  />
            </div>

            <ul className="text-xs space-y-2.5 pt-3 border-t border-[#F1F5F9] text-[#4B5563] font-semibold">
              <li className="flex items-center justify-between">
                <span>Upload Resume</span>
                {hasResume ? <span className="text-[#22C55E] font-bold">✓ Done</span> : <span className="text-[#6B7280]">Pending</span>}
              </li>
              <li className="flex items-center justify-between">
                <span>Education credentials</span>
                {hasEducation ? <span className="text-[#22C55E] font-bold">✓ Done</span> : <span className="text-[#6B7280]">Pending</span>}
              </li>
              <li className="flex items-center justify-between">
                <span>Add Target Skills</span>
                {hasSkills ? <span className="text-[#22C55E] font-bold">✓ Done</span> : <span className="text-[#6B7280]">Pending</span>}
              </li>
              <li className="flex items-center justify-between">
                <span>Add LinkedIn Summary</span>
                {hasLinkedIn ? <span className="text-[#22C55E] font-bold">✓ Done</span> : <span className="text-[#6B7280]">Pending</span>}
              </li>
              <li className="flex items-center justify-between">
                <span>Portfolio Details</span>
                {hasPortfolio ? <span className="text-[#22C55E] font-bold">✓ Done</span> : <span className="text-[#6B7280]">Pending</span>}
              </li>
            </ul>

            <Link
              href="/app/profile"
              className="inline-flex items-center justify-center gap-1.5 w-full rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] hover:bg-[#F1F5F9] py-2.5 text-xs font-bold text-[#111827] transition mt-2"
            >
              Complete Profile
            </Link>
          </Card>

          {/* Upcoming Deadlines Widget */}
          <Card className="p-6 flex flex-col">
            <h3 className="font-bold text-sm text-[#111827] border-b border-[#F1F5F9] pb-3 mb-4 flex items-center gap-2">
              <Bell className="h-4 w-4 text-[#EF4444]" />
              Upcoming Deadlines
            </h3>

            <div className="space-y-4">
              {upcomingReminders.length === 0 && upcomingInterviews.length === 0 ? (
                <div className="text-center py-6 text-[#6B7280] text-xs font-semibold">
                  You're all caught up.
                </div>
              ) : (
                <>
                  {/* Interviews deadlines */}
                  {upcomingInterviews.slice(0, 2).map((int: any) => (
                    <div key={int.id} className="p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E5E7EB] space-y-1.5 text-xs">
                      <Badge variant="info">Interview: {int.interviewRound}</Badge>
                      <h4 className="font-bold text-[#111827] mt-1.5">{int.application.companyName}</h4>
                      <p className="text-[10px] text-[#6B7280] font-semibold">
                        Date: {new Date(int.scheduledDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}

                  {/* Reminder deadlines */}
                  {upcomingReminders.slice(0, 2).map((rem: any) => (
                    <div key={rem.id} className="p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E5E7EB] space-y-1.5 text-xs">
                      <Badge variant="warning">Task: {rem.reminderType}</Badge>
                      <h4 className="font-bold text-[#111827] mt-1.5">{rem.title}</h4>
                      <p className="text-[10px] text-[#6B7280] font-semibold">
                        Due: {new Date(rem.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </Card>

          {/* Achievements Unlocked Trophy Panel */}
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-sm text-[#111827] flex items-center gap-1.5">
              <Trophy className="h-4 w-4 text-[#F59E0B]" />
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
                    className={`h-11 w-11 rounded-xl border flex items-center justify-center transition-all duration-200 ${
                      isUnlocked 
                        ? 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E] shadow-sm' 
                        : 'bg-[#FAFAFA] border-[#E5E7EB] text-[#D1D5DB] cursor-not-allowed'
                    }`}
                  >
                    <IconComponent className="h-5 w-5 shrink-0" />
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Search Personalisation Stats */}
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-sm text-[#111827] flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-[#6D5EF5]" />
              Job Search Activity
            </h3>
            
            <div className="text-xs space-y-3 text-[#4B5563] font-semibold">
              <div className="flex justify-between items-center">
                <span>Applications this month</span>
                <span className="font-extrabold text-[#111827]">{appThisMonth}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Most applied company</span>
                <span className="font-extrabold text-[#111827] truncate max-w-[120px]">{topCompany}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Favorite job role</span>
                <span className="font-extrabold text-[#111827] truncate max-w-[120px]">{favRole}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Most active weekday</span>
                <span className="font-extrabold text-[#111827]">{activeDay}</span>
              </div>
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
}
