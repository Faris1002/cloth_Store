import axios from 'axios';
import { supabase } from '../lib/supabase.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to attach local auth token or Supabase session token
api.interceptors.request.use(
  async (config) => {
    try {
      const localToken = localStorage.getItem('auth_token');
      if (localToken) {
        config.headers.Authorization = `Bearer ${localToken}`;
        return config;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (err) {
      console.warn('Failed to attach session token to request:', err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to normalize error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorResponse = error.response?.data?.error;
    const message =
      errorResponse?.message ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';

    const enhancedError = new Error(message);
    enhancedError.code = errorResponse?.code || error.code || 'REQUEST_FAILED';
    enhancedError.status = error.response?.status;
    enhancedError.originalError = error;

    return Promise.reject(enhancedError);
  }
);

export default api;
