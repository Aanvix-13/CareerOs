import { create } from 'zustand';
import apiClient from '../lib/api-client';

interface Reminder {
  id: string;
  applicationId?: string | null;
  interviewId?: string | null;
  title: string;
  description?: string | null;
  reminderType: string;
  priority: string;
  status: string;
  dueDate: string;
  dueTime?: string | null;
  completedAt?: string | null;
  createdAt: string;
  application?: { id: string; companyName: string; jobTitle: string } | null;
}

interface ReminderState {
  reminders: Reminder[];
  total: number;
  isLoading: boolean;
  error: string | null;
  fetchReminders: (options?: any) => Promise<void>;
  createReminder: (data: any) => Promise<Reminder>;
  updateReminder: (id: string, data: any) => Promise<Reminder>;
  completeReminder: (id: string) => Promise<Reminder>;
  deleteReminder: (id: string) => Promise<void>;
}

export const useReminderStore = create<ReminderState>((set, get) => ({
  reminders: [],
  total: 0,
  isLoading: false,
  error: null,

  fetchReminders: async (options = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (options.page) params.append('page', options.page.toString());
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.status) params.append('status', options.status);
      if (options.priority) params.append('priority', options.priority);
      if (options.reminderType) params.append('reminderType', options.reminderType);

      const response: any = await apiClient.get(`/reminders?${params.toString()}`);
      set({
        reminders: response.data.data,
        total: response.data.pagination.total,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch reminders.', isLoading: false });
    }
  },

  createReminder: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response: any = await apiClient.post('/reminders', data);
      const reminder = response.data;
      set((state) => ({
        reminders: [reminder, ...state.reminders],
        total: state.total + 1,
        isLoading: false,
      }));
      return reminder;
    } catch (err: any) {
      set({ error: err.message || 'Failed to create reminder.', isLoading: false });
      throw err;
    }
  },

  updateReminder: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response: any = await apiClient.put(`/reminders/${id}`, data);
      const updated = response.data;
      set((state) => ({
        reminders: state.reminders.map((item) => (item.id === id ? { ...item, ...updated } : item)),
        isLoading: false,
      }));
      return updated;
    } catch (err: any) {
      set({ error: err.message || 'Failed to update reminder.', isLoading: false });
      throw err;
    }
  },

  completeReminder: async (id) => {
    set({ error: null });
    try {
      const response: any = await apiClient.patch(`/reminders/${id}/complete`);
      const updated = response.data;
      set((state) => ({
        reminders: state.reminders.map((item) => (item.id === id ? updated : item)),
      }));
      return updated;
    } catch (err: any) {
      set({ error: err.message || 'Failed to mark reminder as completed.' });
      throw err;
    }
  },

  deleteReminder: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/reminders/${id}`);
      set((state) => ({
        reminders: state.reminders.filter((item) => item.id !== id),
        total: Math.max(0, state.total - 1),
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to delete reminder.', isLoading: false });
      throw err;
    }
  },
}));

export default useReminderStore;
