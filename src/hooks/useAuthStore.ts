import { create } from 'zustand';
import apiClient from '../lib/api-client';

interface User {
  id: string;
  email: string;
}

interface Profile {
  id: string;
  userId: string;
  fullName: string;
  profileImageUrl?: string | null;
  phone?: string | null;
  college?: string | null;
  degree?: string | null;
  specialization?: string | null;
  graduationYear?: number | null;
  preferredRole?: string | null;
  preferredLocation?: string | null;
  bio?: string | null;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  updateProfile: (profileData: any, isMultipart?: boolean) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response: any = await apiClient.post('/auth/login', credentials);
      const user = response.data;
      set({ user, isAuthenticated: true, isLoading: false });
      await get().checkSession();
    } catch (err: any) {
      set({ error: err.message || 'Login failed.', isLoading: false });
      throw err;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.post('/auth/register', data);
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Registration failed.', isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await apiClient.post('/auth/logout');
      set({ user: null, profile: null, isAuthenticated: false, isLoading: false });
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } catch (err: any) {
      set({ error: err.message || 'Logout failed.', isLoading: false });
    }
  },

  checkSession: async () => {
    // Prevent redundant loading overlays on background check
    try {
      const response: any = await apiClient.get('/auth/me');
      set({
        user: { id: response.data.id, email: response.data.email },
        profile: response.data.profile,
        isAuthenticated: true,
      });
    } catch (err) {
      set({ user: null, profile: null, isAuthenticated: false });
    }
  },

  updateProfile: async (profileData, isMultipart = false) => {
    set({ isLoading: true, error: null });
    try {
      const headers = isMultipart ? { 'Content-Type': 'multipart/form-data' } : {};
      const response: any = await apiClient.put('/profile', profileData, { headers });
      set({ profile: response.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to update profile.', isLoading: false });
      throw err;
    }
  },
}));

export default useAuthStore;
