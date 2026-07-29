'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Eye,
  Settings,
} from 'lucide-react';
import useResumeStore from '../../../hooks/useResumeStore';

export default function ResumesPage() {
  const { resumes, fetchResumes, uploadResume, deleteResume, setDefault, error } = useResumeStore();

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Drag and drop states
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setLocalError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalError(null);
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      setLocalError('Only PDF files are supported.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setLocalError('File is too large. Max size is 5MB.');
      return;
    }
    setSelectedFile(file);
    // Autofill resume name field with file name (without extension)
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    setValue('name', nameWithoutExt);
  };

  const handleUploadSubmit = async (formData: any) => {
    setLocalError(null);
    if (!selectedFile) {
      setLocalError('Please select or drag a PDF file first.');
      return;
    }

    const data = new FormData();
    data.append('file', selectedFile);
    data.append('name', formData.name);
    if (formData.targetRole) data.append('targetRole', formData.targetRole);
    if (formData.version) data.append('version', formData.version);
    if (formData.notes) data.append('notes', formData.notes);

    setUploading(true);
    try {
      await uploadResume(data);
      setIsUploadOpen(false);
      setSelectedFile(null);
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

  const handleRenameClick = () => {
    alert('To rename a resume, please delete and upload a new file with your preferred name, or upload as a new version.');
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Resume Library</h1>
          <p className="text-gray-500 text-sm mt-1">Manage resumes and map custom versions to job applications.</p>
        </div>
        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-indigo-600 transition duration-150 shadow-lg glow-indigo cursor-pointer"
        >
          <Upload className="h-4 w-4" />
          Upload Resume
        </button>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="rounded-xl bg-rose-600/10 border border-rose-600/20 p-4 text-sm text-rose-600 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 2. Drag & Drop Upload Zone + Empty States */}
      {resumes.length === 0 ? (
        <div className="max-w-2xl mx-auto mt-8">
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`bg-white shadow-sm border border-gray-200 rounded-2xl border-2 border-dashed p-12 text-center transition cursor-pointer flex flex-col items-center justify-center min-h-[300px] ${
              dragActive ? 'border-indigo-600 bg-indigo-950/10' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <FileUp className="h-16 w-16 text-indigo-600 mb-4 animate-bounce" />
            <h3 className="font-bold text-gray-900 text-lg">Upload Resume</h3>
            <p className="text-gray-500 text-sm mt-1 mb-2">
              Drag & Drop PDF here, or <span className="text-indigo-600 underline font-semibold">Browse Files</span>
            </p>
            <p className="text-gray-400 text-xs">
              Accepted format: PDF (Max size: 5 MB)
            </p>
          </div>
          
          {selectedFile && (
            <div className="mt-4 p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-indigo-600" />
                <div>
                  <p className="text-sm font-bold text-gray-900 truncate max-w-xs">{selectedFile.name}</p>
                  <p className="text-xs text-gray-400">{formatBytes(selectedFile.size)}</p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadOpen(true)}
                className="text-xs font-semibold text-gray-900 bg-indigo-600 hover:bg-indigo-600 px-4 py-2 rounded-lg transition"
              >
                Complete Upload Info
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Resumes Grid Card View with premium visual adjustments */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className={`bg-white shadow-sm border border-gray-200 rounded-2xl p-5 border flex flex-col justify-between h-60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                resume.isDefault ? 'border-indigo-600/40 glow-indigo bg-indigo-950/5' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg border ${resume.isDefault ? 'bg-indigo-600/10 text-indigo-600 border-indigo-600/20' : 'bg-gray-100 text-gray-500 border-gray-300/60'}`}>
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm truncate max-w-[150px]" title={resume.name}>{resume.name}</h4>
                      {resume.version && <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider block mt-0.5">Version: {resume.version}</span>}
                    </div>
                  </div>
                  {resume.isDefault && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-600/10 px-2 py-0.5 text-[9px] font-semibold text-indigo-600 border border-indigo-600/20">
                      <CheckCircle className="h-3 w-3" /> Default
                    </span>
                  )}
                </div>

                <div className="text-xs text-gray-500 space-y-1.5 border-t border-gray-200/40 pt-3">
                  <div className="flex items-center justify-between">
                    <span>Role Target:</span>
                    <span className="font-medium text-gray-700">{resume.targetRole || 'General'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>File Size:</span>
                    <span className="font-medium text-zinc-350">{formatBytes(resume.fileSize)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Uploaded:</span>
                    <span className="font-medium text-gray-500">{new Date(resume.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {resume.notes && (
                  <p className="text-[10px] text-gray-400 line-clamp-1 italic">{resume.notes}</p>
                )}
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-4 text-xs font-semibold">
                <a
                  href={resume.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-300"
                >
                  <Eye className="h-4 w-4" /> Preview / View
                </a>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleRenameClick}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    Rename
                  </button>
                  
                  {!resume.isDefault && (
                    <button
                      onClick={() => handleSetDefault(resume.id)}
                      className="text-gray-500 hover:text-gray-900 transition duration-150 cursor-pointer"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(resume.id)}
                    className="text-rose-600 hover:text-rose-600 hover:bg-rose-950/10 p-1 rounded transition cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UPLOAD RESUME MODAL (Also handles drag files details filler) */}
      {isUploadOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-bold text-lg text-gray-900">Upload Resume PDF</h3>
              <button onClick={() => setIsUploadOpen(false)} className="text-gray-500 hover:text-gray-900">
                <X className="h-5 w-5" />
              </button>
            </div>

            {localError && (
              <div className="rounded-lg bg-rose-600/10 border border-rose-600/20 p-3 text-xs text-rose-600 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span>{localError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(handleUploadSubmit)} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Resume Name</label>
                <input
                  type="text"
                  required
                  {...register('name', { required: true })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:border-indigo-600 focus:outline-none"
                  placeholder="e.g. Master Resume 2026"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Target Role</label>
                  <input
                    type="text"
                    {...register('targetRole')}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-indigo-600 focus:outline-none"
                    placeholder="e.g. Frontend Engineer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Version</label>
                  <input
                    type="text"
                    {...register('version')}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-indigo-600 focus:outline-none"
                    placeholder="e.g. 1.2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 font-bold">Select PDF File (Max 5MB)</label>
                {selectedFile ? (
                  <div className="p-3 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-between text-xs">
                    <span className="text-gray-700 font-medium truncate max-w-[200px]">{selectedFile.name}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="text-rose-600 hover:text-rose-300 font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept="application/pdf"
                    required
                    onChange={handleFileChange}
                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 file:hover:bg-gray-200 cursor-pointer"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Notes / Changelog</label>
                <textarea
                  rows={2}
                  {...register('notes')}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-indigo-600 focus:outline-none"
                  placeholder="Add details about what is tailored in this version..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-600 text-gray-900 font-semibold flex items-center gap-2 shadow-lg glow-indigo"
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
