import React, { useEffect, useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Loader2, AlertCircle } from 'lucide-react';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export default function SignInPage() {
  const navigate = useNavigate();
  const { loginWithGoogle, devLogin, isAuthenticated } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Handle Google credential response
  const handleCredentialResponse = useCallback((response) => {
    if (response.credential) {
      const result = loginWithGoogle(response.credential);
      if (result.success) {
        navigate('/dashboard');
      }
    }
  }, [loginWithGoogle, navigate]);

  // Initialize Google Identity Services
  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-btn'),
          {
            theme: 'filled_black',
            size: 'large',
            width: 320,
            text: 'continue_with',
            shape: 'rectangular',
          }
        );
      }
    };

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [handleCredentialResponse]);

  return (
    <div className="min-h-screen bg-[#070A12] flex flex-col">
      {/* Header */}
      <header className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2.5">
            <ShieldCheck className="h-7 w-7 text-[#5B6CFF]" />
            <span className="text-lg font-semibold text-white/95">Nexodify</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div
            className="bg-white/[0.04] border border-white/[0.10] rounded-2xl p-8"
            style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.55)' }}
          >
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#5B6CFF]/10 rounded-2xl mb-4">
                <ShieldCheck className="h-8 w-8 text-[#5B6CFF]" />
              </div>
              <h1 className="text-2xl font-bold text-white/95 mb-2">Welcome to Nexodify AVA</h1>
              <p className="text-white/60 text-sm">
                Sign in to run EU label compliance preflights
              </p>
            </div>

            {/* Google Sign In Button */}
            <div className="flex justify-center mb-6">
              <div id="google-signin-btn"></div>
            </div>

            {/* Dev Login for Testing */}
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.08]"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 bg-[#0a0d14] text-white/40">Or for testing</span>
                </div>
              </div>

              {/* Login Error */}
              {loginError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-400 flex-shrink-0" />
                  <span className="text-rose-400 text-sm">{loginError}</span>
                </div>
              )}
              
              <button
                onClick={async () => {
                  setIsLoggingIn(true);
                  setLoginError(null);
                  try {
                    // Call real backend dev-login API
                    await devLogin('nexodifyforyou@gmail.com');
                    navigate('/dashboard');
                  } catch (error) {
                    console.error('Login error:', error);
                    setLoginError(error.message || 'Failed to login. Is the backend running?');
                  } finally {
                    setIsLoggingIn(false);
                  }
                }}
                disabled={isLoggingIn}
                className="w-full py-3 px-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl hover:bg-emerald-500/20 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Continue as Admin (nexodifyforyou@gmail.com)'
                )}
              </button>
              
              <button
                onClick={async () => {
                  setIsLoggingIn(true);
                  setLoginError(null);
                  try {
                    // Call real backend dev-login API
                    await devLogin('demo@example.com');
                    navigate('/dashboard');
                  } catch (error) {
                    console.error('Login error:', error);
                    setLoginError(error.message || 'Failed to login. Is the backend running?');
                  } finally {
                    setIsLoggingIn(false);
                  }
                }}
                disabled={isLoggingIn}
                className="w-full py-3 px-4 bg-white/[0.04] border border-white/[0.12] text-white/70 rounded-xl hover:bg-white/[0.08] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Continue as Demo User (10 credits)'
                )}
              </button>
            </div>

            {/* Info */}
            <div className="text-center text-sm text-white/50">
              <p className="mb-4">
                By signing in, you agree to our{' '}
                <Link to="/terms" className="text-[#5B6CFF] hover:text-[#7B8CFF]">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-[#5B6CFF] hover:text-[#7B8CFF]">
                  Privacy Policy
                </Link>
              </p>
            </div>

            {/* Features */}
            <div className="mt-8 pt-6 border-t border-white/[0.06]">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-[#5B6CFF]">10</div>
                  <div className="text-xs text-white/50">Free credits</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-400">EU</div>
                  <div className="text-xs text-white/50">1169/2011 Ready</div>
                </div>
              </div>
            </div>
          </div>

          {/* Back to landing */}
          <div className="text-center mt-6">
            <Link to="/" className="text-white/50 hover:text-white/80 text-sm transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 text-center">
        <p className="text-white/30 text-xs">
          © 2025 Nexodify. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
