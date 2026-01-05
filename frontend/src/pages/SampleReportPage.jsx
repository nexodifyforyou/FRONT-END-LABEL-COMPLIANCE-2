import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ArrowLeft,
  Download,
  FileText,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';

// Severity Badge
const SeverityBadge = ({ level }) => {
  const styles = {
    critical: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    pass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  };
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${styles[level]}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
};

// Finding Card
const FindingCard = ({ title, severity, source, fix }) => {
  const StatusIcon = severity === 'critical' ? XCircle : severity === 'warning' ? AlertTriangle : CheckCircle;
  const statusColor = severity === 'critical' ? 'text-rose-400' : severity === 'warning' ? 'text-amber-400' : 'text-emerald-400';
  
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
          <p className="text-white/50 text-sm">{fix}</p>
        </div>
      </div>
    </div>
  );
};

export default function SampleReportPage() {
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
            <Link to="/">
              <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/[0.06]">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-white/95 mb-4">
              Sample Compliance Report
            </h1>
            <p className="text-white/55 max-w-2xl mx-auto">
              Interactive preview of a 6-page EU 1169/2011 label compliance preflight report
            </p>
          </motion.div>

          {/* Report Preview */}
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
                <div className="text-white/70 font-mono">SAMPLE-AVA-0001</div>
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
              <p className="text-white/55 mb-8">Automated verification against Regulation (EU) 1169/2011</p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Product Info */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-4">Product Information</div>
                  {[
                    ['Product Name', 'Omega-3 Capsules 1000mg'],
                    ['Company', 'Example Nutrition S.r.l.'],
                    ['Country of Sale', 'Italy'],
                    ['Languages', 'Italian, English'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between py-2 border-b border-white/[0.04] last:border-0">
                      <span className="text-white/50 text-sm">{label}</span>
                      <span className="text-white/90 text-sm font-medium">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Score Card */}
                <div className="bg-[#0B1020] border border-white/[0.08] rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Compliance Score</div>
                    <div className="text-5xl font-bold text-amber-400">72%</div>
                    <div className="text-white/50 text-sm mt-1">Issues require attention</div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <span className="flex items-center gap-1.5 text-xs">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      <span className="text-rose-400">3 Critical</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-xs">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span className="text-amber-400">5 Warnings</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="text-emerald-400">12 Passed</span>
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

              <h3 className="text-xl font-semibold text-white/90 mb-6">8 Issues Identified</h3>

              <div className="grid md:grid-cols-2 gap-3">
                <FindingCard title="Allergen emphasis missing" severity="critical" source="Label" fix="Apply bold or CAPS to allergen names" />
                <FindingCard title="QUID percentage absent" severity="critical" source="Label" fix="Add % for fish oil ingredient" />
                <FindingCard title="Language mismatch" severity="critical" source="Label" fix="Add Italian translations" />
                <FindingCard title="Nutrition table incomplete" severity="warning" source="Label" fix="Add %RI values" />
                <FindingCard title="Net quantity format" severity="warning" source="Label" fix="Use 'e' symbol correctly" />
                <FindingCard title="Operator address" severity="warning" source="Label" fix="Include full postal address" />
                <FindingCard title="Storage conditions" severity="warning" source="TDS" fix="Add storage temperature" />
                <FindingCard title="Claim verification" severity="warning" source="Label" fix="Check EU Register" />
              </div>
            </div>

            {/* Page 3-4: Evidence Preview */}
            <div className="p-8 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 bg-[#5B6CFF]/10 text-[#5B6CFF] text-xs font-medium rounded-full border border-[#5B6CFF]/30">
                  Pages 3-4
                </span>
                <span className="text-white/50 text-sm">Evidence & Fix Details</span>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <SeverityBadge level="critical" />
                  <span className="text-white/90 font-semibold">Allergen Emphasis Missing</span>
                </div>

                <div className="bg-[#0B1020] border border-white/[0.08] rounded-lg p-4 mb-4">
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Evidence (Label excerpt)</div>
                  <p className="text-white/70 text-sm italic">
                    "Ingredients: Fish oil, gelatin capsule (bovine gelatin, glycerol), <span className="text-[#5B6CFF] font-medium">soy</span> lecithin, mixed tocopherols. Contains: <span className="text-[#5B6CFF] font-medium">fish, soy</span>."
                  </p>
                  <p className="text-white/40 text-xs mt-2">↳ Allergens appear in regular typeface, not distinguished</p>
                </div>

                <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4">
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Recommended Fix</div>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li className="flex items-start gap-2">
                      <span className="text-[#5B6CFF]">1.</span>
                      Update ingredients to emphasize: "...FISH oil, gelatin capsule..."
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#5B6CFF]">2.</span>
                      Apply consistently across all label languages
                    </li>
                  </ul>
                </div>

                <p className="text-white/40 text-xs mt-4">Reference: Regulation (EU) 1169/2011, Article 21(1)(b), Annex II</p>
              </div>
            </div>

            {/* Page 5: Cross-Check */}
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
                    Matched (5)
                  </h4>
                  {['Product Name', 'Net Quantity', 'Ingredients Order', 'Best Before Format', 'Capsule Count'].map((item) => (
                    <div key={item} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                      <span className="text-white/60 text-sm">{item}</span>
                      <span className="text-emerald-400 text-xs">✓ Match</span>
                    </div>
                  ))}
                </div>

                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
                  <h4 className="text-white/90 font-semibold mb-4 flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-rose-400" />
                    Mismatched (3)
                  </h4>
                  {[
                    { field: 'Allergen List', note: 'TDS includes shellfish' },
                    { field: 'EPA Content', note: 'Label shows 180mg vs TDS 200mg' },
                    { field: 'Storage Temp', note: 'TDS has temp, label missing' },
                  ].map((item) => (
                    <div key={item.field} className="py-2 border-b border-white/[0.04] last:border-0">
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">{item.field}</span>
                        <span className="text-rose-400 text-xs">Mismatch</span>
                      </div>
                      <span className="text-amber-400/70 text-xs">⚠ {item.note}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Page 6: Next Steps */}
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
                  {[
                    { p: 'P1', task: 'Fix allergen emphasis, QUID, language' },
                    { p: 'P1', task: 'Reconcile Label ↔ TDS mismatches' },
                    { p: 'P2', task: 'Add %RI to nutrition table' },
                    { p: 'P2', task: 'Complete operator address' },
                    { p: 'P3', task: 'Verify health claim in EU Register' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0">
                      <span className="w-4 h-4 border border-white/20 rounded"></span>
                      <span className="px-1.5 py-0.5 bg-[#5B6CFF]/10 text-[#5B6CFF] text-[10px] font-medium rounded">{item.p}</span>
                      <span className="text-white/70 text-sm">{item.task}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5">
                  <h4 className="text-white/90 font-semibold mb-4">Audit Trail Artifacts</h4>
                  <div className="bg-[#0B1020] border border-white/[0.08] rounded-lg p-4 font-mono text-xs">
                    <div className="text-white/40 mb-2">/srv/ava/data/runs/SAMPLE-AVA-0001/</div>
                    <div className="text-white/60 space-y-1">
                      <div>├── label.pdf</div>
                      <div>├── tds.pdf</div>
                      <div>├── evidence_text.txt</div>
                      <div>├── request.json</div>
                      <div>├── report.json</div>
                      <div>└── report.pdf</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-white/[0.02] border-t border-white/[0.06] flex items-center justify-between text-xs text-white/40">
              <span>Run ID: SAMPLE-AVA-0001</span>
              <span>Generated: January 5, 2025 at 14:32 UTC</span>
              <span>Sample Preview • 6 Pages</span>
            </div>
          </motion.div>

          {/* Download CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-center"
          >
            <p className="text-white/40 text-sm mb-4">
              This is a sample report format. Actual reports reflect your uploaded documents.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button className="bg-[#5B6CFF] hover:bg-[#4A5BEE] text-white h-12 px-8 rounded-xl shadow-lg shadow-[#5B6CFF]/25 hover:shadow-[#5B6CFF]/40 transition-all">
                  Run Your Own Preflight
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
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
