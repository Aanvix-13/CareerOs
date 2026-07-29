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
import { useClerk } from '@clerk/nextjs';

const navigation = [
  { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
  { name: 'Applications', href: '/app/applications', icon: KanbanSquare },
  { name: 'Resumes', href: '/app/resumes', icon: FileText },
  { name: 'Interviews', href: '/app/interviews', icon: CalendarRange },
  { name: 'Reminders', href: '/app/reminders', icon: CheckSquare },
  { name: 'Analytics', href: '/app/analytics', icon: TrendingUp },
  { name: 'Feedback', href: '/app/feedback', icon: MessageSquare },
  { name: 'Profile', href: '/app/profile', icon: User },
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
  const { signOut } = useClerk();

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
      router.replace('/sign-in');
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
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#6D5EF5]" />
          <p className="text-[#6B7280] text-sm font-semibold font-[--font-sans]">Verifying session...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut();
    await logout();
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111827] flex flex-col md:flex-row relative font-[--font-sans]">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#E5E7EB] p-6 shrink-0 h-screen sticky top-0">
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#6D5EF5] shadow-[0_4px_12px_rgba(109,94,245,0.2)]">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <span className="font-black text-xl tracking-tight text-[#111827]">
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
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition duration-200 ${
                  isActive
                    ? 'bg-[#F3F1FF] text-[#6D5EF5]'
                    : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F8FAFC]'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-[#F1F5F9] pt-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-bold text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEF2F2] transition duration-200 cursor-pointer"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Navigation Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Drawer Navigation Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-white z-50 p-6 border-r border-[#E5E7EB] transform transition-transform duration-300 md:hidden flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6D5EF5]">
              <Briefcase className="h-4 w-4 text-white" />
            </div>
            <span className="font-black text-lg tracking-tight text-[#111827]">CareerOS</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="text-[#6B7280] hover:text-[#111827]">
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
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition duration-200 ${
                  isActive
                    ? 'bg-[#F3F1FF] text-[#6D5EF5]'
                    : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F8FAFC]'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-[#F1F5F9] pt-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-bold text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEF2F2] cursor-pointer"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#E5E7EB] px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-[#4B5563] hover:text-[#111827] cursor-pointer"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Welcome Text */}
          <div className="hidden sm:block text-sm text-[#4B5563] font-semibold">
            Welcome back, <span className="text-[#111827] font-extrabold">{profile?.fullName}</span>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* Notifications Popover */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-xl bg-white border border-[#E5E7EB] hover:bg-[#F8FAFC] text-[#4B5563] hover:text-[#111827] transition duration-200 cursor-pointer"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#EF4444] text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-[20px] bg-white border border-[#E5E7EB] shadow-[0_8px_24px_rgba(15,23,42,0.08)] p-4 z-50">
                  <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-2 mb-3">
                    <span className="font-bold text-sm text-[#111827]">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => markAllAsRead()}
                        className="text-xs text-[#6D5EF5] hover:text-[#5B4BE6] font-bold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 text-xs text-[#6B7280]">
                        No new notifications
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-3 rounded-xl border text-xs transition duration-200 ${
                            notif.status === 'Unread'
                              ? 'bg-[#F3F1FF] border-[#6D5EF5]/20 text-[#111827]'
                              : 'bg-white border-[#E5E7EB] text-[#4B5563]'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <span className="font-bold">{notif.title}</span>
                            <div className="flex gap-2">
                              {notif.status === 'Unread' && (
                                <button
                                  onClick={() => markAsRead(notif.id)}
                                  className="text-[10px] text-[#6D5EF5] font-bold"
                                >
                                  Read
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notif.id)}
                                className="text-[10px] text-[#EF4444] font-bold"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          <p className="text-[#4B5563]">{notif.message}</p>
                          <span className="text-[9px] text-[#6B7280] block mt-1">
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
                className="flex items-center gap-2 p-1 pr-3 rounded-full bg-white border border-[#E5E7EB] hover:bg-[#F8FAFC] transition duration-200 cursor-pointer"
              >
                <div className="h-8 w-8 rounded-full bg-[#F3F1FF] text-[#6D5EF5] flex items-center justify-center text-sm font-bold overflow-hidden border border-[#E5E7EB]">
                  {profile?.profileImageUrl ? (
                    <img src={profile.profileImageUrl} alt="avatar" className="h-full w-full object-cover" />
                  ) : (
                    profile?.fullName.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="hidden sm:inline text-xs font-bold text-[#4B5563]">
                  {profile?.fullName.split(' ')[0]}
                </span>
                <ChevronDown className="h-3 w-3 text-[#6B7280] hidden sm:block" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-[16px] bg-white border border-[#E5E7EB] shadow-[0_8px_24px_rgba(15,23,42,0.08)] p-2 z-50">
                  <Link
                    href="/app/profile"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#4B5563] hover:text-[#111827] hover:bg-[#F8FAFC] transition duration-200 font-bold"
                  >
                    <User className="h-4 w-4" />
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-[#EF4444] hover:bg-[#FEF2F2] transition duration-200 text-left cursor-pointer font-bold"
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#E5E7EB] flex justify-around items-center px-2 z-30 shadow-lg">
        {navigation.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full text-[10px] font-bold transition duration-200 ${
                isActive ? 'text-[#6D5EF5]' : 'text-[#6B7280]'
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
