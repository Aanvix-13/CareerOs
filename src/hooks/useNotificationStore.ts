import { create } from 'zustand';
import apiClient from '../lib/api-client';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  status: string;
  relatedEntity?: string | null;
  relatedEntityId?: string | null;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: (options?: any) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  total: 0,
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async (options = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (options.page) params.append('page', options.page.toString());
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.status) params.append('status', options.status);

      const response: any = await apiClient.get(`/notifications?${params.toString()}`);
      
      // Compute unread count in memory from retrieved list, or set based on response meta
      const list = response.data.data;
      const count = list.filter((n: any) => n.status === 'Unread').length;

      set({
        notifications: list,
        total: response.data.pagination.total,
        unreadCount: count,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch notifications.', isLoading: false });
    }
  },

  markAsRead: async (id) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
      set((state) => ({
        notifications: state.notifications.map((n) => (n.id === id ? { ...n, status: 'Read' } : n)),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to mark notification as read.' });
    }
  },

  markAllAsRead: async () => {
    try {
      await apiClient.patch('/notifications');
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, status: 'Read' })),
        unreadCount: 0,
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to mark all notifications as read.' });
    }
  },

  deleteNotification: async (id) => {
    try {
      const target = get().notifications.find((n) => n.id === id);
      const isUnread = target?.status === 'Unread';

      await apiClient.delete(`/notifications/${id}`);
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
        total: Math.max(0, state.total - 1),
        unreadCount: isUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to delete notification.' });
    }
  },
}));

export default useNotificationStore;
