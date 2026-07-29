'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Save, Loader2, AlertCircle, Check, Shield, Key } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, Button } from '@/components/ui';

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
    setLoading(true); setError(null);
    try {
      const res = await axios.get('/api/admin_careeros/profile');
      setProfile(res.data.data);
      setFullName(res.data.data.fullName);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load profile.');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    if (fullName.trim().length < 2) { setError('Name must be at least 2 characters.'); return; }
    setSaveLoading(true); setSuccess(false); setError(null);
    try {
      const res = await axios.patch('/api/admin_careeros/profile', { fullName: fullName.trim() });
      setProfile(res.data.data);
      setFullName(res.data.data.fullName);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to update profile.');
    } finally { setSaveLoading(false); }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#6D5EF5]" />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="rounded-[24px] border border-[#FECACA] bg-[#FEF2F2] p-8 text-center max-w-xl mx-auto mt-12">
        <AlertCircle className="h-10 w-10 mx-auto mb-3 text-[#EF4444]" />
        <h3 className="font-bold text-lg text-[#111827] mb-1">Failed to Load Profile</h3>
        <p className="text-sm text-[#4B5563] mb-4">{error}</p>
        <Button variant="danger" size="sm" onClick={fetchProfile}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12 font-[--font-sans]">
      <div>
        <h1 className="text-3xl font-black text-[#111827] tracking-tight">Admin Profile</h1>
        <p className="text-sm text-[#6B7280] font-semibold mt-1">Manage your administrative credentials and details.</p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] text-sm font-bold flex items-center gap-2">
          <Check className="h-4 w-4" /> Profile updated successfully.
        </div>
      )}
      {error && (
        <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-sm font-bold flex items-center gap-2">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      {profile && (
        <div className="space-y-5">
          {/* Avatar Card */}
          <Card className="p-6 flex items-center gap-5">
            <div className="h-16 w-16 rounded-full bg-[#F3F1FF] text-[#6D5EF5] flex items-center justify-center font-black text-xl overflow-hidden shrink-0 border border-[#E5E7EB]">
              {profile.profileImageUrl ? (
                <img src={profile.profileImageUrl} alt="avatar" className="h-full w-full object-cover" />
              ) : profile.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#111827] leading-tight">{profile.fullName}</h3>
              <p className="text-xs text-[#6B7280] font-semibold flex items-center gap-1.5 mt-1">
                <Shield className="h-3 w-3 text-[#6D5EF5]" /> System Administrator
              </p>
            </div>
          </Card>

          {/* Edit Form */}
          <Card className="p-6 space-y-6">
            <h3 className="font-bold text-sm text-[#111827] border-b border-[#F1F5F9] pb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-[#6D5EF5]" /> Profile Details
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-[#6B7280] font-bold uppercase tracking-wider block mb-1">Full Name</label>
                <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111827] focus:outline-none focus:border-[#6D5EF5] focus:ring-2 focus:ring-[#6D5EF5]/10 transition" />
              </div>
              <div>
                <label className="text-xs text-[#6B7280] font-bold uppercase tracking-wider block mb-1">Email Address</label>
                <p className="text-sm text-[#4B5563] font-mono p-3 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl select-all">{profile.email}</p>
              </div>
              <div>
                <label className="text-xs text-[#6B7280] font-bold uppercase tracking-wider block mb-1">Admin User ID</label>
                <p className="text-xs text-[#4B5563] font-mono p-3 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl select-all truncate">{profile.userId}</p>
              </div>
              <Button type="submit" disabled={saveLoading} className="w-full justify-center gap-2">
                {saveLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Save Settings</>}
              </Button>
            </form>
          </Card>

          {/* Security Card */}
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-sm text-[#111827] flex items-center gap-2">
              <Key className="h-4 w-4 text-[#6D5EF5]" /> Password & Security
            </h3>
            <p className="text-sm text-[#4B5563] leading-relaxed">
              Credentials are managed securely via Supabase Auth. To update your password, use the security profile settings panel.
            </p>
            <Button variant="secondary" size="sm" onClick={() => router.push('/profile')}>Configure Security</Button>
          </Card>
        </div>
      )}
    </div>
  );
}
