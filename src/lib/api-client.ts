import axios from 'axios';

const baseURL = typeof window === 'undefined'
  ? (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000') + '/api/app'
  : '/api/app';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // If unauthorized, redirect to sign-in
    if (error.response?.status === 401 && typeof window !== 'undefined' && !window.location.pathname.startsWith('/sign-in') && !window.location.pathname.startsWith('/sign-up')) {
      window.location.href = '/sign-in';
    }
    return Promise.reject(error.response?.data?.error || { message: error.message });
  }
);

export default apiClient;
