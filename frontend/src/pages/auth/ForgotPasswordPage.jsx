import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authAPI } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ShieldCheck, Loader2, ArrowLeft, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      await authAPI.forgotPassword(data.email);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-sm border border-slate-200 p-8 text-center"
        >
          <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
            <Mail className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 font-heading">Check your email</h1>
          <p className="mt-3 text-slate-600">
            If an account exists with that email, we've sent password reset instructions.
          </p>
          <Link to="/login">
            <Button className="mt-6 bg-slate-900 hover:bg-slate-800">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
            </Button>
          </Link>
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
            Reset your password
          </h1>
          <p className="mt-2 text-slate-600 text-sm">
            Enter your email address and we'll send you instructions to reset your password.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            {error && (
              <div className="p-3 rounded-sm bg-rose-50 border border-rose-200 text-sm text-rose-600">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                data-testid="forgot-email-input"
                {...register('email')}
                className={errors.email ? 'border-rose-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-rose-500">{errors.email.message}</p>
              )}
            </div>

            <Button
              type="submit"
              data-testid="forgot-submit-btn"
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white h-11"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Send Reset Instructions'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-slate-600 hover:text-slate-900 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back to login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
