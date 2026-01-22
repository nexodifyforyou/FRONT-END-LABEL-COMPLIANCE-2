import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { completeOAuthLogin, isAuthenticated } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      setError('Missing authorization code. Please try signing in again.');
      return;
    }

    let isActive = true;

    const exchangeCode = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/exchange`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          const message = payload?.error || payload?.message || 'Unable to complete sign-in.';
          throw new Error(message);
        }

        const payload = await response.json();
        if (!payload?.token) {
          throw new Error('Authentication token missing from response.');
        }

        completeOAuthLogin(payload, 'google');

        if (isActive) {
          navigate('/dashboard', { replace: true });
        }
      } catch (err) {
        if (isActive) {
          setError(err?.message || 'Unable to complete sign-in.');
        }
      }
    };

    exchangeCode();

    return () => {
      isActive = false;
    };
  }, [completeOAuthLogin, navigate, searchParams]);

  return (
    <div className="min-h-screen bg-[#070A12] flex flex-col">
      <header className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2.5">
            <ShieldCheck className="h-7 w-7 text-[#5B6CFF]" />
            <span className="text-lg font-semibold text-white/95">Nexodify</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div
            className="bg-white/[0.04] border border-white/[0.10] rounded-2xl p-8 text-center"
            style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.55)' }}
          >
            {!error ? (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#5B6CFF]/10 rounded-2xl mb-4">
                  <Loader2 className="h-7 w-7 text-[#5B6CFF] animate-spin" />
                </div>
                <h1 className="text-2xl font-bold text-white/95 mb-2">Signing you in</h1>
                <p className="text-white/60 text-sm">
                  Completing secure Google authentication. This usually takes a moment.
                </p>
              </>
            ) : (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-500/10 rounded-2xl mb-4">
                  <AlertCircle className="h-7 w-7 text-rose-400" />
                </div>
                <h1 className="text-2xl font-bold text-white/95 mb-2">Sign-in failed</h1>
                <p className="text-white/60 text-sm mb-6">{error}</p>
                <Link
                  to="/signin"
                  className="inline-flex items-center justify-center w-full py-3 px-4 bg-white text-slate-900 rounded-xl hover:bg-slate-100 transition-colors text-sm font-semibold"
                >
                  Back to Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="py-6 px-4 text-center">
        <p className="text-white/30 text-xs">
          © 2025 Nexodify. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
