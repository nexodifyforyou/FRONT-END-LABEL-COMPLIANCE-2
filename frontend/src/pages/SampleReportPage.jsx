import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ArrowLeft,
  Download,
  ExternalLink,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import ReportView from '../components/ReportView';

export default function SampleReportPage() {
  const [sampleReport, setSampleReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    const fetchSampleReport = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const response = await fetch('/sample-report.json');
        if (!response.ok) {
          throw new Error('Failed to load sample report');
        }
        const reportData = await response.json();
        setSampleReport(reportData);
      } catch (error) {
        console.error('Error loading sample report:', error);
        setLoadError(error.message || 'Failed to load sample report');
      } finally {
        setLoading(false);
      }
    };

    fetchSampleReport();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070A12] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5B6CFF] mb-4"></div>
        <p className="text-white/50 text-sm">Loading sample report...</p>
      </div>
    );
  }

  if (loadError || !sampleReport) {
    return (
      <div className="min-h-screen bg-[#070A12] flex flex-col items-center justify-center text-white px-6">
        <XCircle className="h-12 w-12 text-rose-400 mb-4" />
        <h1 className="text-xl font-semibold mb-2">Error Loading Sample Report</h1>
        <p className="text-white/50 mb-6 max-w-md text-center">
          {loadError || 'The sample report could not be loaded.'}
        </p>
        <Link to="/">
          <Button className="bg-[#5B6CFF] hover:bg-[#4A5BEE]">
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  const samplePdfHref = sampleReport?.product?.halal_enabled === true
    ? '/sample-halal-report.pdf'
    : '/sample-report.pdf';

  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#070A12]/60 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5">
              <ShieldCheck className="h-7 w-7 text-[#5B6CFF]" />
              <span className="text-lg font-semibold text-white/95">Nexodify</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/[0.06]">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </Link>
              <a href={samplePdfHref} download>
                <Button variant="outline" className="border-white/[0.14] text-white/80 hover:bg-white/[0.04]">
                  <Download className="mr-2 h-4 w-4" />
                  Download Sample PDF
                </Button>
              </a>
              <Link to="/register">
                <Button className="bg-[#5B6CFF] hover:bg-[#4A5BEE] text-white rounded-xl">
                  Run a Preflight
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white/95 mb-4">
              Interactive Sample Report
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto">
              EU 1169/2011 label compliance preflight with print verification and optional Halal checks
            </p>
          </motion.div>

          {/* What's Inside */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-8">
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-5">
              <h3 className="text-white/90 font-semibold mb-3">What's Inside</h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  'Executive summary + compliance score',
                  'Findings (severity + fixes)',
                  'Evidence excerpts (Label/TDS)',
                  'Label ↔ TDS cross-check summary',
                  'Print Verification Pack (checklist + sign-off)',
                  'Halal export-readiness preflight (optional)',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-white/60">
                    <CheckCircle className="h-4 w-4 text-[#5B6CFF] flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <ReportView report={sampleReport} />

          {/* Download CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-center"
          >
            <p className="text-white/40 text-sm mb-4">
              This is a sample report. Actual reports reflect your uploaded documents.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button className="bg-[#5B6CFF] hover:bg-[#4A5BEE] text-white h-12 px-8 rounded-xl shadow-lg shadow-[#5B6CFF]/25 hover:shadow-[#5B6CFF]/40 transition-all">
                  Run Your Own Preflight
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href={samplePdfHref} download>
                <Button variant="outline" className="border-white/[0.14] text-white/80 hover:bg-white/[0.04] h-12 px-8 rounded-xl">
                  <Download className="mr-2 h-4 w-4" />
                  Download Sample PDF
                </Button>
              </a>
            </div>
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
