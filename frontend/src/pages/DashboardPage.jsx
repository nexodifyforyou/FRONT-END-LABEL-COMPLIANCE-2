import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
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
} from 'lucide-react';

// Verdict Badge component
const VerdictBadge = ({ verdict }) => {
  const styles = {
    PASS: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    CONDITIONAL: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    FAIL: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  };
  const icons = {
    PASS: CheckCircle,
    CONDITIONAL: AlertTriangle,
    FAIL: XCircle,
  };
  const Icon = icons[verdict] || AlertTriangle;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full border ${styles[verdict] || styles.CONDITIONAL}`}>
      <Icon className="h-3 w-3" />
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

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, wallet, credits, creditsDisplay, isAdmin, logout } = useAuth();
  const [runs, setRuns] = useState([]);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Load runs from localStorage
  useEffect(() => {
    const storedRuns = localStorage.getItem('ava_runs');
    if (storedRuns) {
      try {
        const allRuns = JSON.parse(storedRuns);
        // Sort by timestamp descending and take last 5
        const sortedRuns = allRuns.sort((a, b) => new Date(b.ts) - new Date(a.ts)).slice(0, 5);
        setRuns(sortedRuns);
      } catch (e) {
        console.error('Error loading runs:', e);
      }
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const handleDownloadPdf = (run) => {
    const pdfPath = run.halal ? '/sample-halal-report.pdf' : '/sample-report.pdf';
    // For now, download the sample PDF
    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = `${run.run_id}-report.pdf`;
    link.click();
  };

  // Calculate credits bar percentage
  const creditsPercentage = isAdmin ? 100 : Math.min(100, ((wallet?.credits_available || 0) / (wallet?.monthly_credits || 10)) * 100);

  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-[#070A12]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <Link to="/" className="flex items-center gap-2.5">
              <ShieldCheck className="h-7 w-7 text-[#5B6CFF]" />
              <span className="text-lg font-semibold text-white/95">Nexodify</span>
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Credits Pill */}
              <Link
                to="/billing"
                className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-full hover:bg-white/[0.06] transition-colors"
              >
                <Coins className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium text-white/90">
                  {isAdmin ? (
                    <span className="text-emerald-400">Unlimited</span>
                  ) : (
                    creditsDisplay
                  )}
                </span>
              </Link>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-white/[0.06] transition-colors"
                >
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-[#5B6CFF] flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-[#0f1219] border border-white/[0.08] rounded-xl shadow-xl z-50 py-2">
                      <div className="px-4 py-2 border-b border-white/[0.06]">
                        <div className="text-sm font-medium text-white/90">{user?.name}</div>
                        <div className="text-xs text-white/50">{user?.email}</div>
                        {isAdmin && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-medium bg-[#5B6CFF]/20 text-[#5B6CFF] rounded">
                            Admin
                          </span>
                        )}
                      </div>
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white/95">
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-white/50 mt-1">Run compliance preflights and manage your audit history</p>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Card A: Start a new run */}
          <div className="bg-gradient-to-br from-[#5B6CFF]/10 to-transparent border border-[#5B6CFF]/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#5B6CFF]/20 flex items-center justify-center">
                <Play className="h-5 w-5 text-[#5B6CFF]" />
              </div>
              <h2 className="text-lg font-semibold text-white/95">Start a new run</h2>
            </div>
            <p className="text-white/50 text-sm mb-6">
              Upload your label and TDS files to run a compliance preflight check.
            </p>
            <Button
              onClick={() => navigate('/run')}
              className="w-full bg-[#5B6CFF] hover:bg-[#4A5BEE] text-white rounded-xl h-11"
            >
              Run Label Preflight
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Card B: Recent History */}
          <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center">
                  <History className="h-5 w-5 text-white/70" />
                </div>
                <h2 className="text-lg font-semibold text-white/95">Recent history</h2>
              </div>
              <Link to="/history" className="text-xs text-[#5B6CFF] hover:text-[#7B8CFF]">
                View all
              </Link>
            </div>

            {runs.length === 0 ? (
              <div className="text-center py-8">
                <History className="h-8 w-8 text-white/20 mx-auto mb-2" />
                <p className="text-white/40 text-sm">No runs yet</p>
                <p className="text-white/30 text-xs mt-1">Start your first preflight</p>
              </div>
            ) : (
              <div className="space-y-3">
                {runs.map((run) => (
                  <div
                    key={run.run_id}
                    className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-3 hover:border-white/[0.12] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white/90 truncate">
                          {run.product_name}
                        </div>
                        <div className="text-xs text-white/40">{run.company_name}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {run.halal && <HalalBadge />}
                        <VerdictBadge verdict={run.verdict} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-white/40">
                        <span>{run.compliance_score}%</span>
                        <span>•</span>
                        <span>{new Date(run.ts).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/report/${run.run_id}`)}
                          className="p-1.5 hover:bg-white/[0.06] rounded transition-colors"
                          title="Open report"
                        >
                          <ExternalLink className="h-3.5 w-3.5 text-white/50" />
                        </button>
                        <button
                          onClick={() => handleDownloadPdf(run)}
                          className="p-1.5 hover:bg-white/[0.06] rounded transition-colors"
                          title="Download PDF"
                        >
                          <Download className="h-3.5 w-3.5 text-white/50" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card C: Credits & Plan */}
          <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Coins className="h-5 w-5 text-amber-400" />
              </div>
              <h2 className="text-lg font-semibold text-white/95">Credits & Plan</h2>
            </div>

            {isAdmin ? (
              <div className="mb-6">
                <div className="text-3xl font-bold text-emerald-400 mb-1">Unlimited</div>
                <div className="text-xs text-white/40">Admin account</div>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-bold text-white/95">
                      {wallet?.credits_available || 0}
                    </span>
                    <span className="text-white/40 text-sm">
                      / {wallet?.monthly_credits || 10} credits
                    </span>
                  </div>
                  <div className="text-xs text-white/40">
                    {wallet?.plan?.charAt(0).toUpperCase() + wallet?.plan?.slice(1) || 'Starter'} Plan
                  </div>
                </div>

                {/* Credits Bar */}
                <div className="mb-4">
                  <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#5B6CFF] to-[#7B8CFF] rounded-full transition-all"
                      style={{ width: `${creditsPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-white/30">
                    <span>Used: {(wallet?.monthly_credits || 10) - (wallet?.credits_available || 0)}</span>
                    <span>Renews: {wallet?.renewal_date || 'N/A'}</span>
                  </div>
                </div>
              </>
            )}

            <Button
              onClick={() => navigate('/billing')}
              variant="outline"
              className="w-full border-white/[0.12] text-white/80 hover:bg-white/[0.04] rounded-xl"
            >
              {isAdmin ? 'View Billing' : 'Top up credits'}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
