import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
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
  Circle,
} from 'lucide-react';
import { getSeverityColor } from '../lib/checkDefinitions';
import { HALAL_CHECK_DEFINITIONS } from '../lib/halalChecks';

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

export default function ReportView({ report, runIdFallback }) {
  if (!report) return null;

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

  // Derive data from report
  const complianceScore = safeNumber(report?.compliance_score ?? report?.score, 0);
  const evidenceConfidence = safeNumber(
    report?.evidence_confidence ?? report?.evidence_confidence_percent,
    0
  );
  const verdict = typeof report?.verdict === 'string' ? report.verdict : safeString(report?.verdict, 'CONDITIONAL');
  const runIdDisplay = safeString(report?.run_id, runIdFallback || 'Unknown');
  const generatedAt = report?.ts ? new Date(report.ts) : null;
  const generatedAtLabel = generatedAt && !Number.isNaN(generatedAt.getTime())
    ? generatedAt.toLocaleString()
    : 'Unknown time';
  const scoreColor = complianceScore >= 85 ? 'text-emerald-400' : complianceScore >= 70 ? 'text-amber-400' : 'text-rose-400';
  const product = report?.product || {
    product_name: report?.product_name,
    company_name: report?.company_name,
    country_of_sale: report?.country_of_sale,
    languages_provided: report?.languages_provided,
    halal_enabled: report?.halal,
  };
  const summary = report?.summary || {};
  const findings = Array.isArray(report?.findings) ? report.findings : [];
  const crossCheck = report?.cross_check || { matched: [], mismatched: [] };
  const printPack = report?.print_pack || {};
  const nextSteps = Array.isArray(report?.next_steps) ? report.next_steps : [];
  const artifacts = report?.artifacts || { run_dir: '', files: [] };
  const halalChecks = Array.isArray(report?.halalChecks) ? report.halalChecks : [];
  const halalEnabled = !!(product?.halal_enabled ?? report?.halal);

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
    <>
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-b from-white/[0.04] to-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
      >
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

        <div className="px-8 py-4 bg-white/[0.02] border-t border-white/[0.06] flex items-center justify-between text-xs text-white/40">
          <span>Run ID: {runIdDisplay}</span>
          <span>Generated: {generatedAtLabel}</span>
          <span>{halalEnabled ? 'EU + Halal' : 'EU Only'}</span>
        </div>
      </motion.div>
    </>
  );
}
