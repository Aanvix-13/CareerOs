'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
} from 'lucide-react';
import useAuthStore from '../../../hooks/useAuthStore';

export default function ProfilePage() {
  const { profile, updateProfile, error, checkSession } = useAuthStore();
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const { register, handleSubmit, setValue } = useForm();

  // Populate values when profile loads
  useEffect(() => {
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
  }, [profile, setValue]);

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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Profile Settings</h1>
        <p className="text-zinc-400 text-sm mt-1">Manage target roles, college credentials, and preferences.</p>
      </div>

      {(error || localError) && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-sm text-rose-400 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>{localError || error}</span>
        </div>
      )}

      {success && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm text-emerald-400 flex items-center gap-3 glow-emerald">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>Profile changes saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Quick Info */}
        <div className="md:col-span-1 glass-card rounded-2xl p-6 border border-zinc-800 flex flex-col items-center text-center space-y-4">
          <div className="relative h-28 w-28 rounded-full bg-indigo-600 flex items-center justify-center text-3xl font-bold text-white overflow-hidden border border-zinc-800">
            {profile?.profileImageUrl ? (
              <img src={profile.profileImageUrl} alt="profile" className="h-full w-full object-cover" />
            ) : (
              profile?.fullName.charAt(0).toUpperCase()
            )}
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-white text-base">{profile?.fullName}</h3>
            <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">{profile?.preferredRole || 'General Target'}</span>
          </div>

          <div className="w-full pt-4 border-t border-zinc-850">
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Upload Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              {...register('file')}
              className="w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-zinc-800 file:text-zinc-200 file:hover:bg-zinc-700 cursor-pointer"
            />
          </div>
        </div>

        {/* Right Column: Profile Form Details */}
        <div className="md:col-span-2 glass-card rounded-2xl p-6 border border-zinc-800 space-y-6 text-sm">
          <h3 className="font-bold text-base text-white border-b border-zinc-850 pb-2">Personal Credentials</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Full Name</label>
              <input
                type="text"
                required
                {...register('fullName', { required: true })}
                className="w-full px-3 py-2.5 rounded-lg border border-zinc-800 bg-zinc-950 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Phone Number</label>
              <input
                type="text"
                {...register('phone')}
                placeholder="+91 XXXXXXXXXX"
                className="w-full px-3 py-2.5 rounded-lg border border-zinc-800 bg-zinc-950 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <h3 className="font-bold text-base text-white border-b border-zinc-850 pb-2 pt-2">College Credentials</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">College Name</label>
              <input
                type="text"
                {...register('college')}
                className="w-full px-3 py-2.5 rounded-lg border border-zinc-800 bg-zinc-950 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Degree</label>
              <input
                type="text"
                {...register('degree')}
                placeholder="e.g. B.Tech"
                className="w-full px-3 py-2.5 rounded-lg border border-zinc-800 bg-zinc-950 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Specialization</label>
              <input
                type="text"
                {...register('specialization')}
                placeholder="e.g. Computer Science"
                className="w-full px-3 py-2.5 rounded-lg border border-zinc-800 bg-zinc-950 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Graduation Year</label>
              <input
                type="number"
                {...register('graduationYear')}
                placeholder="e.g. 2026"
                className="w-full px-3 py-2.5 rounded-lg border border-zinc-800 bg-zinc-950 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <h3 className="font-bold text-base text-white border-b border-zinc-850 pb-2 pt-2">Career Preferences</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Preferred Target Role</label>
              <input
                type="text"
                {...register('preferredRole')}
                placeholder="e.g. Frontend developer"
                className="w-full px-3 py-2.5 rounded-lg border border-zinc-800 bg-zinc-950 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Preferred Location</label>
              <input
                type="text"
                {...register('preferredLocation')}
                placeholder="e.g. Remote, Bangalore"
                className="w-full px-3 py-2.5 rounded-lg border border-zinc-800 bg-zinc-950 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Bio / Profile Summary</label>
              <textarea
                rows={3}
                {...register('bio')}
                placeholder="Brief summary introducing yourself..."
                className="w-full px-3 py-2.5 rounded-lg border border-zinc-800 bg-zinc-950 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-850">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-2 shadow-lg glow-indigo disabled:opacity-50 cursor-pointer"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Profile Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
