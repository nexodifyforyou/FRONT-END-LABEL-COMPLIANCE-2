#!/usr/bin/env python3
"""
Generate sample PDF with off-white background, proper spacing, white cards
"""

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
)
import os

# Colors
PRIMARY = colors.HexColor('#5B6CFF')
DARK = colors.HexColor('#1a1a2e')
MUTED = colors.HexColor('#64748b')
LIGHT_MUTED = colors.HexColor('#94a3b8')
CARD_BG = colors.HexColor('#FFFFFF')
PAGE_BG = colors.HexColor('#F4F6FB')
BORDER = colors.HexColor('#E2E8F0')
RED = colors.HexColor('#ef4444')
AMBER = colors.HexColor('#f59e0b')
GREEN = colors.HexColor('#22c55e')

PAGE_W, PAGE_H = A4

def create_styles():
    styles = getSampleStyleSheet()
    
    styles.add(ParagraphStyle('Title1', fontName='Helvetica-Bold', fontSize=18, textColor=DARK, spaceAfter=6))
    styles.add(ParagraphStyle('Title2', fontName='Helvetica-Bold', fontSize=14, textColor=DARK, spaceAfter=6))
    styles.add(ParagraphStyle('Body1', fontName='Helvetica', fontSize=11, textColor=DARK, leading=17))
    styles.add(ParagraphStyle('Small1', fontName='Helvetica', fontSize=9, textColor=MUTED, leading=14))
    styles.add(ParagraphStyle('Tiny1', fontName='Helvetica', fontSize=8, textColor=LIGHT_MUTED))
    styles.add(ParagraphStyle('CardHead', fontName='Helvetica-Bold', fontSize=8, textColor=PRIMARY, spaceAfter=6))
    
    return styles

def header_footer(canvas, doc):
    """Draw background, header, footer on each page"""
    canvas.saveState()
    
    # Page background
    canvas.setFillColor(PAGE_BG)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)
    
    # Header
    canvas.setFillColor(DARK)
    canvas.setFont('Helvetica-Bold', 10)
    canvas.drawString(36, PAGE_H - 28, "Nexodify AVA")
    
    canvas.setFillColor(MUTED)
    canvas.setFont('Helvetica', 9)
    canvas.drawCentredString(PAGE_W/2, PAGE_H - 28, "EU Label Compliance Preflight Report")
    canvas.drawRightString(PAGE_W - 36, PAGE_H - 28, "Run ID: SAMPLE-AVA-0001")
    
    # Header line
    canvas.setStrokeColor(PRIMARY)
    canvas.setLineWidth(2)
    canvas.line(36, PAGE_H - 36, PAGE_W - 36, PAGE_H - 36)
    
    # Footer
    canvas.setFillColor(MUTED)
    canvas.setFont('Helvetica', 8)
    footer = f"Nexodify AVA • EU Label Compliance Preflight • Confidential • Sample Report • Page {doc.page}"
    canvas.drawCentredString(PAGE_W/2, 20, footer)
    
    canvas.restoreState()

def card(content, width=500):
    """Wrap content in white card"""
    t = Table([[content]], colWidths=[width])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), CARD_BG),
        ('BOX', (0,0), (-1,-1), 1, BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 16),
        ('BOTTOMPADDING', (0,0), (-1,-1), 16),
        ('LEFTPADDING', (0,0), (-1,-1), 16),
        ('RIGHTPADDING', (0,0), (-1,-1), 16),
    ]))
    return t

def page1(s):
    """Executive Summary"""
    e = []
    e.append(Spacer(1, 24))
    e.append(Paragraph('<font color="#5B6CFF">Page 1</font> &nbsp; Executive Summary', s['Title1']))
    e.append(Paragraph('EU Label Compliance, <font color="#5B6CFF">Preflighted.</font>', s['Title2']))
    e.append(Paragraph('Automated verification against Regulation (EU) 1169/2011', s['Small1']))
    e.append(Spacer(1, 18))
    
    # Product info
    prod = """<font color="#5B6CFF"><b>PRODUCT INFORMATION</b></font><br/><br/>
<b>Product Name:</b> Milk Chocolate Bar with Hazelnuts (100 g)<br/>
<b>Company:</b> Example Foods S.r.l.<br/>
<b>Country:</b> Italy<br/>
<b>Languages:</b> Italian, English<br/>
<b>Category:</b> Confectionery"""
    
    score = """<font size="28" color="#f59e0b"><b>78%</b></font><br/>
<font color="#64748b">Compliance Score</font><br/><br/>
<font color="#ef4444">● 2 Critical</font> &nbsp; <font color="#f59e0b">● 4 Warnings</font> &nbsp; <font color="#22c55e">● 14 Passed</font>"""
    
    row = Table([
        [card(Paragraph(prod, s['Body1']), 260), Spacer(16,1), card(Paragraph(score, s['Body1']), 200)]
    ], colWidths=[284, 16, 224])
    row.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))
    e.append(row)
    e.append(Spacer(1, 18))
    
    # What's included
    inc = """<font color="#5B6CFF"><b>WHAT'S INCLUDED</b></font><br/><br/>
✓ Executive summary + compliance score &nbsp;&nbsp;&nbsp; ✓ Label ↔ TDS cross-check<br/>
✓ Findings with severity + fixes &nbsp;&nbsp;&nbsp; ✓ Print Verification Pack<br/>
✓ Evidence excerpts &nbsp;&nbsp;&nbsp; ✓ Halal export-readiness preflight"""
    e.append(card(Paragraph(inc, s['Body1'])))
    e.append(PageBreak())
    return e

def page2(s):
    """Findings"""
    e = []
    e.append(Spacer(1, 24))
    e.append(Paragraph('<font color="#5B6CFF">Page 2</font> &nbsp; Findings Overview', s['Title1']))
    e.append(Paragraph('6 Issues Identified', s['Title2']))
    e.append(Spacer(1, 12))
    
    findings = [
        ('✕', '#ef4444', 'CRITICAL', 'Allergen emphasis missing', 'Label', "Apply bold to 'milk, hazelnuts, soy lecithin'"),
        ('✕', '#ef4444', 'CRITICAL', 'Cocoa QUID percentage absent', 'Label', 'Declare cocoa solids % per Article 22'),
        ('!', '#f59e0b', 'WARNING', 'Net quantity format', 'Label', "Use 'e' symbol with 100 g declaration"),
        ('!', '#f59e0b', 'WARNING', 'Nutrition %RI missing', 'Label', 'Add Reference Intake percentages'),
        ('!', '#f59e0b', 'WARNING', 'Storage conditions absent', 'TDS', "Add 'Store in a cool, dry place'"),
        ('!', '#f59e0b', 'WARNING', 'Operator address incomplete', 'Label', 'Include full postal address'),
    ]
    
    for icon, color, sev, title, src, fix in findings:
        txt = f'<font size="14" color="{color}">{icon}</font> &nbsp; <b>{title}</b><br/><font size="8" color="{color}">{sev}</font> &nbsp; <font size="8" color="#2563eb">Source: {src}</font><br/><font color="#64748b">{fix}</font>'
        e.append(card(Paragraph(txt, s['Body1'])))
        e.append(Spacer(1, 8))
    
    e.append(PageBreak())
    return e

def page3(s):
    """Evidence"""
    e = []
    e.append(Spacer(1, 24))
    e.append(Paragraph('<font color="#5B6CFF">Page 3</font> &nbsp; Evidence &amp; Fix Details', s['Title1']))
    e.append(Spacer(1, 12))
    
    ev1 = """<font color="#ef4444"><b>CRITICAL</b></font> &nbsp; <b>Allergen Emphasis Missing</b><br/><br/>
<font size="8" color="#64748b">EVIDENCE (LABEL EXCERPT)</font><br/>
<i>"Ingredients: Sugar, cocoa butter, whole <font color="#5B6CFF">milk</font> powder, <font color="#5B6CFF">hazelnuts</font> (15%), cocoa mass, <font color="#5B6CFF">soy</font> lecithin..."</i><br/>
<font size="8" color="#94a3b8">↳ Allergens appear in regular typeface</font><br/><br/>
<font size="8" color="#64748b">RECOMMENDED FIX</font><br/>
1. Update: "...whole <b>MILK</b> powder, <b>HAZELNUTS</b> (15%), <b>SOY</b> lecithin..."<br/>
2. Add "Contains: Milk, Hazelnuts (tree nuts), Soy"<br/>
3. Apply consistently in Italian<br/><br/>
<font size="8" color="#94a3b8">Ref: Regulation (EU) 1169/2011, Article 21(1)(b), Annex II</font>"""
    e.append(card(Paragraph(ev1, s['Body1'])))
    e.append(Spacer(1, 16))
    
    ev2 = """<font color="#ef4444"><b>CRITICAL</b></font> &nbsp; <b>Cocoa QUID Percentage Absent</b><br/><br/>
<font size="8" color="#64748b">EVIDENCE (LABEL EXCERPT)</font><br/>
<i>Product name: "<font color="#5B6CFF">Milk Chocolate</font> Bar with Hazelnuts"</i><br/>
<i>Ingredients list shows "cocoa mass" without percentage</i><br/>
<font size="8" color="#94a3b8">↳ "Chocolate" in name triggers QUID requirement</font><br/><br/>
<font size="8" color="#64748b">RECOMMENDED FIX</font><br/>
1. Add "Cocoa solids: 30% minimum" declaration<br/>
2. Verify percentage against TDS specification<br/><br/>
<font size="8" color="#94a3b8">Ref: Regulation (EU) 1169/2011, Article 22; Directive 2000/36/EC</font>"""
    e.append(card(Paragraph(ev2, s['Body1'])))
    
    e.append(PageBreak())
    return e

def page4(s):
    """Cross-check"""
    e = []
    e.append(Spacer(1, 24))
    e.append(Paragraph('<font color="#5B6CFF">Page 4</font> &nbsp; Label ↔ TDS Cross-Check', s['Title1']))
    e.append(Spacer(1, 12))
    
    match = """<font color="#22c55e"><b>✓ MATCHED (5)</b></font><br/><br/>
Product Name <font color="#22c55e">✓</font><br/>
Net Quantity <font color="#22c55e">✓</font><br/>
Ingredients Order <font color="#22c55e">✓</font><br/>
Hazelnut % <font color="#22c55e">✓</font><br/>
Allergen List <font color="#22c55e">✓</font>"""
    
    mismatch = """<font color="#ef4444"><b>✕ MISMATCHED (3)</b></font><br/><br/>
<b>Cocoa Solids %</b> <font color="#ef4444">✕</font><br/>
<font size="8" color="#f59e0b">⚠ TDS: 32%, Label: not declared</font><br/><br/>
<b>Storage Temp</b> <font color="#ef4444">✕</font><br/>
<font size="8" color="#f59e0b">⚠ TDS: &lt; 25°C, Label: missing</font><br/><br/>
<b>Sugar Content</b> <font color="#ef4444">✕</font><br/>
<font size="8" color="#f59e0b">⚠ TDS: 48g, Label: 45g per 100g</font>"""
    
    row = Table([
        [card(Paragraph(match, s['Body1']), 230), Spacer(16,1), card(Paragraph(mismatch, s['Body1']), 246)]
    ], colWidths=[254, 16, 270])
    row.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))
    e.append(row)
    e.append(Spacer(1, 18))
    
    cat = """<font color="#5B6CFF"><b>CATEGORY-AWARE CHECKS</b></font><br/><br/>
This report applies EU 1169/2011 checks for <b>Confectionery</b>.<br/><br/>
Dairy • Meat &amp; Fish • <b><font color="#1d4ed8">Confectionery ✓</font></b> • Bakery • Beverages • Ready Meals • Oils &amp; Fats • Frozen • Baby Food • Supplements"""
    e.append(card(Paragraph(cat, s['Body1'])))
    
    e.append(PageBreak())
    return e

def page5(s):
    """Print Pack"""
    e = []
    e.append(Spacer(1, 24))
    e.append(Paragraph('<font color="#16a34a">Print Pack</font> &nbsp; Print Verification Pack', s['Title1']))
    e.append(Spacer(1, 12))
    
    signoff = """<font color="#16a34a"><b>📋 VERSIONING &amp; SIGN-OFF</b></font><br/><br/>
Label Version ID: ___________________ &nbsp;&nbsp; Artwork File Name: ___________________<br/><br/>
Print Vendor: ___________________ &nbsp;&nbsp; Approval Owner (QA): ___________________<br/><br/>
Date: ___________________ &nbsp;&nbsp; Signature: ___________________<br/><br/>
Final Print Run Notes: ________________________________________________________________"""
    
    signoff_card = card(Paragraph(signoff, s['Body1']))
    signoff_card.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f0fdf4')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#bbf7d0')),
        ('TOPPADDING', (0,0), (-1,-1), 16),
        ('BOTTOMPADDING', (0,0), (-1,-1), 16),
        ('LEFTPADDING', (0,0), (-1,-1), 16),
        ('RIGHTPADDING', (0,0), (-1,-1), 16),
    ]))
    e.append(signoff_card)
    e.append(Spacer(1, 16))
    
    checklist = """<font color="#5B6CFF"><b>PRE-PRESS CHECKLIST</b></font><br/><br/>
☐ Mandatory particulars fully in Italian for Italy sale<br/>
☐ Allergen emphasis applied consistently<br/>
☐ QUID declared where ingredients emphasized<br/>
☐ Net quantity format correct<br/>
☐ Nutrition declaration complete (per 100 g)<br/>
☐ Operator name + full address present<br/>
☐ Lot/expiry placeholders legible<br/>
☐ Font size/contrast acceptable<br/>
☐ Barcode area clear + quiet zone respected<br/>
☐ Language consistency across panels<br/>
☐ Claims reviewed — mark "requires separate verification"<br/>
☐ Cross-check with TDS confirms formulation"""
    e.append(card(Paragraph(checklist, s['Body1'])))
    
    e.append(PageBreak())
    return e

def page6(s):
    """Halal"""
    e = []
    e.append(Spacer(1, 24))
    e.append(Paragraph('<font color="#a16207">Optional</font> &nbsp; Halal Export-Readiness Preflight', s['Title1']))
    e.append(Paragraph('Target Market: Malaysia • Certificate: Not provided', s['Small1']))
    e.append(Spacer(1, 12))
    
    checks = [
        ('✕', '#ef4444', 'Halal Certificate Provided', 'No certificate uploaded', 'Obtain valid certificate'),
        ('!', '#f59e0b', 'Certificate Validity', 'Cannot verify', 'Ensure covers production dates'),
        ('!', '#f59e0b', 'Animal-Derived Ingredients', 'Milk powder — verify source', 'Confirm dairy meets Halal'),
        ('✓', '#22c55e', 'Gelatin / Enzymes', 'No gelatin declared', ''),
        ('!', '#f59e0b', 'Alcohol / Solvent Carrier', 'Vanilla — carrier not specified', 'Confirm non-alcohol carrier'),
        ('✕', '#ef4444', 'Cross-Contamination', 'No cleaning protocol info', 'Obtain facility Halal statement'),
        ('✓', '#22c55e', 'Traceability Fields', 'Lot traceability documented', ''),
    ]
    
    for icon, color, title, detail, fix in checks:
        fix_txt = f'<br/><font size="8" color="#92400e">Fix: {fix}</font>' if fix else ''
        txt = f'<font size="12" color="{color}">{icon}</font> &nbsp; <b>{title}</b><br/><font size="9" color="#78716c">{detail}</font>{fix_txt}'
        c = card(Paragraph(txt, s['Body1']))
        c.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#fefce8')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#fde68a')),
            ('TOPPADDING', (0,0), (-1,-1), 12),
            ('BOTTOMPADDING', (0,0), (-1,-1), 12),
            ('LEFTPADDING', (0,0), (-1,-1), 16),
            ('RIGHTPADDING', (0,0), (-1,-1), 16),
        ]))
        e.append(c)
        e.append(Spacer(1, 6))
    
    disc = """<b>Important:</b> Halal determinations depend on target market and certification body. This provides preflight flags, not certification."""
    disc_card = card(Paragraph(disc, s['Small1']))
    disc_card.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#fef3c7')),
        ('BOX', (0,0), (-1,-1), 0, colors.white),
        ('TOPPADDING', (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
        ('LEFTPADDING', (0,0), (-1,-1), 16),
        ('RIGHTPADDING', (0,0), (-1,-1), 16),
    ]))
    e.append(Spacer(1, 8))
    e.append(disc_card)
    
    e.append(PageBreak())
    return e

def page7(s):
    """Next Steps"""
    e = []
    e.append(Spacer(1, 24))
    e.append(Paragraph('<font color="#5B6CFF">Page 7</font> &nbsp; Next Steps &amp; Audit Trail', s['Title1']))
    e.append(Spacer(1, 12))
    
    steps = """<font color="#5B6CFF"><b>NEXT STEPS CHECKLIST</b></font><br/><br/>
☐ <font color="#3b82f6">P1</font> Fix allergen emphasis + cocoa QUID<br/>
☐ <font color="#3b82f6">P1</font> Reconcile Label ↔ TDS sugar mismatch<br/>
☐ <font color="#3b82f6">P2</font> Add %RI to nutrition table<br/>
☐ <font color="#3b82f6">P2</font> Add storage conditions<br/>
☐ <font color="#3b82f6">P3</font> Complete print verification sign-off<br/>
☐ <font color="#3b82f6">P3</font> Resolve Halal certificate gaps (if exporting)"""
    
    audit = """<font color="#5B6CFF"><b>AUDIT TRAIL ARTIFACTS</b></font><br/><br/>
<font name="Courier" size="9" color="#64748b">/srv/ava/data/runs/SAMPLE-AVA-0001/</font><br/>
<font name="Courier" size="9" color="#94a3b8">├── label.pdf<br/>
├── tds.pdf<br/>
├── evidence_text.txt<br/>
├── request.json<br/>
├── report.json<br/>
└── report.pdf</font>"""
    
    row = Table([
        [card(Paragraph(steps, s['Body1']), 238), Spacer(16,1), card(Paragraph(audit, s['Body1']), 238)]
    ], colWidths=[262, 16, 262])
    row.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))
    e.append(row)
    e.append(Spacer(1, 24))
    
    cta = """<b>Ready to Preflight Your Labels?</b><br/>
<font color="#64748b">This is a sample report. Run your own preflight at nexodify.com</font>"""
    cta_card = card(Paragraph(cta, s['Body1']))
    e.append(cta_card)
    
    return e

def generate():
    output = '/app/frontend/public/sample-report.pdf'
    
    doc = SimpleDocTemplate(
        output,
        pagesize=A4,
        rightMargin=36,
        leftMargin=36,
        topMargin=52,
        bottomMargin=40,
    )
    
    styles = create_styles()
    
    elements = []
    elements.extend(page1(styles))
    elements.extend(page2(styles))
    elements.extend(page3(styles))
    elements.extend(page4(styles))
    elements.extend(page5(styles))
    elements.extend(page6(styles))
    elements.extend(page7(styles))
    
    doc.build(elements, onFirstPage=header_footer, onLaterPages=header_footer)
    
    print(f"✅ PDF generated: {output}")
    print(f"   Size: {os.path.getsize(output) / 1024:.1f} KB")

if __name__ == '__main__':
    generate()
