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
import { normalizeReport } from '../lib/reportViewModel';
import { formatVerdictLabel, normalizeVerdict } from '../utils/verdict';

const cardBase = 'bg-white/[0.035] border border-white/[0.06] rounded-2xl p-6 shadow-[0_18px_40px_rgba(0,0,0,0.35)]';
const cardInset = 'bg-[#0B1020]/70 rounded-xl p-4';

// Severity Badge - uses shared severity colors
const SeverityBadge = ({ level }) => {
  const colors = getSeverityColor(level);
  return (
    <span className={`px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}>
      {colors.badge}
    </span>
  );
};

// Finding Card for Issues Overview
const FindingCard = ({ title, severity, source, fix, safeString }) => {
  const colors = getSeverityColor(severity);
  const StatusIcon = severity === 'critical' || severity === 'high' ? XCircle : severity === 'warning' || severity === 'medium' ? AlertTriangle : CheckCircle;

  return (
    <div className={`${cardBase} hover:border-white/[0.16] transition-all`}>
      <div className="flex items-start gap-3">
        <StatusIcon className={`h-5 w-5 mt-0.5 ${colors.text} flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-2">
            <span className="text-white/90 text-base font-semibold">{safeString(title, 'Untitled check')}</span>
            <SeverityBadge level={severity} />
            {source && (
              <span className="text-[11px] font-semibold uppercase tracking-wide text-[#7F8CFF] bg-[#5B6CFF]/10 px-2 py-0.5 rounded-full border border-[#5B6CFF]/30">
                {safeString(source, 'Unknown source')}
              </span>
            )}
          </div>
          {fix && <p className="text-white/55 text-sm leading-relaxed">{safeString(fix, '')}</p>}
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
    <div className={cardBase}>
      <div className="flex items-start gap-3">
        <StatusIcon className={`h-5 w-5 mt-0.5 ${colors.text} flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-2">
            <span className="text-white/90 text-base font-semibold">{safeString(check.title, 'Untitled check')}</span>
            <SeverityBadge level={check.severity || check.status} />
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[#7F8CFF] bg-[#5B6CFF]/10 px-2 py-0.5 rounded-full border border-[#5B6CFF]/30">
              {safeString(check.source, 'N/A')}
            </span>
          </div>
          <p className="text-white/55 text-sm mb-1 leading-relaxed">{safeString(check.detail, '')}</p>
          <p className="text-white/40 text-xs">Fix: {safeString(check.fix, '')}</p>
        </div>
      </div>
    </div>
  );
};

// Category Chip
const CategoryChip = ({ icon: Icon, label, active }) => (
  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm ${active ? 'bg-[#5B6CFF]/15 border-[#5B6CFF]/40 text-[#5B6CFF]' : 'bg-white/[0.03] border-white/[0.08] text-white/60'}`}>
    <Icon className="h-3.5 w-3.5" />
    <span>{label}</span>
  </div>
);

// Verdict Badge
const VerdictBadge = ({ verdict }) => {
  const normalizedVerdict = normalizeVerdict(verdict);
  const label = formatVerdictLabel(normalizedVerdict);
  const styles = {
    PASS: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    NEEDS_REVIEW: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    FAIL: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  };
  return (
    <span className={`px-3 py-1 text-sm font-medium rounded-full border ${styles[normalizedVerdict] || styles.NEEDS_REVIEW}`}>
      {label}
    </span>
  );
};

export default function ReportView({ report, reportView, runIdFallback }) {
  if (!report && !reportView) return null;

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

  const view = reportView || normalizeReport(report);
  const sectionMap = Object.fromEntries((view.sections || []).map((section) => [section.id, section]));
  const kpiBlock = sectionMap.executive_summary?.blocks?.find((block) => block.type === 'kpi_cards') || {};
  const findingsBlock = sectionMap.findings_overview?.blocks?.find((block) => block.type === 'findings_list') || {};
  const evidenceBlock = sectionMap.evidence_details?.blocks?.find((block) => block.type === 'evidence_cards') || {};
  const crossBlock = sectionMap.cross_check?.blocks?.find((block) => block.type === 'crosscheck_table') || {};
  const printBlock = sectionMap.print_pack?.blocks?.find((block) => block.type === 'print_pack') || {};
  const halalBlock = sectionMap.halal?.blocks?.find((block) => block.type === 'halal_checks') || {};
  const nextStepsBlock = sectionMap.next_steps?.blocks?.find((block) => block.type === 'next_steps') || {};
  const auditBlock = sectionMap.next_steps?.blocks?.find((block) => block.type === 'audit_trail') || {};

  const complianceScore = safeNumber(kpiBlock.score ?? view.summary?.score, 0);
  const evidenceConfidence = safeNumber(kpiBlock.evidence_confidence ?? view.summary?.evidence_confidence, 0);
  const verdict = normalizeVerdict(safeString(view.summary?.verdict, 'NEEDS_REVIEW'));
  const runIdDisplay = safeString(view.meta?.run_id, runIdFallback || 'Unknown');
  const generatedAt = view.meta?.created_at ? new Date(view.meta.created_at) : null;
  const generatedAtLabel = generatedAt && !Number.isNaN(generatedAt.getTime())
    ? generatedAt.toLocaleString()
    : 'Unknown time';
  const scoreColor = complianceScore >= 85 ? 'text-emerald-400' : complianceScore >= 70 ? 'text-amber-400' : 'text-rose-400';
  const product = kpiBlock.product || {};
  const findings = Array.isArray(findingsBlock.items) ? findingsBlock.items : [];
  const crossCheck = { matched: crossBlock.matched || [], mismatched: crossBlock.mismatched || [] };
  const printPack = printBlock || {};
  const nextSteps = Array.isArray(nextStepsBlock.items) ? nextStepsBlock.items : [];
  const artifacts = auditBlock || { run_dir: '', files: [] };
  const halalChecks = Array.isArray(halalBlock.items) ? halalBlock.items : [];
  const halalEnabled = !!(view.meta?.halal_enabled ?? product?.halal_enabled);

  const counts = view.summary?.counts || kpiBlock.counts || {};
  const criticalCount = safeNumber(counts.critical, findings.filter((c) => c.status === 'critical').length);
  const warningCount = safeNumber(counts.warnings, findings.filter((c) => c.status === 'warning').length);
  const passCount = safeNumber(counts.passed, 0);
  const issuesTotal = safeNumber(counts.issuesTotal, findings.length);
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
        className="relative overflow-hidden rounded-[28px] border border-white/[0.06] bg-gradient-to-b from-[#111827]/80 via-[#0B1020]/90 to-[#05070f]/95 shadow-[0_32px_80px_rgba(0,0,0,0.55)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(91,108,255,0.16),_transparent_45%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.12),_transparent_50%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.12),_transparent_55%)] opacity-80"></div>
        <div className="relative">
          <div className="px-7 py-6 sm:px-8 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-[#5B6CFF]" />
              <div>
                <div className="text-xs text-white/40 uppercase tracking-[0.2em]">Nexodify AVA</div>
                <div className="text-white/90 font-semibold">EU Label Compliance Preflight Report</div>
              </div>
            </div>
            <div className="text-right text-sm">
              <div className="text-white/40">Run ID</div>
              <div className="text-white/70 font-mono">{runIdDisplay}</div>
            </div>
          </div>

          <div className="p-7 sm:p-8 border-b border-white/[0.06]">
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 bg-[#5B6CFF]/10 text-[#5B6CFF] text-[11px] font-semibold uppercase tracking-wide rounded-full border border-[#5B6CFF]/30">
                Section
              </span>
              <span className="text-white/50 text-sm">Executive Summary</span>
            </div>

            <h2 className="text-2xl sm:text-[28px] font-semibold text-white/95 mb-2">
              EU Label Compliance, <span className="text-[#5B6CFF]">Preflighted.</span>
            </h2>
            <p className="text-white/60 mb-8 text-sm sm:text-base">Automated verification against Regulation (EU) 1169/2011</p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className={cardBase}>
                <div className="text-xs text-white/40 uppercase tracking-[0.2em] mb-4">Product Information</div>
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

              <div className={`${cardBase} bg-[#0B1020]/85`}>
                <div>
                  <div className="text-xs text-white/40 uppercase tracking-[0.2em] mb-2">Compliance Score</div>
                  <div className={`text-5xl font-semibold ${scoreColor}`}>{complianceScore}%</div>
                  <div className="text-white/50 text-sm mt-1">
                    Evidence confidence: {evidenceConfidence}%
                  </div>
                </div>
                <div className="flex gap-3 mt-4 flex-wrap">
                  <span className="flex items-center gap-1.5 text-xs">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span className="text-rose-300">{criticalCount} Critical</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-xs">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span className="text-amber-300">{warningCount} Warnings</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-emerald-300">{passCount} Passed</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-7 sm:p-8 border-b border-white/[0.06]">
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 bg-[#5B6CFF]/10 text-[#5B6CFF] text-[11px] font-semibold uppercase tracking-wide rounded-full border border-[#5B6CFF]/30">
                Section
              </span>
              <span className="text-white/50 text-sm">Findings Overview</span>
            </div>

            <h3 className="text-lg sm:text-xl font-semibold text-white/90 mb-6">
              {issuesTotal} Issues Identified
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
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

          <div className="p-7 sm:p-8 border-b border-white/[0.06]">
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 bg-[#5B6CFF]/10 text-[#5B6CFF] text-[11px] font-semibold uppercase tracking-wide rounded-full border border-[#5B6CFF]/30">
                Section
              </span>
              <span className="text-white/50 text-sm">Evidence & Fix Details</span>
            </div>

            <div className="space-y-4">
              {evidenceFindings.length > 0 ? (
                evidenceFindings.map((finding, idx) => (
                  <div key={finding.id || idx} className={cardBase}>
                    <div className="flex items-center gap-2 mb-4">
                      <SeverityBadge level={finding.status} />
                      <span className="text-white/90 text-base font-semibold">{safeString(finding.title, '')}</span>
                    </div>

                    <div className={`${cardInset} mb-4`}>
                      <div className="text-xs text-white/40 uppercase tracking-[0.2em] mb-2">Evidence (excerpt)</div>
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

                    <div className={cardInset}>
                      <div className="text-xs text-white/40 uppercase tracking-[0.2em] mb-2">Recommended Fix</div>
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

          <div className="p-7 sm:p-8 border-b border-white/[0.06]">
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 bg-[#5B6CFF]/10 text-[#5B6CFF] text-[11px] font-semibold uppercase tracking-wide rounded-full border border-[#5B6CFF]/30">
                Section
              </span>
              <span className="text-white/50 text-sm">Label ↔ TDS Cross-Check</span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className={cardBase}>
                <h4 className="text-white/90 text-base font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  Matched ({Array.isArray(crossCheck.matched) ? crossCheck.matched.length : 0})
                </h4>
                {Array.isArray(crossCheck.matched) && crossCheck.matched.length > 0 ? (
                  crossCheck.matched.map((item) => (
                    <div key={item.field} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                      <span className="text-white/60 text-sm">{safeString(item.field, '')}</span>
                      <span className="text-emerald-300 text-xs">✓ Match</span>
                    </div>
                  ))
                ) : (
                  <p className="text-white/50 text-sm">No matched fields detected.</p>
                )}
              </div>

              <div className={cardBase}>
                <h4 className="text-white/90 text-base font-semibold mb-4 flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-rose-400" />
                  Mismatched ({Array.isArray(crossCheck.mismatched) ? crossCheck.mismatched.length : 0})
                </h4>
                {Array.isArray(crossCheck.mismatched) && crossCheck.mismatched.length > 0 ? (
                  crossCheck.mismatched.map((item) => (
                    <div key={item.field} className="py-2 border-b border-white/[0.04] last:border-0">
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">{safeString(item.field, '')}</span>
                        <span className="text-rose-300 text-xs">Mismatch</span>
                      </div>
                      <span className="text-amber-300/80 text-xs">⚠ {safeString(item.note, '')}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-white/50 text-sm">No mismatches detected.</p>
                )}
              </div>
            </div>
          </div>

          <div className="p-7 sm:p-8 border-b border-white/[0.06]">
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 bg-[#5B6CFF]/10 text-[#5B6CFF] text-[11px] font-semibold uppercase tracking-wide rounded-full border border-[#5B6CFF]/30">
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

          <div className="p-7 sm:p-8 border-b border-white/[0.06]" id="print-verification">
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold uppercase tracking-wide rounded-full border border-emerald-500/30">
                <Printer className="inline h-3 w-3 mr-1" />
                Print Pack
              </span>
              <span className="text-white/50 text-sm">Print Verification Pack (Pre-Press Checklist)</span>
            </div>

            <div className={`${cardBase} mb-6`}>
              <h4 className="text-white/90 text-base font-semibold mb-4 flex items-center gap-2">
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

            <div className={`${cardBase} mb-6`}>
              <h4 className="text-white/90 text-base font-semibold mb-4">Pre-Press Checklist</h4>
              <div className="space-y-3">
                {(printPack.prepress_checklist || []).map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 border border-white/20 rounded flex-shrink-0 mt-0.5"></div>
                    <span className="text-white/70 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${cardBase} mb-6`}>
              <h4 className="text-white/90 text-base font-semibold mb-4">What to Send to Printer</h4>
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
            <div className="p-7 sm:p-8 border-b border-white/[0.06]" id="halal-preflight">
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold uppercase tracking-wide rounded-full border border-emerald-500/30">
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

              <div className={`${cardBase} mb-6`}>
                <h4 className="text-white/90 text-base font-semibold mb-4">Inputs Provided</h4>
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
                <h4 className="text-white/90 text-base font-semibold">
                  Halal Preflight Checks ({halalChecks.length || HALAL_CHECK_DEFINITIONS.length})
                </h4>
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

          <div className="p-7 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 bg-[#5B6CFF]/10 text-[#5B6CFF] text-[11px] font-semibold uppercase tracking-wide rounded-full border border-[#5B6CFF]/30">
                Section
              </span>
              <span className="text-white/50 text-sm">Next Steps & Audit Trail</span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className={cardBase}>
                <h4 className="text-white/90 text-base font-semibold mb-4">Next Steps Checklist</h4>
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

              <div className={cardBase}>
                <h4 className="text-white/90 text-base font-semibold mb-4">Audit Trail Artifacts</h4>
                <div className={`${cardInset} font-mono text-xs`}>
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

          <div className="px-7 py-4 sm:px-8 bg-white/[0.02] border-t border-white/[0.06] flex items-center justify-between text-xs text-white/40">
            <span>Run ID: {runIdDisplay}</span>
            <span>Generated: {generatedAtLabel}</span>
            <span>{halalEnabled ? 'EU + Halal' : 'EU Only'}</span>
          </div>
        </div>
      </motion.div>
    </>
  );
}
