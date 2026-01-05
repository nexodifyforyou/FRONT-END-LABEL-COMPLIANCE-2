#!/usr/bin/env python3
"""
Generate improved sample PDF with:
- Off-white background (#F4F6FB)
- White cards with borders and shadows
- Proper A4 spacing (32px top/bottom, 36px left/right)
- Clean header/footer
"""

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether
)
from reportlab.pdfgen import canvas
import os
from datetime import datetime

# Color definitions
PRIMARY_BLUE = colors.HexColor('#5B6CFF')
PAGE_BG = colors.HexColor('#F4F6FB')
CARD_BG = colors.white
CARD_BORDER = colors.HexColor('#E2E8F0')
DARK_TEXT = colors.HexColor('#1a1a2e')
MUTED_TEXT = colors.HexColor('#64748b')
CRITICAL_RED = colors.HexColor('#ef4444')
WARNING_AMBER = colors.HexColor('#f59e0b')
PASS_GREEN = colors.HexColor('#22c55e')

# A4 dimensions
PAGE_WIDTH, PAGE_HEIGHT = A4
MARGIN_TOP = 32
MARGIN_BOTTOM = 32
MARGIN_LEFT = 36
MARGIN_RIGHT = 36

class NumberedCanvas(canvas.Canvas):
    """Canvas that adds page background and header/footer on each page"""
    def __init__(self, *args, **kwargs):
        canvas.Canvas.__init__(self, *args, **kwargs)
        self._saved_page_states = []
        self.page_count = 0

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()
        self.page_count += 1

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_background()
            self.draw_header_footer(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_background(self):
        """Draw off-white background"""
        self.setFillColor(PAGE_BG)
        self.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=1, stroke=0)

    def draw_header_footer(self, num_pages):
        """Draw header and footer on each page"""
        page_num = self._pageNumber
        
        # Header
        self.setFillColor(DARK_TEXT)
        self.setFont('Helvetica-Bold', 10)
        self.drawString(MARGIN_LEFT, PAGE_HEIGHT - 24, "Nexodify AVA")
        
        self.setFillColor(MUTED_TEXT)
        self.setFont('Helvetica', 9)
        self.drawCentredString(PAGE_WIDTH / 2, PAGE_HEIGHT - 24, "EU Label Compliance Preflight Report")
        
        self.drawRightString(PAGE_WIDTH - MARGIN_RIGHT, PAGE_HEIGHT - 24, "Run ID: SAMPLE-AVA-0001")
        
        # Header divider line
        self.setStrokeColor(PRIMARY_BLUE)
        self.setLineWidth(2)
        self.line(MARGIN_LEFT, PAGE_HEIGHT - 32, PAGE_WIDTH - MARGIN_RIGHT, PAGE_HEIGHT - 32)
        
        # Footer
        self.setFillColor(MUTED_TEXT)
        self.setFont('Helvetica', 8)
        footer_text = f"Nexodify AVA • EU Label Compliance Preflight • Confidential • Sample Report • Page {page_num}/{num_pages}"
        self.drawCentredString(PAGE_WIDTH / 2, 18, footer_text)

def create_styles():
    """Create custom paragraph styles"""
    styles = getSampleStyleSheet()
    
    styles.add(ParagraphStyle(
        name='PageTitle',
        fontName='Helvetica-Bold',
        fontSize=18,
        textColor=DARK_TEXT,
        spaceAfter=8,
    ))
    
    styles.add(ParagraphStyle(
        name='SectionTitle',
        fontName='Helvetica-Bold',
        fontSize=13,
        textColor=DARK_TEXT,
        spaceBefore=12,
        spaceAfter=8,
    ))
    
    styles.add(ParagraphStyle(
        name='CardTitle',
        fontName='Helvetica-Bold',
        fontSize=8,
        textColor=PRIMARY_BLUE,
        spaceAfter=6,
    ))
    
    styles.add(ParagraphStyle(
        name='BodyTextMain',
        fontName='Helvetica',
        fontSize=11,
        textColor=DARK_TEXT,
        leading=17.6,  # 1.6 line height
        spaceAfter=6,
    ))
    
    styles.add(ParagraphStyle(
        name='SmallText',
        fontName='Helvetica',
        fontSize=9,
        textColor=MUTED_TEXT,
        leading=14.4,
        spaceAfter=4,
    ))
    
    styles.add(ParagraphStyle(
        name='TinyText',
        fontName='Helvetica',
        fontSize=8,
        textColor=colors.HexColor('#94a3b8'),
    ))
    
    return styles

def card_table(content_table, col_widths):
    """Wrap a table in a white card with border"""
    # Create the content with card styling
    wrapper = Table([[content_table]], colWidths=[sum(col_widths) + 24])
    wrapper.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), CARD_BG),
        ('BOX', (0, 0), (-1, -1), 1, CARD_BORDER),
        ('TOPPADDING', (0, 0), (-1, -1), 16),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 16),
        ('LEFTPADDING', (0, 0), (-1, -1), 16),
        ('RIGHTPADDING', (0, 0), (-1, -1), 16),
    ]))
    return wrapper

def build_page1(styles):
    """Page 1: Executive Summary"""
    elements = []
    elements.append(Spacer(1, 20))
    
    # Page badge
    elements.append(Paragraph('<font color="#5B6CFF">Page 1</font> &nbsp; <b>Executive Summary</b>', styles['PageTitle']))
    elements.append(Spacer(1, 6))
    elements.append(Paragraph('EU Label Compliance, <font color="#5B6CFF">Preflighted.</font>', styles['SectionTitle']))
    elements.append(Paragraph('<font color="#64748b">Automated verification against Regulation (EU) 1169/2011</font>', styles['SmallText']))
    elements.append(Spacer(1, 18))
    
    # Product Info Card
    product_data = [
        [Paragraph('<font color="#5B6CFF"><b>PRODUCT INFORMATION</b></font>', styles['CardTitle']), ''],
        ['Product Name', 'Milk Chocolate Bar with Hazelnuts (100 g)'],
        ['Company', 'Example Foods S.r.l.'],
        ['Country of Sale', 'Italy'],
        ['Languages', 'Italian, English'],
        ['Category', 'Confectionery'],
    ]
    
    product_table = Table(product_data, colWidths=[100, 160])
    product_table.setStyle(TableStyle([
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('TEXTCOLOR', (0, 1), (0, -1), MUTED_TEXT),
        ('FONTNAME', (1, 1), (1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (1, 1), (1, -1), 10),
        ('ALIGN', (1, 1), (1, -1), 'RIGHT'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('LINEBELOW', (0, 1), (-1, -2), 0.5, CARD_BORDER),
        ('SPAN', (0, 0), (1, 0)),
    ]))
    
    # Score Card
    score_data = [
        [Paragraph('<font size="32" color="#f59e0b"><b>78%</b></font>', styles['BodyTextMain'])],
        [Paragraph('<font size="10" color="#64748b">Compliance Score</font>', styles['SmallText'])],
        [''],
        [Paragraph('<font size="9"><font color="#ef4444">● 2 Critical</font> &nbsp; <font color="#f59e0b">● 4 Warnings</font> &nbsp; <font color="#22c55e">● 14 Passed</font></font>', styles['SmallText'])],
    ]
    
    score_table = Table(score_data, colWidths=[170])
    score_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#1a1a2e')),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (0, 0), 16),
        ('BOTTOMPADDING', (0, -1), (0, -1), 16),
    ]))
    
    # Wrap both in cards
    product_card = card_table(product_table, [100, 160])
    
    score_wrapper = Table([[score_table]], colWidths=[190])
    score_wrapper.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 1, CARD_BORDER),
    ]))
    
    main_row = Table([[product_card, Spacer(16, 1), score_wrapper]], colWidths=[300, 16, 190])
    main_row.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP')]))
    elements.append(main_row)
    elements.append(Spacer(1, 20))
    
    # What's Included Card
    included_data = [
        [Paragraph('<font color="#5B6CFF"><b>WHAT\'S INCLUDED</b></font>', styles['CardTitle']), ''],
        ['✓ Executive summary + compliance score', '✓ Label ↔ TDS cross-check summary'],
        ['✓ Findings (severity + fixes)', '✓ Print Verification Pack'],
        ['✓ Evidence excerpts (Label/TDS)', '✓ Halal export-readiness preflight'],
    ]
    included_table = Table(included_data, colWidths=[230, 230])
    included_table.setStyle(TableStyle([
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('SPAN', (0, 0), (1, 0)),
    ]))
    elements.append(card_table(included_table, [230, 230]))
    
    elements.append(PageBreak())
    return elements

def build_page2(styles):
    """Page 2: Findings Overview"""
    elements = []
    elements.append(Spacer(1, 20))
    
    elements.append(Paragraph('<font color="#5B6CFF">Page 2</font> &nbsp; <b>Findings Overview</b>', styles['PageTitle']))
    elements.append(Paragraph('6 Issues Identified', styles['SectionTitle']))
    elements.append(Spacer(1, 12))
    
    findings = [
        ('✕', '#ef4444', 'CRITICAL', 'Allergen emphasis missing', 'Label', 'Apply bold to \'milk, hazelnuts, soy lecithin\''),
        ('✕', '#ef4444', 'CRITICAL', 'Cocoa QUID percentage absent', 'Label', 'Declare cocoa solids % per Article 22'),
        ('!', '#f59e0b', 'WARNING', 'Net quantity format', 'Label', 'Use \'e\' symbol with 100 g declaration'),
        ('!', '#f59e0b', 'WARNING', 'Nutrition %RI missing', 'Label', 'Add Reference Intake percentages'),
        ('!', '#f59e0b', 'WARNING', 'Storage conditions absent', 'TDS', 'Add \'Store in a cool, dry place\''),
        ('!', '#f59e0b', 'WARNING', 'Operator address incomplete', 'Label', 'Include full postal address'),
    ]
    
    for icon, color, severity, title, source, fix in findings:
        finding_data = [[
            Paragraph(f'<font size="14" color="{color}">{icon}</font>', styles['BodyTextMain']),
            Paragraph(f'<b>{title}</b><br/><font size="8" color="{color}">{severity}</font> &nbsp; <font size="8" color="#2563eb">Source: {source}</font><br/><font size="9" color="#64748b">{fix}</font>', styles['BodyTextMain'])
        ]]
        finding_table = Table(finding_data, colWidths=[24, 460])
        finding_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('TOPPADDING', (0, 0), (-1, -1), 4),
        ]))
        elements.append(card_table(finding_table, [24, 460]))
        elements.append(Spacer(1, 8))
    
    elements.append(PageBreak())
    return elements

def build_page3(styles):
    """Page 3: Evidence & Fix Details"""
    elements = []
    elements.append(Spacer(1, 20))
    
    elements.append(Paragraph('<font color="#5B6CFF">Page 3</font> &nbsp; <b>Evidence & Fix Details</b>', styles['PageTitle']))
    elements.append(Spacer(1, 12))
    
    # Finding 1: Allergen
    evidence1_data = [[
        Paragraph('''<font color="#ef4444" size="8"><b>CRITICAL</b></font> &nbsp; <b>Allergen Emphasis Missing</b><br/><br/>
<font size="8" color="#64748b">EVIDENCE (LABEL EXCERPT)</font><br/>
<i>"Ingredients: Sugar, cocoa butter, whole <font color="#5B6CFF">milk</font> powder, <font color="#5B6CFF">hazelnuts</font> (15%), cocoa mass, <font color="#5B6CFF">soy</font> lecithin..."</i><br/>
<font size="8" color="#94a3b8">↳ Allergens appear in regular typeface, not distinguished</font><br/><br/>
<font size="8" color="#64748b">RECOMMENDED FIX</font><br/>
<font color="#5B6CFF">1.</font> Update: "...whole <b>MILK</b> powder, <b>HAZELNUTS</b> (15%), <b>SOY</b> lecithin..."<br/>
<font color="#5B6CFF">2.</font> Add "Contains: Milk, Hazelnuts (tree nuts), Soy"<br/>
<font color="#5B6CFF">3.</font> Apply consistently in Italian translation<br/><br/>
<font size="8" color="#94a3b8">Reference: Regulation (EU) 1169/2011, Article 21(1)(b), Annex II</font>''', styles['BodyTextMain'])
    ]]
    evidence1_table = Table(evidence1_data, colWidths=[480])
    elements.append(card_table(evidence1_table, [480]))
    elements.append(Spacer(1, 16))
    
    # Finding 2: QUID
    evidence2_data = [[
        Paragraph('''<font color="#ef4444" size="8"><b>CRITICAL</b></font> &nbsp; <b>Cocoa QUID Percentage Absent</b><br/><br/>
<font size="8" color="#64748b">EVIDENCE (LABEL EXCERPT)</font><br/>
<i>Product name: "<font color="#5B6CFF">Milk Chocolate</font> Bar with Hazelnuts"</i><br/>
<i>Ingredients list shows "cocoa mass" without percentage</i><br/>
<font size="8" color="#94a3b8">↳ "Chocolate" in name triggers QUID requirement</font><br/><br/>
<font size="8" color="#64748b">RECOMMENDED FIX</font><br/>
<font color="#5B6CFF">1.</font> Add "Cocoa solids: 30% minimum" declaration<br/>
<font color="#5B6CFF">2.</font> Verify percentage against TDS specification<br/><br/>
<font size="8" color="#94a3b8">Reference: Regulation (EU) 1169/2011, Article 22; Directive 2000/36/EC</font>''', styles['BodyTextMain'])
    ]]
    evidence2_table = Table(evidence2_data, colWidths=[480])
    elements.append(card_table(evidence2_table, [480]))
    
    elements.append(PageBreak())
    return elements

def build_page4(styles):
    """Page 4: Cross-Check Summary"""
    elements = []
    elements.append(Spacer(1, 20))
    
    elements.append(Paragraph('<font color="#5B6CFF">Page 4</font> &nbsp; <b>Label ↔ TDS Cross-Check</b>', styles['PageTitle']))
    elements.append(Spacer(1, 12))
    
    # Matched
    match_data = [
        [Paragraph('<font color="#22c55e"><b>✓ MATCHED (5)</b></font>', styles['CardTitle']), ''],
        ['Product Name', Paragraph('<font color="#22c55e">✓</font>', styles['SmallText'])],
        ['Net Quantity', Paragraph('<font color="#22c55e">✓</font>', styles['SmallText'])],
        ['Ingredients Order', Paragraph('<font color="#22c55e">✓</font>', styles['SmallText'])],
        ['Hazelnut %', Paragraph('<font color="#22c55e">✓</font>', styles['SmallText'])],
        ['Allergen List', Paragraph('<font color="#22c55e">✓</font>', styles['SmallText'])],
    ]
    match_table = Table(match_data, colWidths=[140, 60])
    match_table.setStyle(TableStyle([
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('TEXTCOLOR', (0, 1), (0, -1), MUTED_TEXT),
        ('ALIGN', (1, 1), (1, -1), 'RIGHT'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LINEBELOW', (0, 1), (-1, -2), 0.5, CARD_BORDER),
        ('SPAN', (0, 0), (1, 0)),
    ]))
    
    # Mismatched
    mismatch_data = [
        [Paragraph('<font color="#ef4444"><b>✕ MISMATCHED (3)</b></font>', styles['CardTitle']), ''],
        [Paragraph('Cocoa Solids %<br/><font size="8" color="#f59e0b">⚠ TDS: 32%, Label: not declared</font>', styles['SmallText']), Paragraph('<font color="#ef4444">✕</font>', styles['SmallText'])],
        [Paragraph('Storage Temp<br/><font size="8" color="#f59e0b">⚠ TDS: &lt; 25°C, Label: missing</font>', styles['SmallText']), Paragraph('<font color="#ef4444">✕</font>', styles['SmallText'])],
        [Paragraph('Sugar Content<br/><font size="8" color="#f59e0b">⚠ TDS: 48g, Label: 45g per 100g</font>', styles['SmallText']), Paragraph('<font color="#ef4444">✕</font>', styles['SmallText'])],
    ]
    mismatch_table = Table(mismatch_data, colWidths=[170, 40])
    mismatch_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (1, 1), (1, -1), 'RIGHT'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LINEBELOW', (0, 1), (-1, -2), 0.5, CARD_BORDER),
        ('SPAN', (0, 0), (1, 0)),
    ]))
    
    match_card = card_table(match_table, [140, 60])
    mismatch_card = card_table(mismatch_table, [170, 40])
    
    row = Table([[match_card, Spacer(16, 1), mismatch_card]], colWidths=[224, 16, 254])
    row.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP')]))
    elements.append(row)
    elements.append(Spacer(1, 20))
    
    # Category info
    cat_data = [[Paragraph('''<font color="#5B6CFF"><b>CATEGORY-AWARE CHECKS</b></font><br/><br/>
This report applies EU 1169/2011 checks for <b>Confectionery</b>.<br/><br/>
<font size="9">Dairy • Meat & Fish • <b><font color="#1d4ed8">Confectionery ✓</font></b> • Bakery • Beverages • Ready Meals • Oils & Fats • Frozen • Baby Food • Supplements</font>''', styles['BodyTextMain'])]]
    cat_table = Table(cat_data, colWidths=[480])
    elements.append(card_table(cat_table, [480]))
    
    elements.append(PageBreak())
    return elements

def build_page5(styles):
    """Page 5: Print Verification Pack"""
    elements = []
    elements.append(Spacer(1, 20))
    
    elements.append(Paragraph('<font color="#16a34a">Print Pack</font> &nbsp; <b>Print Verification Pack</b>', styles['PageTitle']))
    elements.append(Spacer(1, 12))
    
    # Sign-off section
    signoff_data = [[Paragraph('''<font color="#16a34a"><b>📋 VERSIONING & SIGN-OFF</b></font><br/><br/>
<font size="9">Label Version ID: ___________________ &nbsp;&nbsp; Artwork File Name: ___________________</font><br/><br/>
<font size="9">Print Vendor: ___________________ &nbsp;&nbsp; Approval Owner (QA): ___________________</font><br/><br/>
<font size="9">Date: ___________________ &nbsp;&nbsp; Signature: ___________________</font><br/><br/>
<font size="9">Final Print Run Notes: ________________________________________________________________</font>''', styles['BodyTextMain'])]]
    signoff_table = Table(signoff_data, colWidths=[480])
    signoff_wrapper = card_table(signoff_table, [480])
    signoff_wrapper.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f0fdf4')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#bbf7d0')),
    ]))
    elements.append(signoff_wrapper)
    elements.append(Spacer(1, 16))
    
    # Pre-press checklist
    checklist_items = [
        '☐ Mandatory particulars fully in Italian for Italy sale',
        '☐ Allergen emphasis applied consistently',
        '☐ QUID declared where ingredients emphasized',
        '☐ Net quantity format correct',
        '☐ Nutrition declaration complete (per 100 g)',
        '☐ Operator name + full address present',
        '☐ Lot/expiry placeholders legible',
        '☐ Font size/contrast acceptable',
        '☐ Barcode area clear + quiet zone respected',
        '☐ Language consistency across panels',
        '☐ Claims reviewed — mark "requires separate verification"',
        '☐ Cross-check with TDS confirms formulation',
    ]
    
    checklist_text = '<font color="#5B6CFF"><b>PRE-PRESS CHECKLIST</b></font><br/><br/>' + '<br/>'.join([f'<font size="10">{item}</font>' for item in checklist_items])
    checklist_data = [[Paragraph(checklist_text, styles['BodyTextMain'])]]
    checklist_table = Table(checklist_data, colWidths=[480])
    elements.append(card_table(checklist_table, [480]))
    
    elements.append(PageBreak())
    return elements

def build_page6(styles):
    """Page 6: Halal Export-Readiness"""
    elements = []
    elements.append(Spacer(1, 20))
    
    elements.append(Paragraph('<font color="#a16207">Optional Module</font> &nbsp; <b>Halal Export-Readiness Preflight</b>', styles['PageTitle']))
    elements.append(Paragraph('<font color="#64748b">Target Market: Malaysia • Certificate: Not provided</font>', styles['SmallText']))
    elements.append(Spacer(1, 12))
    
    halal_checks = [
        ('✕', '#ef4444', 'Halal Certificate Provided', 'No certificate uploaded', 'Obtain valid certificate'),
        ('!', '#f59e0b', 'Certificate Validity', 'Cannot verify', 'Ensure certificate covers production dates'),
        ('!', '#f59e0b', 'Animal-Derived Ingredients', 'Milk powder — verify source', 'Confirm dairy meets Halal requirements'),
        ('✓', '#22c55e', 'Gelatin / Enzymes', 'No gelatin declared', ''),
        ('!', '#f59e0b', 'Alcohol / Solvent Carrier', 'Vanilla flavouring — carrier not specified', 'Confirm non-alcohol carrier'),
        ('!', '#f59e0b', 'E-Number Source', 'Soy lecithin — verify processing', 'Request Halal statement'),
        ('✕', '#ef4444', 'Cross-Contamination', 'No cleaning protocol info', 'Obtain facility Halal statement'),
        ('✓', '#22c55e', 'Traceability Fields', 'Lot traceability documented', ''),
        ('!', '#f59e0b', 'Halal Logo Usage', 'No logo present', 'Add authorized logo only with certification'),
    ]
    
    for icon, color, title, detail, fix in halal_checks:
        fix_text = f'<br/><font size="8" color="#92400e">Fix: {fix}</font>' if fix else ''
        check_data = [[
            Paragraph(f'<font size="12" color="{color}">{icon}</font>', styles['BodyTextMain']),
            Paragraph(f'<b>{title}</b><br/><font size="9" color="#78716c">{detail}</font>{fix_text}', styles['BodyTextMain'])
        ]]
        check_table = Table(check_data, colWidths=[24, 460])
        check_table.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP')]))
        wrapper = card_table(check_table, [24, 460])
        wrapper.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#fefce8')),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#fde68a')),
        ]))
        elements.append(wrapper)
        elements.append(Spacer(1, 6))
    
    # Disclaimer
    disc_data = [[Paragraph('<font size="9" color="#92400e"><b>Important:</b> Halal determinations depend on target market and certification body. This provides preflight flags, not certification.</font>', styles['SmallText'])]]
    disc_table = Table(disc_data, colWidths=[480])
    disc_wrapper = card_table(disc_table, [480])
    disc_wrapper.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#fef3c7')),
    ]))
    elements.append(Spacer(1, 8))
    elements.append(disc_wrapper)
    
    elements.append(PageBreak())
    return elements

def build_page7(styles):
    """Page 7: Next Steps"""
    elements = []
    elements.append(Spacer(1, 20))
    
    elements.append(Paragraph('<font color="#5B6CFF">Page 7</font> &nbsp; <b>Next Steps & Audit Trail</b>', styles['PageTitle']))
    elements.append(Spacer(1, 12))
    
    # Next steps
    steps_text = '''<font color="#5B6CFF"><b>NEXT STEPS CHECKLIST</b></font><br/><br/>
<font size="10">☐ <font color="#3b82f6">P1</font> Fix allergen emphasis + cocoa QUID</font><br/>
<font size="10">☐ <font color="#3b82f6">P1</font> Reconcile Label ↔ TDS sugar mismatch</font><br/>
<font size="10">☐ <font color="#3b82f6">P2</font> Add %RI to nutrition table</font><br/>
<font size="10">☐ <font color="#3b82f6">P2</font> Add storage conditions</font><br/>
<font size="10">☐ <font color="#3b82f6">P3</font> Complete print verification sign-off</font><br/>
<font size="10">☐ <font color="#3b82f6">P3</font> Resolve Halal certificate gaps (if exporting)</font>'''
    
    steps_data = [[Paragraph(steps_text, styles['BodyTextMain'])]]
    steps_table = Table(steps_data, colWidths=[230])
    
    # Audit trail
    audit_text = '''<font color="#5B6CFF"><b>AUDIT TRAIL ARTIFACTS</b></font><br/><br/>
<font name="Courier" size="9" color="#64748b">/srv/ava/data/runs/SAMPLE-AVA-0001/</font><br/>
<font name="Courier" size="9" color="#94a3b8">├── label.pdf</font><br/>
<font name="Courier" size="9" color="#94a3b8">├── tds.pdf</font><br/>
<font name="Courier" size="9" color="#94a3b8">├── evidence_text.txt</font><br/>
<font name="Courier" size="9" color="#94a3b8">├── request.json</font><br/>
<font name="Courier" size="9" color="#94a3b8">├── report.json</font><br/>
<font name="Courier" size="9" color="#94a3b8">└── report.pdf</font>'''
    
    audit_data = [[Paragraph(audit_text, styles['BodyTextMain'])]]
    audit_table = Table(audit_data, colWidths=[230])
    
    steps_card = card_table(steps_table, [230])
    audit_card = card_table(audit_table, [230])
    
    row = Table([[steps_card, Spacer(16, 1), audit_card]], colWidths=[254, 16, 254])
    row.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP')]))
    elements.append(row)
    elements.append(Spacer(1, 24))
    
    # CTA
    cta_data = [[Paragraph('''<font size="11"><b>Ready to Preflight Your Labels?</b></font><br/>
<font size="10" color="#64748b">This is a sample report. Run your own preflight at nexodify.com</font>''', styles['BodyTextMain'])]]
    cta_table = Table(cta_data, colWidths=[480])
    cta_table.setStyle(TableStyle([('ALIGN', (0, 0), (-1, -1), 'CENTER')]))
    elements.append(card_table(cta_table, [480]))
    
    return elements

def generate_pdf():
    """Generate the complete PDF"""
    output_path = '/app/frontend/public/sample-report.pdf'
    
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        rightMargin=MARGIN_RIGHT,
        leftMargin=MARGIN_LEFT,
        topMargin=MARGIN_TOP + 20,  # Extra space for header
        bottomMargin=MARGIN_BOTTOM + 10,  # Extra space for footer
    )
    
    styles = create_styles()
    
    elements = []
    elements.extend(build_page1(styles))
    elements.extend(build_page2(styles))
    elements.extend(build_page3(styles))
    elements.extend(build_page4(styles))
    elements.extend(build_page5(styles))
    elements.extend(build_page6(styles))
    elements.extend(build_page7(styles))
    
    print("Generating PDF with improved styling...")
    doc.build(elements, canvasmaker=NumberedCanvas)
    
    file_size = os.path.getsize(output_path)
    print(f"✅ PDF generated: {output_path}")
    print(f"   File size: {file_size / 1024:.1f} KB")

if __name__ == '__main__':
    generate_pdf()
