import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authAPI } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { ShieldCheck, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('loading'); // loading, success, error
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setError('Invalid verification link');
      return;
    }

    const verifyEmail = async () => {
      try {
        await authAPI.verifyEmail(token);
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setError(err.response?.data?.error || 'Verification failed');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-sm border border-slate-200 p-8 text-center"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <ShieldCheck className="h-8 w-8 text-slate-900" />
          <span className="text-xl font-semibold text-slate-900 font-heading">Nexodify</span>
        </Link>

        {status === 'loading' && (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-indigo-500 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-slate-900 font-heading">
              Verifying your email...
            </h1>
            <p className="mt-2 text-slate-600">Please wait while we confirm your email address.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 font-heading">Email Verified!</h1>
            <p className="mt-3 text-slate-600">
              Your email has been successfully verified. You can now sign in to your account.
            </p>
            <Link to="/login">
              <Button className="mt-6 bg-slate-900 hover:bg-slate-800" data-testid="verify-login-btn">
                Sign In
              </Button>
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mx-auto w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-6">
              <XCircle className="h-8 w-8 text-rose-600" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 font-heading">Verification Failed</h1>
            <p className="mt-3 text-slate-600">{error}</p>
            <div className="mt-6 space-y-3">
              <Link to="/login" className="block">
                <Button variant="outline" className="w-full">
                  Back to Login
                </Button>
              </Link>
              <Link to="/register" className="block">
                <Button className="w-full bg-slate-900 hover:bg-slate-800">
                  Create New Account
                </Button>
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
