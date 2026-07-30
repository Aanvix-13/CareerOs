import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import apiClient from '../lib/api-client';

interface Resume {
  id: string;
  name: string;
  targetRole?: string | null;
  version?: string | null;
  notes?: string | null;
  fileUrl: string;
  fileSize: number;
  isDefault: boolean;
  createdAt: string;
}

interface ResumeState {
  resumes: Resume[];
  total: number;
  isLoading: boolean;
  error: string | null;
  fetchResumes: (options?: any) => Promise<void>;
  uploadResume: (formData: FormData) => Promise<Resume>;
  updateResume: (id: string, data: any) => Promise<Resume>;
  deleteResume: (id: string) => Promise<void>;
  setDefault: (id: string) => Promise<void>;
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      resumes: [],
      total: 0,
      isLoading: false,
      error: null,

      fetchResumes: async (options = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (options.page) params.append('page', options.page.toString());
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.search) params.append('search', options.search);

      const response: any = await apiClient.get(`/resumes?${params.toString()}`);
      set({
        resumes: response.data.data,
        total: response.data.pagination.total,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch resumes.', isLoading: false });
    }
  },

  uploadResume: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const response: any = await apiClient.post('/resumes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const resume = response.data;
      set((state) => {
        // If this resume is set as default, mark all others as non-default
        const updatedResumes = resume.isDefault
          ? state.resumes.map((r) => ({ ...r, isDefault: false }))
          : state.resumes;

        return {
          resumes: [resume, ...updatedResumes],
          total: state.total + 1,
          isLoading: false,
        };
      });
      return resume;
    } catch (err: any) {
      set({ error: err.message || 'Failed to upload resume.', isLoading: false });
      throw err;
    }
  },

  updateResume: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response: any = await apiClient.put(`/resumes/${id}`, data);
      const updated = response.data;
      set((state) => ({
        resumes: state.resumes.map((r) => (r.id === id ? { ...r, ...updated } : r)),
        isLoading: false,
      }));
      return updated;
    } catch (err: any) {
      set({ error: err.message || 'Failed to update resume.', isLoading: false });
      throw err;
    }
  },

  deleteResume: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/resumes/${id}`);
      set((state) => ({
        resumes: state.resumes.filter((r) => r.id !== id),
        total: Math.max(0, state.total - 1),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to delete resume.', isLoading: false });
      throw err;
    }
  },

  setDefault: async (id) => {
    set({ error: null });
    try {
      await apiClient.patch(`/resumes/${id}/default`);
      set((state) => ({
        resumes: state.resumes.map((r) => ({
          ...r,
          isDefault: r.id === id,
        })),
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to set default resume.' });
      throw err;
    }
  },
}),
{
  name: 'resume-storage',
  storage: createJSONStorage(() => sessionStorage),
  partialize: (state) => ({ resumes: state.resumes, total: state.total }),
}
)
);

export default useResumeStore;
