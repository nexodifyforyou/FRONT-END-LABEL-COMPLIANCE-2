import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  ArrowLeft,
  Download,
  FileText,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Printer,
  FileCheck,
  Milk,
  Fish,
  Cookie,
  Croissant,
  Wine,
  Soup,
  Droplets,
  Snowflake,
  Baby,
  Pill,
  Moon,
  RefreshCw,
  Coins,
  Circle,
  ChevronDown,
  ChevronUp,
  Edit3,
  Loader2,
  Clock,
  History,
  Code,
  MessageSquare,
  Plus,
  X,
} from 'lucide-react';
import { getSeverityColor } from '../lib/checkDefinitions';
import { HALAL_CHECK_DEFINITIONS } from '../lib/halalChecks';
import { runAPI } from '../lib/api';

// ============================================================================
// TOAST NOTIFICATION COMPONENT
// Simple toast for showing success/error messages after corrections
// ============================================================================
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 ${
        type === 'success' 
          ? 'bg-emerald-500/90 text-white' 
          : 'bg-rose-500/90 text-white'
      }`}
    >
      {type === 'success' ? (
        <CheckCircle className="h-5 w-5" />
      ) : (
        <XCircle className="h-5 w-5" />
      )}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
};

// Severity Badge - uses shared severity colors
const SeverityBadge = ({ level }) => {
  const colors = getSeverityColor(level);
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}>
      {colors.badge}
    </span>
  );
};

// Finding Card for Issues Overview
const FindingCard = ({ title, severity, source, fix, safeString }) => {
  const StatusIcon = severity === 'critical' || severity === 'high' ? XCircle : severity === 'warning' || severity === 'medium' ? AlertTriangle : CheckCircle;
  const statusColor = severity === 'critical' || severity === 'high' ? 'text-rose-400' : severity === 'warning' || severity === 'medium' ? 'text-amber-400' : 'text-emerald-400';
  
  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 hover:border-white/[0.12] transition-all">
      <div className="flex items-start gap-3">
        <StatusIcon className={`h-5 w-5 mt-0.5 ${statusColor} flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-2">
            <span className="text-white/90 font-medium">{safeString(title, 'Untitled check')}</span>
            <SeverityBadge level={severity} />
            {source && (
              <span className="text-xs text-[#5B6CFF] bg-[#5B6CFF]/10 px-2 py-0.5 rounded-full border border-[#5B6CFF]/30">
                {safeString(source, 'Unknown source')}
              </span>
            )}
          </div>
          {fix && <p className="text-white/55 text-sm">{safeString(fix, '')}</p>}
        </div>
      </div>
    </div>
  );
};

// Halal Check Card - matches sample layout
const HalalCheckCard = ({ check, safeString }) => {
  const colors = getSeverityColor(check.severity || check.status);
  const StatusIcon = check.status === 'critical'
    ? XCircle
    : check.status === 'warning'
      ? AlertTriangle
      : check.status === 'pass'
        ? CheckCircle
        : Circle;
  
  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
      <div className="flex items-start gap-3">
        <StatusIcon className={`h-5 w-5 mt-0.5 ${colors.text} flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-2">
            <span className="text-white/90 font-medium">{safeString(check.title, 'Untitled check')}</span>
            <SeverityBadge level={check.severity || check.status} />
            <span className="text-xs text-[#5B6CFF] bg-[#5B6CFF]/10 px-2 py-0.5 rounded-full border border-[#5B6CFF]/30">
              {safeString(check.source, 'N/A')}
            </span>
          </div>
          <p className="text-white/55 text-sm mb-1">{safeString(check.detail, '')}</p>
          <p className="text-white/40 text-xs">Fix: {safeString(check.fix, '')}</p>
        </div>
      </div>
    </div>
  );
};

// Category Chip
const CategoryChip = ({ icon: Icon, label, active }) => (
  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm ${active ? 'bg-[#5B6CFF]/10 border-[#5B6CFF]/30 text-[#5B6CFF]' : 'bg-white/[0.02] border-white/[0.08] text-white/60'}`}>
    <Icon className="h-3.5 w-3.5" />
    <span>{label}</span>
  </div>
);

// Verdict Badge
const VerdictBadge = ({ verdict }) => {
  const styles = {
    PASS: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    CONDITIONAL: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    FAIL: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  };
  return (
    <span className={`px-3 py-1 text-sm font-medium rounded-full border ${styles[verdict] || styles.CONDITIONAL}`}>
      {verdict}
    </span>
  );
};

export default function ReportPage() {
  const { runId } = useParams();
  const navigate = useNavigate();
  const { isAdmin, creditsDisplay, deductCredits, token, loading: authLoading, logout, activeEmail } = useAuth();
  const [run, setRun] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  
  // ============================================================================
  // CORRECTIONS LOOP STATE
  // Manages the corrections form and displays previous corrections from API
  // ============================================================================
  const [correctionsText, setCorrectionsText] = useState('');
  const [languagesOverride, setLanguagesOverride] = useState(''); // Comma-separated languages
  const [showOverrides, setShowOverrides] = useState(false);
  const [isApplyingCorrections, setIsApplyingCorrections] = useState(false);
  const [correctionsError, setCorrectionsError] = useState(null);
  const [showCorrectionsPanel, setShowCorrectionsPanel] = useState(true);
  
  // Toast notification state
  const [toast, setToast] = useState(null);

  const handleSwitchAccount = () => {
    logout();
    navigate('/signin');
  };

  // ============================================================================
  // FETCH REPORT DATA
  // Loads report.json from backend, includes corrections array if present
  // ============================================================================
  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const reportData = await runAPI.getReport(runId);
        setRun(reportData);
      } catch (error) {
        const status = error?.response?.status;
        if (status === 401) {
          setLoadError('Please sign in');
        } else if (status === 404) {
          setLoadError('Report not found');
        } else {
          console.error('Error loading report:', error);
          setLoadError(error.message || 'Failed to load report');
        }
      } finally {
        setLoading(false);
      }
    };

    if (!runId) {
      setLoading(false);
      setLoadError('Report not found');
      return;
    }

    if (!authLoading && !token) {
      setLoading(false);
      setLoadError('Please sign in');
      return;
    }

    if (runId && token) {
      fetchReport();
    }
  }, [runId, token, authLoading]);

  // ============================================================================
  // APPLY CORRECTIONS HANDLER
  // POST /api/runs/:run_id/corrections then refetch report.json
  // ============================================================================
  const handleApplyCorrections = async () => {
    if (!runId) {
      setCorrectionsError('Report not found.');
      return;
    }

    if (!token) {
      setCorrectionsError('Please sign in to apply corrections.');
      return;
    }
    // Validation: corrections_text required, min 3 chars
    if (!correctionsText.trim() || correctionsText.trim().length < 3) {
      setCorrectionsError('Please enter at least 3 characters describing the corrections needed.');
      return;
    }

    setIsApplyingCorrections(true);
    setCorrectionsError(null);

    try {
      // Build override_fields JSON (only languages_provided for now)
      const overrideFields = {};
      if (languagesOverride.trim()) {
        overrideFields.languages_provided = languagesOverride
          .split(',')
          .map(lang => lang.trim())
          .filter(lang => lang.length > 0);
      }
      const overrideFieldsJson = Object.keys(overrideFields).length > 0 
        ? JSON.stringify(overrideFields) 
        : '{}';

      // Call backend corrections endpoint
      await runAPI.submitCorrections(runId, correctionsText.trim(), overrideFieldsJson);
      
      // Immediately refetch report.json to get updated data with new correction
      const updatedReport = await runAPI.getReport(runId);
      setRun(updatedReport);
      
      // Clear the form
      setCorrectionsText('');
      setLanguagesOverride('');
      setShowOverrides(false);
      
      // Show success toast
      setToast({ message: 'Corrections applied — report updated', type: 'success' });
      
      // Deduct credit if not admin
      if (!isAdmin) {
        deductCredits(1, 'Corrections applied', runId);
      }
    } catch (err) {
      console.error('Apply corrections error:', err);
      setCorrectionsError(err.message || 'Failed to apply corrections. Please try again.');
      setToast({ message: 'Failed to apply corrections', type: 'error' });
    } finally {
      setIsApplyingCorrections(false);
    }
  };

  // ============================================================================
  // Premium PDF download (auth-protected)
  // ============================================================================
  const handleDownloadPdf = async () => {
    try {
      await runAPI.downloadPremiumPdf(runId, run);
    } catch (error) {
      console.error('PDF download error:', error);
      setToast({ message: 'Failed to download PDF', type: 'error' });
    }
  };

  // Format date for corrections display
  const formatCorrectionDate = (dateStr) => {
    if (!dateStr) return 'Unknown date';
    try {
      return new Date(dateStr).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const safeString = (value, fallback = '—') => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }
    if (Array.isArray(value)) {
      const list = value.map((item) => safeString(item, '')).filter(Boolean);
      return list.length > 0 ? list.join(', ') : fallback;
    }
    if (typeof value === 'object') {
      if ('label' in value) return safeString(value.label, fallback);
      if ('value' in value) return safeString(value.value, fallback);
      try {
        return JSON.stringify(value);
      } catch (error) {
        return fallback;
      }
    }
    return fallback;
  };

  const safeNumber = (value, fallback = 0) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070A12] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5B6CFF] mb-4"></div>
        <p className="text-white/50 text-sm">Loading report...</p>
      </div>
    );
  }

  if (loadError || !run) {
    return (
      <div className="min-h-screen bg-[#070A12] flex flex-col items-center justify-center text-white">
        <XCircle className="h-12 w-12 text-rose-400 mb-4" />
        <h1 className="text-xl font-semibold mb-2">{loadError ? 'Error Loading Report' : 'Run Not Found'}</h1>
        <p className="text-white/50 mb-6 max-w-md text-center">
          {loadError || 'The requested run could not be found.'}
        </p>
        <Button onClick={() => navigate('/dashboard')} className="bg-[#5B6CFF] hover:bg-[#4A5BEE]">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  // Derive data from run
  const complianceScore = safeNumber(run?.compliance_score ?? run?.score, 0);
  const evidenceConfidence = safeNumber(
    run?.evidence_confidence ?? run?.evidence_confidence_percent,
    0
  );
  const verdict = typeof run?.verdict === 'string' ? run.verdict : safeString(run?.verdict, 'CONDITIONAL');
  const runIdDisplay = safeString(run?.run_id, runId || 'Unknown');
  const generatedAt = run?.ts ? new Date(run.ts) : null;
  const generatedAtLabel = generatedAt && !Number.isNaN(generatedAt.getTime())
    ? generatedAt.toLocaleString()
    : 'Unknown time';
  const scoreColor = complianceScore >= 85 ? 'text-emerald-400' : complianceScore >= 70 ? 'text-amber-400' : 'text-rose-400';
  const product = run?.product || {
    product_name: run?.product_name,
    company_name: run?.company_name,
    country_of_sale: run?.country_of_sale,
    languages_provided: run?.languages_provided,
    halal_enabled: run?.halal,
  };
  const summary = run?.summary || {};
  const findings = Array.isArray(run?.findings) ? run.findings : [];
  const crossCheck = run?.cross_check || { matched: [], mismatched: [] };
  const printPack = run?.print_pack || {};
  const nextSteps = Array.isArray(run?.next_steps) ? run.next_steps : [];
  const artifacts = run?.artifacts || { run_dir: '', files: [] };
  const halalChecks = Array.isArray(run?.halalChecks) ? run.halalChecks : [];
  const halalEnabled = !!(product?.halal_enabled ?? run?.halal);
  const corrections = Array.isArray(run?.corrections) ? run.corrections : [];
  
  const criticalCount = safeNumber(
    summary.critical,
    findings.filter((c) => c.status === 'critical').length
  );
  const warningCount = safeNumber(
    summary.warnings,
    findings.filter((c) => c.status === 'warning').length
  );
  const passCount = safeNumber(summary.passed, 0);
  const issuesTotal = safeNumber(summary.issues_total, findings.length);
  const evidenceFindings = findings.filter((f) => f.status === 'critical').length
    ? findings.filter((f) => f.status === 'critical')
    : findings.filter((f) => f.status === 'warning');
  const halalCertificateCheck = halalChecks.find((c) => c.id === 'halal_certificate_provided');
  const halalInputs = halalEnabled
    ? [
        { label: 'Supplier TDS', tone: 'success' },
        {
          label:
            halalCertificateCheck?.status === 'pass'
              ? 'Halal Certificate'
              : 'Halal Certificate (not provided)',
          tone: halalCertificateCheck?.status === 'pass' ? 'success' : 'warning',
        },
        {
          label: `Target Market: ${safeString(product.country_of_sale, 'N/A')}`,
          tone: 'neutral',
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#070A12]/60 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/dashboard" className="flex items-center gap-2.5">
              <ShieldCheck className="h-7 w-7 text-[#5B6CFF]" />
              <span className="text-lg font-semibold text-white/95">Nexodify</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end text-right">
                <span className="text-xs text-white/40">Signed in as</span>
                <span className="text-sm text-white/80">{activeEmail || 'Unknown account'}</span>
              </div>
              <Button
                variant="ghost"
                onClick={handleSwitchAccount}
                className="text-white/70 hover:text-white hover:bg-white/[0.06]"
              >
                Switch account
              </Button>
              <Link to="/dashboard">
                <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/[0.06]">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={handleDownloadPdf}
                className="border-white/[0.14] text-white/80 hover:bg-white/[0.04]"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Premium PDF
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header with Verdict */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <VerdictBadge verdict={verdict} />
              {halalEnabled && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <Moon className="h-3.5 w-3.5" />
                  Halal
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white/95 mb-2">
              Compliance Report
            </h1>
            <p className="text-white/60">
              Run ID: {runIdDisplay} • Generated: {generatedAtLabel}
            </p>
          </motion.div>

          {/* Report Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-b from-white/[0.04] to-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
          >
            {/* Report Header */}
            <div className="px-8 py-6 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-8 w-8 text-[#5B6CFF]" />
                <div>
                  <div className="text-xs text-white/40 uppercase tracking-wider">Nexodify AVA</div>
                  <div className="text-white/90 font-semibold">EU Label Compliance Preflight Report</div>
                </div>
              </div>
              <div className="text-right text-sm">
                <div className="text-white/40">Run ID</div>
                <div className="text-white/70 font-mono">{runIdDisplay}</div>
              </div>
            </div>

            {/* Page 1: Executive Summary */}
            <div className="p-8 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 bg-[#5B6CFF]/10 text-[#5B6CFF] text-xs font-medium rounded-full border border-[#5B6CFF]/30">
                  Page 1
                </span>
                <span className="text-white/50 text-sm">Executive Summary</span>
              </div>

              <h2 className="text-2xl font-bold text-white/95 mb-2">
                EU Label Compliance, <span className="text-[#5B6CFF]">Preflighted.</span>
              </h2>
              <p className="text-white/60 mb-8">Automated verification against Regulation (EU) 1169/2011</p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Product Info */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-4">Product Information</div>
                  {[
                    ['Product Name', product.product_name],
                    ['Company', product.company_name],
                    ['Country of Sale', product.country_of_sale],
                    ['Languages', product.languages_provided || 'English'],
                    ['Halal Module', halalEnabled ? 'Enabled' : 'Disabled'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between py-2 border-b border-white/[0.04] last:border-0">
                      <span className="text-white/50 text-sm">{label}</span>
                      <span className="text-white/90 text-sm font-medium text-right">{safeString(value, '—')}</span>
                    </div>
                  ))}
                </div>

                {/* Score Card */}
                <div className="bg-[#0B1020] border border-white/[0.08] rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Compliance Score</div>
                    <div className={`text-5xl font-bold ${scoreColor}`}>{complianceScore}%</div>
                    <div className="text-white/50 text-sm mt-1">
                      Evidence confidence: {evidenceConfidence}%
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4 flex-wrap">
                    <span className="flex items-center gap-1.5 text-xs">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      <span className="text-rose-400">{criticalCount} Critical</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-xs">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span className="text-amber-400">{warningCount} Warnings</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="text-emerald-400">{passCount} Passed</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Page 2: Findings Overview */}
            <div className="p-8 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 bg-[#5B6CFF]/10 text-[#5B6CFF] text-xs font-medium rounded-full border border-[#5B6CFF]/30">
                  Page 2
                </span>
                <span className="text-white/50 text-sm">Findings Overview</span>
              </div>

              <h3 className="text-xl font-semibold text-white/90 mb-6">
                {issuesTotal} Issues Identified
              </h3>

              <div className="grid md:grid-cols-2 gap-3">
                {findings.length > 0 ? (
                  findings.map((finding, i) => (
                    <FindingCard
                      key={finding.id || i}
                      title={finding.title}
                      severity={finding.status}
                      source={finding.source}
                      fix={finding.fix}
                      safeString={safeString}
                    />
                  ))
                ) : (
                  <div className="text-white/50 text-sm">No issues identified.</div>
                )}
              </div>
            </div>

            {/* Pages 3-4: Evidence & Fix Details */}
            <div className="p-8 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 bg-[#5B6CFF]/10 text-[#5B6CFF] text-xs font-medium rounded-full border border-[#5B6CFF]/30">
                  Pages 3-4
                </span>
                <span className="text-white/50 text-sm">Evidence & Fix Details</span>
              </div>

              <div className="space-y-4">
                {evidenceFindings.length > 0 ? (
                  evidenceFindings.map((finding, idx) => (
                    <div key={finding.id || idx} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <SeverityBadge level={finding.status} />
                        <span className="text-white/90 font-semibold">{safeString(finding.title, '')}</span>
                      </div>

                      <div className="bg-[#0B1020] border border-white/[0.08] rounded-lg p-4 mb-4">
                        <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Evidence (excerpt)</div>
                        {Array.isArray(finding.evidence) && finding.evidence.length > 0 ? (
                          <div className="space-y-3">
                            {finding.evidence.map((entry, evIdx) => (
                              <div key={evIdx}>
                                <p className="text-white/70 text-sm italic">"{safeString(entry.excerpt, '')}"</p>
                                <p className="text-white/40 text-xs mt-1">
                                  ↳ {safeString(entry.source, 'Source')}
                                  {entry.page ? ` · Page ${entry.page}` : ''}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-white/50 text-sm">No evidence excerpts available.</p>
                        )}
                      </div>

                      <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4">
                        <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Recommended Fix</div>
                        <p className="text-white/70 text-sm">{safeString(finding.fix, 'No fix provided')}</p>
                      </div>

                      <p className="text-white/40 text-xs mt-4">
                        Reference: {safeString(finding.reference, '')}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-white/50 text-sm">No critical findings available for evidence review.</div>
                )}
              </div>
            </div>

            {/* Page 5: Label ↔ TDS Cross-Check */}
            <div className="p-8 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 bg-[#5B6CFF]/10 text-[#5B6CFF] text-xs font-medium rounded-full border border-[#5B6CFF]/30">
                  Page 5
                </span>
                <span className="text-white/50 text-sm">Label ↔ TDS Cross-Check</span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
                  <h4 className="text-white/90 font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    Matched ({Array.isArray(crossCheck.matched) ? crossCheck.matched.length : 0})
                  </h4>
                  {Array.isArray(crossCheck.matched) && crossCheck.matched.length > 0 ? (
                    crossCheck.matched.map((item) => (
                      <div key={item.field} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                        <span className="text-white/60 text-sm">{safeString(item.field, '')}</span>
                        <span className="text-emerald-400 text-xs">✓ Match</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/50 text-sm">No matched fields detected.</p>
                  )}
                </div>

                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
                  <h4 className="text-white/90 font-semibold mb-4 flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-rose-400" />
                    Mismatched ({Array.isArray(crossCheck.mismatched) ? crossCheck.mismatched.length : 0})
                  </h4>
                  {Array.isArray(crossCheck.mismatched) && crossCheck.mismatched.length > 0 ? (
                    crossCheck.mismatched.map((item) => (
                      <div key={item.field} className="py-2 border-b border-white/[0.04] last:border-0">
                        <div className="flex items-center justify-between">
                          <span className="text-white/60 text-sm">{safeString(item.field, '')}</span>
                          <span className="text-rose-400 text-xs">Mismatch</span>
                        </div>
                        <span className="text-amber-400/70 text-xs">⚠ {safeString(item.note, '')}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/50 text-sm">No mismatches detected.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Multi-Category Section */}
            <div className="p-8 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 bg-[#5B6CFF]/10 text-[#5B6CFF] text-xs font-medium rounded-full border border-[#5B6CFF]/30">
                  Info
                </span>
                <span className="text-white/50 text-sm">Built for Every Food Category</span>
              </div>

              <p className="text-white/60 text-sm mb-4">Category-aware checks for EU 1169/2011 labeling:</p>
              <div className="flex flex-wrap gap-2">
                <CategoryChip icon={Milk} label="Dairy" />
                <CategoryChip icon={Fish} label="Meat & Fish" />
                <CategoryChip icon={Cookie} label="Confectionery" active />
                <CategoryChip icon={Croissant} label="Bakery" />
                <CategoryChip icon={Wine} label="Beverages" />
                <CategoryChip icon={Soup} label="Ready Meals" />
                <CategoryChip icon={Droplets} label="Oils & Fats" />
                <CategoryChip icon={Snowflake} label="Frozen" />
                <CategoryChip icon={Baby} label="Baby Food" />
                <CategoryChip icon={Pill} label="Supplements" />
              </div>
            </div>

            {/* Print Verification Pack */}
            <div className="p-8 border-b border-white/[0.06]" id="print-verification">
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/30">
                  <Printer className="inline h-3 w-3 mr-1" />
                  Print Pack
                </span>
                <span className="text-white/50 text-sm">Print Verification Pack (Pre-Press Checklist)</span>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 mb-6">
                <h4 className="text-white/90 font-semibold mb-4 flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-emerald-400" />
                  Versioning & Sign-off
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  {(printPack.signoff_fields || []).map((label) => (
                    <div key={label} className="flex flex-col gap-1">
                      <span className="text-white/50 text-xs">{label}</span>
                      <div className="h-8 border-b border-white/20 border-dashed"></div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <span className="text-white/50 text-xs">Final Print Run Notes</span>
                  <div className="h-16 border border-white/10 border-dashed rounded mt-1"></div>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 mb-6">
                <h4 className="text-white/90 font-semibold mb-4">Pre-Press Checklist</h4>
                <div className="space-y-3">
                  {(printPack.prepress_checklist || []).map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 border border-white/20 rounded flex-shrink-0 mt-0.5"></div>
                      <span className="text-white/70 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 mb-6">
                <h4 className="text-white/90 font-semibold mb-4">What to Send to Printer</h4>
                <div className="space-y-3">
                  {(printPack.attachments_checklist || []).map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 border border-white/20 rounded flex-shrink-0 mt-0.5"></div>
                      <span className="text-white/70 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                <h4 className="text-amber-400 font-semibold text-sm mb-2">Printer Notes</h4>
                <p className="text-white/60 text-sm">
                  {safeString(printPack.printer_notes, '')}
                </p>
              </div>
            </div>

            {/* Halal Export-Readiness Preflight */}
            {halalEnabled && (
              <div className="p-8 border-b border-white/[0.06]" id="halal-preflight">
                <div className="flex items-center gap-2 mb-6">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/30">
                    Optional Module
                  </span>
                  <span className="text-white/50 text-sm">Halal Export-Readiness Preflight</span>
                </div>

                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-medium">Module Status</span>
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded border border-emerald-500/30">
                      Active
                    </span>
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 mb-6">
                  <h4 className="text-white/90 font-semibold mb-4">Inputs Provided</h4>
                  <div className="flex flex-wrap gap-3">
                    {halalInputs.map((item) => (
                      <span
                        key={item.label}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm ${
                          item.tone === 'success'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : item.tone === 'warning'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-white/[0.04] text-white/60 border-white/[0.08]'
                        }`}
                      >
                        {item.tone === 'success' ? (
                          <CheckCircle className="h-3.5 w-3.5" />
                        ) : item.tone === 'warning' ? (
                          <AlertTriangle className="h-3.5 w-3.5" />
                        ) : (
                          <Circle className="h-3.5 w-3.5" />
                        )}
                        {item.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <h4 className="text-white/90 font-semibold">Halal Preflight Checks (10)</h4>
                  {halalChecks.length > 0 ? (
                    halalChecks.map((check) => (
                      <HalalCheckCard key={check.id} check={check} safeString={safeString} />
                    ))
                  ) : (
                    HALAL_CHECK_DEFINITIONS.map((check) => (
                      <HalalCheckCard
                        key={check.id}
                        check={{
                          ...check,
                          status: 'not_evaluated',
                          severity: check.defaultSeverity,
                          detail: check.detailMissing,
                        }}
                        safeString={safeString}
                      />
                    ))
                  )}
                </div>

                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                  <p className="text-amber-400/90 text-sm">
                    <strong>Important:</strong> Halal determinations depend on the target market, accepted standard, and certification body. This module provides preflight risk flags, not certification.
                  </p>
                </div>
              </div>
            )}

            {/* Next Steps & Audit Trail */}
            <div className="p-8">
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 bg-[#5B6CFF]/10 text-[#5B6CFF] text-xs font-medium rounded-full border border-[#5B6CFF]/30">
                  Page 6
                </span>
                <span className="text-white/50 text-sm">Next Steps & Audit Trail</span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
                  <h4 className="text-white/90 font-semibold mb-4">Next Steps Checklist</h4>
                  {nextSteps.length > 0 ? (
                    nextSteps.map((item, i) => (
                      <div key={`${item.priority}-${i}`} className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0">
                        <span className="w-4 h-4 border border-white/20 rounded"></span>
                        <span className="px-1.5 py-0.5 bg-[#5B6CFF]/10 text-[#5B6CFF] text-[10px] font-medium rounded">
                          {item.priority}
                        </span>
                        <span className="text-white/70 text-sm">{safeString(item.task, '')}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/50 text-sm">No next steps available.</p>
                  )}
                </div>

                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
                  <h4 className="text-white/90 font-semibold mb-4">Audit Trail Artifacts</h4>
                  <div className="bg-[#0B1020] border border-white/[0.08] rounded-lg p-4 font-mono text-xs">
                    <div className="text-white/40 mb-2">{safeString(artifacts.run_dir, '—')}</div>
                    <div className="text-white/60 space-y-1">
                      {Array.isArray(artifacts.files) && artifacts.files.length > 0 ? (
                        artifacts.files.map((file) => (
                          <div key={file}>{file}</div>
                        ))
                      ) : (
                        <div>No artifacts listed.</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-white/[0.02] border-t border-white/[0.06] flex items-center justify-between text-xs text-white/40">
              <span>Run ID: {runIdDisplay}</span>
              <span>Generated: {generatedAtLabel}</span>
              <span>{halalEnabled ? 'EU + Halal' : 'EU Only'}</span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              onClick={handleDownloadPdf}
              className="bg-[#5B6CFF] hover:bg-[#4A5BEE] text-white h-12 px-8 rounded-xl"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Premium PDF
            </Button>
            <Button
              onClick={() => navigate('/run')}
              variant="outline"
              className="border-white/[0.14] text-white/80 hover:bg-white/[0.04] h-12 px-8 rounded-xl"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Run New Preflight
            </Button>
          </motion.div>

          {/* Corrections & Re-run */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-10 bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6"
          >
            <button
              onClick={() => setShowCorrectionsPanel(!showCorrectionsPanel)}
              className="w-full flex items-center justify-between mb-6"
            >
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-medium rounded-full border border-amber-500/30">
                  <Edit3 className="inline h-3 w-3 mr-1" />
                  Corrections
                </span>
                <span className="text-white/50 text-sm">Corrections & Re-run</span>
                {corrections.length > 0 && (
                  <span className="px-2 py-0.5 bg-[#5B6CFF]/20 text-[#5B6CFF] text-xs rounded-full">
                    {corrections.length} applied
                  </span>
                )}
              </div>
              {showCorrectionsPanel ? (
                <ChevronUp className="h-5 w-5 text-white/40" />
              ) : (
                <ChevronDown className="h-5 w-5 text-white/40" />
              )}
            </button>

            {showCorrectionsPanel && (
              <div className="space-y-6">
                {corrections.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-white/60 text-xs uppercase tracking-wider">Previous Corrections</Label>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {corrections.map((correction, idx) => (
                        <div key={idx} className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="h-4 w-4 text-[#5B6CFF]" />
                            <span className="text-xs text-white/40">
                              {formatCorrectionDate(correction.created_at)}
                            </span>
                          </div>
                          <p className="text-white/80 text-sm">{safeString(correction.corrections_text, '')}</p>
                          {correction.override_fields_json && correction.override_fields_json !== '{}' && (
                            <div className="mt-2 pt-2 border-t border-white/[0.06]">
                              <span className="text-xs text-white/40">Override fields: </span>
                              <code className="text-xs text-amber-400/80 bg-amber-500/10 px-1 rounded">
                                {safeString(correction.override_fields_json, '')}
                              </code>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4 text-emerald-400" />
                    <Label className="text-white/80 text-sm font-medium">Apply New Correction</Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="corrections-text" className="text-white/60 text-xs">
                      What should be corrected? <span className="text-rose-400">*</span>
                    </Label>
                    <Textarea
                      id="corrections-text"
                      value={correctionsText}
                      onChange={(e) => setCorrectionsText(e.target.value)}
                      placeholder="E.g., 'Update allergen emphasis for milk and hazelnuts. Correct QUID percentage for cocoa.'"
                      className="min-h-[100px] bg-white/[0.04] border-white/[0.12] text-white placeholder:text-white/30 focus:border-[#5B6CFF] resize-none text-sm"
                    />
                    <p className="text-white/30 text-xs">Minimum 3 characters required</p>
                  </div>

                  <div className="border border-white/[0.06] rounded-lg overflow-hidden">
                    <button
                      onClick={() => setShowOverrides(!showOverrides)}
                      className="w-full px-4 py-2.5 flex items-center justify-between bg-white/[0.02] hover:bg-white/[0.04] transition-colors text-left"
                    >
                      <span className="text-xs text-white/60">Override fields (optional)</span>
                      {showOverrides ? (
                        <ChevronUp className="h-4 w-4 text-white/40" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-white/40" />
                      )}
                    </button>
                    {showOverrides && (
                      <div className="p-4 border-t border-white/[0.06] space-y-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="languages-override" className="text-white/60 text-xs">
                            Languages (comma-separated)
                          </Label>
                          <Input
                            id="languages-override"
                            value={languagesOverride}
                            onChange={(e) => setLanguagesOverride(e.target.value)}
                            placeholder="e.g., English, Italian, German"
                            className="bg-white/[0.04] border-white/[0.12] text-white placeholder:text-white/30 text-sm"
                          />
                          <p className="text-white/30 text-xs">
                            Current: {safeString(product.languages_provided, 'Not specified')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {correctionsError && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-rose-400 flex-shrink-0" />
                      <span className="text-rose-400 text-sm">{correctionsError}</span>
                    </div>
                  )}

                  <Button
                    onClick={handleApplyCorrections}
                    disabled={isApplyingCorrections || correctionsText.trim().length < 3}
                    className="w-full bg-[#5B6CFF] hover:bg-[#4A5BEE] text-white h-10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isApplyingCorrections ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Applying corrections...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Apply corrections
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-white/40" />
            <span className="text-white/40 text-sm">© 2025 Nexodify. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link to="/privacy" className="text-white/40 hover:text-white/70 transition-colors">Privacy</Link>
            <Link to="/terms" className="text-white/40 hover:text-white/70 transition-colors">Terms</Link>
            <a href="mailto:nexodifyforyou@gmail.com?subject=Nexodify%20AVA%20Support&body=Hi%20Nexodify%20Team%2C%0A%0A%5BDescribe%20your%20issue%5D%0A%0AThanks%2C" className="text-white/40 hover:text-white/70 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
