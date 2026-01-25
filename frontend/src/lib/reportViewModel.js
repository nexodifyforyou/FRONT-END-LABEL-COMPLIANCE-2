import { normalizeVerdict } from '../utils/verdict';

const safeText = (value, fallback = 'Not provided') => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') {
    return value.trim() ? value : fallback;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return fallback;
};

const safeArray = (value) => (Array.isArray(value) ? value : []);

const normalizeStatus = (value) => {
  if (!value) return 'unknown';
  const status = String(value).toLowerCase();
  if (status === 'high') return 'critical';
  if (status === 'medium') return 'warning';
  if (status === 'low') return 'pass';
  return status;
};

const getHalalEnabled = (report) => Boolean(report?.product?.halal_enabled || report?.halal);

const formatLanguages = (report) => {
  const value = report?.product?.languages_provided ?? report?.languages_provided;
  if (Array.isArray(value)) {
    return value.length ? value.join(', ') : 'Not provided';
  }
  return safeText(value);
};

const getCategoryLabel = (report) => {
  const product = report?.product || {};
  const category = product.category ?? product.categories;
  if (Array.isArray(category)) {
    return category.length ? category.join(', ') : 'Not provided';
  }
  return safeText(category);
};

const getCounts = (report) => {
  const findings = safeArray(report?.findings);
  const summary = report?.summary || {};
  const critical = summary.critical ?? findings.filter((f) => normalizeStatus(f.status) === 'critical').length;
  const warnings = summary.warnings ?? findings.filter((f) => normalizeStatus(f.status) === 'warning').length;
  const passed = summary.passed ?? findings.filter((f) => normalizeStatus(f.status) === 'pass').length;
  const issuesTotal = summary.issues_total ?? findings.length;
  return { critical, warnings, passed, issuesTotal };
};

const getEvidenceConfidence = (report) => {
  if (typeof report?.evidence_confidence === 'number') return report.evidence_confidence;
  if (typeof report?.evidence_confidence_percent === 'number') return report.evidence_confidence_percent;
  if (typeof report?.evidence_confidence_detail?.overall === 'number') {
    return Math.round(report.evidence_confidence_detail.overall * 100);
  }
  return 0;
};

export const normalizeReport = (report) => {
  const halalEnabled = getHalalEnabled(report);
  const counts = getCounts(report);
  const product = report?.product || {};
  const findings = safeArray(report?.findings).map((finding) => ({
    id: safeText(finding?.id, ''),
    title: safeText(finding?.title),
    status: normalizeStatus(finding?.status),
    source: safeText(finding?.source),
    fix: safeText(finding?.fix),
    reference: safeText(finding?.reference ?? finding?.id),
    evidence: safeArray(finding?.evidence).map((entry) => ({
      source: safeText(entry?.source, 'Source'),
      page: entry?.page ?? null,
      excerpt: safeText(entry?.excerpt),
    })),
  }));

  const crossCheck = report?.cross_check || { matched: [], mismatched: [] };
  const printPack = report?.print_pack || {};
  const halalChecks = safeArray(report?.halalChecks).map((check) => ({
    id: safeText(check?.id, ''),
    title: safeText(check?.title),
    status: normalizeStatus(check?.status || check?.severity),
    severity: normalizeStatus(check?.severity || check?.status),
    detail: safeText(check?.detail),
    fix: safeText(check?.fix),
    source: safeText(check?.source, 'N/A'),
  }));
  const nextSteps = safeArray(report?.next_steps).map((step) => ({
    priority: safeText(step?.priority, 'P2'),
    task: safeText(step?.task),
  }));
  const artifacts = report?.artifacts || { run_dir: '', files: [] };

  const includedItems = [
    'Executive summary + compliance score',
    findings.length ? 'Findings with severity + fixes' : 'Not provided',
    findings.some((finding) => finding.evidence.length) ? 'Evidence excerpts' : 'Not provided',
    report?.cross_check ? 'Label ↔ TDS cross-check' : 'Not provided',
    report?.print_pack ? 'Print Verification Pack' : 'Not provided',
    halalEnabled ? 'Halal export-readiness preflight' : 'Not provided',
  ];

  const summary = {
    verdict: normalizeVerdict(safeText(report?.verdict, 'NEEDS_REVIEW')),
    counts,
    score: report?.compliance_score ?? report?.score ?? 0,
    evidence_confidence: getEvidenceConfidence(report),
    disclaimers: report?.halal_disclaimer ? [safeText(report?.halal_disclaimer)] : [],
  };

  const sections = [
    {
      id: 'executive_summary',
      title: 'Executive Summary',
      blocks: [
        {
          type: 'kpi_cards',
          product: {
            product_name: safeText(product.product_name ?? report?.product_name),
            company_name: safeText(product.company_name ?? report?.company_name),
            country_of_sale: safeText(product.country_of_sale ?? report?.country_of_sale),
            languages_provided: formatLanguages(report),
            category: getCategoryLabel(report),
            halal_enabled: halalEnabled,
          },
          score: summary.score,
          evidence_confidence: summary.evidence_confidence,
          counts,
          included: includedItems,
        },
      ],
    },
    {
      id: 'findings_overview',
      title: 'Findings Overview',
      blocks: [
        {
          type: 'findings_list',
          items: findings,
        },
      ],
    },
    {
      id: 'evidence_details',
      title: 'Evidence & Fix Details',
      blocks: [
        {
          type: 'evidence_cards',
          items: findings,
        },
      ],
    },
    {
      id: 'cross_check',
      title: 'Label ↔ TDS Cross-Check',
      blocks: [
        {
          type: 'crosscheck_table',
          matched: safeArray(crossCheck?.matched).map((item) => ({
            field: safeText(item?.field),
          })),
          mismatched: safeArray(crossCheck?.mismatched).map((item) => ({
            field: safeText(item?.field),
            note: safeText(item?.note),
          })),
          category_label: getCategoryLabel(report),
          category_text: `This report applies EU 1169/2011 checks for ${getCategoryLabel(report)}.`,
        },
      ],
    },
    {
      id: 'print_pack',
      title: 'Print Verification Pack',
      blocks: [
        {
          type: 'print_pack',
          signoff_fields: safeArray(printPack?.signoff_fields).map((field) => safeText(field)),
          prepress_checklist: safeArray(printPack?.prepress_checklist).map((item) => safeText(item)),
          attachments_checklist: safeArray(printPack?.attachments_checklist).map((item) => safeText(item)),
          printer_notes: safeText(printPack?.printer_notes, ''),
        },
      ],
    },
  ];

  if (halalEnabled) {
    sections.push({
      id: 'halal',
      title: 'Optional Halal Export-Readiness Preflight',
      blocks: [
        {
          type: 'halal_checks',
          items: halalChecks,
          disclaimer: safeText(report?.halal_disclaimer, ''),
          certificate: safeText(report?.halal_certificate ?? report?.halal?.certificate ?? 'Not provided'),
          target_market: safeText(report?.product?.country_of_sale ?? report?.country_of_sale),
        },
      ],
    });
  }

  sections.push({
    id: 'next_steps',
    title: 'Next Steps & Audit Trail',
    blocks: [
      {
        type: 'next_steps',
        items: nextSteps,
        cta: report?.cta ?? null,
      },
      {
        type: 'audit_trail',
        run_dir: safeText(artifacts?.run_dir, ''),
        files: safeArray(artifacts?.files).map((file) => safeText(file)),
      },
    ],
  });

  return {
    meta: {
      run_id: safeText(report?.run_id, 'Unknown'),
      created_at: report?.ts || report?.created_at || report?.createdAt || null,
      halal_enabled: halalEnabled,
      locale: safeText(report?.locale, 'en-US'),
    },
    summary,
    sections,
  };
};
