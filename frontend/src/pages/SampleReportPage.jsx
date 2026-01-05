import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pdf } from '@react-pdf/renderer';
import SampleReportPDF from '../components/pdf/SampleReportPDF';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ArrowLeft,
  Download,
  FileText,
  ExternalLink,
  Loader2,
  AlertCircle,
} from 'lucide-react';

export default function SampleReportPage() {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const generatePdf = async () => {
      try {
        setLoading(true);
        const blob = await pdf(<SampleReportPDF />).toBlob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (err) {
        console.error('PDF generation error:', err);
        setError('Failed to generate PDF preview. Please try downloading directly.');
      } finally {
        setLoading(false);
      }
    };
    generatePdf();

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, []);

  const handleDownload = async () => {
    try {
      const blob = await pdf(<SampleReportPDF />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'nexodify-ava-sample-report.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

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
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white/95">
                  Sample Report Preview
                </h1>
                <p className="text-white/55 mt-2">
                  6-page premium PDF report for EU 1169/2011 compliance preflight
                </p>
              </div>
              <Button
                onClick={handleDownload}
                className="bg-[#5B6CFF] hover:bg-[#4A5BEE] text-white rounded-xl px-6 shadow-lg shadow-[#5B6CFF]/25 hover:shadow-[#5B6CFF]/40 transition-all"
                data-testid="download-sample-pdf-btn"
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </motion.div>

          {/* PDF Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid sm:grid-cols-3 gap-4 mb-8"
          >
            {[
              { label: 'Pages', value: '6', icon: FileText },
              { label: 'Product', value: 'Omega-3 Capsules 1000mg', icon: ShieldCheck },
              { label: 'Score', value: '72% Compliance', icon: AlertCircle },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-[#5B6CFF]/10 flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-[#5B6CFF]" />
                </div>
                <div>
                  <div className="text-xs text-white/40 uppercase tracking-wider">{item.label}</div>
                  <div className="text-white/90 font-medium">{item.value}</div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* PDF Viewer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.55)' }}
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="h-10 w-10 text-[#5B6CFF] animate-spin mb-4" />
                <p className="text-white/55">Generating PDF preview...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-32">
                <AlertCircle className="h-10 w-10 text-amber-400 mb-4" />
                <p className="text-white/70 mb-4">{error}</p>
                <Button
                  onClick={handleDownload}
                  className="bg-[#5B6CFF] hover:bg-[#4A5BEE] text-white rounded-xl"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF Instead
                </Button>
              </div>
            ) : (
              <div className="relative">
                {/* PDF Embed */}
                <object
                  data={pdfUrl}
                  type="application/pdf"
                  className="w-full h-[800px]"
                  data-testid="pdf-viewer"
                >
                  {/* Fallback for browsers that can't embed PDFs */}
                  <div className="flex flex-col items-center justify-center py-32 bg-[#0B1020]">
                    <FileText className="h-16 w-16 text-white/20 mb-4" />
                    <p className="text-white/70 mb-2">PDF preview not available in this browser</p>
                    <p className="text-white/50 text-sm mb-6">Download the file to view the full report</p>
                    <Button
                      onClick={handleDownload}
                      className="bg-[#5B6CFF] hover:bg-[#4A5BEE] text-white rounded-xl"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>
                </object>
              </div>
            )}
          </motion.div>

          {/* Report Contents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 grid md:grid-cols-2 gap-6"
          >
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white/90 mb-4">Report Contents</h3>
              <ul className="space-y-3">
                {[
                  { page: 1, title: 'Executive Summary', desc: 'Score, product info, what was checked' },
                  { page: 2, title: 'Findings Overview', desc: '8 issues with severity and source' },
                  { page: '3-4', title: 'Evidence & Fix Details', desc: 'Deep dive on critical findings' },
                  { page: 5, title: 'Cross-Check Summary', desc: 'Label ↔ TDS comparison' },
                  { page: 6, title: 'Next Steps & Audit Trail', desc: 'Checklist and artifact locations' },
                ].map((item) => (
                  <li key={item.page} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-6 bg-[#5B6CFF]/10 rounded text-[#5B6CFF] text-xs font-medium flex items-center justify-center">
                      {item.page}
                    </span>
                    <div>
                      <div className="text-white/80 font-medium text-sm">{item.title}</div>
                      <div className="text-white/50 text-xs">{item.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white/90 mb-4">Sample Data Used</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-white/[0.06]">
                  <span className="text-white/50">Product</span>
                  <span className="text-white/80">Omega-3 Capsules 1000mg</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/[0.06]">
                  <span className="text-white/50">Company</span>
                  <span className="text-white/80">Example Nutrition S.r.l.</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/[0.06]">
                  <span className="text-white/50">Country</span>
                  <span className="text-white/80">Italy</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/[0.06]">
                  <span className="text-white/50">Score</span>
                  <span className="text-amber-400 font-medium">72%</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-white/50">Issues</span>
                  <span className="text-white/80">3 Critical · 5 Warnings</span>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-white/[0.06]">
                <p className="text-white/40 text-xs">
                  This is a sample report with fictional data for demonstration purposes. 
                  Actual reports will reflect your uploaded documents.
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 text-center"
          >
            <p className="text-white/55 mb-4">
              Ready to generate your own compliance report?
            </p>
            <Link to="/register">
              <Button className="bg-[#5B6CFF] hover:bg-[#4A5BEE] text-white h-12 px-8 rounded-xl text-base font-medium shadow-lg shadow-[#5B6CFF]/25 hover:shadow-[#5B6CFF]/40 transition-all">
                Run a Preflight
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <span className="text-white/40 text-sm">© 2025 Nexodify. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
