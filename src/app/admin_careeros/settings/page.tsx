'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Settings,
  Save,
  Loader2,
  AlertCircle,
  Check,
  Shield,
  UploadCloud,
  Globe,
} from 'lucide-react';

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
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/admin_careeros/settings');
      setSettings(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to load system settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (key: keyof AppSettings, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [key]: value,
    });
  };

  const handleArrayChange = (key: 'allowedResumeTypes' | 'allowedImageTypes', value: string) => {
    if (!settings) return;
    const arrayVal = value.split(',').map((s) => s.trim().toUpperCase()).filter(Boolean);
    setSettings({
      ...settings,
      [key]: arrayVal,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    // Front-end validations
    if (!settings.appName || settings.appName.length < 2) {
      setError('Application Name must be at least 2 characters.');
      return;
    }
    if (!settings.supportEmail.includes('@')) {
      setError('Please provide a valid support email address.');
      return;
    }
    if (settings.maxResumeSize <= 0 || settings.maxProfileImageSize <= 0) {
      setError('File size limits must be greater than zero.');
      return;
    }

    setSaveLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const res = await axios.patch('/api/admin_careeros/settings', settings);
      setSettings(res.data.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to update system settings.');
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

  if (error && !settings) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-6 text-center text-rose-400 max-w-xl mx-auto mt-12">
        <AlertCircle className="h-10 w-10 mx-auto mb-3 text-rose-500" />
        <h3 className="font-semibold text-white mb-1">Failed to Load Settings</h3>
        <p className="text-sm text-zinc-400 mb-4">{error}</p>
        <button
          onClick={fetchSettings}
          className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">System Settings</h1>
        <p className="text-sm text-zinc-400 mt-1">Configure application variables, file limits, and maintenance flags.</p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-400 text-sm font-semibold flex items-center gap-2 animate-fade-in">
          <Check className="h-4 w-4 text-indigo-400" />
          Settings updated and persisted successfully.
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/20 text-rose-400 text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-rose-500" />
          {error}
        </div>
      )}

      {settings && (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: General Settings */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 space-y-6 backdrop-blur-sm">
            <h3 className="font-bold text-base text-white border-b border-zinc-900 pb-3 flex items-center gap-2">
              <Globe className="h-5 w-5 text-indigo-500" />
              General Configuration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Application Name</label>
                <input
                  type="text"
                  required
                  value={settings.appName}
                  onChange={(e) => handleChange('appName', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/40 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Default Time Zone</label>
                <input
                  type="text"
                  required
                  value={settings.defaultTimeZone}
                  onChange={(e) => handleChange('defaultTimeZone', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/40 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Support Email Address</label>
                <input
                  type="email"
                  required
                  value={settings.supportEmail}
                  onChange={(e) => handleChange('supportEmail', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/40 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Contact Email Address</label>
                <input
                  type="email"
                  required
                  value={settings.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/40 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Upload Settings */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 space-y-6 backdrop-blur-sm">
            <h3 className="font-bold text-base text-white border-b border-zinc-900 pb-3 flex items-center gap-2">
              <UploadCloud className="h-5 w-5 text-indigo-500" />
              File & Upload Constraints
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Max Resume Upload Size (MB)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={settings.maxResumeSize}
                  onChange={(e) => handleChange('maxResumeSize', parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/40 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Allowed Resume File Extensions</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PDF"
                  value={settings.allowedResumeTypes.join(', ')}
                  onChange={(e) => handleArrayChange('allowedResumeTypes', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/40 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Max Profile Picture Size (MB)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={settings.maxProfileImageSize}
                  onChange={(e) => handleChange('maxProfileImageSize', parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/40 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Allowed Profile Picture Types</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. JPG, JPEG, PNG"
                  value={settings.allowedImageTypes.join(', ')}
                  onChange={(e) => handleArrayChange('allowedImageTypes', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/40 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Security & Flags */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 p-6 space-y-6 backdrop-blur-sm">
            <h3 className="font-bold text-base text-white border-b border-zinc-900 pb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-indigo-500" />
              Security & Application Flags
            </h3>

            <div className="flex flex-col gap-4">
              <label className="flex items-start gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-950/20 hover:bg-zinc-950/40 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                  className="mt-1 rounded border-zinc-800 bg-zinc-950 text-indigo-650 focus:ring-indigo-500"
                />
                <div>
                  <p className="font-bold text-white text-xs leading-none">Enable Maintenance Mode</p>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Locks the platform and returns a placeholder page to all non-administrator users.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-950/20 hover:bg-zinc-950/40 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.allowNewRegistrations}
                  onChange={(e) => handleChange('allowNewRegistrations', e.target.checked)}
                  className="mt-1 rounded border-zinc-800 bg-zinc-950 text-indigo-650 focus:ring-indigo-500"
                />
                <div>
                  <p className="font-bold text-white text-xs leading-none">Allow New User Registrations</p>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    When disabled, the user signup page is blocked and returns a registration closed message.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 rounded-xl border border-zinc-800 bg-zinc-950/20 hover:bg-zinc-950/40 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.enableUserFeedback}
                  onChange={(e) => handleChange('enableUserFeedback', e.target.checked)}
                  className="mt-1 rounded border-zinc-800 bg-zinc-950 text-indigo-650 focus:ring-indigo-500"
                />
                <div>
                  <p className="font-bold text-white text-xs leading-none">Enable User Feedback Submissions</p>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    When disabled, users cannot submit new bug reports or feedback forms through their sidebar.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saveLoading}
            className="w-full py-3.5 px-4 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-650/10 hover:shadow-indigo-650/20"
          >
            {saveLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save System Settings
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
