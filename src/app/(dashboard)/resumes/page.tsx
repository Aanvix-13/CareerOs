'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  FileText,
  Upload,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Plus,
  X,
  FileUp,
  Download,
} from 'lucide-react';
import useResumeStore from '../../../hooks/useResumeStore';

export default function ResumesPage() {
  const { resumes, fetchResumes, uploadResume, deleteResume, setDefault, error } = useResumeStore();

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleUploadSubmit = async (formData: any) => {
    setLocalError(null);
    const fileList = formData.file;
    
    if (!fileList || fileList.length === 0) {
      setLocalError('Please select a PDF file.');
      return;
    }

    const file = fileList[0];
    if (file.type !== 'application/pdf') {
      setLocalError('Only PDF files are supported.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setLocalError('File is too large. Max size is 5MB.');
      return;
    }

    const data = new FormData();
    data.append('file', file);
    data.append('name', formData.name);
    if (formData.targetRole) data.append('targetRole', formData.targetRole);
    if (formData.version) data.append('version', formData.version);
    if (formData.notes) data.append('notes', formData.notes);

    setUploading(true);
    try {
      await uploadResume(data);
      setIsUploadOpen(false);
      reset();
      fetchResumes();
    } catch (err: any) {
      setLocalError(err.message || 'Failed to upload resume.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    try {
      await deleteResume(id);
    } catch (err: any) {
      alert(err.message || 'Failed to delete resume.');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefault(id);
    } catch (err: any) {
      alert(err.message || 'Failed to set default.');
    }
  };

  // Human readable bytes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Resume Library</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage resumes and map custom versions to job applications.</p>
        </div>
        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition duration-150 shadow-lg glow-indigo cursor-pointer"
        >
          <Upload className="h-4 w-4" />
          Upload Resume
        </button>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-sm text-rose-400 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Resumes Grid */}
      {resumes.length === 0 ? (
        <div className="glass-card rounded-2xl border border-dashed border-zinc-800 p-12 text-center max-w-lg mx-auto mt-8">
          <FileUp className="h-12 w-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="font-bold text-white text-base">No resumes uploaded</h3>
          <p className="text-zinc-400 text-xs mt-1 mb-6">
            Upload your master resume to start mapping versions to applications.
          </p>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-semibold text-white"
          >
            <Upload className="h-3 w-3" /> Upload PDF
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className={`glass-card rounded-2xl p-5 border flex flex-col justify-between h-56 transition-all duration-300 ${
                resume.isDefault ? 'border-indigo-500/40 glow-indigo bg-indigo-950/5' : 'border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${resume.isDefault ? 'bg-indigo-600/10 text-indigo-400' : 'bg-zinc-800 text-zinc-400'}`}>
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm truncate max-w-[150px]">{resume.name}</h4>
                      {resume.version && <span className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider block">Ver: {resume.version}</span>}
                    </div>
                  </div>
                  {resume.isDefault && (
                    <span className="inline-flex items-center gap-1 rounded bg-indigo-500/10 px-2 py-0.5 text-[9px] font-semibold text-indigo-400 border border-indigo-500/20">
                      <CheckCircle className="h-3 w-3" /> Default
                    </span>
                  )}
                </div>

                <div className="text-xs text-zinc-400">
                  <div className="flex items-center justify-between">
                    <span>Role target:</span>
                    <span className="font-medium text-zinc-200">{resume.targetRole || 'General'}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span>File size:</span>
                    <span className="font-medium text-zinc-300">{formatBytes(resume.fileSize)}</span>
                  </div>
                </div>

                {resume.notes && (
                  <p className="text-[10px] text-zinc-500 line-clamp-2 italic pt-1">{resume.notes}</p>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-zinc-850 pt-3 mt-4 text-xs font-semibold">
                <a
                  href={resume.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
                >
                  <Download className="h-4 w-4" /> Download PDF
                </a>

                <div className="flex items-center gap-3">
                  {!resume.isDefault && (
                    <button
                      onClick={() => handleSetDefault(resume.id)}
                      className="text-zinc-400 hover:text-white transition duration-150 cursor-pointer"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(resume.id)}
                    className="text-rose-500 hover:text-rose-400 hover:bg-rose-950/10 p-1.5 rounded-lg border border-transparent hover:border-rose-500/10 transition cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UPLOAD RESUME MODAL */}
      {isUploadOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-lg text-white">Upload Resume PDF</h3>
              <button onClick={() => setIsUploadOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {localError && (
              <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span>{localError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(handleUploadSubmit)} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Resume Name</label>
                <input
                  type="text"
                  required
                  {...register('name', { required: true })}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-white focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. Master Resume 2026"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Target Role</label>
                  <input
                    type="text"
                    {...register('targetRole')}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-white focus:border-indigo-500 focus:outline-none"
                    placeholder="e.g. Frontend Engineer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Version</label>
                  <input
                    type="text"
                    {...register('version')}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-white focus:border-indigo-500 focus:outline-none"
                    placeholder="e.g. 1.2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1 font-bold">Select PDF File (Max 5MB)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  required
                  {...register('file', { required: true })}
                  className="w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-200 file:hover:bg-zinc-700 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Notes / Changelog</label>
                <textarea
                  rows={2}
                  {...register('notes')}
                  className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-white focus:border-indigo-500 focus:outline-none"
                  placeholder="Add details about what is tailored in this version..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-2 shadow-lg glow-indigo"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                    </>
                  ) : (
                    'Upload'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
