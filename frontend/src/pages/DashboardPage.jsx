import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { runAPI } from '../../lib/api';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { formatDate, formatCredits, getStatusColor } from '../../lib/utils';
import { motion } from 'framer-motion';
import {
  Plus,
  FileSearch,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Clock,
  TrendingUp,
  Loader2,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, credits } = useAuth();
  const [recentRuns, setRecentRuns] = useState([]);
  const [stats, setStats] = useState({ total: 0, passed: 0, failed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await runAPI.list({ limit: 5 });
        setRecentRuns(data.runs || []);
        setStats({
          total: data.total || 0,
          passed: data.passed || 0,
          failed: data.failed || 0,
        });
      } catch (err) {
        console.error('Failed to fetch runs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pass':
      case 'passed':
      case 'compliant':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'fail':
      case 'failed':
      case 'non-compliant':
        return <XCircle className="h-5 w-5 text-rose-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8" data-testid="dashboard-page">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 font-heading tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'there'}
            </h1>
            <p className="text-slate-600 mt-1">
              You have <span className="font-medium text-slate-900">{formatCredits(credits)}</span> credits available
            </p>
          </div>
          <Link to="/audit/new">
            <Button className="bg-slate-900 hover:bg-slate-800" data-testid="new-audit-btn">
              <Plus className="mr-2 h-4 w-4" />
              New Audit
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-100 rounded-sm">
                    <FileSearch className="h-6 w-6 text-slate-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-slate-900 font-heading">
                      {stats.total}
                    </div>
                    <div className="text-sm text-slate-600">Total Audits</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 rounded-sm">
                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-slate-900 font-heading">
                      {stats.passed}
                    </div>
                    <div className="text-sm text-slate-600">Passed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-rose-50 rounded-sm">
                    <XCircle className="h-6 w-6 text-rose-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-slate-900 font-heading">
                      {stats.failed}
                    </div>
                    <div className="text-sm text-slate-600">Failed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Runs */}
        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-heading">Recent Audits</CardTitle>
              <CardDescription>Your latest compliance checks</CardDescription>
            </div>
            <Link to="/runs">
              <Button variant="ghost" size="sm" className="text-indigo-600">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
              </div>
            ) : recentRuns.length === 0 ? (
              <div className="text-center py-12">
                <FileSearch className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 font-heading">No audits yet</h3>
                <p className="text-slate-600 mt-1">Start your first compliance audit to see results here.</p>
                <Link to="/audit/new">
                  <Button className="mt-4 bg-slate-900 hover:bg-slate-800">
                    <Plus className="mr-2 h-4 w-4" />
                    Start Audit
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentRuns.map((run, index) => (
                  <motion.div
                    key={run.run_id || index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={`/runs/${run.run_id}`}
                      className="flex items-center gap-4 py-4 hover:bg-slate-50 -mx-4 px-4 transition-colors"
                      data-testid={`run-item-${run.run_id}`}
                    >
                      <div className="flex-shrink-0">{getStatusIcon(run.status)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-900 truncate">
                          {run.product_name || 'Untitled Product'}
                        </div>
                        <div className="text-sm text-slate-500 truncate">
                          {run.company_name || 'Unknown Company'} · {run.country_of_sale || 'N/A'}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="hidden sm:flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(run.created_at)}
                        </div>
                        <div className={`px-2 py-1 rounded-sm text-xs font-medium ${
                          run.status?.toLowerCase().includes('pass') 
                            ? 'bg-emerald-50 text-emerald-700'
                            : run.status?.toLowerCase().includes('fail')
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {run.score ? `${Math.round(run.score * 100)}%` : run.status || 'Pending'}
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-slate-200 bg-gradient-to-br from-indigo-50 to-white">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-100 rounded-sm">
                  <TrendingUp className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 font-heading">Need more credits?</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Upgrade your plan or purchase credit packs to run more audits.
                  </p>
                  <Link to="/billing">
                    <Button variant="outline" size="sm" className="mt-3">
                      View Plans
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-gradient-to-br from-emerald-50 to-white">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-100 rounded-sm">
                  <FileSearch className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 font-heading">Ready to audit?</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Upload your label and TDS to get instant compliance results.
                  </p>
                  <Link to="/audit/new">
                    <Button size="sm" className="mt-3 bg-emerald-600 hover:bg-emerald-700">
                      Start Audit
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
