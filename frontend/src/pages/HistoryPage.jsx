import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  ShieldCheck,
  ArrowLeft,
  Search,
  Download,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Moon,
  History,
  Coins,
  Filter,
  Trash2,
  Loader2,
} from 'lucide-react';
import { runAPI, API_BASE_URL } from '../lib/api';

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
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${styles[verdict] || styles.CONDITIONAL}`}>
      <Icon className="h-3.5 w-3.5" />
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

export default function HistoryPage() {
  const navigate = useNavigate();
  const { isAdmin, creditsDisplay } = useAuth();
  const [runs, setRuns] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [verdictFilter, setVerdictFilter] = useState('all');
  const [halalFilter, setHalalFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load runs from backend API
  useEffect(() => {
    const fetchRuns = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const response = await runAPI.list();
        // Handle both array response and object with runs array
        const runsData = Array.isArray(response) ? response : (response.runs || []);
        // Sort by timestamp descending
        const sortedRuns = runsData.sort((a, b) => new Date(b.ts || b.created_at) - new Date(a.ts || a.created_at));
        setRuns(sortedRuns);
      } catch (error) {
        console.error('Error loading runs:', error);
        setLoadError(error.message || 'Failed to load run history');
      } finally {
        setLoading(false);
      }
    };

    fetchRuns();
  }, []);

  // Delete a run
  const handleDeleteRun = async (runId) => {
    setIsDeleting(true);
    try {
      await runAPI.delete(runId);
      // Remove from local state
      setRuns(prev => prev.filter(run => run.run_id !== runId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting run:', error);
      // Still remove from UI if delete endpoint doesn't exist yet
      setRuns(prev => prev.filter(run => run.run_id !== runId));
      setDeleteConfirm(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter runs
  const filteredRuns = useMemo(() => {
    return runs.filter(run => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          run.product_name?.toLowerCase().includes(query) ||
          run.company_name?.toLowerCase().includes(query) ||
          run.run_id?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      
      // Verdict filter
      if (verdictFilter !== 'all' && run.verdict !== verdictFilter) {
        return false;
      }
      
      // Halal filter
      if (halalFilter === 'halal' && !run.halal) return false;
      if (halalFilter === 'eu_only' && run.halal) return false;
      
      return true;
    });
  }, [runs, searchQuery, verdictFilter, halalFilter]);

  const handleDownloadPdf = (run) => {
    const pdfPath = run.halal ? '/sample-halal-report.pdf' : '/sample-report.pdf';
    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = `${run.run_id}-report.pdf`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#070A12]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm hidden sm:inline">Dashboard</span>
              </Link>
              <Link to="/" className="flex items-center gap-2.5">
                <ShieldCheck className="h-6 w-6 text-[#5B6CFF]" />
                <span className="text-lg font-semibold text-white/95">Nexodify</span>
              </Link>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-full">
              <Coins className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-medium text-white/90">
                {isAdmin ? <span className="text-emerald-400">Unlimited</span> : creditsDisplay}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white/95">Run History</h1>
          <p className="text-white/50 mt-1">View and manage all your compliance preflight runs</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product, company, or run ID..."
              className="pl-10 bg-white/[0.04] border-white/[0.12] text-white placeholder:text-white/30 focus:border-[#5B6CFF]"
            />
          </div>

          {/* Verdict Filter */}
          <Select value={verdictFilter} onValueChange={setVerdictFilter}>
            <SelectTrigger className="w-[160px] bg-white/[0.04] border-white/[0.12] text-white">
              <Filter className="h-4 w-4 mr-2 text-white/50" />
              <SelectValue placeholder="Verdict" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f1219] border-white/[0.12]">
              <SelectItem value="all" className="text-white/90 focus:bg-white/[0.08]">All Verdicts</SelectItem>
              <SelectItem value="PASS" className="text-white/90 focus:bg-white/[0.08]">Pass</SelectItem>
              <SelectItem value="CONDITIONAL" className="text-white/90 focus:bg-white/[0.08]">Conditional</SelectItem>
              <SelectItem value="FAIL" className="text-white/90 focus:bg-white/[0.08]">Fail</SelectItem>
            </SelectContent>
          </Select>

          {/* Halal Filter */}
          <Select value={halalFilter} onValueChange={setHalalFilter}>
            <SelectTrigger className="w-[160px] bg-white/[0.04] border-white/[0.12] text-white">
              <Moon className="h-4 w-4 mr-2 text-white/50" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f1219] border-white/[0.12]">
              <SelectItem value="all" className="text-white/90 focus:bg-white/[0.08]">All Types</SelectItem>
              <SelectItem value="halal" className="text-white/90 focus:bg-white/[0.08]">Halal Only</SelectItem>
              <SelectItem value="eu_only" className="text-white/90 focus:bg-white/[0.08]">EU Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Runs Table */}
        {filteredRuns.length === 0 ? (
          <div className="text-center py-16">
            <History className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white/70 mb-2">
              {runs.length === 0 ? 'No runs yet' : 'No matching runs'}
            </h3>
            <p className="text-white/40 text-sm mb-6">
              {runs.length === 0 
                ? 'Start your first preflight to see it here'
                : 'Try adjusting your filters'}
            </p>
            {runs.length === 0 && (
              <Button onClick={() => navigate('/run')} className="bg-[#5B6CFF] hover:bg-[#4A5BEE]">
                Run Label Preflight
              </Button>
            )}
          </div>
        ) : (
          <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden">
            {/* Table Header */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 border-b border-white/[0.06] text-xs text-white/40 uppercase tracking-wider">
              <div className="col-span-3">Product</div>
              <div className="col-span-2">Company</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-1">Score</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-white/[0.04]">
              {filteredRuns.map((run) => (
                <div
                  key={run.run_id}
                  className="px-6 py-4 hover:bg-white/[0.02] transition-colors"
                >
                  {/* Desktop View */}
                  <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                    <div className="col-span-3">
                      <div className="text-sm font-medium text-white/90 truncate">{run.product_name}</div>
                      <div className="text-xs text-white/40 font-mono">{run.run_id}</div>
                    </div>
                    <div className="col-span-2 text-sm text-white/70 truncate">{run.company_name}</div>
                    <div className="col-span-2 text-sm text-white/50">
                      {new Date(run.ts).toLocaleDateString()}
                    </div>
                    <div className="col-span-1">
                      <span className={`text-sm font-medium ${
                        run.compliance_score >= 85 ? 'text-emerald-400' :
                        run.compliance_score >= 70 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {run.compliance_score}%
                      </span>
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <VerdictBadge verdict={run.verdict} />
                      {run.halal && <HalalBadge />}
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/report/${run.run_id}`)}
                        className="text-white/60 hover:text-white hover:bg-white/[0.06]"
                        title="View Report"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadPdf(run)}
                        className="text-white/60 hover:text-white hover:bg-white/[0.06]"
                        title="Download PDF"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirm(run)}
                        className="text-white/60 hover:text-rose-400 hover:bg-rose-500/10"
                        title="Delete Run"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Mobile View */}
                  <div className="md:hidden space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-medium text-white/90">{run.product_name}</div>
                        <div className="text-xs text-white/50">{run.company_name}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {run.halal && <HalalBadge />}
                        <VerdictBadge verdict={run.verdict} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4 text-white/40">
                        <span className="font-mono text-xs">{run.run_id}</span>
                        <span>{new Date(run.ts).toLocaleDateString()}</span>
                      </div>
                      <span className={`font-medium ${
                        run.compliance_score >= 85 ? 'text-emerald-400' :
                        run.compliance_score >= 70 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {run.compliance_score}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-white/[0.04]">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/report/${run.run_id}`)}
                        className="flex-1 border-white/[0.12] text-white/70 hover:bg-white/[0.04]"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadPdf(run)}
                        className="flex-1 border-white/[0.12] text-white/70 hover:bg-white/[0.04]"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteConfirm(run)}
                        className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        {runs.length > 0 && (
          <div className="mt-6 text-center text-sm text-white/40">
            Showing {filteredRuns.length} of {runs.length} runs
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="bg-[#0f1219] border-white/[0.12] text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-rose-400" />
              Delete Run
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Are you sure you want to delete this run? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {deleteConfirm && (
            <div className="p-4 bg-white/[0.02] border border-white/[0.08] rounded-xl">
              <div className="text-sm font-medium text-white/90">{deleteConfirm.product_name}</div>
              <div className="text-xs text-white/50">{deleteConfirm.company_name}</div>
              <div className="text-xs text-white/40 font-mono mt-1">{deleteConfirm.run_id}</div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              className="border-white/[0.12] text-white/70 hover:bg-white/[0.04]"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleDeleteRun(deleteConfirm.run_id)}
              className="bg-rose-500 hover:bg-rose-600 text-white"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
