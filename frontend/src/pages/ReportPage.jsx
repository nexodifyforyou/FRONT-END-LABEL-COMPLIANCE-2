import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
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
} from 'lucide-react';

// Severity Badge - reused from SampleReportPage
const SeverityBadge = ({ level }) => {
  const styles = {
    critical: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    high: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    pass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  };
  const label = level === 'high' ? 'Critical' : level === 'medium' ? 'Warning' : level === 'low' ? 'Info' : level === 'critical' ? 'Critical' : level.charAt(0).toUpperCase() + level.slice(1);
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${styles[level] || styles.warning}`}>
      {label}
    </span>
  );
};

// Finding Card - reused from SampleReportPage
const FindingCard = ({ title, severity, source, fix }) => {
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
            <span className="text-xs text-[#5B6CFF] bg-[#5B6CFF]/10 px-2 py-0.5 rounded-full border border-[#5B6CFF]/30">
              {source}
            </span>
          </div>
          {fix && <p className="text-white/55 text-sm">{fix}</p>}
        </div>
      </div>
    </div>
  );
};

// Category Chip - reused from SampleReportPage
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
  const { isAdmin, creditsDisplay } = useAuth();
  const [run, setRun] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load run data from localStorage
  useEffect(() => {
    const storedRuns = localStorage.getItem('ava_runs');
    if (storedRuns) {
      try {
        const runs = JSON.parse(storedRuns);
        const foundRun = runs.find(r => r.run_id === runId);
        if (foundRun) {
          setRun(foundRun);
        }
      } catch (e) {
        console.error('Error loading run:', e);
      }
    }
    setLoading(false);
  }, [runId]);

  const handleDownloadPdf = () => {
    const pdfPath = run?.halal ? '/sample-halal-report.pdf' : '/sample-report.pdf';
    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = `${run?.run_id || 'report'}-report.pdf`;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070A12] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5B6CFF]"></div>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="min-h-screen bg-[#070A12] flex flex-col items-center justify-center text-white">
        <XCircle className="h-12 w-12 text-rose-400 mb-4" />
        <h1 className="text-xl font-semibold mb-2">Run Not Found</h1>
        <p className="text-white/50 mb-6">The requested run could not be found.</p>
        <Button onClick={() => navigate('/dashboard')} className="bg-[#5B6CFF] hover:bg-[#4A5BEE]">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  // Derive data from run
  const scoreColor = run.compliance_score >= 85 ? 'text-emerald-400' : run.compliance_score >= 70 ? 'text-amber-400' : 'text-rose-400';
  const criticalCount = run.checks?.filter(c => c.status === 'critical' || c.status === 'high').length || 0;
  const warningCount = run.checks?.filter(c => c.status === 'warning' || c.status === 'medium').length || 0;
  const passCount = run.checks?.filter(c => c.status === 'pass' || c.status === 'low').length || 0;

  return (
    <div className="min-h-screen bg-[#070A12] text-white">
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

          {/* Report Preview - REUSING SAME UI AS SampleReportPage */}
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

            {/* Page 2: Findings Overview */}
            <div className="p-8 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 bg-[#5B6CFF]/10 text-[#5B6CFF] text-xs font-medium rounded-full border border-[#5B6CFF]/30">
                  Page 2
                </span>
                <span className="text-white/50 text-sm">Findings Overview</span>
              </div>

              <h3 className="text-xl font-semibold text-white/90 mb-6">
                {run.checks?.length || 0} Checks Performed
              </h3>

              <div className="grid md:grid-cols-2 gap-3">
                {run.checks?.map((check, i) => (
                  <FindingCard
                    key={i}
                    title={check.title}
                    severity={check.status}
                    source={check.source}
                    fix={check.fix}
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

            {/* Halal Section (if enabled) */}
            {run.halal && (
              <div className="p-8 border-b border-white/[0.06]">
                <div className="flex items-center gap-2 mb-6">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/30">
                    <Moon className="inline h-3 w-3 mr-1" />
                    Halal
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

                <div className="space-y-3">
                  {run.checks?.filter(c => c.source === 'Input' || c.title.toLowerCase().includes('halal')).map((check, i) => (
                    <FindingCard
                      key={i}
                      title={check.title}
                      severity={check.status}
                      source={check.source}
                      fix={check.fix}
                    />
                  ))}
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
