import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, billingAPI } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('ava_token');
      if (!token) {
        setLoading(false);
        return;
      }
      const { data } = await authAPI.me();
      setUser(data.user);
      setCredits(data.credits || 0);
    } catch (err) {
      console.error('Auth fetch error:', err);
      localStorage.removeItem('ava_token');
      localStorage.removeItem('ava_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshCredits = useCallback(async () => {
    try {
      const { data } = await billingAPI.getWallet();
      setCredits(data.balance || 0);
    } catch (err) {
      console.error('Credits fetch error:', err);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password) => {
    setError(null);
    try {
      const { data } = await authAPI.login({ email, password });
      localStorage.setItem('ava_token', data.token);
      localStorage.setItem('ava_user', JSON.stringify(data.user));
      setUser(data.user);
      setCredits(data.credits || 0);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const { data } = await authAPI.register(userData);
      return { success: true, message: data.message };
    } catch (err) {
      const message = err.response?.data?.error || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('ava_token');
      localStorage.removeItem('ava_user');
      setUser(null);
      setCredits(0);
    }
  };

  const value = {
    user,
    credits,
    loading,
    error,
    login,
    register,
    logout,
    fetchUser,
    refreshCredits,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
