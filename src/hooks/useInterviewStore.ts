import { create } from 'zustand';
import apiClient from '../lib/api-client';

interface Interview {
  id: string;
  applicationId: string;
  interviewRound: string;
  interviewType: string;
  status: string;
  result: string;
  interviewerName?: string | null;
  interviewerEmail?: string | null;
  meetingPlatform?: string | null;
  meetingLink?: string | null;
  scheduledDate: string;
  scheduledTime: string;
  timeZone: string;
  preparationNotes?: string | null;
  interviewFeedback?: string | null;
  questionsAsked?: string | null;
  personalNotes?: string | null;
  createdAt: string;
  application: { id: string; companyName: string; jobTitle: string };
}

interface InterviewState {
  interviews: Interview[];
  total: number;
  isLoading: boolean;
  error: string | null;
  fetchInterviews: (options?: any) => Promise<void>;
  scheduleInterview: (data: any) => Promise<Interview>;
  updateInterview: (id: string, data: any) => Promise<Interview>;
  updateStatus: (id: string, data: { status: string; result: string; interviewFeedback?: string | null; questionsAsked?: string | null }) => Promise<Interview>;
  deleteInterview: (id: string) => Promise<void>;
}

export const useInterviewStore = create<InterviewState>((set, get) => ({
  interviews: [],
  total: 0,
  isLoading: false,
  error: null,

  fetchInterviews: async (options = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (options.page) params.append('page', options.page.toString());
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.applicationId) params.append('applicationId', options.applicationId);
      if (options.status) params.append('status', options.status);
      if (options.result) params.append('result', options.result);

      const response: any = await apiClient.get(`/interviews?${params.toString()}`);
      set({
        interviews: response.data.data,
        total: response.data.pagination.total,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch interviews.', isLoading: false });
    }
  },

  scheduleInterview: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response: any = await apiClient.post('/interviews', data);
      const interview = response.data;
      set((state) => ({
        interviews: [interview, ...state.interviews],
        total: state.total + 1,
        isLoading: false,
      }));
      return interview;
    } catch (err: any) {
      set({ error: err.message || 'Failed to schedule interview.', isLoading: false });
      throw err;
    }
  },

  updateInterview: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response: any = await apiClient.put(`/interviews/${id}`, data);
      const updated = response.data;
      set((state) => ({
        interviews: state.interviews.map((item) => (item.id === id ? { ...item, ...updated } : item)),
        isLoading: false,
      }));
      return updated;
    } catch (err: any) {
      set({ error: err.message || 'Failed to update interview.', isLoading: false });
      throw err;
    }
  },

  updateStatus: async (id, statusData) => {
    set({ error: null });
    try {
      const response: any = await apiClient.patch(`/interviews/${id}/status`, statusData);
      const updated = response.data;
      set((state) => ({
        interviews: state.interviews.map((item) => (item.id === id ? { ...item, ...updated } : item)),
      }));
      return updated;
    } catch (err: any) {
      set({ error: err.message || 'Failed to update interview outcome.' });
      throw err;
    }
  },

  deleteInterview: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/interviews/${id}`);
      set((state) => ({
        interviews: state.interviews.filter((item) => item.id !== id),
        total: Math.max(0, state.total - 1),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to delete interview.', isLoading: false });
      throw err;
    }
  },
}));

export default useInterviewStore;
