'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  User,
  Save,
  Loader2,
  AlertCircle,
  Check,
  Shield,
  Key,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProfileData {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  profileImageUrl: string | null;
  phone: string | null;
  college: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [fullName, setFullName] = useState('');


  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/admin_careeros/profile');
      setProfile(res.data.data);
      setFullName(res.data.data.fullName);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    if (fullName.trim().length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }

    setSaveLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await axios.patch('/api/admin_careeros/profile', {
        fullName: fullName.trim(),
      });
      setProfile(res.data.data);
      setFullName(res.data.data.fullName);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to update profile.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-6 text-center text-rose-400 max-w-xl mx-auto mt-12">
        <AlertCircle className="h-10 w-10 mx-auto mb-3 text-rose-500" />
        <h3 className="font-semibold text-white mb-1">Failed to Load Profile</h3>
        <p className="text-sm text-zinc-400 mb-4">{error}</p>
        <button
          onClick={fetchProfile}
          className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Profile</h1>
        <p className="text-sm text-zinc-400 mt-1">Manage your administrative credentials and details.</p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-400 text-sm font-semibold flex items-center gap-2">
          <Check className="h-4 w-4 text-indigo-400" />
          Profile updated successfully.
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/20 text-rose-400 text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-rose-500" />
          {error}
        </div>
      )}

      {profile && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 flex items-center gap-6 backdrop-blur-sm">
            <div className="h-16 w-16 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xl text-white overflow-hidden border border-zinc-800">
              {profile.profileImageUrl ? (
                <img src={profile.profileImageUrl} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                profile.fullName.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg text-white leading-tight">{profile.fullName}</h3>
              <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-1 font-medium">
                <Shield className="h-3 w-3 text-indigo-400" />
                System Administrator
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 space-y-6 backdrop-blur-sm">
            <h3 className="font-bold text-sm text-white border-b border-zinc-900 pb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-indigo-500" />
              Profile Details
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/40 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block">Email Address</label>
                <p className="text-xs text-zinc-400 font-mono p-3 bg-zinc-950/60 border border-zinc-900 rounded-xl select-all">
                  {profile.email}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block">Admin User ID</label>
                <p className="text-xs text-zinc-400 font-mono p-3 bg-zinc-950/60 border border-zinc-900 rounded-xl select-all">
                  {profile.userId}
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={saveLoading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20"
            >
              {saveLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Settings
                </>
              )}
            </button>
          </form>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 space-y-4 backdrop-blur-sm">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Key className="h-4 w-4 text-indigo-500" />
              Password & Security
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-medium">
              Administrative credentials are managed securely via Supabase Auth. To update your password, use the user-facing security profile settings panel.
            </p>
            <button
              type="button"
              onClick={() => router.push('/profile')}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Configure Security
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
