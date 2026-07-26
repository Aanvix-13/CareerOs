'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  KanbanSquare,
  FileText,
  CalendarRange,
  CheckSquare,
  TrendingUp,
  MessageSquare,
  User,
  LogOut,
  Bell,
  Menu,
  X,
  Briefcase,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import useAuthStore from '../../hooks/useAuthStore';
import useNotificationStore from '../../hooks/useNotificationStore';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Applications', href: '/applications', icon: KanbanSquare },
  { name: 'Resumes', href: '/resumes', icon: FileText },
  { name: 'Interviews', href: '/interviews', icon: CalendarRange },
  { name: 'Reminders', href: '/reminders', icon: CheckSquare },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  { name: 'Feedback', href: '/feedback', icon: MessageSquare },
  { name: 'Profile', href: '/profile', icon: User },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { profile, checkSession, isAuthenticated, logout, isLoading } = useAuthStore();
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead, deleteNotification } = useNotificationStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Verify auth session
  useEffect(() => {
    const initSession = async () => {
      await checkSession();
      setSessionChecked(true);
    };
    initSession();
  }, [checkSession]);

  // Redirect if not authenticated after check
  useEffect(() => {
    if (sessionChecked && !isAuthenticated) {
      router.replace('/login');
    }
  }, [sessionChecked, isAuthenticated, router]);

  // Fetch notifications on session load
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications({ limit: 10 });
      // Poll notifications every 60 seconds
      const interval = setInterval(() => {
        fetchNotifications({ limit: 10 });
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchNotifications]);

  if (!sessionChecked || (!isAuthenticated && !profile)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-zinc-400 text-sm">Verifying session...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
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
            CareerOS
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
            <span className="font-bold text-lg">CareerOS</span>
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

          {/* Quick Stats Search or Banner */}
          <div className="hidden sm:block text-sm text-zinc-400 font-medium">
            Welcome back, <span className="text-white font-semibold">{profile?.fullName}</span>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* Notifications Popover */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition duration-150 cursor-pointer"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl p-4 z-50">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
                    <span className="font-semibold text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAllAsRead()}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 text-xs text-zinc-500">
                        No new notifications
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-3 rounded-lg border text-xs transition duration-150 ${
                            notif.status === 'Unread'
                              ? 'bg-indigo-950/20 border-indigo-500/20 text-zinc-200'
                              : 'bg-zinc-950/20 border-zinc-800/80 text-zinc-400'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <span className="font-semibold">{notif.title}</span>
                            <div className="flex gap-2">
                              {notif.status === 'Unread' && (
                                <button
                                  onClick={() => markAsRead(notif.id)}
                                  className="text-[10px] text-indigo-400 hover:text-indigo-300"
                                >
                                  Read
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notif.id)}
                                className="text-[10px] text-rose-500 hover:text-rose-400"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          <p>{notif.message}</p>
                          <span className="text-[9px] text-zinc-500 block mt-1">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

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
                    href="/profile"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition duration-150"
                  >
                    <User className="h-4 w-4" />
                    My Profile
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
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
