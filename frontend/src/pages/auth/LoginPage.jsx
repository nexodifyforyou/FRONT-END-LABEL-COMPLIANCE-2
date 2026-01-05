import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ShieldCheck, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginPage() {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const result = await login(data.email, data.password);
    setIsLoading(false);
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

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
            Welcome back
          </h1>
          <p className="mt-2 text-slate-600">
            Sign in to access your compliance dashboard
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
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
                data-testid="login-email-input"
                {...register('email')}
                className={errors.email ? 'border-rose-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-rose-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  data-testid="login-password-input"
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

            <Button
              type="submit"
              data-testid="login-submit-btn"
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white h-11"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Create account
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
          <blockquote className="text-white">
            <p className="text-xl font-medium font-heading leading-relaxed">
              "AVA helped us reduce compliance review time by 75% while ensuring every label meets regulatory standards."
            </p>
            <footer className="mt-4">
              <div className="text-white/80">Sarah Chen</div>
              <div className="text-white/60 text-sm">Head of Regulatory Affairs, NutraLife Inc.</div>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
