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
import { getSeverityColor, HALAL_CHECK_DEFINITIONS } from '../lib/checkDefinitions';
import { runAPI, API_BASE_URL } from '../lib/api';

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

// Finding Card for EU checks
const FindingCard = ({ title, severity, source, description, reference }) => {
  const StatusIcon = severity === 'critical' || severity === 'high' ? XCircle : severity === 'warning' || severity === 'medium' ? AlertTriangle : CheckCircle;
  const statusColor = severity === 'critical' || severity === 'high' ? 'text-rose-400' : severity === 'warning' || severity === 'medium' ? 'text-amber-400' : 'text-emerald-400';
  
  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 hover:border-white/[0.12] transition-all">
      <div className="flex items-start gap-3">
        <StatusIcon className={`h-5 w-5 mt-0.5 ${statusColor} flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-2">
            <span className="text-white/90 font-medium">{title}</span>
            <SeverityBadge level={severity} />
            {source && (
              <span className="text-xs text-[#5B6CFF] bg-[#5B6CFF]/10 px-2 py-0.5 rounded-full border border-[#5B6CFF]/30">
                {source}
              </span>
            )}
          </div>
          {description && <p className="text-white/55 text-sm mb-1">{description}</p>}
          {reference && <p className="text-white/30 text-xs">Ref: {reference}</p>}
        </div>
      </div>
    </div>
  );
};

// Halal Check Card - special styling for Halal module
const HalalCheckCard = ({ check }) => {
  const colors = getSeverityColor(check.status);
  const StatusIcon = check.status === 'critical' ? XCircle : 
                     check.status === 'warning' ? AlertTriangle : 
                     check.status === 'pass' ? CheckCircle : Circle;
  
  return (
    <div className={`bg-emerald-500/[0.03] border border-emerald-500/20 rounded-xl p-4 hover:border-emerald-500/30 transition-all`}>
      <div className="flex items-start gap-3">
        <StatusIcon className={`h-5 w-5 mt-0.5 ${colors.text} flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-2">
            <span className="text-white/90 font-medium">{check.title}</span>
            <SeverityBadge level={check.status} />
            <span className="text-xs text-emerald-400/70 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              {check.category}
            </span>
          </div>
          <p className="text-white/55 text-sm mb-2">{check.description}</p>
          {check.status !== 'pass' && check.status !== 'not_evaluated' && (
            <div className="mt-2 p-2 bg-white/[0.02] rounded-lg">
              <p className="text-xs text-amber-400/80 mb-1">
                <strong>Why it matters:</strong> {check.whyItMatters}
              </p>
              <p className="text-xs text-emerald-400/80">
                <strong>What to provide:</strong> {check.whatToProvide}
              </p>
            </div>
          )}
          {check.status === 'not_evaluated' && (
            <p className="text-xs text-white/40 italic">Not evaluated / Missing info</p>
          )}
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
  const { isAdmin, creditsDisplay, deductCredits } = useAuth();
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
        console.error('Error loading report:', error);
        setLoadError(error.message || 'Failed to load report');
      } finally {
        setLoading(false);
      }
    };

    if (runId) {
      fetchReport();
    }
  }, [runId]);

  // ============================================================================
  // APPLY CORRECTIONS HANDLER
  // POST /api/runs/:run_id/corrections then refetch report.json
  // ============================================================================
  const handleApplyCorrections = async () => {
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
  // PDF DOWNLOAD WITH CACHE-BUSTER
  // Adds timestamp query param to ensure latest PDF is downloaded after corrections
  // ============================================================================
  const handleDownloadPdf = async () => {
    try {
      // Build PDF URL with cache-buster to ensure fresh download after corrections
      const cacheBuster = `?t=${Date.now()}`;
      const basePdfUrl = run?.files?.pdf 
        ? `${API_BASE_URL}${run.files.pdf}`
        : runAPI.getPdfUrl(runId);
      const pdfUrl = `${basePdfUrl}${cacheBuster}`;
      
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
      link.download = `${run?.run_id || 'report'}-report.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF download error:', error);
      // Fallback to direct link with cache-buster
      const cacheBuster = `?t=${Date.now()}`;
      const pdfUrl = run?.files?.pdf 
        ? `${API_BASE_URL}${run.files.pdf}${cacheBuster}`
        : `${runAPI.getPdfUrl(runId)}${cacheBuster}`;
      window.open(pdfUrl, '_blank');
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
  const scoreColor = run.compliance_score >= 85 ? 'text-emerald-400' : run.compliance_score >= 70 ? 'text-amber-400' : 'text-rose-400';
  const euChecks = run.checks || [];
  const halalChecks = run.halalChecks || [];
  
  const criticalCount = [...euChecks, ...halalChecks].filter(c => c.status === 'critical').length;
  const warningCount = [...euChecks, ...halalChecks].filter(c => c.status === 'warning').length;
  const passCount = [...euChecks, ...halalChecks].filter(c => c.status === 'pass').length;

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
                Download PDF
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
              <VerdictBadge verdict={run.verdict} />
              {run.halal && (
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
              Run ID: {run.run_id} • Generated: {new Date(run.ts).toLocaleString()}
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
                <div className="text-white/70 font-mono">{run.run_id}</div>
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
                    ['Product Name', run.product_name],
                    ['Company', run.company_name],
                    ['Country of Sale', run.country_of_sale],
                    ['Languages', run.languages_provided?.join(', ') || 'English'],
                    ['Halal Module', run.halal ? 'Enabled' : 'Disabled'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between py-2 border-b border-white/[0.04] last:border-0">
                      <span className="text-white/50 text-sm">{label}</span>
                      <span className="text-white/90 text-sm font-medium text-right">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Score Card */}
                <div className="bg-[#0B1020] border border-white/[0.08] rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Compliance Score</div>
                    <div className={`text-5xl font-bold ${scoreColor}`}>{run.compliance_score}%</div>
                    <div className="text-white/50 text-sm mt-1">
                      Evidence confidence: {run.evidence_confidence}%
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

            {/* ================================================================
                CORRECTIONS & RE-RUN PANEL
                Shows previous corrections and form to apply new corrections
                This section appears ABOVE the checks list as per requirements
                ================================================================ */}
            <div className="p-8 border-b border-white/[0.06]">
              {/* Section Header - Collapsible */}
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
                  {run.corrections && run.corrections.length > 0 && (
                    <span className="px-2 py-0.5 bg-[#5B6CFF]/20 text-[#5B6CFF] text-xs rounded-full">
                      {run.corrections.length} applied
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
                  {/* Previous Corrections List */}
                  {run.corrections && run.corrections.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-white/60 text-xs uppercase tracking-wider">Previous Corrections</Label>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {run.corrections.map((correction, idx) => (
                          <div 
                            key={idx} 
                            className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <MessageSquare className="h-4 w-4 text-[#5B6CFF]" />
                              <span className="text-xs text-white/40">
                                {formatCorrectionDate(correction.created_at)}
                              </span>
                            </div>
                            <p className="text-white/80 text-sm">{correction.corrections_text}</p>
                            {correction.override_fields_json && correction.override_fields_json !== '{}' && (
                              <div className="mt-2 pt-2 border-t border-white/[0.06]">
                                <span className="text-xs text-white/40">Override fields: </span>
                                <code className="text-xs text-amber-400/80 bg-amber-500/10 px-1 rounded">
                                  {correction.override_fields_json}
                                </code>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Correction Form */}
                  <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4 text-emerald-400" />
                      <Label className="text-white/80 text-sm font-medium">Apply New Correction</Label>
                    </div>

                    {/* Corrections Text Input */}
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

                    {/* Languages Override (Optional) - Collapsible */}
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
                              Current: {run.languages_provided?.join(', ') || 'Not specified'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Error Display */}
                    {correctionsError && (
                      <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-rose-400 flex-shrink-0" />
                        <span className="text-rose-400 text-sm">{correctionsError}</span>
                      </div>
                    )}

                    {/* Apply Button */}
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
            </div>

            {/* Page 2: EU Findings Overview */}
            <div className="p-8 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 bg-[#5B6CFF]/10 text-[#5B6CFF] text-xs font-medium rounded-full border border-[#5B6CFF]/30">
                  Page 2
                </span>
                <span className="text-white/50 text-sm">EU 1169/2011 Findings</span>
              </div>

              <h3 className="text-xl font-semibold text-white/90 mb-6">
                {euChecks.length} EU Compliance Checks
              </h3>

              <div className="grid md:grid-cols-2 gap-3">
                {euChecks.map((check, i) => (
                  <FindingCard
                    key={i}
                    title={check.title}
                    severity={check.status}
                    source={check.source}
                    description={check.description}
                    reference={check.reference}
                  />
                ))}
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
            <div className="p-8 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/30">
                  <Printer className="inline h-3 w-3 mr-1" />
                  Print Pack
                </span>
                <span className="text-white/50 text-sm">Print Verification Pack</span>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 mb-6">
                <h4 className="text-white/90 font-semibold mb-4 flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-emerald-400" />
                  Versioning & Sign-off
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    ['Label Version ID', ''],
                    ['Artwork File Name', ''],
                    ['Print Vendor', ''],
                    ['Approval Owner (QA)', ''],
                    ['Date', ''],
                    ['Signature', ''],
                  ].map(([label]) => (
                    <div key={label} className="flex flex-col gap-1">
                      <span className="text-white/50 text-xs">{label}</span>
                      <div className="h-8 border-b border-white/20 border-dashed"></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
                <h4 className="text-white/90 font-semibold mb-4">Pre-Press Checklist</h4>
                <div className="space-y-3">
                  {[
                    'Mandatory particulars fully in target language',
                    'Allergen emphasis applied consistently',
                    'QUID declared where required',
                    'Net quantity format correct',
                    'Nutrition declaration complete',
                    'Operator name + full address present',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 border border-white/20 rounded flex-shrink-0 mt-0.5"></div>
                      <span className="text-white/70 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Halal Section - CRITICAL: Uses shared check definitions */}
            {run.halal && (
              <div className="p-8 border-b border-white/[0.06]">
                <div className="flex items-center gap-2 mb-6">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/30">
                    <Moon className="inline h-3 w-3 mr-1" />
                    Halal Module
                  </span>
                  <span className="text-white/50 text-sm">Halal Export-Readiness Preflight</span>
                </div>

                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-emerald-400 font-medium">Halal Export-Readiness Checks</span>
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded border border-emerald-500/30">
                      {halalChecks.length} Checks
                    </span>
                  </div>
                  <p className="text-white/50 text-sm">
                    Preflight Label + Supplier TDS to flag missing certificates, high-risk ingredients, and documentation gaps.
                  </p>
                </div>

                {/* Halal Checks - Using shared definitions */}
                <div className="space-y-3">
                  {halalChecks.length > 0 ? (
                    halalChecks.map((check, i) => (
                      <HalalCheckCard key={i} check={check} />
                    ))
                  ) : (
                    // Fallback: Show all checks as not_evaluated
                    HALAL_CHECK_DEFINITIONS.map((check, i) => (
                      <HalalCheckCard key={i} check={{ ...check, status: 'not_evaluated' }} />
                    ))
                  )}
                </div>

                {/* Disclaimer */}
                <div className="mt-6 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                  <p className="text-amber-400/80 text-xs">
                    <strong>Important:</strong> Halal determinations depend on target market and certification body. 
                    This module provides preflight risk flags, not certification.
                  </p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="px-8 py-4 bg-white/[0.02] border-t border-white/[0.06] flex items-center justify-between text-xs text-white/40">
              <span>Run ID: {run.run_id}</span>
              <span>Generated: {new Date(run.ts).toLocaleString()}</span>
              <span>{run.halal ? 'EU + Halal' : 'EU Only'}</span>
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
              Download PDF Report
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

          {/* Corrections & Re-run Section - Only shown on valid report */}
          {run && run.run_id && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10"
            >
              <div className="bg-gradient-to-b from-white/[0.04] to-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden">
                {/* Section Header */}
                <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
                  <Edit3 className="h-5 w-5 text-[#5B6CFF]" />
                  <h3 className="text-lg font-semibold text-white/90">Corrections & Re-run</h3>
                  {run.is_rerun && (
                    <span className="px-2 py-0.5 text-xs bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">
                      Re-run
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-6">
                  {/* A) Corrections Text */}
                  <div className="space-y-2">
                    <Label htmlFor="corrections" className="text-white/70 text-sm font-medium">
                      What should be corrected? *
                    </Label>
                    <Textarea
                      id="corrections"
                      value={correctionsText}
                      onChange={(e) => setCorrectionsText(e.target.value)}
                      placeholder="Describe the corrections needed. E.g., 'Update allergen emphasis for milk and hazelnuts. Correct QUID percentage for cocoa. Fix date marking format to DD/MM/YYYY.'"
                      className="min-h-[120px] bg-white/[0.04] border-white/[0.12] text-white placeholder:text-white/30 focus:border-[#5B6CFF] resize-none"
                    />
                    <p className="text-white/40 text-xs">
                      Describe the changes needed for the label. The system will re-analyze with these corrections in mind.
                    </p>
                  </div>

                  {/* B) Structured Overrides (Collapsible) */}
                  <div className="border border-white/[0.08] rounded-xl overflow-hidden">
                    <button
                      onClick={() => setShowOverrides(!showOverrides)}
                      className="w-full px-4 py-3 flex items-center justify-between bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                    >
                      <span className="text-sm font-medium text-white/70">Structured overrides (optional)</span>
                      {showOverrides ? (
                        <ChevronUp className="h-4 w-4 text-white/50" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-white/50" />
                      )}
                    </button>

                    {showOverrides && (
                      <div className="p-4 space-y-4 border-t border-white/[0.06]">
                        {/* Form Fields */}
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="net_quantity" className="text-white/60 text-xs">Net Quantity</Label>
                            <Input
                              id="net_quantity"
                              value={overrideFields.net_quantity}
                              onChange={(e) => handleOverrideChange('net_quantity', e.target.value)}
                              placeholder="e.g., 100 g ℮"
                              className="bg-white/[0.04] border-white/[0.12] text-white placeholder:text-white/30 text-sm"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="date_marking" className="text-white/60 text-xs">Date Marking</Label>
                            <Input
                              id="date_marking"
                              value={overrideFields.date_marking}
                              onChange={(e) => handleOverrideChange('date_marking', e.target.value)}
                              placeholder="e.g., Best before: DD/MM/YYYY"
                              className="bg-white/[0.04] border-white/[0.12] text-white placeholder:text-white/30 text-sm"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="fbo_name" className="text-white/60 text-xs">FBO Name</Label>
                            <Input
                              id="fbo_name"
                              value={overrideFields.fbo_name}
                              onChange={(e) => handleOverrideChange('fbo_name', e.target.value)}
                              placeholder="e.g., Example Foods S.r.l."
                              className="bg-white/[0.04] border-white/[0.12] text-white placeholder:text-white/30 text-sm"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="fbo_address" className="text-white/60 text-xs">FBO Address</Label>
                            <Input
                              id="fbo_address"
                              value={overrideFields.fbo_address}
                              onChange={(e) => handleOverrideChange('fbo_address', e.target.value)}
                              placeholder="e.g., Via Roma 123, 00100 Rome, Italy"
                              className="bg-white/[0.04] border-white/[0.12] text-white placeholder:text-white/30 text-sm"
                            />
                          </div>
                          <div className="space-y-1.5 sm:col-span-2">
                            <Label htmlFor="languages" className="text-white/60 text-xs">Languages (comma-separated)</Label>
                            <Input
                              id="languages"
                              value={overrideFields.languages}
                              onChange={(e) => handleOverrideChange('languages', e.target.value)}
                              placeholder="e.g., English, Italian, German"
                              className="bg-white/[0.04] border-white/[0.12] text-white placeholder:text-white/30 text-sm"
                            />
                          </div>
                        </div>

                        {/* Advanced JSON Toggle */}
                        <div className="border-t border-white/[0.06] pt-4">
                          <button
                            onClick={() => setShowAdvancedJson(!showAdvancedJson)}
                            className="flex items-center gap-2 text-xs text-white/50 hover:text-white/70 transition-colors"
                          >
                            <Code className="h-3.5 w-3.5" />
                            {showAdvancedJson ? 'Hide' : 'Show'} Advanced JSON Editor
                          </button>

                          {showAdvancedJson && (
                            <div className="mt-3 space-y-2">
                              <Label className="text-white/60 text-xs">Advanced JSON</Label>
                              <Textarea
                                value={advancedJson}
                                onChange={(e) => handleAdvancedJsonChange(e.target.value)}
                                className="font-mono text-xs min-h-[100px] bg-white/[0.04] border-white/[0.12] text-white placeholder:text-white/30"
                              />
                            </div>
                          )}
                        </div>

                        {/* Preview JSON (read-only) */}
                        <div className="space-y-2">
                          <Label className="text-white/50 text-xs">Preview JSON (sent with request)</Label>
                          <pre className="p-3 bg-black/20 rounded-lg text-xs font-mono text-white/60 overflow-x-auto">
                            {advancedJson}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Error Display */}
                  {rerunError && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-rose-400 flex-shrink-0" />
                      <span className="text-rose-400 text-sm">{rerunError}</span>
                    </div>
                  )}

                  {/* C) Re-run Button */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleRerun}
                      disabled={isRerunning || !correctionsText.trim()}
                      className="w-full bg-[#5B6CFF] hover:bg-[#4A5BEE] text-white h-12 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isRerunning ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Re-running...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Re-run with corrections
                        </>
                      )}
                    </Button>
                    <p className="text-white/40 text-xs text-center">
                      Re-run may cost 1 credit if OCR can be reused; otherwise backend may charge extra per page.
                    </p>
                  </div>

                  {/* D) PDF Consistency Note */}
                  <div className="p-3 bg-[#5B6CFF]/5 border border-[#5B6CFF]/20 rounded-lg">
                    <p className="text-[#5B6CFF]/80 text-xs flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                      The downloaded PDF for this run includes the corrections summary used.
                    </p>
                  </div>
                </div>
              </div>

              {/* Attempt History */}
              {attemptHistory.length > 0 && (
                <div className="mt-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
                  <div className="px-6 py-3 border-b border-white/[0.06] flex items-center gap-2">
                    <History className="h-4 w-4 text-white/50" />
                    <h4 className="text-sm font-medium text-white/70">Attempt History</h4>
                    <span className="text-xs text-white/40">({attemptHistory.length} runs)</span>
                  </div>
                  <div className="divide-y divide-white/[0.04]">
                    {attemptHistory.map((attempt) => (
                      <div
                        key={attempt.run_id}
                        className={`px-6 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors ${
                          attempt.run_id === run.run_id ? 'bg-[#5B6CFF]/5 border-l-2 border-l-[#5B6CFF]' : ''
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-white/60">{attempt.run_id}</span>
                              {attempt.run_id === run.run_id && (
                                <span className="px-1.5 py-0.5 text-[10px] bg-[#5B6CFF]/20 text-[#5B6CFF] rounded">Current</span>
                              )}
                              {attempt.is_rerun && (
                                <span className="px-1.5 py-0.5 text-[10px] bg-amber-500/20 text-amber-400 rounded">Re-run</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Clock className="h-3 w-3 text-white/30" />
                              <span className="text-xs text-white/40">{new Date(attempt.ts).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-sm font-medium ${
                            attempt.compliance_score >= 85 ? 'text-emerald-400' :
                            attempt.compliance_score >= 70 ? 'text-amber-400' : 'text-rose-400'
                          }`}>
                            {attempt.compliance_score}%
                          </span>
                          <span className={`px-2 py-0.5 text-xs rounded-full border ${
                            attempt.verdict === 'PASS' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                            attempt.verdict === 'FAIL' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                            'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          }`}>
                            {attempt.verdict}
                          </span>
                          {attempt.run_id !== run.run_id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/report/${attempt.run_id}`)}
                              className="text-white/50 hover:text-white hover:bg-white/[0.06]"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
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
