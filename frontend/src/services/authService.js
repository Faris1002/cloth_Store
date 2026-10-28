import { supabase } from '../lib/supabase.js';
import api from './api.js';

export const authService = {
  /**
   * Register a new user with credentials stored in PostgreSQL users table.
   * Completely bypasses Supabase Auth email rate limits.
   */
  async signUp(email, password, fullName) {
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        fullName,
      });

      const data = response.data?.data || {};
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
      }

      return {
        user: data.user,
        session: { access_token: data.token, user: data.user },
      };
    } catch (err) {
      throw err;
    }
  },

  /**
   * Sign in verifying credentials against PostgreSQL users table
   */
  async signIn(email, password) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const data = response.data?.data || {};
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
      }

      return {
        user: data.user,
        session: { access_token: data.token, user: data.user },
      };
    } catch (err) {
      throw err;
    }
  },

  /**
   * Sign out user session
   */
  async signOut() {
    try {
      await api.post('/auth/logout').catch(() => {});
    } catch {
      // Ignored
    }
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignored
    }
  },

  /**
   * Get locally cached user profile
   */
  getStoredUser() {
    try {
      const raw = localStorage.getItem('auth_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  /**
   * Get locally cached access token
   */
  getStoredToken() {
    return localStorage.getItem('auth_token');
  },

  /**
   * Get current active session
   */
  async getSession() {
    const token = this.getStoredToken();
    const user = this.getStoredUser();
    if (token && user) {
      return { access_token: token, user };
    }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch {
      return null;
    }
  },

  /**
   * Retrieve authenticated user profile from backend
   */
  async getMe() {
    const res = await api.get('/auth/me');
    return res.data?.data?.user;
  },
};
