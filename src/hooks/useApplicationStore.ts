import { create } from 'zustand';
import apiClient from '../lib/api-client';

interface Application {
  id: string;
  companyName: string;
  jobTitle: string;
  department?: string | null;
  jobType: string;
  workMode: string;
  location?: string | null;
  source: string;
  recruiterName?: string | null;
  recruiterEmail?: string | null;
  salary?: any | null;
  jobUrl?: string | null;
  notes?: string | null;
  currentStatus: string;
  applicationDate: string;
  createdAt: string;
  updatedAt: string;
  resume: { id: string; name: string };
}

interface ApplicationState {
  applications: Application[];
  total: number;
  isLoading: boolean;
  error: string | null;
  fetchApplications: (options?: any) => Promise<void>;
  createApplication: (data: any) => Promise<Application>;
  updateApplication: (id: string, data: any) => Promise<Application>;
  updateStatus: (id: string, status: string, notes?: string | null) => Promise<Application>;
  deleteApplication: (id: string) => Promise<void>;
  fetchHistory: (id: string) => Promise<any[]>;
}

export const useApplicationStore = create<ApplicationState>((set, get) => ({
  applications: [],
  total: 0,
  isLoading: false,
  error: null,

  fetchApplications: async (options = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (options.page) params.append('page', options.page.toString());
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.search) params.append('search', options.search);
      if (options.status) params.append('status', options.status);
      if (options.jobType) params.append('jobType', options.jobType);
      if (options.workMode) params.append('workMode', options.workMode);
      if (options.source) params.append('source', options.source);
      if (options.sort) params.append('sort', options.sort);
      if (options.order) params.append('order', options.order);

      const response: any = await apiClient.get(`/applications?${params.toString()}`);
      set({
        applications: response.data.data,
        total: response.data.pagination.total,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch applications.', isLoading: false });
    }
  },

  createApplication: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response: any = await apiClient.post('/applications', data);
      const app = response.data;
      set((state) => ({
        applications: [app, ...state.applications],
        total: state.total + 1,
        isLoading: false,
      }));
      return app;
    } catch (err: any) {
      set({ error: err.message || 'Failed to create application.', isLoading: false });
      throw err;
    }
  },

  updateApplication: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response: any = await apiClient.put(`/applications/${id}`, data);
      const updatedApp = response.data;
      set((state) => ({
        applications: state.applications.map((app) => (app.id === id ? { ...app, ...updatedApp } : app)),
        isLoading: false,
      }));
      return updatedApp;
    } catch (err: any) {
      set({ error: err.message || 'Failed to update application.', isLoading: false });
      throw err;
    }
  },

  updateStatus: async (id, status, notes = null) => {
    set({ error: null });
    try {
      const response: any = await apiClient.patch(`/applications/${id}/status`, { status, notes });
      const updatedApp = response.data;
      set((state) => ({
        applications: state.applications.map((app) => (app.id === id ? { ...app, currentStatus: status } : app)),
      }));
      return updatedApp;
    } catch (err: any) {
      set({ error: err.message || 'Failed to update status.' });
      throw err;
    }
  },

  deleteApplication: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/applications/${id}`);
      set((state) => ({
        applications: state.applications.filter((app) => app.id !== id),
        total: Math.max(0, state.total - 1),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to delete application.', isLoading: false });
      throw err;
    }
  },

  fetchHistory: async (id) => {
    try {
      const response: any = await apiClient.get(`/applications/${id}/history`);
      return response.data;
    } catch (err: any) {
      throw err;
    }
  },
}));

export default useApplicationStore;
