import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { authService } from '../services/authService.js';
import { useToast } from './ToastContext.jsx';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        // 1. Check local session from custom users table first
        const storedToken = authService.getStoredToken();
        const storedUser = authService.getStoredUser();

        if (storedToken && storedUser) {
          if (mounted) {
            setUser(storedUser);
            setSession({ access_token: storedToken, user: storedUser });
            setLoading(false);
          }

          // Verify/refresh user data in background
          try {
            const freshUser = await authService.getMe();
            if (mounted && freshUser) {
              setUser(freshUser);
              localStorage.setItem('auth_user', JSON.stringify(freshUser));
            }
          } catch {
            // Token expired or invalid, clear if 401
          }
          return;
        }

        // 2. Fallback: check Supabase session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('Initial session check notice:', error.message);
        }
        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          setLoading(false);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    // Listen to real-time Supabase auth state changes as fallback
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (mounted && !authService.getStoredToken()) {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.signIn(email, password);
      setUser(data.user);
      setSession(data.session);
      showToast('Welcome back!', 'success');
      return data;
    } catch (error) {
      showToast(error.message || 'Login failed. Please verify credentials.', 'error');
      throw error;
    }
  };

  const register = async (email, password, fullName) => {
    try {
      const data = await authService.signUp(email, password, fullName);
      setUser(data.user);
      setSession(data.session);
      showToast('Registration successful! Welcome to ModernWear.', 'success');
      return data;
    } catch (error) {
      showToast(error.message || 'Registration failed.', 'error');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setSession(null);
      showToast('You have been logged out.', 'info');
    } catch (error) {
      showToast(error.message || 'Error signing out.', 'error');
    }
  };

  const value = {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
