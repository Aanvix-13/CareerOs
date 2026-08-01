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
    if (error.response?.status === 401 && typeof window !== 'undefined' && !window.location.pathname.startsWith('/sign-in') && !window.location.pathname.startsWith('/sign-up') && !window.location.pathname.startsWith('/auth/redirect')) {
      window.location.href = '/sign-in';
    }

    // Intercept limit exceeded errors
    if (error.response?.status === 409 && error.response?.data?.code === 'LIMIT_EXCEEDED' && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('limit-exceeded', { detail: error.response.data }));
    }

    return Promise.reject(error.response?.data?.error || error.response?.data || { message: error.message });
  }
);

export default apiClient;
