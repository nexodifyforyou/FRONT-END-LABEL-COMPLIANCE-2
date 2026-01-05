import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../lib/api';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Textarea } from '../../components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { formatDate, formatCredits } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Coins,
  FileSearch,
  Loader2,
  Send,
  Shield,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalUsers: 0, totalRuns: 0, totalCredits: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grantLoading, setGrantLoading] = useState(false);
  const [grantForm, setGrantForm] = useState({ userId: '', credits: '', reason: '' });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          adminAPI.getStats(),
          adminAPI.getUsers({ limit: 20 }),
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data.users || []);
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAdmin, navigate]);

  const handleGrantCredits = async (e) => {
    e.preventDefault();
    if (!grantForm.userId || !grantForm.credits) {
      toast.error('Please fill in user ID and credits');
      return;
    }
    setGrantLoading(true);
    try {
      await adminAPI.grantCredits(grantForm.userId, parseFloat(grantForm.credits), grantForm.reason);
      toast.success(`Granted ${grantForm.credits} credits`);
      setGrantForm({ userId: '', credits: '', reason: '' });
      // Refresh users
      const { data } = await adminAPI.getUsers({ limit: 20 });
      setUsers(data.users || []);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to grant credits');
    } finally {
      setGrantLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8" data-testid="admin-page">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-sm">
            <Shield className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 font-heading tracking-tight">
              Admin Panel
            </h1>
            <p className="text-slate-600">Manage users and system settings</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-100 rounded-sm">
                  <Users className="h-6 w-6 text-slate-600" />
                </div>
                <div>
                  <div className="text-2xl font-semibold text-slate-900 font-heading">
                    {stats.totalUsers || 0}
                  </div>
                  <div className="text-sm text-slate-600">Total Users</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-100 rounded-sm">
                  <FileSearch className="h-6 w-6 text-slate-600" />
                </div>
                <div>
                  <div className="text-2xl font-semibold text-slate-900 font-heading">
                    {stats.totalRuns || 0}
                  </div>
                  <div className="text-sm text-slate-600">Total Audits</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-100 rounded-sm">
                  <Coins className="h-6 w-6 text-slate-600" />
                </div>
                <div>
                  <div className="text-2xl font-semibold text-slate-900 font-heading">
                    {formatCredits(stats.totalCredits || 0)}
                  </div>
                  <div className="text-sm text-slate-600">Credits Issued</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grant Credits */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="font-heading">Grant Credits</CardTitle>
            <CardDescription>Manually grant credits to a user for testing</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGrantCredits} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userId">User ID or Email</Label>
                  <Input
                    id="userId"
                    placeholder="user@example.com"
                    value={grantForm.userId}
                    onChange={(e) => setGrantForm({ ...grantForm, userId: e.target.value })}
                    data-testid="grant-user-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="credits">Credits</Label>
                  <Input
                    id="credits"
                    type="number"
                    step="0.1"
                    placeholder="10"
                    value={grantForm.credits}
                    onChange={(e) => setGrantForm({ ...grantForm, credits: e.target.value })}
                    data-testid="grant-credits-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason (optional)</Label>
                  <Input
                    id="reason"
                    placeholder="Testing grant"
                    value={grantForm.reason}
                    onChange={(e) => setGrantForm({ ...grantForm, reason: e.target.value })}
                    data-testid="grant-reason-input"
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={grantLoading}
                className="bg-indigo-600 hover:bg-indigo-700"
                data-testid="grant-credits-btn"
              >
                {grantLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Grant Credits
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="font-heading">Users</CardTitle>
            <CardDescription>All registered users</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id || user.email}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.company || '-'}</TableCell>
                    <TableCell>{formatCredits(user.credits || 0)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-indigo-100 text-indigo-700' 
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {user.role || 'user'}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {formatDate(user.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {users.length === 0 && (
              <div className="text-center py-8 text-slate-500">No users found</div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
