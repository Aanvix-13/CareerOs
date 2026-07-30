'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import {
  User,
  Phone,
  GraduationCap,
  Briefcase,
  MapPin,
  FileText,
  Upload,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Award,
} from 'lucide-react';
import useAuthStore from '../../../hooks/useAuthStore';
import useResumeStore from '../../../hooks/useResumeStore';
import { useUser } from '@clerk/nextjs';

export default function ProfilePage() {
  const { user: clerkUser } = useUser();
  const { profile, updateProfile, error, checkSession } = useAuthStore();
  const { resumes, fetchResumes } = useResumeStore();

  const displayName = clerkUser?.firstName || clerkUser?.username || clerkUser?.fullName || profile?.fullName || 'User';
  
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const { register, handleSubmit, setValue } = useForm();

  // Populate values when profile loads
  useEffect(() => {
    fetchResumes();
    if (profile) {
      setValue('fullName', profile.fullName);
      setValue('phone', profile.phone || '');
      setValue('college', profile.college || '');
      setValue('degree', profile.degree || '');
      setValue('specialization', profile.specialization || '');
      setValue('graduationYear', profile.graduationYear || '');
      setValue('preferredRole', profile.preferredRole || '');
      setValue('preferredLocation', profile.preferredLocation || '');
      setValue('bio', profile.bio || '');
    }
  }, [profile, setValue, fetchResumes]);

  const onSubmit = async (formData: any) => {
    setSuccess(false);
    setLocalError(null);
    setSaving(true);

    try {
      const data = new FormData();
      data.append('fullName', formData.fullName);
      data.append('phone', formData.phone || '');
      data.append('college', formData.college || '');
      data.append('degree', formData.degree || '');
      data.append('specialization', formData.specialization || '');
      if (formData.graduationYear) data.append('graduationYear', formData.graduationYear);
      data.append('preferredRole', formData.preferredRole || '');
      data.append('preferredLocation', formData.preferredLocation || '');
      data.append('bio', formData.bio || '');

      // Check if image file is uploaded
      const fileList = formData.file;
      if (fileList && fileList.length > 0) {
        const file = fileList[0];
        if (!file.type.startsWith('image/')) {
          throw new Error('Only image files are allowed for profile pictures.');
        }
        if (file.size > 2 * 1024 * 1024) {
          throw new Error('File size cannot exceed 2MB.');
        }
        data.append('file', file);
      }

      await updateProfile(data, true);
      setSuccess(true);
      await checkSession(); // Reload session details
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setLocalError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  // 5. Dynamic Profile Completion Calculations
  const hasResume = resumes.length > 0;
  const hasEducation = !!(profile?.college && profile?.degree);
  const hasSkills = !!profile?.preferredRole;
  const hasLinkedIn = !!profile?.bio;
  const hasPortfolio = !!profile?.specialization;

  let completionPercent = 0;
  if (profile?.fullName) completionPercent += 20; // Name is initial
  if (hasEducation) completionPercent += 20;
  if (hasSkills) completionPercent += 20;
  if (hasLinkedIn) completionPercent += 20;
  if (hasPortfolio) completionPercent += 20;
  if (hasResume) completionPercent += 20;
  // Cap at 100%
  completionPercent = Math.min(completionPercent, 100);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Profile Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage target roles, college credentials, and preferences.</p>
      </div>

      {(error || localError) && (
        <div className="rounded-xl bg-rose-600/10 border border-rose-600/20 p-4 text-sm text-rose-600 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>{localError || error}</span>
        </div>
      )}

      {success && (
        <div className="rounded-xl bg-emerald-600/10 border border-emerald-600/20 p-4 text-sm text-emerald-600 flex items-center gap-3 glow-emerald">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>Profile changes saved successfully.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Profile Completion Widget */}
        <div className="md:col-span-1 space-y-6">
          {/* Avatar details */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 border border-gray-200 flex flex-col items-center text-center space-y-4">
            <div className="relative h-28 w-28 rounded-full bg-indigo-600 flex items-center justify-center text-3xl font-bold text-gray-900 overflow-hidden border border-gray-200">
              {profile?.profileImageUrl ? (
                <img src={profile.profileImageUrl} alt="profile" className="h-full w-full object-cover" />
              ) : (
                displayName.charAt(0).toUpperCase()
              )}
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-gray-900 text-base">{displayName}</h3>
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{profile?.preferredRole || 'General Target'}</span>
            </div>

            <div className="w-full pt-4 border-t border-gray-100">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Upload Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                {...register('file')}
                className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-gray-100 file:text-gray-700 file:hover:bg-gray-200 cursor-pointer"
              />
            </div>
          </div>

          {/* 5. Profile Completion Card widget */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 border border-gray-200 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-indigo-600" />
                Profile Completion
              </h4>
              <span className="text-xs font-extrabold text-indigo-600">{completionPercent}%</span>
            </div>
            
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 rounded-full transition-all duration-550" 
                style={{ width: `${completionPercent}%` }} 
              />
            </div>

            <ul className="text-xs space-y-2.5 pt-3 border-t border-gray-100">
              <li className="flex items-center justify-between">
                <span className="text-zinc-450">Upload Resume</span>
                {hasResume ? (
                  <span className="text-emerald-600 font-semibold">✓ Complete</span>
                ) : (
                  <Link href="/app/resumes" className="text-indigo-600 hover:underline">Pending &rarr;</Link>
                )}
              </li>
              <li className="flex items-center justify-between">
                <span className="text-zinc-450">Complete Education</span>
                {hasEducation ? (
                  <span className="text-emerald-600 font-semibold">✓ Complete</span>
                ) : (
                  <span className="text-gray-400 italic">Add credentials</span>
                )}
              </li>
              <li className="flex items-center justify-between">
                <span className="text-zinc-450">Add Skills</span>
                {hasSkills ? (
                  <span className="text-emerald-600 font-semibold">✓ Complete</span>
                ) : (
                  <span className="text-gray-400 italic">Add target role</span>
                )}
              </li>
              <li className="flex items-center justify-between">
                <span className="text-zinc-450">Add LinkedIn</span>
                {hasLinkedIn ? (
                  <span className="text-emerald-600 font-semibold">✓ Complete</span>
                ) : (
                  <span className="text-gray-400 italic">Write bio/summary</span>
                )}
              </li>
              <li className="flex items-center justify-between">
                <span className="text-zinc-450">Add Portfolio</span>
                {hasPortfolio ? (
                  <span className="text-emerald-600 font-semibold">✓ Complete</span>
                ) : (
                  <span className="text-gray-400 italic">Add specialization</span>
                )}
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Profile Form Details */}
        <form onSubmit={handleSubmit(onSubmit)} className="md:col-span-2 bg-white shadow-sm border border-gray-200 rounded-2xl p-6 border border-gray-200 space-y-6 text-sm">
          <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-2">Personal Credentials</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
              <input
                type="text"
                required
                {...register('fullName', { required: true })}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:border-indigo-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone Number</label>
              <input
                type="text"
                {...register('phone')}
                placeholder="+91 XXXXXXXXXX"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-indigo-600 focus:outline-none"
              />
            </div>
          </div>

          <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-2 pt-2">College Credentials</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">College Name</label>
              <input
                type="text"
                {...register('college')}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-indigo-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Degree</label>
              <input
                type="text"
                {...register('degree')}
                placeholder="e.g. B.Tech"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:border-indigo-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Specialization</label>
              <input
                type="text"
                {...register('specialization')}
                placeholder="e.g. Computer Science"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-indigo-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Graduation Year</label>
              <input
                type="number"
                {...register('graduationYear')}
                placeholder="e.g. 2026"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-indigo-600 focus:outline-none"
              />
            </div>
          </div>

          <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-2 pt-2">Career Preferences</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Preferred Target Role</label>
              <input
                type="text"
                {...register('preferredRole')}
                placeholder="e.g. Frontend developer"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-indigo-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Preferred Location</label>
              <input
                type="text"
                {...register('preferredLocation')}
                placeholder="e.g. Remote, Bangalore"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-indigo-600 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 font-bold">Bio / Profile Summary (Acts as LinkedIn Bio)</label>
              <textarea
                rows={3}
                {...register('bio')}
                placeholder="Brief summary introducing yourself..."
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:border-indigo-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 font-semibold">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-600 text-gray-900 flex items-center gap-2 shadow-lg glow-indigo disabled:opacity-50 cursor-pointer text-xs"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
