import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, setAuthToken, getAuthToken, removeAuthToken } from '../lib/api';

const AuthContext = createContext(null);

const ADMIN_EMAIL = process.env.REACT_APP_ADMIN_EMAIL || 'nexodifyforyou@gmail.com';

// Initialize wallet for new users
const createDefaultWallet = () => ({
  plan: 'starter',
  monthly_credits: 10,
  credits_available: 10,
  renewal_date: getNextMonthFirstDay(),
  ledger: []
});

function getNextMonthFirstDay() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString().split('T')[0];
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Check if user is admin
  const isAdmin = user?.email === ADMIN_EMAIL;

  // Get credits display
  const credits = isAdmin ? Infinity : (wallet?.credits_available || 0);
  const creditsDisplay = isAdmin ? 'Unlimited' : (wallet?.credits_available || 0);

  // Load auth from localStorage on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('ava_auth');
    const storedWallet = localStorage.getItem('ava_wallet');
    const storedToken = getAuthToken();
    
    if (storedAuth && storedToken) {
      try {
        const authData = JSON.parse(storedAuth);
        setUser(authData);
        setToken(storedToken);
        
        // Load or create wallet
        if (storedWallet) {
          setWallet(JSON.parse(storedWallet));
        } else if (authData.email !== ADMIN_EMAIL) {
          const newWallet = createDefaultWallet();
          localStorage.setItem('ava_wallet', JSON.stringify(newWallet));
          setWallet(newWallet);
        }
      } catch (e) {
        console.error('Error parsing auth data:', e);
        localStorage.removeItem('ava_auth');
        removeAuthToken();
      }
    }
    setLoading(false);
  }, []);

  // Google login handler (kept for compatibility)
  const loginWithGoogle = useCallback((credential) => {
    // Decode JWT from Google
    const payload = JSON.parse(atob(credential.split('.')[1]));
    
    const authData = {
      provider: 'google',
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      iat: new Date().toISOString()
    };
    
    localStorage.setItem('ava_auth', JSON.stringify(authData));
    setUser(authData);
    
    // Create wallet for non-admin users
    if (authData.email !== ADMIN_EMAIL) {
      const existingWallet = localStorage.getItem('ava_wallet');
      if (!existingWallet) {
        const newWallet = createDefaultWallet();
        localStorage.setItem('ava_wallet', JSON.stringify(newWallet));
        setWallet(newWallet);
      } else {
        setWallet(JSON.parse(existingWallet));
      }
    }
    
    return { success: true };
  }, []);

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem('ava_auth');
    removeAuthToken();
    setUser(null);
    setToken(null);
  }, []);

  // Dev login - calls real backend API
  const devLogin = useCallback(async (email) => {
    try {
      // Call backend dev-login endpoint
      const response = await authAPI.devLogin(email);
      
      // Store the token
      if (response.token) {
        setAuthToken(response.token);
        setToken(response.token);
      }
      
      // Create auth data from response or email
      const authData = {
        provider: 'dev',
        email: response.email || email,
        name: response.name || email.split('@')[0],
        picture: response.picture || '',
        iat: new Date().toISOString(),
        user_id: response.user_id,
      };
      
      localStorage.setItem('ava_auth', JSON.stringify(authData));
      setUser(authData);
      
      // Handle wallet for non-admin users
      if (authData.email !== ADMIN_EMAIL) {
        const existingWallet = localStorage.getItem('ava_wallet');
        if (existingWallet) {
          setWallet(JSON.parse(existingWallet));
        } else {
          const newWallet = createDefaultWallet();
          localStorage.setItem('ava_wallet', JSON.stringify(newWallet));
          setWallet(newWallet);
        }
      }
      
      return { success: true, token: response.token };
    } catch (error) {
      console.error('Dev login error:', error);
      throw error;
    }
  }, []);

  // Deduct credits
  const deductCredits = useCallback((amount, reason, runId) => {
    if (isAdmin) return true; // Admin never deducts
    
    if (!wallet || wallet.credits_available < amount) {
      return false;
    }
    
    const newWallet = {
      ...wallet,
      credits_available: wallet.credits_available - amount,
      ledger: [
        ...wallet.ledger,
        {
          ts: new Date().toISOString(),
          type: 'spend',
          delta: -amount,
          reason,
          run_id: runId
        }
      ]
    };
    
    localStorage.setItem('ava_wallet', JSON.stringify(newWallet));
    setWallet(newWallet);
    return true;
  }, [wallet, isAdmin]);

  // Add credits (top-up)
  const addCredits = useCallback((amount, euroAmount) => {
    const currentWallet = wallet || createDefaultWallet();
    
    const newWallet = {
      ...currentWallet,
      credits_available: currentWallet.credits_available + amount,
      ledger: [
        ...currentWallet.ledger,
        {
          ts: new Date().toISOString(),
          type: 'topup',
          delta: amount,
          reason: `Top-up €${euroAmount}`,
          run_id: null
        }
      ]
    };
    
    localStorage.setItem('ava_wallet', JSON.stringify(newWallet));
    setWallet(newWallet);
    return true;
  }, [wallet]);

  // Check if user has enough credits
  const hasEnoughCredits = useCallback((amount) => {
    if (isAdmin) return true;
    return wallet && wallet.credits_available >= amount;
  }, [wallet, isAdmin]);

  // Refresh wallet from localStorage
  const refreshWallet = useCallback(() => {
    const storedWallet = localStorage.getItem('ava_wallet');
    if (storedWallet) {
      setWallet(JSON.parse(storedWallet));
    }
  }, []);

  const value = {
    user,
    wallet,
    credits,
    creditsDisplay,
    loading,
    isAuthenticated: !!user,
    isAdmin,
    loginWithGoogle,
    devLogin,
    logout,
    deductCredits,
    addCredits,
    hasEnoughCredits,
    refreshWallet,
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
