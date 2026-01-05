import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ShieldCheck, Eye, EyeOff, Loader2, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  company: z.string().min(2, 'Company name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export default function RegisterPage() {
  const { register: registerUser, error } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const result = await registerUser({
      name: data.name,
      email: data.email,
      company: data.company,
      password: data.password,
    });
    setIsLoading(false);
    if (result.success) {
      setSuccess(true);
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
          <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 font-heading">Check your email</h1>
          <p className="mt-3 text-slate-600">
            We've sent a verification link to your email address. Please click the link to activate your account.
          </p>
          <Button
            onClick={() => navigate('/login')}
            className="mt-6 bg-slate-900 hover:bg-slate-800"
          >
            Back to Login
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-12">
            <ShieldCheck className="h-8 w-8 text-slate-900" />
            <span className="text-xl font-semibold text-slate-900 font-heading">Nexodify</span>
          </Link>

          <h1 className="text-3xl font-semibold text-slate-900 font-heading tracking-tight">
            Create your account
          </h1>
          <p className="mt-2 text-slate-600">
            Start auditing your product labels in minutes
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            {error && (
              <div className="p-3 rounded-sm bg-rose-50 border border-rose-200 text-sm text-rose-600">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  data-testid="register-name-input"
                  {...register('name')}
                  className={errors.name ? 'border-rose-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-rose-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  placeholder="Acme Inc"
                  data-testid="register-company-input"
                  {...register('company')}
                  className={errors.company ? 'border-rose-500' : ''}
                />
                {errors.company && (
                  <p className="text-sm text-rose-500">{errors.company.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Work Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                data-testid="register-email-input"
                {...register('email')}
                className={errors.email ? 'border-rose-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-rose-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  data-testid="register-password-input"
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
                placeholder="Confirm your password"
                data-testid="register-confirm-password-input"
                {...register('confirmPassword')}
                className={errors.confirmPassword ? 'border-rose-500' : ''}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-rose-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              data-testid="register-submit-btn"
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white h-11 mt-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <p className="text-xs text-slate-500 text-center">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-indigo-600 hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>
            </p>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right: Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-slate-900">
        <img
          src="https://images.pexels.com/photos/8108729/pexels-photo-8108729.jpeg"
          alt="Abstract geometric data"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-12">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <div className="font-medium text-white">Instant Analysis</div>
                <div className="text-white/60 text-sm">Get compliance results in under 30 seconds</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <div className="font-medium text-white">Multi-Region Support</div>
                <div className="text-white/60 text-sm">FDA, EU, and international regulations</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <div className="font-medium text-white">Detailed Reports</div>
                <div className="text-white/60 text-sm">Downloadable PDF reports with actionable fixes</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
