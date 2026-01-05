import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { User, Mail, Building2, Key, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../lib/api';

const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  company: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export default function SettingsPage() {
  const { user, fetchUser } = useAuth();
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      company: user?.company || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data) => {
    setProfileLoading(true);
    try {
      await api.put('/api/me', data);
      await fetchUser();
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setPasswordLoading(true);
    try {
      await api.put('/api/me/password', {
        current_password: data.currentPassword,
        new_password: data.newPassword,
      });
      resetPassword();
      toast.success('Password updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-8" data-testid="settings-page">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 font-heading tracking-tight">
            Settings
          </h1>
          <p className="text-slate-600 mt-1">Manage your account settings</p>
        </div>

        {/* Profile Settings */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    {...registerProfile('name')}
                    className={profileErrors.name ? 'border-rose-500' : ''}
                    data-testid="settings-name-input"
                  />
                  {profileErrors.name && (
                    <p className="text-sm text-rose-500">{profileErrors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    {...registerProfile('company')}
                    data-testid="settings-company-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="h-4 w-4" />
                  {user?.email}
                </div>
                <p className="text-sm text-slate-500">Email cannot be changed</p>
              </div>

              <Button
                type="submit"
                disabled={profileLoading}
                className="bg-slate-900 hover:bg-slate-800"
                data-testid="save-profile-btn"
              >
                {profileLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Settings */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <Key className="h-5 w-5" />
              Change Password
            </CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  {...registerPassword('currentPassword')}
                  className={passwordErrors.currentPassword ? 'border-rose-500' : ''}
                  data-testid="current-password-input"
                />
                {passwordErrors.currentPassword && (
                  <p className="text-sm text-rose-500">{passwordErrors.currentPassword.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...registerPassword('newPassword')}
                    className={passwordErrors.newPassword ? 'border-rose-500' : ''}
                    data-testid="new-password-input"
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-sm text-rose-500">{passwordErrors.newPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...registerPassword('confirmPassword')}
                    className={passwordErrors.confirmPassword ? 'border-rose-500' : ''}
                    data-testid="confirm-password-input"
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-sm text-rose-500">{passwordErrors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={passwordLoading}
                className="bg-slate-900 hover:bg-slate-800"
                data-testid="change-password-btn"
              >
                {passwordLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Key className="mr-2 h-4 w-4" />
                )}
                Change Password
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-rose-200">
          <CardHeader>
            <CardTitle className="font-heading text-rose-600">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-900">Delete Account</div>
                <div className="text-sm text-slate-600">
                  Permanently delete your account and all associated data
                </div>
              </div>
              <Button variant="destructive" disabled>
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
