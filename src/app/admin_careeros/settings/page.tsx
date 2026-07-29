'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Settings, Save, Loader2, AlertCircle, Check, Shield, UploadCloud, Globe } from 'lucide-react';
import { Card, Button } from '@/components/ui';

interface AppSettings {
  appName: string;
  supportEmail: string;
  contactEmail: string;
  defaultTimeZone: string;
  maxResumeSize: number;
  allowedResumeTypes: string[];
  maxProfileImageSize: number;
  allowedImageTypes: string[];
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  enableUserFeedback: boolean;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchSettings = async () => {
    setLoading(true); setError(null);
    try {
      const res = await axios.get('/api/admin_careeros/settings');
      setSettings(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load system settings.');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleChange = (key: keyof AppSettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  const handleArrayChange = (key: 'allowedResumeTypes' | 'allowedImageTypes', value: string) => {
    if (!settings) return;
    const arrayVal = value.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
    setSettings({ ...settings, [key]: arrayVal });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    if (!settings.appName || settings.appName.length < 2) { setError('Application Name must be at least 2 characters.'); return; }
    if (!settings.supportEmail.includes('@')) { setError('Please provide a valid support email.'); return; }
    if (settings.maxResumeSize <= 0 || settings.maxProfileImageSize <= 0) { setError('File size limits must be greater than zero.'); return; }
    setSaveLoading(true); setSuccess(false); setError(null);
    try {
      const res = await axios.patch('/api/admin_careeros/settings', settings);
      setSettings(res.data.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to update settings.');
    } finally { setSaveLoading(false); }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#6D5EF5]" />
      </div>
    );
  }

  if (error && !settings) {
    return (
      <div className="rounded-[24px] border border-[#FECACA] bg-[#FEF2F2] p-8 text-center max-w-xl mx-auto mt-12">
        <AlertCircle className="h-10 w-10 mx-auto mb-3 text-[#EF4444]" />
        <h3 className="font-bold text-lg text-[#111827] mb-1">Failed to Load Settings</h3>
        <p className="text-sm text-[#4B5563] mb-4">{error}</p>
        <Button variant="danger" size="sm" onClick={fetchSettings}>Try Again</Button>
      </div>
    );
  }

  const inputCls = "w-full h-10 px-3 rounded-xl border border-[#E5E7EB] bg-white text-sm text-[#111827] focus:outline-none focus:border-[#6D5EF5] focus:ring-2 focus:ring-[#6D5EF5]/10 transition";
  const labelCls = "text-xs text-[#6B7280] font-bold uppercase tracking-wider block mb-1";

  const toggleFlags = settings ? [
    { key: 'maintenanceMode' as keyof AppSettings, label: 'Enable Maintenance Mode', desc: 'Locks the platform and returns a placeholder page to non-admin users.', value: settings.maintenanceMode, warn: true },
    { key: 'allowNewRegistrations' as keyof AppSettings, label: 'Allow New User Registrations', desc: 'When disabled, the signup page is blocked and returns a registration-closed message.', value: settings.allowNewRegistrations, warn: false },
    { key: 'enableUserFeedback' as keyof AppSettings, label: 'Enable User Feedback Submissions', desc: 'When disabled, users cannot submit new bug reports through their sidebar.', value: settings.enableUserFeedback, warn: false },
  ] : [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 font-[--font-sans]">
      <div>
        <h1 className="text-3xl font-black text-[#111827] tracking-tight">System Settings</h1>
        <p className="text-sm text-[#6B7280] font-semibold mt-1">Configure application variables, file limits, and maintenance flags.</p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] text-sm font-bold flex items-center gap-2">
          <Check className="h-4 w-4" /> Settings updated and persisted successfully.
        </div>
      )}
      {error && (
        <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-sm font-bold flex items-center gap-2">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      {settings && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Config */}
          <Card className="p-6 space-y-5">
            <h3 className="font-bold text-base text-[#111827] border-b border-[#F1F5F9] pb-3 flex items-center gap-2">
              <Globe className="h-5 w-5 text-[#6D5EF5]" /> General Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Application Name</label>
                <input type="text" required value={settings.appName} onChange={e => handleChange('appName', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Default Time Zone</label>
                <input type="text" required value={settings.defaultTimeZone} onChange={e => handleChange('defaultTimeZone', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Support Email Address</label>
                <input type="email" required value={settings.supportEmail} onChange={e => handleChange('supportEmail', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Contact Email Address</label>
                <input type="email" required value={settings.contactEmail} onChange={e => handleChange('contactEmail', e.target.value)} className={inputCls} />
              </div>
            </div>
          </Card>

          {/* Upload Settings */}
          <Card className="p-6 space-y-5">
            <h3 className="font-bold text-base text-[#111827] border-b border-[#F1F5F9] pb-3 flex items-center gap-2">
              <UploadCloud className="h-5 w-5 text-[#6D5EF5]" /> File & Upload Constraints
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Max Resume Upload Size (MB)</label>
                <input type="number" required min={1} value={settings.maxResumeSize}
                  onChange={e => handleChange('maxResumeSize', parseInt(e.target.value, 10))} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Allowed Resume Extensions</label>
                <input type="text" required placeholder="e.g. PDF" value={settings.allowedResumeTypes.join(', ')}
                  onChange={e => handleArrayChange('allowedResumeTypes', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Max Profile Picture Size (MB)</label>
                <input type="number" required min={1} value={settings.maxProfileImageSize}
                  onChange={e => handleChange('maxProfileImageSize', parseInt(e.target.value, 10))} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Allowed Image Types</label>
                <input type="text" required placeholder="e.g. JPG, PNG" value={settings.allowedImageTypes.join(', ')}
                  onChange={e => handleArrayChange('allowedImageTypes', e.target.value)} className={inputCls} />
              </div>
            </div>
          </Card>

          {/* Security Flags */}
          <Card className="p-6 space-y-5">
            <h3 className="font-bold text-base text-[#111827] border-b border-[#F1F5F9] pb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#6D5EF5]" /> Security & Application Flags
            </h3>
            <div className="flex flex-col gap-3">
              {toggleFlags.map(flag => (
                <label key={flag.key as string}
                  className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer select-none transition ${flag.value && flag.warn ? 'border-[#FCA5A5] bg-[#FEF2F2]' : 'border-[#E5E7EB] bg-[#FAFAFA] hover:bg-[#F3F1FF]/50'}`}>
                  <input type="checkbox" checked={flag.value as boolean}
                    onChange={e => handleChange(flag.key, e.target.checked)}
                    className="mt-0.5 rounded border-[#E5E7EB] text-[#6D5EF5] focus:ring-[#6D5EF5] cursor-pointer" />
                  <div>
                    <p className={`font-bold text-sm leading-none ${flag.value && flag.warn ? 'text-[#991B1B]' : 'text-[#111827]'}`}>{flag.label}</p>
                    <p className="text-xs text-[#6B7280] mt-1.5 leading-relaxed">{flag.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </Card>

          <Button type="submit" disabled={saveLoading} className="w-full justify-center gap-2 py-3">
            {saveLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Save className="h-5 w-5" /> Save System Settings</>}
          </Button>
        </form>
      )}
    </div>
  );
}
