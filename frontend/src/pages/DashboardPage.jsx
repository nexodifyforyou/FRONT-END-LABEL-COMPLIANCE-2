import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import {
  ShieldCheck,
  Play,
  History,
  Coins,
  ChevronRight,
  Download,
  ExternalLink,
  LogOut,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Moon,
  LayoutDashboard,
  Plus,
  FileText,
  Settings,
  Clock,
  TrendingUp,
  BarChart3,
  AlertCircle,
  RefreshCw,
  Users,
  BookOpen,
  Zap,
  Target,
  Activity,
  Loader2,
} from 'lucide-react';
import { runAPI, API_BASE_URL } from '../lib/api';

// Verdict Badge component
const VerdictBadge = ({ verdict, size = 'sm' }) => {
  const styles = {
    PASS: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    WARN: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    CONDITIONAL: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    FAIL: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  };
  const icons = {
    PASS: CheckCircle,
    WARN: AlertTriangle,
    CONDITIONAL: AlertTriangle,
    FAIL: XCircle,
  };
  const Icon = icons[verdict] || AlertTriangle;
  const sizeClass = size === 'lg' ? 'px-3 py-1.5 text-sm' : 'px-2 py-0.5 text-xs';
  
  return (
    <span className={`inline-flex items-center gap-1.5 ${sizeClass} font-medium rounded-full border ${styles[verdict] || styles.CONDITIONAL}`}>
      <Icon className={size === 'lg' ? 'h-4 w-4' : 'h-3 w-3'} />
      {verdict}
    </span>
  );
};

// Halal Badge
const HalalBadge = () => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
    <Moon className="h-3 w-3" />
    Halal
  </span>
);

// KPI Tile Component
const KPITile = ({ icon: Icon, label, value, subtext, color = 'default' }) => {
  const colors = {
    default: 'text-white/90',
    success: 'text-emerald-400',
    warning: 'text-amber-400',
    danger: 'text-rose-400',
    muted: 'text-white/40',
  };
  
  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 hover:border-white/[0.12] transition-all">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-white/40" />
        <span className="text-xs text-white/50 uppercase tracking-wider">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${colors[color]}`}>{value}</div>
      {subtext && <div className="text-xs text-white/40 mt-1">{subtext}</div>}
    </div>
  );
};

// Sidebar Link Component
const SidebarLink = ({ icon: Icon, label, to, active, badge }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
      active
        ? 'bg-[#5B6CFF]/10 text-[#5B6CFF] border border-[#5B6CFF]/20'
        : 'text-white/60 hover:text-white/90 hover:bg-white/[0.04]'
    }`}
  >
    <Icon className="h-5 w-5" />
    <span className="text-sm font-medium">{label}</span>
    {badge && (
      <span className="ml-auto px-2 py-0.5 text-xs bg-[#5B6CFF]/20 text-[#5B6CFF] rounded-full">
        {badge}
      </span>
    )}
  </Link>
);

// Getting Started Checklist Item
const ChecklistItem = ({ checked, label, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
      checked ? 'opacity-60' : 'hover:bg-white/[0.04]'
    }`}
  >
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
      checked ? 'bg-emerald-500 border-emerald-500' : 'border-white/20'
    }`}>
      {checked && <CheckCircle className="h-3 w-3 text-white" />}
    </div>
    <span className={`text-sm ${checked ? 'text-white/50 line-through' : 'text-white/80'}`}>
      {label}
    </span>
  </div>
);

const getRunTs = (run) => run?.ts || run?.created_at || run?.updated_at;

const getRunDateValue = (run) => {
  const ts = getRunTs(run);
  const date = ts ? new Date(ts) : null;
  return date && !Number.isNaN(date.getTime()) ? date.getTime() : 0;
};

const formatRunDate = (run) => {
  const ts = getRunTs(run);
  const date = ts ? new Date(ts) : null;
  return date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString() : '—';
};

const normalizeScore = (score) => {
  if (score === null || score === undefined) return null;
  return score <= 1 ? Math.round(score * 100) : Math.round(score);
};

const isPassVerdict = (verdict) => (verdict || '').toUpperCase() === 'PASS';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, wallet, credits, creditsDisplay, isAdmin, logout, token, loading, activeEmail } = useAuth();
  const [runs, setRuns] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    runs7d: 0,
    runs30d: 0,
    passRate: 0,
    avgIssues: 0,
    avgRuntime: null,
    lastRun: null,
    trend: [],
    topFailingChecks: [],
    issuesByRunId: {},
  });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [checklist, setChecklist] = useState({
    uploadLabel: false,
    uploadTds: false,
    chooseMarket: false,
    runPreflight: false,
    reviewIssues: false,
    downloadPdf: false,
    saveTemplate: false,
  });
  const [backendStatus, setBackendStatus] = useState('unknown'); // 'unknown', 'checking', 'online', 'offline', 'unauthorized'
  const hasWarnedRunShape = useRef(false);

  const fetchRuns = useCallback(async () => {
    if (!token) {
      setBackendStatus('unknown');
      return;
    }
    setBackendStatus('checking');
    try {
      const response = await runAPI.listRuns();
      const runsData = Array.isArray(response?.items) ? response.items : [];
      if (!Array.isArray(response?.items) && response?.items && !hasWarnedRunShape.current) {
        console.warn('Expected runs response with items array, received:', response);
        hasWarnedRunShape.current = true;
      }
      const sortedRuns = [...runsData].sort((a, b) => getRunDateValue(b) - getRunDateValue(a));
      setRuns(sortedRuns);
      await buildDashboardStats(sortedRuns);
      setBackendStatus('online');

      // Auto-check checklist items based on runs
      if (sortedRuns.length > 0) {
        setChecklist(prev => ({
          ...prev,
          uploadLabel: true,
          uploadTds: true,
          chooseMarket: true,
          runPreflight: true,
        }));
      }
    } catch (error) {
      console.error('Error loading runs:', error);
      const status = error?.response?.status;
      if (status === 401) {
        setBackendStatus('unauthorized');
        return;
      }
      const isNetworkError = !error?.response
        || error?.code === 'ECONNREFUSED'
        || error?.code === 'ECONNABORTED'
        || error?.code === 'ETIMEDOUT';
      if (isNetworkError || (status && status >= 500)) {
        setBackendStatus('offline');
      } else {
        setBackendStatus('unknown');
      }
    }
  }, [token]);

  const buildDashboardStats = async (runsData) => {
    const sortedRuns = [...runsData].sort((a, b) => getRunDateValue(b) - getRunDateValue(a));
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const runs7d = sortedRuns.filter((run) => getRunDateValue(run) >= sevenDaysAgo).length;
    const runs30dRuns = sortedRuns.filter((run) => getRunDateValue(run) >= thirtyDaysAgo);
    const runs30d = runs30dRuns.length;
    const passRuns30d = runs30dRuns.filter((run) => isPassVerdict(run.verdict)).length;
    const passRate = runs30d > 0 ? Math.round((passRuns30d / runs30d) * 100) : 0;
    const lastRun = sortedRuns[0] || null;

    const recentRuns = sortedRuns.slice(0, 14);
    const issuesByRunId = {};
    const avgIssues = null;
    const trend = recentRuns.slice().reverse().map((run) => ({
      runId: run.run_id,
      verdict: run.verdict,
      score: run.score,
      label: run.product_name,
    }));
    const topFailingChecks = [];

    setDashboardStats({
      runs7d,
      runs30d,
      passRate,
      avgIssues,
      avgRuntime: null,
      lastRun,
      trend,
      topFailingChecks,
      issuesByRunId,
    });
  };

  // Load runs from backend API
  useEffect(() => {
    if (loading || !token) {
      return;
    }
    fetchRuns();
    
    // Load checklist from localStorage
    const storedChecklist = localStorage.getItem('ava_checklist');
    if (storedChecklist) {
      setChecklist(JSON.parse(storedChecklist));
    }
  }, [loading, token, fetchRuns]);

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    const checkHealth = async () => {
      try {
        const health = await runAPI.healthCheck();
        const isOk = health?.ok === true || health?.status === 'ok' || health?.status === 'healthy';
        if (isOk) {
          setBackendStatus((prev) => (prev === 'offline' ? 'online' : prev));
        }
      } catch (error) {
        // Ignore health check errors; fetchRuns handles status updates.
      }
    };

    const intervalId = setInterval(checkHealth, 15000);
    checkHealth();

    return () => clearInterval(intervalId);
  }, [token]);

  // Save checklist to localStorage
  const toggleChecklistItem = (key) => {
    const newChecklist = { ...checklist, [key]: !checklist[key] };
    setChecklist(newChecklist);
    localStorage.setItem('ava_checklist', JSON.stringify(newChecklist));
  };

  const lastRunScore = normalizeScore(dashboardStats.lastRun?.score);
  const lastRunLabel = dashboardStats.lastRun
    ? `${dashboardStats.lastRun.verdict || '—'}${lastRunScore !== null ? ` · ${lastRunScore}%` : ''}`
    : 'No runs';

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const handleDownloadPdf = async (run) => {
    try {
      // Get PDF URL from run data or construct default
      const pdfUrl = run?.files?.pdf 
        ? `${API_BASE_URL}${run.files.pdf}`
        : runAPI.getPdfUrl(run.run_id);
      
      // Download the PDF
      const response = await fetch(pdfUrl, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('ava_token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${run.run_id}-report.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      // Mark checklist
      if (!checklist.downloadPdf) {
        toggleChecklistItem('downloadPdf');
      }
    } catch (error) {
      console.error('PDF download error:', error);
      // Fallback to direct link
      const pdfUrl = run?.files?.pdf 
        ? `${API_BASE_URL}${run.files.pdf}`
        : runAPI.getPdfUrl(run.run_id);
      window.open(pdfUrl, '_blank');
    }
  };

  // Navigate to run page - no more demo runs, all runs go through backend
  const handleStartRun = () => {
    navigate('/run');
  };

  // Checklist progress
  const checklistProgress = Object.values(checklist).filter(Boolean).length;
  const checklistTotal = Object.keys(checklist).length;

  if (!loading && !token) {
    return (
      <div className="min-h-screen bg-[#070A12] flex flex-col items-center justify-center text-white px-4 text-center">
        <XCircle className="h-12 w-12 text-rose-400 mb-4" />
        <h1 className="text-xl font-semibold mb-2">Please sign in</h1>
        <p className="text-white/60 mb-6 max-w-md">
          You need to sign in to view your runs and dashboard stats.
        </p>
        <Button onClick={() => navigate('/signin')} className="bg-[#5B6CFF] hover:bg-[#4A5BEE]">
          Go to Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070A12] text-white flex">
      {/* Left Sidebar */}
      <aside className="w-64 border-r border-white/[0.06] flex flex-col">
        {/* Brand */}
        <div className="p-6 border-b border-white/[0.06]">
          <Link to="/" className="flex items-center gap-2.5">
            <ShieldCheck className="h-7 w-7 text-[#5B6CFF]" />
            <span className="text-lg font-semibold text-white/95">Nexodify</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <SidebarLink icon={LayoutDashboard} label="Dashboard" to="/dashboard" active />
          <SidebarLink icon={Plus} label="New Run" to="/run" />
          <SidebarLink icon={FileText} label="Templates" to="/dashboard" badge="Soon" />
          <SidebarLink icon={History} label="History" to="/history" badge={runs.length > 0 ? runs.length : null} />
          <SidebarLink icon={Settings} label="Settings" to="/billing" />
        </nav>

        {/* Credits Section */}
        <div className="p-4 border-t border-white/[0.06]">
          <Link
            to="/billing"
            className="block p-4 bg-gradient-to-br from-[#5B6CFF]/10 to-transparent border border-[#5B6CFF]/20 rounded-xl hover:border-[#5B6CFF]/40 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <Coins className="h-4 w-4 text-amber-400" />
              <span className="text-xs text-white/50">Credits</span>
            </div>
            <div className="text-xl font-bold">
              {isAdmin ? (
                <span className="text-emerald-400">Unlimited</span>
              ) : (
                <span className="text-white/95">{creditsDisplay}</span>
              )}
            </div>
            {!isAdmin && (
              <div className="mt-2 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#5B6CFF] to-[#7B8CFF] rounded-full"
                  style={{ width: `${Math.min(100, ((wallet?.credits_available || 0) / (wallet?.monthly_credits || 10)) * 100)}%` }}
                />
              </div>
            )}
          </Link>
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-white/[0.06]">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.04] transition-colors"
            >
              {user?.picture ? (
                <img src={user.picture} alt={user.name} className="h-8 w-8 rounded-full" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-[#5B6CFF] flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
              <div className="flex-1 text-left min-w-0">
                <div className="text-sm font-medium text-white/90 truncate">{user?.name}</div>
                <div className="text-xs text-white/40 truncate">{activeEmail}</div>
              </div>
            </button>

            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#0f1219] border border-white/[0.08] rounded-xl shadow-xl z-50 py-1">
                  <div className="px-4 py-2 text-xs text-white/40">
                    Signed in as <span className="text-white/80">{activeEmail || 'Unknown account'}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-white/70 hover:bg-white/[0.04] flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Switch account
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-white/70 hover:bg-white/[0.04] flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#070A12]/80 backdrop-blur-xl border-b border-white/[0.06]">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-white/95">Dashboard</h1>
              <p className="text-sm text-white/40">Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex flex-col items-end text-right">
                <span className="text-xs text-white/40">Signed in as</span>
                <span className="text-sm text-white/80">{activeEmail || 'Unknown account'}</span>
              </div>
              {/* Backend Status */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.02] border border-white/[0.08] rounded-full">
                <div className={`h-2 w-2 rounded-full ${
                  backendStatus === 'online' ? 'bg-emerald-400' :
                  backendStatus === 'unauthorized' ? 'bg-amber-400' :
                  backendStatus === 'offline' ? 'bg-rose-400' :
                  backendStatus === 'checking' ? 'bg-amber-400 animate-pulse' :
                  'bg-white/30'
                }`} />
                <span className="text-xs text-white/60">
                  {backendStatus === 'online' ? 'Backend Online' :
                   backendStatus === 'unauthorized' ? 'Auth required / session expired' :
                   backendStatus === 'offline' ? 'Backend Offline' :
                   backendStatus === 'checking' ? 'Checking...' :
                   'Unknown'}
                </span>
                {backendStatus === 'offline' && (
                  <button 
                    onClick={fetchRuns}
                    className="text-[#5B6CFF] hover:text-[#4A5BEE] text-xs ml-1"
                  >
                    Retry
                  </button>
                )}
                {backendStatus === 'unauthorized' && (
                  <button
                    onClick={() => navigate('/signin')}
                    className="text-[#5B6CFF] hover:text-[#4A5BEE] text-xs ml-1"
                  >
                    Go to Sign In
                  </button>
                )}
              </div>
              <Button onClick={() => navigate('/run')} className="bg-[#5B6CFF] hover:bg-[#4A5BEE] rounded-xl">
                <Plus className="mr-2 h-4 w-4" />
                New Run
              </Button>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-6">
          {/* Row 1: KPI Strip */}
          <div className="grid grid-cols-6 gap-4">
            <KPITile
              icon={Activity}
              label="Runs (7d)"
              value={runs.length > 0 ? dashboardStats.runs7d : '—'}
              subtext={runs.length === 0 ? 'Run your first preflight' : null}
              color={runs.length === 0 ? 'muted' : 'default'}
            />
            <KPITile
              icon={BarChart3}
              label="Runs (30d)"
              value={runs.length > 0 ? dashboardStats.runs30d : '—'}
              color={runs.length === 0 ? 'muted' : 'default'}
            />
            <KPITile
              icon={Target}
              label="Pass Rate"
              value={runs.length > 0 ? `${dashboardStats.passRate}%` : '—'}
              color={runs.length === 0 ? 'muted' : dashboardStats.passRate >= 80 ? 'success' : dashboardStats.passRate >= 50 ? 'warning' : 'danger'}
            />
            <KPITile
              icon={AlertCircle}
              label="Avg Issues"
              value={runs.length > 0 ? (dashboardStats.avgIssues ?? '—') : '—'}
              color={runs.length === 0 ? 'muted' : 'default'}
            />
            <KPITile
              icon={Zap}
              label="Avg Runtime"
              value={dashboardStats.avgRuntime ?? '—'}
              color={dashboardStats.avgRuntime ? 'default' : 'muted'}
            />
            <KPITile
              icon={CheckCircle}
              label="Last Run"
              value={lastRunLabel}
              color={dashboardStats.lastRun ? (isPassVerdict(dashboardStats.lastRun.verdict) ? 'success' : dashboardStats.lastRun.verdict === 'FAIL' ? 'danger' : 'warning') : 'muted'}
            />
          </div>

          {/* Row 2: Main Content */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left: Recent Runs Table */}
            <div className="col-span-8">
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
                  <h2 className="text-base font-semibold text-white/90">Recent Runs</h2>
                  {runs.length > 0 && (
                    <Link to="/history" className="text-xs text-[#5B6CFF] hover:text-[#7B8CFF]">
                      View all →
                    </Link>
                  )}
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/[0.04] text-xs text-white/40 uppercase tracking-wider">
                  <div className="col-span-3">Product / SKU</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-2">Market</div>
                  <div className="col-span-2">Result</div>
                  <div className="col-span-1">Issues</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

                {/* Table Body */}
                {runs.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <History className="h-10 w-10 text-white/15 mx-auto mb-3" />
                    <p className="text-white/50 text-sm mb-1">No runs yet</p>
                    <p className="text-white/30 text-xs mb-4">Start your first preflight to see results here</p>
                    <Button
                      onClick={handleStartRun}
                      size="sm"
                      className="bg-[#5B6CFF] hover:bg-[#4A5BEE]"
                    >
                      <Plus className="mr-2 h-3 w-3" />
                      Start New Run
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-white/[0.04]">
                    {runs.slice(0, 5).map((run) => (
                      <div key={run.run_id} className="grid grid-cols-12 gap-4 px-6 py-3 hover:bg-white/[0.02] transition-colors items-center">
                        <div className="col-span-3">
                          <div className="text-sm text-white/90 truncate">{run.product_name}</div>
                          <div className="text-xs text-white/40 font-mono">{run.run_id}</div>
                        </div>
                        <div className="col-span-2 text-sm text-white/50">
                          {formatRunDate(run)}
                        </div>
                        <div className="col-span-2 flex items-center gap-1.5">
                          <span className="text-xs text-white/60">EU</span>
                          {run.halal && <HalalBadge />}
                        </div>
                        <div className="col-span-2">
                          <VerdictBadge verdict={run.verdict} />
                        </div>
                        <div className="col-span-1 text-sm text-white/60">
                          {dashboardStats.issuesByRunId[run.run_id] ?? '—'}
                        </div>
                        <div className="col-span-2 flex items-center justify-end gap-1">
                          <button
                            onClick={() => navigate(`/report/${run.run_id}`)}
                            className="p-1.5 hover:bg-white/[0.06] rounded-lg transition-colors"
                            title="View"
                          >
                            <ExternalLink className="h-4 w-4 text-white/50" />
                          </button>
                          <button
                            onClick={() => navigate('/run')}
                            className="p-1.5 hover:bg-white/[0.06] rounded-lg transition-colors"
                            title="Re-run"
                          >
                            <RefreshCw className="h-4 w-4 text-white/50" />
                          </button>
                          <button
                            onClick={() => handleDownloadPdf(run)}
                            className="p-1.5 hover:bg-white/[0.06] rounded-lg transition-colors"
                            title="Download PDF"
                          >
                            <Download className="h-4 w-4 text-white/50" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Next Actions + Getting Started */}
            <div className="col-span-4 space-y-4">
              {/* Next Actions Card */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white/90 mb-4">Next Actions</h3>
                <div className="space-y-2">
                  <Button
                    onClick={() => navigate('/run')}
                    className="w-full justify-start bg-[#5B6CFF] hover:bg-[#4A5BEE] rounded-xl h-10"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Start New Run
                  </Button>
                  <Button
                    onClick={() => runs.length > 0 && navigate(`/report/${runs[0].run_id}`)}
                    variant="outline"
                    disabled={runs.length === 0}
                    className="w-full justify-start border-white/[0.12] text-white/70 hover:bg-white/[0.04] rounded-xl h-10 disabled:opacity-40"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    View Last Run
                  </Button>
                </div>
              </div>

              {/* Getting Started Checklist */}
              <div className="bg-gradient-to-br from-[#5B6CFF]/5 to-transparent border border-[#5B6CFF]/10 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white/90">Getting Started</h3>
                  <span className="text-xs text-[#5B6CFF]">{checklistProgress}/{checklistTotal}</span>
                </div>
                
                {/* Progress Bar */}
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-gradient-to-r from-[#5B6CFF] to-emerald-400 rounded-full transition-all"
                    style={{ width: `${(checklistProgress / checklistTotal) * 100}%` }}
                  />
                </div>

                <div className="space-y-1">
                  <ChecklistItem checked={checklist.uploadLabel} label="Upload Label" onClick={() => toggleChecklistItem('uploadLabel')} />
                  <ChecklistItem checked={checklist.uploadTds} label="Upload TDS" onClick={() => toggleChecklistItem('uploadTds')} />
                  <ChecklistItem checked={checklist.chooseMarket} label="Choose Market" onClick={() => toggleChecklistItem('chooseMarket')} />
                  <ChecklistItem checked={checklist.runPreflight} label="Run Preflight" onClick={() => toggleChecklistItem('runPreflight')} />
                  <ChecklistItem checked={checklist.reviewIssues} label="Review Issues" onClick={() => toggleChecklistItem('reviewIssues')} />
                  <ChecklistItem checked={checklist.downloadPdf} label="Download PDF" onClick={() => toggleChecklistItem('downloadPdf')} />
                  <ChecklistItem checked={checklist.saveTemplate} label="Save as Template" onClick={() => toggleChecklistItem('saveTemplate')} />
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Compliance Radar + Alerts */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left: Compliance Radar */}
            <div className="col-span-8 grid grid-cols-2 gap-4">
              {/* Pass/Fail Trend */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white/90">Pass/Fail Trend</h3>
                  <span className="text-xs text-white/40">Last 14 runs</span>
                </div>
                
                {dashboardStats.trend.length === 0 ? (
                  <div className="text-center py-6">
                    <TrendingUp className="h-8 w-8 text-white/15 mx-auto mb-2" />
                    <p className="text-xs text-white/40">Example view</p>
                    <div className="flex justify-center gap-1 mt-4">
                      {[20, 35, 28, 42, 25, 38, 22, 45, 30, 33, 27, 40, 24, 36].map((height, i) => (
                        <div
                          key={i}
                          className={`w-4 rounded ${
                            i % 3 === 0 ? 'bg-emerald-500/30' : i % 5 === 0 ? 'bg-rose-500/30' : 'bg-amber-500/30'
                          }`}
                          style={{ height: `${height}px` }}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center gap-1">
                    {dashboardStats.trend.map((run, i) => {
                      const scoreValue = normalizeScore(run.score);
                      const barHeight = scoreValue !== null ? Math.max(20, scoreValue / 2) : 28;
                      const verdictValue = (run.verdict || '').toUpperCase();
                      const barColor = verdictValue === 'PASS'
                        ? 'bg-emerald-500'
                        : verdictValue === 'FAIL'
                          ? 'bg-rose-500'
                          : 'bg-amber-500';
                      const titleScore = scoreValue !== null ? ` · ${scoreValue}%` : '';
                      return (
                        <div
                          key={run.runId || i}
                          className={`w-4 rounded ${barColor}`}
                          style={{ height: `${barHeight}px` }}
                          title={`${run.label || 'Run'}: ${run.verdict || 'Unknown'}${titleScore}`}
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Top Failing Checks */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white/90 mb-4">Top Failing Checks</h3>
                
                {dashboardStats.topFailingChecks.length === 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs text-white/40 mb-3">Example view</p>
                    {['Allergen Emphasis', 'QUID Percentage', 'Storage Conditions', 'Net Quantity', 'Date Marking'].map((check, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-rose-500/40 rounded-full"
                            style={{ width: `${80 - i * 15}%` }}
                          />
                        </div>
                        <span className="text-xs text-white/40 w-24 truncate">{check}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {dashboardStats.topFailingChecks.map((check, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-rose-500 rounded-full"
                            style={{ width: `${Math.min(100, (check.count / Math.max(1, runs.length)) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-white/60 w-32 truncate">{check.title}</span>
                        <span className="text-xs text-white/40">{check.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Alerts & Updates */}
            <div className="col-span-4">
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white/90 mb-4">Alerts & Updates</h3>
                
                <div className="space-y-3">
                  <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-medium mb-1">
                      <AlertCircle className="h-3 w-3" />
                      Regulatory Update
                    </div>
                    <p className="text-xs text-white/60">EU 1169/2011 allergen guidance update expected Q2 2025</p>
                  </div>
                  
                  <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-white/50">Rules changed this month</span>
                      <span className="text-[#5B6CFF] font-medium">2</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/50">High-risk flags detected</span>
                      <span className={runs.length > 0 ? 'text-rose-400 font-medium' : 'text-white/40'}>
                        {runs.length > 0 ? runs.reduce((sum, r) => sum + (r.checks?.filter(c => c.status === 'critical').length || 0), 0) : '—'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium mb-1">
                      <BookOpen className="h-3 w-3" />
                      New Feature
                    </div>
                    <p className="text-xs text-white/60">Halal Export-Readiness module now available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
