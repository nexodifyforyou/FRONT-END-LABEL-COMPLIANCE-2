#!/usr/bin/env python3
"""
Generate a premium, multi-page sample PDF report for Nexodify AVA
Milk Chocolate Bar EU 1169/2011 Compliance Preflight Report
"""

from weasyprint import HTML, CSS
import os

HTML_CONTENT = """
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
@page {
  size: A4;
  margin: 20mm 15mm 25mm 15mm;
  @bottom-center {
    content: "Page " counter(page) " of " counter(pages);
    font-size: 9px;
    color: #666;
  }
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  font-size: 10pt;
  line-height: 1.5;
  color: #1a1a2e;
  background: #fff;
}

.page {
  page-break-after: always;
  padding: 0;
}

.page:last-child {
  page-break-after: auto;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #5B6CFF;
  padding-bottom: 12px;
  margin-bottom: 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  width: 28px;
  height: 28px;
  background: #5B6CFF;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
}

.brand {
  font-size: 14pt;
  font-weight: 600;
  color: #1a1a2e;
}

.brand-sub {
  font-size: 9pt;
  color: #666;
}

.run-info {
  text-align: right;
  font-size: 9pt;
  color: #666;
}

/* Title Section */
.title-section {
  text-align: center;
  margin: 30px 0;
}

.title {
  font-size: 22pt;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 8px;
}

.title span {
  color: #5B6CFF;
}

.subtitle {
  font-size: 11pt;
  color: #666;
}

/* Cards */
.card {
  background: #f8f9fc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.card-title {
  font-size: 8pt;
  font-weight: 600;
  color: #5B6CFF;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

/* Info Table */
.info-table {
  width: 100%;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid #e2e8f0;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  color: #666;
  font-size: 9pt;
}

.info-value {
  font-weight: 500;
  color: #1a1a2e;
  font-size: 9pt;
}

/* Score Card */
.score-card {
  background: linear-gradient(135deg, #1a1a2e 0%, #2d2d4a 100%);
  color: white;
  text-align: center;
  padding: 24px;
  border-radius: 8px;
}

.score-value {
  font-size: 48pt;
  font-weight: 700;
  color: #f59e0b;
}

.score-label {
  font-size: 10pt;
  color: rgba(255,255,255,0.7);
  margin-top: 4px;
}

.score-pills {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.pill {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 8pt;
  font-weight: 500;
}

.pill-critical { background: rgba(239,68,68,0.2); color: #ef4444; }
.pill-warning { background: rgba(245,158,11,0.2); color: #f59e0b; }
.pill-pass { background: rgba(34,197,94,0.2); color: #22c55e; }

/* Grid */
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* Findings */
.finding {
  background: #f8f9fc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.finding-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  flex-shrink: 0;
}

.finding-icon.critical { background: #fef2f2; color: #ef4444; }
.finding-icon.warning { background: #fffbeb; color: #f59e0b; }
.finding-icon.pass { background: #f0fdf4; color: #22c55e; }

.finding-content { flex: 1; }

.finding-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  flex-wrap: wrap;
}

.finding-title {
  font-weight: 600;
  font-size: 10pt;
  color: #1a1a2e;
}

.badge {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 7pt;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-critical { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
.badge-warning { background: #fffbeb; color: #d97706; border: 1px solid #fde68a; }
.badge-pass { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.badge-source { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }

.finding-fix {
  font-size: 9pt;
  color: #666;
}

/* Section titles */
.section-title {
  font-size: 14pt;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-badge {
  padding: 4px 10px;
  background: #eff6ff;
  color: #5B6CFF;
  border-radius: 12px;
  font-size: 8pt;
  font-weight: 500;
}

/* Evidence Box */
.evidence-box {
  background: #f1f5f9;
  border-left: 3px solid #5B6CFF;
  padding: 12px;
  margin: 12px 0;
  font-size: 9pt;
}

.evidence-label {
  font-size: 7pt;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.evidence-text {
  font-style: italic;
  color: #475569;
}

.highlight {
  color: #5B6CFF;
  font-weight: 600;
}

/* Fix steps */
.fix-steps {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 12px;
  margin-top: 12px;
}

.fix-step {
  display: flex;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 9pt;
}

.step-num {
  color: #5B6CFF;
  font-weight: 600;
}

.reference {
  font-size: 8pt;
  color: #94a3b8;
  margin-top: 10px;
}

/* Cross-check */
.crosscheck-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.match-item, .mismatch-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e2e8f0;
  font-size: 9pt;
}

.match-status { color: #22c55e; font-weight: 500; }
.mismatch-status { color: #ef4444; font-weight: 500; }
.mismatch-note { color: #f59e0b; font-size: 8pt; margin-top: 2px; }

/* Print Pack */
.print-section {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.print-title {
  color: #16a34a;
  font-weight: 600;
  font-size: 11pt;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.signoff-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

.signoff-field {
  border-bottom: 1px dashed #94a3b8;
  padding-bottom: 4px;
}

.signoff-label {
  font-size: 8pt;
  color: #64748b;
  margin-bottom: 20px;
}

.checklist-item {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 9pt;
}

.checkbox {
  width: 14px;
  height: 14px;
  border: 1.5px solid #94a3b8;
  border-radius: 3px;
  flex-shrink: 0;
  margin-top: 2px;
}

/* Halal Section */
.halal-section {
  background: #fefce8;
  border: 1px solid #fef08a;
  border-radius: 8px;
  padding: 16px;
}

.halal-title {
  color: #a16207;
  font-weight: 600;
  font-size: 11pt;
  margin-bottom: 4px;
}

.halal-subtitle {
  color: #ca8a04;
  font-size: 9pt;
  margin-bottom: 16px;
}

.halal-check {
  background: white;
  border: 1px solid #fde68a;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 8px;
}

.halal-check-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.halal-detail {
  font-size: 8pt;
  color: #78716c;
}

.halal-fix {
  font-size: 8pt;
  color: #92400e;
  margin-top: 4px;
}

.halal-disclaimer {
  background: #fef3c7;
  border-radius: 6px;
  padding: 10px;
  margin-top: 16px;
  font-size: 8pt;
  color: #92400e;
}

/* Next Steps */
.next-step {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #e2e8f0;
}

.priority-badge {
  padding: 2px 6px;
  background: #eff6ff;
  color: #3b82f6;
  font-size: 7pt;
  font-weight: 600;
  border-radius: 4px;
}

/* Footer */
.footer {
  margin-top: 30px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  font-size: 8pt;
  color: #94a3b8;
}

/* Utilities */
.mb-4 { margin-bottom: 16px; }
.mb-6 { margin-bottom: 24px; }
.text-center { text-align: center; }
.text-sm { font-size: 9pt; }
.text-xs { font-size: 8pt; }
.text-muted { color: #666; }
</style>
</head>
<body>

<!-- PAGE 1: Executive Summary -->
<div class="page">
  <div class="header">
    <div class="logo">
      <div class="logo-icon">N</div>
      <div>
        <div class="brand">Nexodify AVA</div>
        <div class="brand-sub">EU Label Compliance Preflight</div>
      </div>
    </div>
    <div class="run-info">
      Run ID: SAMPLE-AVA-0001<br>
      Generated: January 5, 2025
    </div>
  </div>

  <div class="title-section">
    <div class="title">EU Label Compliance, <span>Preflighted.</span></div>
    <div class="subtitle">Automated verification against Regulation (EU) 1169/2011</div>
  </div>

  <div class="grid-2">
    <div class="card">
      <div class="card-title">Product Information</div>
      <div class="info-table">
        <div class="info-row">
          <span class="info-label">Product Name</span>
          <span class="info-value">Milk Chocolate Bar with Hazelnuts (100 g)</span>
        </div>
        <div class="info-row">
          <span class="info-label">Company</span>
          <span class="info-value">Example Foods S.r.l.</span>
        </div>
        <div class="info-row">
          <span class="info-label">Country of Sale</span>
          <span class="info-value">Italy</span>
        </div>
        <div class="info-row">
          <span class="info-label">Languages</span>
          <span class="info-value">Italian, English</span>
        </div>
        <div class="info-row">
          <span class="info-label">Category</span>
          <span class="info-value">Confectionery</span>
        </div>
      </div>
    </div>

    <div class="score-card">
      <div class="score-value">78%</div>
      <div class="score-label">Compliance Score</div>
      <div class="score-pills">
        <span class="pill pill-critical">2 Critical</span>
        <span class="pill pill-warning">4 Warnings</span>
        <span class="pill pill-pass">14 Passed</span>
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-title">What's Included in This Report</div>
    <div class="grid-2">
      <div>✓ Executive summary + compliance score</div>
      <div>✓ Label ↔ TDS cross-check summary</div>
      <div>✓ Findings (severity + recommended fixes)</div>
      <div>✓ Print Verification Pack (checklist + sign-off)</div>
      <div>✓ Evidence excerpts (Label/TDS)</div>
      <div>✓ Halal export-readiness preflight (optional)</div>
    </div>
  </div>

  <div class="footer">
    <span>Nexodify AVA · EU Label Compliance Preflight</span>
    <span>Confidential · Sample Report</span>
  </div>
</div>

<!-- PAGE 2: Findings Overview -->
<div class="page">
  <div class="header">
    <div class="logo">
      <div class="logo-icon">N</div>
      <div>
        <div class="brand">Nexodify AVA</div>
        <div class="brand-sub">Findings Overview</div>
      </div>
    </div>
    <div class="run-info">Run ID: SAMPLE-AVA-0001</div>
  </div>

  <div class="section-title">
    <span class="section-badge">Page 2</span>
    6 Issues Identified
  </div>

  <div class="finding">
    <div class="finding-icon critical">✕</div>
    <div class="finding-content">
      <div class="finding-header">
        <span class="finding-title">Allergen emphasis missing</span>
        <span class="badge badge-critical">Critical</span>
        <span class="badge badge-source">Label</span>
      </div>
      <div class="finding-fix">Apply bold to 'milk, hazelnuts, soy lecithin' in ingredients list</div>
    </div>
  </div>

  <div class="finding">
    <div class="finding-icon critical">✕</div>
    <div class="finding-content">
      <div class="finding-header">
        <span class="finding-title">Cocoa QUID percentage absent</span>
        <span class="badge badge-critical">Critical</span>
        <span class="badge badge-source">Label</span>
      </div>
      <div class="finding-fix">Declare cocoa solids % per Article 22</div>
    </div>
  </div>

  <div class="finding">
    <div class="finding-icon warning">!</div>
    <div class="finding-content">
      <div class="finding-header">
        <span class="finding-title">Net quantity format</span>
        <span class="badge badge-warning">Warning</span>
        <span class="badge badge-source">Label</span>
      </div>
      <div class="finding-fix">Use 'e' symbol with 100 g declaration</div>
    </div>
  </div>

  <div class="finding">
    <div class="finding-icon warning">!</div>
    <div class="finding-content">
      <div class="finding-header">
        <span class="finding-title">Nutrition %RI missing</span>
        <span class="badge badge-warning">Warning</span>
        <span class="badge badge-source">Label</span>
      </div>
      <div class="finding-fix">Add Reference Intake percentages per Article 32</div>
    </div>
  </div>

  <div class="finding">
    <div class="finding-icon warning">!</div>
    <div class="finding-content">
      <div class="finding-header">
        <span class="finding-title">Storage conditions absent</span>
        <span class="badge badge-warning">Warning</span>
        <span class="badge badge-source">TDS</span>
      </div>
      <div class="finding-fix">Add 'Store in a cool, dry place' to label</div>
    </div>
  </div>

  <div class="finding">
    <div class="finding-icon warning">!</div>
    <div class="finding-content">
      <div class="finding-header">
        <span class="finding-title">Operator address incomplete</span>
        <span class="badge badge-warning">Warning</span>
        <span class="badge badge-source">Label</span>
      </div>
      <div class="finding-fix">Include full postal address with postal code</div>
    </div>
  </div>

  <div class="footer">
    <span>Nexodify AVA · EU Label Compliance Preflight</span>
    <span>Confidential · Sample Report</span>
  </div>
</div>

<!-- PAGE 3: Evidence & Fix Details -->
<div class="page">
  <div class="header">
    <div class="logo">
      <div class="logo-icon">N</div>
      <div>
        <div class="brand">Nexodify AVA</div>
        <div class="brand-sub">Evidence & Fix Details</div>
      </div>
    </div>
    <div class="run-info">Run ID: SAMPLE-AVA-0001</div>
  </div>

  <div class="section-title">
    <span class="section-badge">Page 3</span>
    Evidence & Recommended Fixes
  </div>

  <div class="card">
    <div class="finding-header mb-4">
      <span class="badge badge-critical">Critical</span>
      <span class="finding-title">Allergen Emphasis Missing</span>
    </div>

    <div class="evidence-box">
      <div class="evidence-label">Evidence (Label Excerpt)</div>
      <div class="evidence-text">
        "Ingredients: Sugar, cocoa butter, whole <span class="highlight">milk</span> powder, <span class="highlight">hazelnuts</span> (15%), cocoa mass, <span class="highlight">soy</span> lecithin (emulsifier), natural vanilla flavouring."
      </div>
      <div class="text-xs text-muted" style="margin-top: 6px;">↳ Allergens appear in regular typeface, not distinguished</div>
    </div>

    <div class="fix-steps">
      <div class="evidence-label">Recommended Fix</div>
      <div class="fix-step"><span class="step-num">1.</span> Update ingredients: "...whole <b>MILK</b> powder, <b>HAZELNUTS</b> (15%), cocoa mass, <b>SOY</b> lecithin..."</div>
      <div class="fix-step"><span class="step-num">2.</span> Add "Contains: Milk, Hazelnuts (tree nuts), Soy" statement</div>
      <div class="fix-step"><span class="step-num">3.</span> Apply consistently in Italian translation</div>
    </div>

    <div class="reference">Reference: Regulation (EU) 1169/2011, Article 21(1)(b), Annex II</div>
  </div>

  <div class="card">
    <div class="finding-header mb-4">
      <span class="badge badge-critical">Critical</span>
      <span class="finding-title">Cocoa QUID Percentage Absent</span>
    </div>

    <div class="evidence-box">
      <div class="evidence-label">Evidence (Label Excerpt)</div>
      <div class="evidence-text">
        Product name: "<span class="highlight">Milk Chocolate</span> Bar with Hazelnuts"<br>
        Ingredients list shows "cocoa mass" without percentage
      </div>
      <div class="text-xs text-muted" style="margin-top: 6px;">↳ "Chocolate" in name triggers QUID requirement for cocoa</div>
    </div>

    <div class="fix-steps">
      <div class="evidence-label">Recommended Fix</div>
      <div class="fix-step"><span class="step-num">1.</span> Add "Cocoa solids: 30% minimum" declaration</div>
      <div class="fix-step"><span class="step-num">2.</span> Verify percentage against TDS specification</div>
    </div>

    <div class="reference">Reference: Regulation (EU) 1169/2011, Article 22; Directive 2000/36/EC</div>
  </div>

  <div class="footer">
    <span>Nexodify AVA · EU Label Compliance Preflight</span>
    <span>Confidential · Sample Report</span>
  </div>
</div>

<!-- PAGE 4: Cross-Check Summary -->
<div class="page">
  <div class="header">
    <div class="logo">
      <div class="logo-icon">N</div>
      <div>
        <div class="brand">Nexodify AVA</div>
        <div class="brand-sub">Label ↔ TDS Cross-Check</div>
      </div>
    </div>
    <div class="run-info">Run ID: SAMPLE-AVA-0001</div>
  </div>

  <div class="section-title">
    <span class="section-badge">Page 4</span>
    Label ↔ TDS Cross-Check Summary
  </div>

  <div class="crosscheck-grid">
    <div class="card">
      <div class="card-title" style="color: #22c55e;">✓ Matched (5)</div>
      <div class="match-item">
        <span>Product Name</span>
        <span class="match-status">✓ Match</span>
      </div>
      <div class="match-item">
        <span>Net Quantity</span>
        <span class="match-status">✓ Match</span>
      </div>
      <div class="match-item">
        <span>Ingredients Order</span>
        <span class="match-status">✓ Match</span>
      </div>
      <div class="match-item">
        <span>Hazelnut %</span>
        <span class="match-status">✓ Match</span>
      </div>
      <div class="match-item">
        <span>Allergen List</span>
        <span class="match-status">✓ Match</span>
      </div>
    </div>

    <div class="card">
      <div class="card-title" style="color: #ef4444;">✕ Mismatched (3)</div>
      <div class="mismatch-item">
        <div>
          <span>Cocoa Solids %</span>
          <div class="mismatch-note">⚠ TDS: 32%, Label: not declared</div>
        </div>
        <span class="mismatch-status">Mismatch</span>
      </div>
      <div class="mismatch-item">
        <div>
          <span>Storage Temp</span>
          <div class="mismatch-note">⚠ TDS: < 25°C, Label: missing</div>
        </div>
        <span class="mismatch-status">Mismatch</span>
      </div>
      <div class="mismatch-item">
        <div>
          <span>Sugar Content</span>
          <div class="mismatch-note">⚠ TDS: 48g, Label: 45g per 100g</div>
        </div>
        <span class="mismatch-status">Mismatch</span>
      </div>
    </div>
  </div>

  <div class="card" style="margin-top: 20px;">
    <div class="card-title">Category-Aware Checks</div>
    <p class="text-sm text-muted mb-4">This report applies EU 1169/2011 checks tailored for the Confectionery category.</p>
    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
      <span class="badge badge-source">Dairy</span>
      <span class="badge badge-source">Meat & Fish</span>
      <span class="badge" style="background: #dbeafe; color: #1d4ed8; border: 1px solid #93c5fd;">Confectionery ✓</span>
      <span class="badge badge-source">Bakery</span>
      <span class="badge badge-source">Beverages</span>
      <span class="badge badge-source">Ready Meals</span>
      <span class="badge badge-source">Oils & Fats</span>
      <span class="badge badge-source">Frozen</span>
      <span class="badge badge-source">Baby Food</span>
      <span class="badge badge-source">Supplements</span>
    </div>
  </div>

  <div class="footer">
    <span>Nexodify AVA · EU Label Compliance Preflight</span>
    <span>Confidential · Sample Report</span>
  </div>
</div>

<!-- PAGE 5: Print Verification Pack -->
<div class="page">
  <div class="header">
    <div class="logo">
      <div class="logo-icon">N</div>
      <div>
        <div class="brand">Nexodify AVA</div>
        <div class="brand-sub">Print Verification Pack</div>
      </div>
    </div>
    <div class="run-info">Run ID: SAMPLE-AVA-0001</div>
  </div>

  <div class="section-title">
    <span class="section-badge" style="background: #dcfce7; color: #16a34a;">Print Pack</span>
    Print Verification Pack (Pre-Press Checklist)
  </div>

  <div class="print-section">
    <div class="print-title">📋 Versioning & Sign-off</div>
    <div class="signoff-grid">
      <div class="signoff-field"><div class="signoff-label">Label Version ID</div></div>
      <div class="signoff-field"><div class="signoff-label">Artwork File Name</div></div>
      <div class="signoff-field"><div class="signoff-label">Print Vendor</div></div>
      <div class="signoff-field"><div class="signoff-label">Approval Owner (QA)</div></div>
      <div class="signoff-field"><div class="signoff-label">Date</div></div>
      <div class="signoff-field"><div class="signoff-label">Signature</div></div>
    </div>
    <div class="signoff-field" style="height: 40px;"><div class="signoff-label">Final Print Run Notes</div></div>
  </div>

  <div class="card">
    <div class="card-title">Pre-Press Checklist</div>
    <div class="checklist-item"><div class="checkbox"></div> Mandatory particulars fully in Italian for Italy sale</div>
    <div class="checklist-item"><div class="checkbox"></div> Allergen emphasis applied consistently (ingredients + contains statements)</div>
    <div class="checklist-item"><div class="checkbox"></div> QUID declared where ingredients are emphasized (text/imagery)</div>
    <div class="checklist-item"><div class="checkbox"></div> Net quantity format correct (units/placement/legibility check)</div>
    <div class="checklist-item"><div class="checkbox"></div> Nutrition declaration complete and formatted correctly (per 100 g)</div>
    <div class="checklist-item"><div class="checkbox"></div> Operator name + full address present</div>
    <div class="checklist-item"><div class="checkbox"></div> Lot/expiry placeholders present (if applicable) and legible</div>
    <div class="checklist-item"><div class="checkbox"></div> Font size/contrast acceptable for print readability</div>
    <div class="checklist-item"><div class="checkbox"></div> Barcode area clear + quiet zone respected</div>
    <div class="checklist-item"><div class="checkbox"></div> Language consistency across panels</div>
    <div class="checklist-item"><div class="checkbox"></div> Claims reviewed (if present) — mark "requires separate verification"</div>
    <div class="checklist-item"><div class="checkbox"></div> Cross-check with TDS confirms formulation + allergens + nutrition values</div>
  </div>

  <div class="card">
    <div class="card-title">What to Send to Printer</div>
    <div class="checklist-item"><div class="checkbox"></div> PDF compliance report</div>
    <div class="checklist-item"><div class="checkbox"></div> Final artwork proof (PDF)</div>
    <div class="checklist-item"><div class="checkbox"></div> Supplier TDS version used</div>
    <div class="checklist-item"><div class="checkbox"></div> Approval email/thread reference</div>
  </div>

  <div class="footer">
    <span>Nexodify AVA · EU Label Compliance Preflight</span>
    <span>Confidential · Sample Report</span>
  </div>
</div>

<!-- PAGE 6: Halal Export-Readiness Preflight -->
<div class="page">
  <div class="header">
    <div class="logo">
      <div class="logo-icon">N</div>
      <div>
        <div class="brand">Nexodify AVA</div>
        <div class="brand-sub">Halal Export-Readiness Preflight</div>
      </div>
    </div>
    <div class="run-info">Run ID: SAMPLE-AVA-0001</div>
  </div>

  <div class="section-title">
    <span class="section-badge" style="background: #fef3c7; color: #a16207;">Optional Module</span>
    Halal Export-Readiness Preflight
  </div>

  <div class="halal-section">
    <div class="halal-title">Halal Preflight Checks (10)</div>
    <div class="halal-subtitle">Target Market: Malaysia · Certificate: Not provided</div>

    <div class="halal-check">
      <div class="halal-check-header">
        <span style="color: #ef4444;">✕</span>
        <span class="finding-title">Halal Certificate Provided</span>
        <span class="badge badge-critical">Critical</span>
      </div>
      <div class="halal-detail">No Halal certificate uploaded for verification</div>
      <div class="halal-fix">Fix: Obtain valid Halal certificate from accredited body</div>
    </div>

    <div class="halal-check">
      <div class="halal-check-header">
        <span style="color: #f59e0b;">!</span>
        <span class="finding-title">Certificate Validity / Expiry</span>
        <span class="badge badge-warning">Warning</span>
      </div>
      <div class="halal-detail">Cannot verify — certificate not provided</div>
      <div class="halal-fix">Fix: Ensure certificate covers production dates</div>
    </div>

    <div class="halal-check">
      <div class="halal-check-header">
        <span style="color: #f59e0b;">!</span>
        <span class="finding-title">Animal-Derived Ingredient Risk</span>
        <span class="badge badge-warning">Warning</span>
      </div>
      <div class="halal-detail">Milk powder present — requires source verification</div>
      <div class="halal-fix">Fix: Confirm dairy source meets Halal requirements</div>
    </div>

    <div class="halal-check">
      <div class="halal-check-header">
        <span style="color: #22c55e;">✓</span>
        <span class="finding-title">Gelatin / Enzymes Check</span>
        <span class="badge badge-pass">Pass</span>
      </div>
      <div class="halal-detail">No gelatin or animal enzymes declared</div>
    </div>

    <div class="halal-check">
      <div class="halal-check-header">
        <span style="color: #f59e0b;">!</span>
        <span class="finding-title">Alcohol / Solvent Carrier Flags</span>
        <span class="badge badge-warning">Warning</span>
      </div>
      <div class="halal-detail">Vanilla flavouring — carrier not specified</div>
      <div class="halal-fix">Fix: Confirm non-alcohol carrier with supplier</div>
    </div>

    <div class="halal-check">
      <div class="halal-check-header">
        <span style="color: #ef4444;">✕</span>
        <span class="finding-title">Cross-Contamination Statement</span>
        <span class="badge badge-critical">Critical</span>
      </div>
      <div class="halal-detail">No dedicated line / cleaning protocol info</div>
      <div class="halal-fix">Fix: Obtain facility Halal compliance statement</div>
    </div>

    <div class="halal-disclaimer">
      <strong>Important:</strong> Halal determinations depend on the target market, accepted standard, and certification body. This module provides preflight risk flags, not certification.
    </div>
  </div>

  <div class="footer">
    <span>Nexodify AVA · EU Label Compliance Preflight</span>
    <span>Confidential · Sample Report</span>
  </div>
</div>

<!-- PAGE 7: Next Steps & Audit Trail -->
<div class="page">
  <div class="header">
    <div class="logo">
      <div class="logo-icon">N</div>
      <div>
        <div class="brand">Nexodify AVA</div>
        <div class="brand-sub">Next Steps & Audit Trail</div>
      </div>
    </div>
    <div class="run-info">Run ID: SAMPLE-AVA-0001</div>
  </div>

  <div class="section-title">
    <span class="section-badge">Page 7</span>
    Next Steps & Audit Trail
  </div>

  <div class="grid-2">
    <div class="card">
      <div class="card-title">Next Steps Checklist</div>
      <div class="next-step">
        <div class="checkbox"></div>
        <span class="priority-badge">P1</span>
        <span>Fix allergen emphasis + cocoa QUID</span>
      </div>
      <div class="next-step">
        <div class="checkbox"></div>
        <span class="priority-badge">P1</span>
        <span>Reconcile Label ↔ TDS sugar mismatch</span>
      </div>
      <div class="next-step">
        <div class="checkbox"></div>
        <span class="priority-badge">P2</span>
        <span>Add %RI to nutrition table</span>
      </div>
      <div class="next-step">
        <div class="checkbox"></div>
        <span class="priority-badge">P2</span>
        <span>Add storage conditions</span>
      </div>
      <div class="next-step">
        <div class="checkbox"></div>
        <span class="priority-badge">P3</span>
        <span>Complete print verification sign-off</span>
      </div>
      <div class="next-step">
        <div class="checkbox"></div>
        <span class="priority-badge">P3</span>
        <span>Resolve Halal certificate gaps (if exporting)</span>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Audit Trail Artifacts</div>
      <div style="background: #1a1a2e; border-radius: 6px; padding: 12px; font-family: monospace; font-size: 8pt; color: #94a3b8;">
        <div style="color: #64748b; margin-bottom: 8px;">/srv/ava/data/runs/SAMPLE-AVA-0001/</div>
        <div>├── label.pdf</div>
        <div>├── tds.pdf</div>
        <div>├── evidence_text.txt</div>
        <div>├── request.json</div>
        <div>├── report.json</div>
        <div>└── report.pdf</div>
      </div>
    </div>
  </div>

  <div class="card" style="margin-top: 20px; text-align: center;">
    <div class="card-title" style="justify-content: center;">Ready to Preflight Your Labels?</div>
    <p class="text-sm text-muted">This is a sample report. Run your own preflight at nexodify.com</p>
    <div style="margin-top: 16px; display: flex; justify-content: center; gap: 12px;">
      <span style="padding: 8px 16px; background: #5B6CFF; color: white; border-radius: 6px; font-size: 9pt; font-weight: 500;">Run a Preflight →</span>
      <span style="padding: 8px 16px; background: #f1f5f9; color: #475569; border-radius: 6px; font-size: 9pt; font-weight: 500;">Learn More</span>
    </div>
  </div>

  <div class="footer" style="margin-top: 60px;">
    <span>Nexodify AVA · EU Label Compliance Preflight</span>
    <span>© 2025 Nexodify. All rights reserved.</span>
    <span>Confidential · Sample Report</span>
  </div>
</div>

</body>
</html>
"""

def generate_pdf():
    # Output path
    output_dir = '/app/frontend/public'
    output_path = os.path.join(output_dir, 'sample-report.pdf')
    
    # Ensure output directory exists
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate PDF
    print("Generating PDF...")
    html = HTML(string=HTML_CONTENT)
    html.write_pdf(output_path)
    
    print(f"✅ PDF generated successfully: {output_path}")
    
    # Verify file
    file_size = os.path.getsize(output_path)
    print(f"   File size: {file_size / 1024:.1f} KB")

if __name__ == '__main__':
    generate_pdf()
