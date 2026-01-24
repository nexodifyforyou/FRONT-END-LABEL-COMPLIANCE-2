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
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Edit3,
  Loader2,
  MessageSquare,
  Plus,
  X,
} from 'lucide-react';
import { runAPI } from '../lib/api';
import ReportView from '../components/ReportView';

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

  const product = run?.product || {
    product_name: run?.product_name,
    company_name: run?.company_name,
    country_of_sale: run?.country_of_sale,
    languages_provided: run?.languages_provided,
    halal_enabled: run?.halal,
  };
  const corrections = Array.isArray(run?.corrections) ? run.corrections : [];

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
          <ReportView report={run} runIdFallback={runId} />

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
