'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Bell,
  Settings,
  User,
  LogOut,
  Loader2,
  ChevronDown,
  Menu,
  X,
  Briefcase,
  TrendingUp,
} from 'lucide-react';
import useAuthStore from '../../hooks/useAuthStore';
import { useClerk } from '@clerk/nextjs';

const navigation = [
  { name: 'Admin Dashboard', href: '/admin_careeros', icon: LayoutDashboard },
  { name: 'User Directory', href: '/admin_careeros/users', icon: Users },
  { name: 'User Feedback', href: '/admin_careeros/feedback', icon: MessageSquare },
  { name: 'Announcements', href: '/admin_careeros/notifications', icon: Bell },
  { name: 'Platform Analytics', href: '/admin_careeros/analytics', icon: TrendingUp },
  { name: 'System Settings', href: '/admin_careeros/settings', icon: Settings },
  { name: 'Admin Profile', href: '/admin_careeros/profile', icon: User },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, checkSession, isAuthenticated, logout } = useAuthStore();
  const { signOut } = useClerk();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Verify auth session and admin role
  useEffect(() => {
    const initSession = async () => {
      await checkSession();
      setSessionChecked(true);
    };
    initSession();
  }, [checkSession]);

  // Redirect if not admin
  useEffect(() => {
    if (sessionChecked) {
      if (!isAuthenticated || user?.role !== 'admin') {
        router.replace('/app/dashboard');
      }
    }
  }, [sessionChecked, isAuthenticated, user, router]);

  if (!sessionChecked || !isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-zinc-400 text-sm">Verifying administrator credentials...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut();
    await logout();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row relative">
      {/* Background radial glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-indigo-950/10 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-violet-950/10 blur-[120px] pointer-events-none -z-10" />

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-zinc-900/50 backdrop-blur-md border-r border-zinc-800/80 p-6 shrink-0 h-screen sticky top-0">
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 glow-indigo">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Admin Panel
          </span>
        </div>

        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition duration-150 ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50 border border-transparent'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-zinc-800/80 pt-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-rose-400 hover:bg-rose-950/10 border border-transparent hover:border-rose-500/10 transition duration-150 cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Navigation Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Drawer Navigation Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-zinc-900/95 z-50 p-6 border-r border-zinc-800 transform transition-transform duration-300 md:hidden flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <Briefcase className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg">Admin Panel</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="text-zinc-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition duration-150 ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-zinc-800 pt-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-rose-400 hover:bg-rose-950/10 cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-zinc-900/20 backdrop-blur-md border-b border-zinc-800/60 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-zinc-400 hover:text-white cursor-pointer"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="hidden sm:block text-sm text-zinc-400 font-medium">
            System Administrator: <span className="text-white font-semibold">{profile?.fullName}</span>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 p-1 pr-3 rounded-full bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition duration-150 cursor-pointer"
              >
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-semibold text-white overflow-hidden">
                  {profile?.profileImageUrl ? (
                    <img src={profile.profileImageUrl} alt="avatar" className="h-full w-full object-cover" />
                  ) : (
                    profile?.fullName.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="hidden sm:inline text-xs font-semibold text-zinc-300">
                  {profile?.fullName.split(' ')[0]}
                </span>
                <ChevronDown className="h-3 w-3 text-zinc-500 hidden sm:block" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl p-2 z-50">
                  <Link
                    href="/admin_careeros/profile"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition duration-150"
                  >
                    <User className="h-4 w-4" />
                    Admin Profile
                  </Link>
                  <Link
                    href="/app/dashboard"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-indigo-400 hover:bg-indigo-950/15 transition duration-150"
                  >
                    <Briefcase className="h-4 w-4" />
                    User Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-rose-400 hover:bg-rose-950/10 transition duration-150 text-left cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-20 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-zinc-900 border-t border-zinc-800 flex justify-around items-center px-2 z-30 backdrop-blur-md bg-zinc-900/90">
        {navigation.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full text-[10px] font-medium transition duration-150 ${
                isActive ? 'text-indigo-400' : 'text-zinc-500'
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              {item.name.split(' ')[1]}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
