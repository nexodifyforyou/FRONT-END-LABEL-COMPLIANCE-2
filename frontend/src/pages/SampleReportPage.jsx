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
} from 'lucide-react';

// Severity Badge
const SeverityBadge = ({ level }) => {
  const styles = {
    critical: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    high: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    pass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  };
  const label = level === 'high' ? 'Critical' : level === 'medium' ? 'Warning' : level === 'low' ? 'Info' : level.charAt(0).toUpperCase() + level.slice(1);
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${styles[level] || styles.warning}`}>
      {label}
    </span>
  );
};

// Finding Card
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
          <p className="text-white/55 text-sm">{fix}</p>
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
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/[0.06]">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </Link>
              <a href="/sample-report.pdf" download>
                <Button variant="outline" className="border-white/[0.14] text-white/80 hover:bg-white/[0.04]">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
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
              <p className="text-white/60 mb-8">Automated verification against Regulation (EU) 1169/2011</p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Product Info */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-4">Product Information</div>
                  {[
                    ['Product Name', 'Milk Chocolate Bar with Hazelnuts (100 g)'],
                    ['Company', 'Example Foods S.r.l.'],
                    ['Country of Sale', 'Italy'],
                    ['Languages', 'Italian, English'],
                    ['Category', 'Confectionery'],
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
                    <div className="text-5xl font-bold text-amber-400">78%</div>
                    <div className="text-white/50 text-sm mt-1">Issues require attention</div>
                  </div>
                  <div className="flex gap-3 mt-4 flex-wrap">
                    <span className="flex items-center gap-1.5 text-xs">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      <span className="text-rose-400">2 Critical</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-xs">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span className="text-amber-400">4 Warnings</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="text-emerald-400">14 Passed</span>
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

              <h3 className="text-xl font-semibold text-white/90 mb-6">6 Issues Identified</h3>

              <div className="grid md:grid-cols-2 gap-3">
                <FindingCard title="Allergen emphasis missing" severity="critical" source="Label" fix="Apply bold to 'milk, hazelnuts, soy lecithin' in ingredients" />
                <FindingCard title="Cocoa QUID percentage absent" severity="critical" source="Label" fix="Declare cocoa solids % per Article 22" />
                <FindingCard title="Net quantity format" severity="warning" source="Label" fix="Use 'e' symbol with 100 g declaration" />
                <FindingCard title="Nutrition %RI missing" severity="warning" source="Label" fix="Add Reference Intake percentages per Article 32" />
                <FindingCard title="Storage conditions absent" severity="warning" source="TDS" fix="Add 'Store in a cool, dry place' to label" />
                <FindingCard title="Operator address incomplete" severity="warning" source="Label" fix="Include full postal address with postal code" />
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

              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 mb-4">
                <div className="flex items-center gap-2 mb-4">
                  <SeverityBadge level="critical" />
                  <span className="text-white/90 font-semibold">Allergen Emphasis Missing</span>
                </div>

                <div className="bg-[#0B1020] border border-white/[0.08] rounded-lg p-4 mb-4">
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Evidence (Label excerpt)</div>
                  <p className="text-white/70 text-sm italic">
                    "Ingredients: Sugar, cocoa butter, whole <span className="text-[#5B6CFF] font-medium">milk</span> powder, <span className="text-[#5B6CFF] font-medium">hazelnuts</span> (15%), cocoa mass, <span className="text-[#5B6CFF] font-medium">soy</span> lecithin (emulsifier), natural vanilla flavouring."
                  </p>
                  <p className="text-white/40 text-xs mt-2">↳ Allergens appear in regular typeface, not distinguished</p>
                </div>

                <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4">
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Recommended Fix</div>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li className="flex items-start gap-2">
                      <span className="text-[#5B6CFF]">1.</span>
                      Update ingredients: "...whole <strong>MILK</strong> powder, <strong>HAZELNUTS</strong> (15%), cocoa mass, <strong>SOY</strong> lecithin..."
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#5B6CFF]">2.</span>
                      Add "Contains: Milk, Hazelnuts (tree nuts), Soy" statement
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#5B6CFF]">3.</span>
                      Apply consistently in Italian translation
                    </li>
                  </ul>
                </div>

                <p className="text-white/40 text-xs mt-4">Reference: Regulation (EU) 1169/2011, Article 21(1)(b), Annex II</p>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <SeverityBadge level="critical" />
                  <span className="text-white/90 font-semibold">Cocoa QUID Percentage Absent</span>
                </div>

                <div className="bg-[#0B1020] border border-white/[0.08] rounded-lg p-4 mb-4">
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Evidence (Label excerpt)</div>
                  <p className="text-white/70 text-sm italic">
                    Product name: "<span className="text-[#5B6CFF] font-medium">Milk Chocolate</span> Bar with Hazelnuts"
                    <br />Ingredients list shows "cocoa mass" without percentage
                  </p>
                  <p className="text-white/40 text-xs mt-2">↳ "Chocolate" in name triggers QUID requirement for cocoa</p>
                </div>

                <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4">
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Recommended Fix</div>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li className="flex items-start gap-2">
                      <span className="text-[#5B6CFF]">1.</span>
                      Add "Cocoa solids: 30% minimum" declaration
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#5B6CFF]">2.</span>
                      Verify percentage against TDS specification
                    </li>
                  </ul>
                </div>

                <p className="text-white/40 text-xs mt-4">Reference: Regulation (EU) 1169/2011, Article 22; Directive 2000/36/EC</p>
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
                  {['Product Name', 'Net Quantity', 'Ingredients Order', 'Hazelnut %', 'Allergen List'].map((item) => (
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
                    { field: 'Cocoa Solids %', note: 'TDS: 32%, Label: not declared' },
                    { field: 'Storage Temp', note: 'TDS: < 25°C, Label: missing' },
                    { field: 'Sugar Content', note: 'TDS: 48g, Label: 45g per 100g' },
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

              {/* Sign-off Block */}
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
                <div className="mt-4">
                  <span className="text-white/50 text-xs">Final Print Run Notes</span>
                  <div className="h-16 border border-white/10 border-dashed rounded mt-1"></div>
                </div>
              </div>

              {/* Pre-Press Checklist */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 mb-6">
                <h4 className="text-white/90 font-semibold mb-4">Pre-Press Checklist</h4>
                <div className="space-y-3">
                  {[
                    'Mandatory particulars fully in Italian for Italy sale',
                    'Allergen emphasis applied consistently (ingredients + contains statements)',
                    'QUID declared where ingredients are emphasized (text/imagery)',
                    'Net quantity format correct (units/placement/legibility check)',
                    'Nutrition declaration complete and formatted correctly (per 100 g)',
                    'Operator name + full address present',
                    'Lot/expiry placeholders present (if applicable) and legible',
                    'Font size/contrast acceptable for print readability',
                    'Barcode area clear + quiet zone respected',
                    'Language consistency across panels',
                    'Claims reviewed (if present) — mark "requires separate verification"',
                    'Cross-check with TDS confirms formulation + allergens + nutrition values',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 border border-white/20 rounded flex-shrink-0 mt-0.5"></div>
                      <span className="text-white/70 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attachments Checklist */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 mb-6">
                <h4 className="text-white/90 font-semibold mb-4">What to Send to Printer</h4>
                <div className="space-y-3">
                  {[
                    'PDF compliance report',
                    'Final artwork proof (PDF)',
                    'Supplier TDS version used',
                    'Approval email/thread reference',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 border border-white/20 rounded flex-shrink-0 mt-0.5"></div>
                      <span className="text-white/70 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Printer Notes */}
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                <h4 className="text-amber-400 font-semibold text-sm mb-2">Printer Notes</h4>
                <p className="text-white/60 text-sm">
                  Verify legibility, panel consistency, safe margins/trim, and final proof sign-off before production run.
                </p>
              </div>
            </div>

            {/* Halal Export-Readiness Preflight */}
            <div className="p-8 border-b border-white/[0.06]" id="halal-preflight">
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/30">
                  Optional Module
                </span>
                <span className="text-white/50 text-sm">Halal Export-Readiness Preflight</span>
              </div>

              {/* Module Status */}
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-medium">Module Status</span>
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded border border-emerald-500/30">
                    Sample Preview
                  </span>
                </div>
              </div>

              {/* Inputs Checklist */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 mb-6">
                <h4 className="text-white/90 font-semibold mb-4">Inputs Provided</h4>
                <div className="flex flex-wrap gap-3">
                  <span className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-sm rounded-full border border-emerald-500/30">
                    <CheckCircle className="h-3.5 w-3.5" /> Supplier TDS
                  </span>
                  <span className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 text-amber-400 text-sm rounded-full border border-amber-500/30">
                    <AlertTriangle className="h-3.5 w-3.5" /> Halal Certificate (not provided)
                  </span>
                  <span className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] text-white/60 text-sm rounded-full border border-white/[0.08]">
                    Target Market: Malaysia
                  </span>
                </div>
              </div>

              {/* Halal Checks */}
              <div className="space-y-3 mb-6">
                <h4 className="text-white/90 font-semibold">Halal Preflight Checks (10)</h4>
                
                {[
                  { title: 'Halal Certificate Provided', status: 'fail', severity: 'high', source: 'Input', detail: 'No Halal certificate uploaded for verification', fix: 'Obtain valid Halal certificate from accredited body' },
                  { title: 'Certificate Validity / Expiry', status: 'warning', severity: 'medium', source: 'N/A', detail: 'Cannot verify — certificate not provided', fix: 'Ensure certificate covers production dates' },
                  { title: 'Issuing Body Listed', status: 'warning', severity: 'medium', source: 'N/A', detail: 'Cannot verify accreditation status', fix: 'Confirm issuing body recognized by target market' },
                  { title: 'Animal-Derived Ingredient Risk', status: 'warning', severity: 'medium', source: 'TDS', detail: 'Milk powder present — requires source verification', fix: 'Confirm dairy source meets Halal requirements' },
                  { title: 'Gelatin / Enzymes Check', status: 'pass', severity: 'low', source: 'TDS', detail: 'No gelatin or animal enzymes declared', fix: 'No action required' },
                  { title: 'Alcohol / Solvent Carrier Flags', status: 'warning', severity: 'medium', source: 'TDS', detail: 'Vanilla flavouring — carrier not specified', fix: 'Confirm non-alcohol carrier with supplier' },
                  { title: 'E-Number Source Verification', status: 'warning', severity: 'medium', source: 'Label', detail: 'Soy lecithin (E322) — plant-derived OK, verify processing', fix: 'Request Halal statement from lecithin supplier' },
                  { title: 'Cross-Contamination Statement', status: 'fail', severity: 'high', source: 'TDS', detail: 'No dedicated line / cleaning protocol info', fix: 'Obtain facility Halal compliance statement' },
                  { title: 'Traceability Fields Complete', status: 'pass', severity: 'low', source: 'TDS', detail: 'Lot traceability documented', fix: 'No action required' },
                  { title: 'Halal Logo Usage Check', status: 'warning', severity: 'medium', source: 'Label', detail: 'No Halal logo present on label', fix: 'Add authorized logo only with valid certification' },
                ].map((check, i) => (
                  <div key={i} className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      {check.status === 'pass' ? (
                        <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      ) : check.status === 'warning' ? (
                        <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-rose-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-2 mb-2">
                          <span className="text-white/90 font-medium">{check.title}</span>
                          <SeverityBadge level={check.severity} />
                          <span className="text-xs text-[#5B6CFF] bg-[#5B6CFF]/10 px-2 py-0.5 rounded-full border border-[#5B6CFF]/30">
                            {check.source}
                          </span>
                        </div>
                        <p className="text-white/55 text-sm mb-1">{check.detail}</p>
                        <p className="text-white/40 text-xs">Fix: {check.fix}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Halal Disclaimer */}
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                <p className="text-amber-400/90 text-sm">
                  <strong>Important:</strong> Halal determinations depend on the target market, accepted standard, and certification body. This module provides preflight risk flags, not certification.
                </p>
              </div>
            </div>

            {/* Next Steps */}
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
                    { p: 'P1', task: 'Fix allergen emphasis + cocoa QUID' },
                    { p: 'P1', task: 'Reconcile Label ↔ TDS sugar mismatch' },
                    { p: 'P2', task: 'Add %RI to nutrition table' },
                    { p: 'P2', task: 'Add storage conditions' },
                    { p: 'P3', task: 'Complete print verification sign-off' },
                    { p: 'P3', task: 'Resolve Halal certificate gaps (if exporting)' },
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
              <span>Sample Preview</span>
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
              This is a sample report. Actual reports reflect your uploaded documents.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button className="bg-[#5B6CFF] hover:bg-[#4A5BEE] text-white h-12 px-8 rounded-xl shadow-lg shadow-[#5B6CFF]/25 hover:shadow-[#5B6CFF]/40 transition-all">
                  Run Your Own Preflight
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="/sample-report.pdf" download>
                <Button variant="outline" className="border-white/[0.14] text-white/80 hover:bg-white/[0.04] h-12 px-8 rounded-xl">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF Version
                </Button>
              </a>
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
