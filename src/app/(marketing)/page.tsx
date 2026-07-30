'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  FileText,
  Briefcase,
  Calendar,
  Bell,
  TrendingUp,
  UserPlus,
  Award,
  CheckCircle,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Zap,
  Shield,
  Target,
  BarChart2,
  Clock,
  Star,
} from 'lucide-react';

// ─── DATA ────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'About', href: '#about' },
];

const PROBLEMS = [
  {
    icon: Briefcase,
    title: 'Lost Track of Applications',
    desc: 'Forgot where you applied. Forgot application status. Everything is scattered.',
    color: 'text-rose-500',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
  },
  {
    icon: FileText,
    title: 'Multiple Resume Versions',
    desc: 'Resume_Final.pdf · Resume_Final_v2.pdf · Resume_Final_Final.pdf. No organisation.',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },
  {
    icon: Calendar,
    title: 'Missed Interview Dates',
    desc: 'Interview reminders scattered across different apps, calendars and sticky notes.',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    icon: BarChart2,
    title: 'No Career Progress Visibility',
    desc: 'No idea how many applications you\'ve submitted or interviews you\'ve completed.',
    color: 'text-violet-500',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
  },
];

const FEATURES = [
  {
    icon: FileText,
    title: 'Resume Manager',
    headline: 'Manage Every Resume Without The Confusion.',
    desc: 'Store every version of your resume in one organised workspace. Never search through folders named Resume_Final_v8.pdf again.',
    benefits: ['Multiple Resume Versions', 'Easy Upload', 'Quick Download', 'Version History', 'Clean Organisation'],
    color: 'bg-violet-50',
    iconColor: 'text-violet-600',
    accent: '#6D5EF5',
  },
  {
    icon: Briefcase,
    title: 'Job Application Tracker',
    headline: 'Track Every Application From One Dashboard.',
    desc: 'Never lose track of where you\'ve applied. Monitor every application from submission to offer with clear status stages.',
    benefits: ['Centralised Tracking', 'Easy Filtering', 'Status Timeline', 'Search & Sort', 'Application History'],
    color: 'bg-blue-50',
    iconColor: 'text-blue-600',
    accent: '#3B82F6',
  },
  {
    icon: Calendar,
    title: 'Interview Tracker',
    headline: 'Never Miss Another Interview.',
    desc: 'Manage every interview with reminders, notes and progress tracking all in one timeline view.',
    benefits: ['Interview Timeline', 'Upcoming Reminders', 'Notes & Prep', 'Preparation Status', 'Follow-Up Tracking'],
    color: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    accent: '#10B981',
  },
  {
    icon: Bell,
    title: 'Reminder System',
    headline: 'Stay Ahead Of Every Deadline.',
    desc: 'Receive reminders before interviews, application deadlines and follow-up dates so nothing slips through.',
    benefits: ['Deadline Tracking', 'Daily Overview', 'Smart Reminders', 'Priority Alerts', 'Status Tracking'],
    color: 'bg-amber-50',
    iconColor: 'text-amber-600',
    accent: '#F59E0B',
  },
  {
    icon: TrendingUp,
    title: 'Career Analytics',
    headline: 'Measure Your Career Progress.',
    desc: 'Visualise your entire job search with meaningful insights. Understand what is working and where to improve.',
    benefits: ['Progress Tracking', 'Motivation Charts', 'Performance Visibility', 'Conversion Rates', 'Better Decisions'],
    color: 'bg-rose-50',
    iconColor: 'text-rose-600',
    accent: '#F43F5E',
  },
];

const HOW_IT_WORKS = [
  { step: 1, icon: UserPlus, title: 'Create Your Free Account', desc: 'Register securely via Clerk Authentication. Complete your profile in under 2 minutes.', time: '< 2 mins' },
  { step: 2, icon: FileText, title: 'Upload Your Resume', desc: 'Upload and organise different resume versions in one secure and accessible place.', time: '1 min' },
  { step: 3, icon: Briefcase, title: 'Track Applications', desc: 'Add every job application and monitor its progress from Applied all the way to Offer.', time: 'Ongoing' },
  { step: 4, icon: Calendar, title: 'Manage Interviews', desc: 'Schedule interviews, add preparation notes and never miss important interview dates.', time: 'Ongoing' },
  { step: 5, icon: Award, title: 'Get Hired', desc: 'Stay organised and focus on preparing for interviews instead of managing spreadsheets.', time: 'Goal' },
];

const WHY_CAREEROS = [
  { icon: Zap, title: 'Everything In One Place', desc: 'Manage resumes, interviews, reminders and applications without switching between multiple apps.', color: 'text-violet-600', bg: 'bg-violet-50' },
  { icon: Target, title: 'Designed For Students', desc: 'CareerOS is built specifically for students and early-career professionals entering the workforce.', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: CheckCircle, title: 'Simple & Fast', desc: 'Minimal interface with zero unnecessary complexity. Get started in under 2 minutes.', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: Shield, title: 'Secure & Private', desc: 'Your data is protected using modern authentication and secure cloud infrastructure.', color: 'text-amber-600', bg: 'bg-amber-50' },
  { icon: Star, title: 'Always Organised', desc: 'Know exactly where every application stands at any point in your job search journey.', color: 'text-rose-600', bg: 'bg-rose-50' },
  { icon: TrendingUp, title: 'Built To Grow', desc: 'CareerOS will continue evolving with powerful AI-driven career tools after the MVP launch.', color: 'text-indigo-600', bg: 'bg-indigo-50' },
];

const FAQS = [
  { q: 'Is CareerOS free?', a: 'Yes. The MVP is completely free. No credit card required. Get started in under 2 minutes.' },
  { q: 'Can I upload multiple resumes?', a: 'Yes. You can organise multiple resume versions in your personal Resume Library and set a default for quick access.' },
  { q: 'Does CareerOS help me find jobs?', a: 'No. CareerOS helps you organise your job search. It is a career workspace, not a job portal. You bring the applications; CareerOS keeps them organised.' },
  { q: 'Can I access CareerOS on mobile?', a: 'Yes. CareerOS is fully responsive and works across desktop, tablet and mobile devices.' },
  { q: 'Is my data secure?', a: 'Yes. CareerOS uses Clerk Authentication for secure login, Prisma ORM and Supabase PostgreSQL for encrypted data storage.' },
  { q: 'Do I need to install anything?', a: 'No. CareerOS runs entirely in your browser. No installation, no downloads, no setup required.' },
];

const ASPIRATION_COMPANIES = ['Google', 'Microsoft', 'Amazon', 'Flipkart', 'TCS', 'Infosys', 'Accenture', 'Wipro'];

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      {/* ── NAVIGATION ─────────────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          navScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow">
              <span className="text-white font-black text-sm">C</span>
            </div>
            <span className="font-black text-gray-900 text-lg tracking-tight">CareerOS</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/sign-in"
              className="text-sm font-semibold text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-lg transition"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl transition shadow-md shadow-violet-200"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-gray-700 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg px-4 py-6 space-y-4">
            {NAV_LINKS.map(link => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="block w-full text-left text-sm font-semibold text-gray-700 hover:text-violet-600 py-2 transition"
              >
                {link.label}
              </button>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
              <Link href="/sign-in" className="text-sm font-semibold text-gray-700 text-center py-2 border border-gray-200 rounded-xl">Sign In</Link>
              <Link href="/sign-up" className="text-sm font-semibold bg-violet-600 text-white text-center py-2.5 rounded-xl">Get Started Free →</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-gradient-to-b from-violet-50/60 via-white to-white">
        {/* Background decorative blurs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Copy */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 border border-violet-200 px-4 py-1.5 text-xs font-bold text-violet-700 uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
              Free Forever During MVP
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] tracking-tight">
              Organise Your{' '}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Entire Job Search
              </span>{' '}
              In One Place.
            </h1>

            <p className="text-lg text-gray-500 max-w-lg leading-relaxed">
              CareerOS helps students manage resumes, job applications, interviews, reminders and career progress from one organised workspace.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold px-6 py-3.5 text-base transition shadow-lg shadow-violet-200 hover:-translate-y-0.5 duration-200"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold px-6 py-3.5 text-base transition hover:-translate-y-0.5 duration-200"
              >
                Sign In
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                Free Forever (MVP)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                No Credit Card Required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                Setup in Under 2 Minutes
              </span>
            </div>
          </div>

          {/* Right: Dashboard Mockup */}
          <div className="relative">
            {/* Main Dashboard card */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/60 overflow-hidden">
              {/* Top bar */}
              <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-amber-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <div className="ml-4 flex-1 h-5 bg-gray-200 rounded-full max-w-xs" />
              </div>

              <div className="p-5 space-y-4">
                {/* Welcome Header */}
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Good Morning</p>
                  <h2 className="text-xl font-black text-gray-900 mt-0.5">Your Career Command Center</h2>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Applications', value: '24', color: 'bg-violet-100 text-violet-700' },
                    { label: 'Interviews', value: '6', color: 'bg-blue-100 text-blue-700' },
                    { label: 'Reminders', value: '3', color: 'bg-amber-100 text-amber-700' },
                  ].map(stat => (
                    <div key={stat.label} className={`rounded-xl ${stat.color} p-3 text-center`}>
                      <div className="text-2xl font-black">{stat.value}</div>
                      <div className="text-xs font-semibold mt-0.5 opacity-75">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Applications List */}
                <div className="space-y-2">
                  {[
                    { company: 'Google', role: 'Frontend Intern', stage: 'Interview', stageColor: 'bg-purple-100 text-purple-700' },
                    { company: 'Microsoft', role: 'SWE Intern', stage: 'Applied', stageColor: 'bg-blue-100 text-blue-700' },
                    { company: 'Flipkart', role: 'Backend Dev', stage: 'Assessment', stageColor: 'bg-amber-100 text-amber-700' },
                  ].map(app => (
                    <div key={app.company} className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 hover:border-gray-200 transition">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xs font-black">
                          {app.company[0]}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{app.company}</div>
                          <div className="text-xs text-gray-400">{app.role}</div>
                        </div>
                      </div>
                      <span className={`text-xs font-bold rounded-full px-2.5 py-0.5 ${app.stageColor}`}>{app.stage}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-5 -right-6 bg-white rounded-xl border border-gray-200 shadow-lg p-3 flex items-center gap-2.5 text-xs font-bold animate-bounce-slow">
              <div className="h-7 w-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <div className="text-gray-900">Resume Uploaded</div>
                <div className="text-gray-400 font-normal">2 min ago</div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-6 bg-white rounded-xl border border-gray-200 shadow-lg p-3 flex items-center gap-2.5 text-xs font-bold">
              <div className="h-7 w-7 rounded-lg bg-violet-100 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-violet-600" />
              </div>
              <div>
                <div className="text-gray-900">Interview Tomorrow</div>
                <div className="text-gray-400 font-normal">Google · 10:00 AM</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── TRUSTED BY ─────────────────────────────────────────────────── */}
      <section className="py-14 border-y border-gray-100 bg-gray-50/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">Trusted by students preparing for careers at</p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {ASPIRATION_COMPANIES.map(company => (
              <span key={company} className="text-sm font-bold text-gray-400 hover:text-gray-700 transition">{company}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM ────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-4">
              Stop Managing Your Job Search<br />Across Five Different Apps.
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Most students use spreadsheets for applications, Google Drive for resumes, Calendar for interviews, Notes for reminders, and email for offer letters. This creates confusion, missed deadlines and unnecessary stress.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROBLEMS.map((problem, i) => (
              <div
                key={problem.title}
                className={`rounded-2xl border ${problem.border} ${problem.bg} p-6 hover:-translate-y-1 transition duration-250`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm mb-4`}>
                  <problem.icon className={`h-5 w-5 ${problem.color}`} />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-2">{problem.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{problem.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTION ───────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-b from-violet-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: benefits */}
            <div className="space-y-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-violet-600 mb-3">The Solution</p>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-4">
                  Everything You Need.<br />One Dashboard.
                </h2>
                <p className="text-gray-500 text-lg leading-relaxed">
                  CareerOS brings resumes, applications, interviews, reminders and analytics together into one organised workspace designed specifically for students and job seekers.
                </p>
              </div>

              <ul className="space-y-3">
                {['Manage every application', 'Store every resume version', 'Never miss interviews', 'Track your career progress', 'Stay organised and focused'].map(benefit => (
                  <li key={benefit} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-violet-600 shrink-0" />
                    <span className="font-semibold text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold px-6 py-3.5 text-base transition shadow-lg shadow-violet-200 hover:-translate-y-0.5 duration-200"
              >
                Start Free Today
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Right: visual */}
            <div className="rounded-2xl border border-violet-100 bg-white shadow-xl p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center">
                  <span className="text-white text-xs font-black">C</span>
                </div>
                <div>
                  <div className="font-black text-gray-900 text-sm">CareerOS Dashboard</div>
                  <div className="text-xs text-gray-400">Career Workspace</div>
                </div>
              </div>
              {[
                { icon: FileText, label: 'Resume Library', value: '3 Versions', color: 'bg-violet-100 text-violet-600' },
                { icon: Briefcase, label: 'Applications', value: '24 Tracked', color: 'bg-blue-100 text-blue-600' },
                { icon: Calendar, label: 'Upcoming Interviews', value: '2 Scheduled', color: 'bg-emerald-100 text-emerald-600' },
                { icon: Bell, label: 'Reminders', value: '3 Due Today', color: 'bg-amber-100 text-amber-600' },
                { icon: TrendingUp, label: 'Success Rate', value: '28% Interview Rate', color: 'bg-rose-100 text-rose-600' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg ${item.color} flex items-center justify-center`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-24">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-wider text-violet-600 mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-4">Meet Your Career Workspace.</h2>
            <p className="text-gray-500 text-lg">One dashboard designed to organise every stage of your job search.</p>
          </div>

          {FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
            >
              {/* Content */}
              <div className={i % 2 !== 0 ? 'lg:order-2' : ''}>
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${feature.color} mb-5`}>
                  <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-4">{feature.headline}</h3>
                <p className="text-gray-500 leading-relaxed mb-6">{feature.desc}</p>
                <ul className="space-y-2.5 mb-8">
                  {feature.benefits.map(b => (
                    <li key={b} className="flex items-center gap-2.5 text-sm font-semibold text-gray-700">
                      <CheckCircle className="h-4 w-4 shrink-0" style={{ color: feature.accent }} />
                      {b}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-1.5 text-sm font-bold transition hover:-translate-y-0.5 duration-200"
                  style={{ color: feature.accent }}
                >
                  Explore CareerOS <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Visual Card */}
              <div className={`rounded-2xl border border-gray-100 bg-gray-50 p-6 shadow-lg hover:-translate-y-1 hover:shadow-xl transition duration-300 ${i % 2 !== 0 ? 'lg:order-1' : ''}`}>
                <div className="flex items-center gap-2.5 mb-5">
                  <div className={`h-8 w-8 rounded-lg ${feature.color} flex items-center justify-center`}>
                    <feature.icon className={`h-4 w-4 ${feature.iconColor}`} />
                  </div>
                  <span className="text-sm font-bold text-gray-900">{feature.title}</span>
                </div>
                <div className="space-y-2">
                  {feature.benefits.map((b, bi) => (
                    <div key={b} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-gray-100 text-xs font-semibold text-gray-700">
                      <div className="h-4 w-4 rounded-full flex items-center justify-center" style={{ backgroundColor: `${feature.accent}15` }}>
                        <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: feature.accent }} />
                      </div>
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-bold uppercase tracking-wider text-violet-600 mb-3">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-4">Your Career Journey Starts In Minutes.</h2>
            <p className="text-gray-500 text-lg">No spreadsheets. No sticky notes. No confusion.</p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Connector Line - desktop */}
            <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-violet-200 via-indigo-200 to-violet-200" />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-4">
              {HOW_IT_WORKS.map((step, i) => (
                <div key={step.step} className="relative flex flex-col items-center text-center">
                  {/* Vertical connector for mobile */}
                  {i < HOW_IT_WORKS.length - 1 && (
                    <div className="lg:hidden absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-8 bg-violet-200" />
                  )}

                  <div className="relative z-10 h-14 w-14 rounded-2xl bg-white border-2 border-violet-200 flex items-center justify-center shadow-md mb-4">
                    <step.icon className="h-6 w-6 text-violet-600" />
                    <div className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-violet-600 flex items-center justify-center">
                      <span className="text-white text-[10px] font-black">{step.step}</span>
                    </div>
                  </div>

                  <h4 className="text-sm font-black text-gray-900 mb-1.5">{step.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed mb-2">{step.desc}</p>
                  <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-100">
                    {step.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-16">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold px-8 py-4 text-base transition shadow-lg shadow-violet-200 hover:-translate-y-0.5 duration-200"
            >
              Create Free Account <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY CAREEROS ───────────────────────────────────────────────── */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-bold uppercase tracking-wider text-violet-600 mb-3">Why CareerOS</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-4">Why Students Choose CareerOS</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_CAREEROS.map(item => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 hover:-translate-y-1 hover:shadow-lg transition duration-250"
              >
                <div className={`h-11 w-11 rounded-xl ${item.bg} flex items-center justify-center mb-4`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS PLACEHOLDER ────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-br from-violet-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-violet-600 mb-4">Student Stories</p>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-4">
            Be Among The First Students To Build<br className="hidden sm:block" />Their Career With CareerOS.
          </h2>
          <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">
            We're currently helping early users organise their careers more effectively. Real student stories will appear here after launch.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {['Organised', 'Focused', 'Hired'].map(word => (
              <div key={word} className="rounded-2xl bg-white border border-white/80 p-5 shadow-sm text-center">
                <div className="text-2xl font-black text-gray-900 mb-1">{word}</div>
                <div className="text-xs text-gray-400">What CareerOS helps you become</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-bold uppercase tracking-wider text-violet-600 mb-3">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-4">Simple. Transparent. Free.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="rounded-2xl border-2 border-violet-200 bg-white p-8 relative">
              <div className="absolute -top-3 left-6 bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full">Current Plan</div>
              <h3 className="text-xl font-black text-gray-900 mb-1">CareerOS Free</h3>
              <div className="text-4xl font-black text-violet-600 mb-1">₹0</div>
              <p className="text-sm text-gray-500 mb-6">Forever free during MVP</p>
              <ul className="space-y-3 mb-8 text-sm">
                {['Dashboard', 'Resume Manager', 'Job Application Tracker', 'Interview Tracker', 'Reminder System', 'Analytics', 'Notifications'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 font-semibold text-gray-700">
                    <CheckCircle className="h-4 w-4 text-violet-600 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className="block w-full text-center rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 transition"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan - Coming Soon */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 relative opacity-75">
              <div className="absolute -top-3 left-6 bg-gray-500 text-white text-xs font-bold px-3 py-1 rounded-full">Coming Soon</div>
              <h3 className="text-xl font-black text-gray-900 mb-1">CareerOS Pro</h3>
              <div className="text-4xl font-black text-gray-400 mb-1">TBD</div>
              <p className="text-sm text-gray-400 mb-6">Launching after MVP</p>
              <ul className="space-y-3 mb-8 text-sm">
                {['Everything in Free', 'Advanced Analytics', 'AI Career Assistant', 'AI Resume Review', 'AI Interview Coach', 'Priority Support'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 font-semibold text-gray-400">
                    <CheckCircle className="h-4 w-4 text-gray-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button disabled className="block w-full text-center rounded-xl bg-gray-200 text-gray-500 font-bold py-3 cursor-not-allowed">
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-wider text-violet-600 mb-3">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 bg-white overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-bold text-gray-900 text-sm">{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 shrink-0 ml-4 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-700 p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">
                Start Organising Your Career Today.
              </h2>
              <p className="text-violet-200 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                Everything you need to manage resumes, applications, interviews and reminders—all in one place.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white hover:bg-gray-50 text-violet-700 font-bold px-8 py-4 text-base transition shadow-lg hover:-translate-y-0.5 duration-200"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => scrollTo('#features')}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/30 text-white hover:bg-white/10 font-bold px-8 py-4 text-base transition hover:-translate-y-0.5 duration-200"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Column 1: Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center">
                  <span className="text-white font-black text-sm">C</span>
                </div>
                <span className="font-black text-white text-lg">CareerOS</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Your personal career operating system. Organised, focused, hired.
              </p>
            </div>

            {/* Column 2: Product */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                {['Features', 'Pricing', 'FAQ', 'Roadmap (Coming Soon)'].map(item => (
                  <li key={item}>
                    <button onClick={() => scrollTo('#features')} className="text-gray-400 hover:text-white transition">
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Company */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                {['About', 'Contact', 'Privacy Policy', 'Terms & Conditions'].map(item => (
                  <li key={item}>
                    <span className="text-gray-400 hover:text-white transition cursor-pointer">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Support */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Support</h4>
              <ul className="space-y-3 text-sm">
                {['Help Center (Coming Soon)', 'Email Support', 'Feedback'].map(item => (
                  <li key={item}>
                    <span className="text-gray-400 hover:text-white transition cursor-pointer">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
            <span>© 2026 CareerOS. All rights reserved.</span>
            <span>Built with ❤️ for students and job seekers.</span>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
