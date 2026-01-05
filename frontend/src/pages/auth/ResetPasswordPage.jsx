import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authAPI } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ShieldCheck, Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const resetSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data) => {
    if (!token) {
      setError('Invalid reset link');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await authAPI.resetPassword({ token, password: data.password });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md bg-white rounded-sm border border-slate-200 p-8 text-center">
          <h1 className="text-2xl font-semibold text-slate-900 font-heading">Invalid Link</h1>
          <p className="mt-3 text-slate-600">This password reset link is invalid or has expired.</p>
          <Link to="/forgot-password">
            <Button className="mt-6 bg-slate-900 hover:bg-slate-800">Request New Link</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-sm border border-slate-200 p-8 text-center"
        >
          <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 font-heading">Password Reset</h1>
          <p className="mt-3 text-slate-600">
            Your password has been successfully reset. You can now sign in with your new password.
          </p>
          <Button
            onClick={() => navigate('/login')}
            className="mt-6 bg-slate-900 hover:bg-slate-800"
          >
            Sign In
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-sm border border-slate-200 p-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <ShieldCheck className="h-8 w-8 text-slate-900" />
            <span className="text-xl font-semibold text-slate-900 font-heading">Nexodify</span>
          </Link>

          <h1 className="text-2xl font-semibold text-slate-900 font-heading">
            Set new password
          </h1>
          <p className="mt-2 text-slate-600 text-sm">
            Enter your new password below.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            {error && (
              <div className="p-3 rounded-sm bg-rose-50 border border-rose-200 text-sm text-rose-600">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  data-testid="reset-password-input"
                  {...register('password')}
                  className={errors.password ? 'border-rose-500 pr-10' : 'pr-10'}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-rose-500">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                data-testid="reset-confirm-password-input"
                {...register('confirmPassword')}
                className={errors.confirmPassword ? 'border-rose-500' : ''}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-rose-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              data-testid="reset-submit-btn"
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white h-11"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
