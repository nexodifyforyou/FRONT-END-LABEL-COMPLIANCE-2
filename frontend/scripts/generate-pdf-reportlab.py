#!/usr/bin/env python3
"""
Generate a premium, multi-page sample PDF report for Nexodify AVA
Milk Chocolate Bar EU 1169/2011 Compliance Preflight Report
Uses ReportLab for pure Python PDF generation
"""

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm, inch
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable, KeepTogether
)
from reportlab.graphics.shapes import Drawing, Rect, String, Circle
from reportlab.graphics import renderPDF
import os

# Color definitions
PRIMARY_BLUE = colors.HexColor('#5B6CFF')
DARK_BG = colors.HexColor('#1a1a2e')
LIGHT_BG = colors.HexColor('#f8f9fc')
BORDER_COLOR = colors.HexColor('#e2e8f0')
CRITICAL_RED = colors.HexColor('#ef4444')
WARNING_AMBER = colors.HexColor('#f59e0b')
PASS_GREEN = colors.HexColor('#22c55e')
MUTED_TEXT = colors.HexColor('#666666')

def create_styles():
    """Create custom paragraph styles"""
    styles = getSampleStyleSheet()
    
    styles.add(ParagraphStyle(
        name='MainTitle',
        fontName='Helvetica-Bold',
        fontSize=22,
        textColor=DARK_BG,
        alignment=TA_CENTER,
        spaceAfter=6,
    ))
    
    styles.add(ParagraphStyle(
        name='MainTitleBlue',
        fontName='Helvetica-Bold',
        fontSize=22,
        textColor=PRIMARY_BLUE,
        alignment=TA_CENTER,
        spaceAfter=12,
    ))
    
    styles.add(ParagraphStyle(
        name='Subtitle',
        fontName='Helvetica',
        fontSize=11,
        textColor=MUTED_TEXT,
        alignment=TA_CENTER,
        spaceAfter=20,
    ))
    
    styles.add(ParagraphStyle(
        name='SectionTitle',
        fontName='Helvetica-Bold',
        fontSize=14,
        textColor=DARK_BG,
        spaceBefore=12,
        spaceAfter=8,
    ))
    
    styles.add(ParagraphStyle(
        name='CardTitle',
        fontName='Helvetica-Bold',
        fontSize=8,
        textColor=PRIMARY_BLUE,
        spaceAfter=8,
    ))
    
    styles.add(ParagraphStyle(
        name='BodyTextCustom',
        fontName='Helvetica',
        fontSize=10,
        textColor=DARK_BG,
        spaceAfter=6,
    ))
    
    styles.add(ParagraphStyle(
        name='SmallText',
        fontName='Helvetica',
        fontSize=9,
        textColor=MUTED_TEXT,
        spaceAfter=4,
    ))
    
    styles.add(ParagraphStyle(
        name='TinyText',
        fontName='Helvetica',
        fontSize=8,
        textColor=colors.HexColor('#94a3b8'),
        spaceAfter=2,
    ))
    
    styles.add(ParagraphStyle(
        name='FindingTitle',
        fontName='Helvetica-Bold',
        fontSize=10,
        textColor=DARK_BG,
        spaceAfter=4,
    ))
    
    styles.add(ParagraphStyle(
        name='EvidenceText',
        fontName='Helvetica-Oblique',
        fontSize=9,
        textColor=colors.HexColor('#475569'),
        spaceAfter=4,
    ))
    
    return styles

def create_header(styles, subtitle="EU Label Compliance Preflight"):
    """Create page header"""
    header_data = [
        [
            Paragraph('<font color="#5B6CFF">■</font> <b>Nexodify AVA</b>', styles['BodyText']),
            Paragraph(f'<font size="8" color="#666666">{subtitle}</font>', styles['BodyText']),
            Paragraph('<font size="8" color="#666666">Run ID: SAMPLE-AVA-0001</font>', styles['SmallText'])
        ]
    ]
    header_table = Table(header_data, colWidths=[120, 280, 130])
    header_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (0, 0), 'LEFT'),
        ('ALIGN', (1, 0), (1, 0), 'CENTER'),
        ('ALIGN', (2, 0), (2, 0), 'RIGHT'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LINEBELOW', (0, 0), (-1, 0), 2, PRIMARY_BLUE),
    ]))
    return header_table

def create_footer():
    """Create page footer text"""
    return Paragraph(
        '<font size="8" color="#94a3b8">Nexodify AVA · EU Label Compliance Preflight &nbsp;&nbsp;|&nbsp;&nbsp; Confidential · Sample Report</font>',
        ParagraphStyle(name='Footer', alignment=TA_CENTER)
    )

def build_page1_executive_summary(styles):
    """Page 1: Executive Summary"""
    elements = []
    
    # Header
    elements.append(create_header(styles, "Executive Summary"))
    elements.append(Spacer(1, 20))
    
    # Title
    elements.append(Paragraph('EU Label Compliance, <font color="#5B6CFF">Preflighted.</font>', styles['MainTitle']))
    elements.append(Paragraph('Automated verification against Regulation (EU) 1169/2011', styles['Subtitle']))
    elements.append(Spacer(1, 10))
    
    # Product Info & Score - Side by side
    product_data = [
        ['PRODUCT INFORMATION', ''],
        ['Product Name', 'Milk Chocolate Bar with Hazelnuts (100 g)'],
        ['Company', 'Example Foods S.r.l.'],
        ['Country of Sale', 'Italy'],
        ['Languages', 'Italian, English'],
        ['Category', 'Confectionery'],
    ]
    
    product_table = Table(product_data, colWidths=[100, 150])
    product_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), LIGHT_BG),
        ('TEXTCOLOR', (0, 0), (-1, 0), PRIMARY_BLUE),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 8),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('TEXTCOLOR', (0, 1), (0, -1), MUTED_TEXT),
        ('FONTNAME', (1, 1), (1, -1), 'Helvetica-Bold'),
        ('ALIGN', (1, 1), (1, -1), 'RIGHT'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('SPAN', (0, 0), (1, 0)),
    ]))
    
    # Score card
    score_data = [
        [Paragraph('<font size="36" color="#f59e0b"><b>78%</b></font>', styles['BodyText'])],
        [Paragraph('<font size="9" color="#666666">Compliance Score</font>', styles['SmallText'])],
        [Paragraph('<font size="8" color="#666666">Issues require attention</font>', styles['TinyText'])],
        [''],
        [Paragraph('<font size="8" color="#ef4444">● 2 Critical</font> &nbsp; <font size="8" color="#f59e0b">● 4 Warnings</font> &nbsp; <font size="8" color="#22c55e">● 14 Passed</font>', styles['SmallText'])],
    ]
    
    score_table = Table(score_data, colWidths=[180])
    score_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), DARK_BG),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (0, 0), 20),
        ('BOTTOMPADDING', (0, -1), (0, -1), 20),
        ('ROUNDEDCORNERS', [8, 8, 8, 8]),
    ]))
    
    main_table = Table([[product_table, score_table]], colWidths=[260, 200])
    main_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    elements.append(main_table)
    elements.append(Spacer(1, 20))
    
    # What's Included
    elements.append(Paragraph('WHAT\'S INCLUDED IN THIS REPORT', styles['CardTitle']))
    included_items = [
        ['✓ Executive summary + compliance score', '✓ Label ↔ TDS cross-check summary'],
        ['✓ Findings (severity + recommended fixes)', '✓ Print Verification Pack (checklist + sign-off)'],
        ['✓ Evidence excerpts (Label/TDS)', '✓ Halal export-readiness preflight (optional)'],
    ]
    included_table = Table(included_items, colWidths=[230, 230])
    included_table.setStyle(TableStyle([
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('BACKGROUND', (0, 0), (-1, -1), LIGHT_BG),
        ('BOX', (0, 0), (-1, -1), 1, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
    ]))
    elements.append(included_table)
    
    elements.append(Spacer(1, 30))
    elements.append(create_footer())
    elements.append(PageBreak())
    
    return elements

def build_page2_findings_overview(styles):
    """Page 2: Findings Overview"""
    elements = []
    
    elements.append(create_header(styles, "Findings Overview"))
    elements.append(Spacer(1, 15))
    
    elements.append(Paragraph('<font color="#5B6CFF">Page 2</font> &nbsp; <b>6 Issues Identified</b>', styles['SectionTitle']))
    elements.append(Spacer(1, 10))
    
    findings = [
        ('CRITICAL', 'Allergen emphasis missing', 'Label', 'Apply bold to \'milk, hazelnuts, soy lecithin\' in ingredients list'),
        ('CRITICAL', 'Cocoa QUID percentage absent', 'Label', 'Declare cocoa solids % per Article 22'),
        ('WARNING', 'Net quantity format', 'Label', 'Use \'e\' symbol with 100 g declaration'),
        ('WARNING', 'Nutrition %RI missing', 'Label', 'Add Reference Intake percentages per Article 32'),
        ('WARNING', 'Storage conditions absent', 'TDS', 'Add \'Store in a cool, dry place\' to label'),
        ('WARNING', 'Operator address incomplete', 'Label', 'Include full postal address with postal code'),
    ]
    
    for severity, title, source, fix in findings:
        icon = '✕' if severity == 'CRITICAL' else '!'
        color = '#ef4444' if severity == 'CRITICAL' else '#f59e0b'
        badge_bg = '#fef2f2' if severity == 'CRITICAL' else '#fffbeb'
        
        finding_data = [[
            Paragraph(f'<font size="14" color="{color}">{icon}</font>', styles['BodyText']),
            Paragraph(f'''
                <b>{title}</b><br/>
                <font size="7" color="{color}">{severity}</font> &nbsp;
                <font size="7" color="#2563eb">Source: {source}</font><br/>
                <font size="8" color="#666666">{fix}</font>
            ''', styles['BodyText'])
        ]]
        finding_table = Table(finding_data, colWidths=[25, 435])
        finding_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), LIGHT_BG),
            ('BOX', (0, 0), (-1, -1), 1, BORDER_COLOR),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ]))
        elements.append(finding_table)
        elements.append(Spacer(1, 6))
    
    elements.append(Spacer(1, 20))
    elements.append(create_footer())
    elements.append(PageBreak())
    
    return elements

def build_page3_evidence_details(styles):
    """Page 3: Evidence & Fix Details"""
    elements = []
    
    elements.append(create_header(styles, "Evidence & Fix Details"))
    elements.append(Spacer(1, 15))
    
    elements.append(Paragraph('<font color="#5B6CFF">Page 3</font> &nbsp; <b>Evidence & Recommended Fixes</b>', styles['SectionTitle']))
    elements.append(Spacer(1, 10))
    
    # Finding 1
    elements.append(Paragraph('<font size="8" color="#ef4444">CRITICAL</font> &nbsp; <b>Allergen Emphasis Missing</b>', styles['FindingTitle']))
    elements.append(Spacer(1, 6))
    
    evidence_data = [[
        Paragraph('''
            <font size="7" color="#64748b">EVIDENCE (LABEL EXCERPT)</font><br/><br/>
            <i>"Ingredients: Sugar, cocoa butter, whole <font color="#5B6CFF">milk</font> powder, 
            <font color="#5B6CFF">hazelnuts</font> (15%), cocoa mass, <font color="#5B6CFF">soy</font> 
            lecithin (emulsifier), natural vanilla flavouring."</i><br/><br/>
            <font size="8" color="#94a3b8">↳ Allergens appear in regular typeface, not distinguished</font>
        ''', styles['EvidenceText'])
    ]]
    evidence_table = Table(evidence_data, colWidths=[450])
    evidence_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f1f5f9')),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
    ]))
    elements.append(evidence_table)
    elements.append(Spacer(1, 8))
    
    fix_data = [[
        Paragraph('''
            <font size="7" color="#64748b">RECOMMENDED FIX</font><br/><br/>
            <font color="#5B6CFF">1.</font> Update ingredients: "...whole <b>MILK</b> powder, <b>HAZELNUTS</b> (15%), cocoa mass, <b>SOY</b> lecithin..."<br/>
            <font color="#5B6CFF">2.</font> Add "Contains: Milk, Hazelnuts (tree nuts), Soy" statement<br/>
            <font color="#5B6CFF">3.</font> Apply consistently in Italian translation
        ''', styles['SmallText'])
    ]]
    fix_table = Table(fix_data, colWidths=[450])
    fix_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), LIGHT_BG),
        ('BOX', (0, 0), (-1, -1), 1, BORDER_COLOR),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
    ]))
    elements.append(fix_table)
    elements.append(Paragraph('<font size="8" color="#94a3b8">Reference: Regulation (EU) 1169/2011, Article 21(1)(b), Annex II</font>', styles['TinyText']))
    elements.append(Spacer(1, 15))
    
    # Finding 2
    elements.append(Paragraph('<font size="8" color="#ef4444">CRITICAL</font> &nbsp; <b>Cocoa QUID Percentage Absent</b>', styles['FindingTitle']))
    elements.append(Spacer(1, 6))
    
    evidence_data2 = [[
        Paragraph('''
            <font size="7" color="#64748b">EVIDENCE (LABEL EXCERPT)</font><br/><br/>
            <i>Product name: "<font color="#5B6CFF">Milk Chocolate</font> Bar with Hazelnuts"</i><br/>
            <i>Ingredients list shows "cocoa mass" without percentage</i><br/><br/>
            <font size="8" color="#94a3b8">↳ "Chocolate" in name triggers QUID requirement for cocoa</font>
        ''', styles['EvidenceText'])
    ]]
    evidence_table2 = Table(evidence_data2, colWidths=[450])
    evidence_table2.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f1f5f9')),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
    ]))
    elements.append(evidence_table2)
    elements.append(Spacer(1, 8))
    
    fix_data2 = [[
        Paragraph('''
            <font size="7" color="#64748b">RECOMMENDED FIX</font><br/><br/>
            <font color="#5B6CFF">1.</font> Add "Cocoa solids: 30% minimum" declaration<br/>
            <font color="#5B6CFF">2.</font> Verify percentage against TDS specification
        ''', styles['SmallText'])
    ]]
    fix_table2 = Table(fix_data2, colWidths=[450])
    fix_table2.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), LIGHT_BG),
        ('BOX', (0, 0), (-1, -1), 1, BORDER_COLOR),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
    ]))
    elements.append(fix_table2)
    elements.append(Paragraph('<font size="8" color="#94a3b8">Reference: Regulation (EU) 1169/2011, Article 22; Directive 2000/36/EC</font>', styles['TinyText']))
    
    elements.append(Spacer(1, 30))
    elements.append(create_footer())
    elements.append(PageBreak())
    
    return elements

def build_page4_crosscheck(styles):
    """Page 4: Label ↔ TDS Cross-Check"""
    elements = []
    
    elements.append(create_header(styles, "Label ↔ TDS Cross-Check"))
    elements.append(Spacer(1, 15))
    
    elements.append(Paragraph('<font color="#5B6CFF">Page 4</font> &nbsp; <b>Label ↔ TDS Cross-Check Summary</b>', styles['SectionTitle']))
    elements.append(Spacer(1, 10))
    
    # Matched items
    match_data = [
        [Paragraph('<font color="#22c55e">✓ MATCHED (5)</font>', styles['CardTitle']), ''],
        ['Product Name', Paragraph('<font color="#22c55e">✓ Match</font>', styles['SmallText'])],
        ['Net Quantity', Paragraph('<font color="#22c55e">✓ Match</font>', styles['SmallText'])],
        ['Ingredients Order', Paragraph('<font color="#22c55e">✓ Match</font>', styles['SmallText'])],
        ['Hazelnut %', Paragraph('<font color="#22c55e">✓ Match</font>', styles['SmallText'])],
        ['Allergen List', Paragraph('<font color="#22c55e">✓ Match</font>', styles['SmallText'])],
    ]
    
    match_table = Table(match_data, colWidths=[140, 80])
    match_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), LIGHT_BG),
        ('BOX', (0, 0), (-1, -1), 1, BORDER_COLOR),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('TEXTCOLOR', (0, 1), (0, -1), MUTED_TEXT),
        ('ALIGN', (1, 1), (1, -1), 'RIGHT'),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('SPAN', (0, 0), (1, 0)),
    ]))
    
    # Mismatched items
    mismatch_data = [
        [Paragraph('<font color="#ef4444">✕ MISMATCHED (3)</font>', styles['CardTitle']), ''],
        [Paragraph('Cocoa Solids %<br/><font size="7" color="#f59e0b">⚠ TDS: 32%, Label: not declared</font>', styles['SmallText']), Paragraph('<font color="#ef4444">Mismatch</font>', styles['SmallText'])],
        [Paragraph('Storage Temp<br/><font size="7" color="#f59e0b">⚠ TDS: &lt; 25°C, Label: missing</font>', styles['SmallText']), Paragraph('<font color="#ef4444">Mismatch</font>', styles['SmallText'])],
        [Paragraph('Sugar Content<br/><font size="7" color="#f59e0b">⚠ TDS: 48g, Label: 45g per 100g</font>', styles['SmallText']), Paragraph('<font color="#ef4444">Mismatch</font>', styles['SmallText'])],
    ]
    
    mismatch_table = Table(mismatch_data, colWidths=[170, 60])
    mismatch_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), LIGHT_BG),
        ('BOX', (0, 0), (-1, -1), 1, BORDER_COLOR),
        ('ALIGN', (1, 1), (1, -1), 'RIGHT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('SPAN', (0, 0), (1, 0)),
    ]))
    
    crosscheck_main = Table([[match_table, mismatch_table]], colWidths=[230, 240])
    crosscheck_main.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    elements.append(crosscheck_main)
    elements.append(Spacer(1, 20))
    
    # Category section
    elements.append(Paragraph('CATEGORY-AWARE CHECKS', styles['CardTitle']))
    elements.append(Paragraph('This report applies EU 1169/2011 checks tailored for the <b>Confectionery</b> category.', styles['SmallText']))
    elements.append(Spacer(1, 8))
    
    categories = 'Dairy • Meat & Fish • <b><font color="#1d4ed8">Confectionery ✓</font></b> • Bakery • Beverages • Ready Meals • Oils & Fats • Frozen • Baby Food • Supplements'
    elements.append(Paragraph(categories, styles['SmallText']))
    
    elements.append(Spacer(1, 40))
    elements.append(create_footer())
    elements.append(PageBreak())
    
    return elements

def build_page5_print_pack(styles):
    """Page 5: Print Verification Pack"""
    elements = []
    
    elements.append(create_header(styles, "Print Verification Pack"))
    elements.append(Spacer(1, 15))
    
    elements.append(Paragraph('<font color="#16a34a">Print Pack</font> &nbsp; <b>Print Verification Pack (Pre-Press Checklist)</b>', styles['SectionTitle']))
    elements.append(Spacer(1, 10))
    
    # Sign-off section
    signoff_data = [
        [Paragraph('<font color="#16a34a">📋 VERSIONING & SIGN-OFF</font>', styles['CardTitle']), '', '', ''],
        ['Label Version ID:', '_________________', 'Artwork File Name:', '_________________'],
        ['Print Vendor:', '_________________', 'Approval Owner (QA):', '_________________'],
        ['Date:', '_________________', 'Signature:', '_________________'],
        ['Final Print Run Notes:', '', '', ''],
        ['________________________________________________________________________________________________', '', '', ''],
    ]
    
    signoff_table = Table(signoff_data, colWidths=[100, 110, 100, 110])
    signoff_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f0fdf4')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#bbf7d0')),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('TEXTCOLOR', (0, 1), (-1, -1), MUTED_TEXT),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('SPAN', (0, 0), (3, 0)),
        ('SPAN', (0, 4), (3, 4)),
        ('SPAN', (0, 5), (3, 5)),
    ]))
    elements.append(signoff_table)
    elements.append(Spacer(1, 15))
    
    # Pre-press checklist
    elements.append(Paragraph('PRE-PRESS CHECKLIST', styles['CardTitle']))
    checklist_items = [
        '☐ Mandatory particulars fully in Italian for Italy sale',
        '☐ Allergen emphasis applied consistently (ingredients + contains statements)',
        '☐ QUID declared where ingredients are emphasized (text/imagery)',
        '☐ Net quantity format correct (units/placement/legibility check)',
        '☐ Nutrition declaration complete and formatted correctly (per 100 g)',
        '☐ Operator name + full address present',
        '☐ Lot/expiry placeholders present (if applicable) and legible',
        '☐ Font size/contrast acceptable for print readability',
        '☐ Barcode area clear + quiet zone respected',
        '☐ Language consistency across panels',
        '☐ Claims reviewed (if present) — mark "requires separate verification"',
        '☐ Cross-check with TDS confirms formulation + allergens + nutrition values',
    ]
    
    for item in checklist_items:
        elements.append(Paragraph(item, styles['SmallText']))
    
    elements.append(Spacer(1, 15))
    
    # What to send to printer
    elements.append(Paragraph('WHAT TO SEND TO PRINTER', styles['CardTitle']))
    printer_items = [
        '☐ PDF compliance report',
        '☐ Final artwork proof (PDF)',
        '☐ Supplier TDS version used',
        '☐ Approval email/thread reference',
    ]
    for item in printer_items:
        elements.append(Paragraph(item, styles['SmallText']))
    
    elements.append(Spacer(1, 30))
    elements.append(create_footer())
    elements.append(PageBreak())
    
    return elements

def build_page6_halal(styles):
    """Page 6: Halal Export-Readiness Preflight"""
    elements = []
    
    elements.append(create_header(styles, "Halal Export-Readiness"))
    elements.append(Spacer(1, 15))
    
    elements.append(Paragraph('<font color="#a16207">Optional Module</font> &nbsp; <b>Halal Export-Readiness Preflight</b>', styles['SectionTitle']))
    elements.append(Spacer(1, 6))
    elements.append(Paragraph('Target Market: Malaysia · Certificate: Not provided', styles['SmallText']))
    elements.append(Spacer(1, 10))
    
    halal_checks = [
        ('✕', '#ef4444', 'CRITICAL', 'Halal Certificate Provided', 'No Halal certificate uploaded', 'Obtain valid certificate from accredited body'),
        ('!', '#f59e0b', 'WARNING', 'Certificate Validity / Expiry', 'Cannot verify — certificate not provided', 'Ensure certificate covers production dates'),
        ('!', '#f59e0b', 'WARNING', 'Animal-Derived Ingredient Risk', 'Milk powder present — requires source verification', 'Confirm dairy source meets Halal requirements'),
        ('✓', '#22c55e', 'PASS', 'Gelatin / Enzymes Check', 'No gelatin or animal enzymes declared', ''),
        ('!', '#f59e0b', 'WARNING', 'Alcohol / Solvent Carrier Flags', 'Vanilla flavouring — carrier not specified', 'Confirm non-alcohol carrier with supplier'),
        ('!', '#f59e0b', 'WARNING', 'E-Number Source Verification', 'Soy lecithin (E322) — verify processing', 'Request Halal statement from lecithin supplier'),
        ('✕', '#ef4444', 'CRITICAL', 'Cross-Contamination Statement', 'No dedicated line / cleaning protocol info', 'Obtain facility Halal compliance statement'),
        ('✓', '#22c55e', 'PASS', 'Traceability Fields Complete', 'Lot traceability documented', ''),
        ('!', '#f59e0b', 'WARNING', 'Halal Logo Usage Check', 'No Halal logo present on label', 'Add authorized logo only with valid certification'),
    ]
    
    for icon, color, severity, title, detail, fix in halal_checks:
        sev_color = '#ef4444' if severity == 'CRITICAL' else '#f59e0b' if severity == 'WARNING' else '#22c55e'
        fix_text = f'<br/><font size="7" color="#92400e">Fix: {fix}</font>' if fix else ''
        
        check_data = [[
            Paragraph(f'<font size="12" color="{color}">{icon}</font>', styles['BodyText']),
            Paragraph(f'''
                <b>{title}</b> &nbsp;<font size="7" color="{sev_color}">{severity}</font><br/>
                <font size="8" color="#78716c">{detail}</font>{fix_text}
            ''', styles['SmallText'])
        ]]
        check_table = Table(check_data, colWidths=[25, 435])
        check_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#fefce8')),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#fde68a')),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ]))
        elements.append(check_table)
        elements.append(Spacer(1, 4))
    
    elements.append(Spacer(1, 10))
    
    # Disclaimer
    disclaimer_data = [[
        Paragraph('''<b>Important:</b> Halal determinations depend on the target market, accepted standard, and certification body. 
        This module provides preflight risk flags, not certification.''', styles['SmallText'])
    ]]
    disclaimer_table = Table(disclaimer_data, colWidths=[460])
    disclaimer_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#fef3c7')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#92400e')),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
    ]))
    elements.append(disclaimer_table)
    
    elements.append(Spacer(1, 20))
    elements.append(create_footer())
    elements.append(PageBreak())
    
    return elements

def build_page7_next_steps(styles):
    """Page 7: Next Steps & Audit Trail"""
    elements = []
    
    elements.append(create_header(styles, "Next Steps"))
    elements.append(Spacer(1, 15))
    
    elements.append(Paragraph('<font color="#5B6CFF">Page 7</font> &nbsp; <b>Next Steps & Audit Trail</b>', styles['SectionTitle']))
    elements.append(Spacer(1, 10))
    
    # Next steps
    next_steps_data = [
        [Paragraph('NEXT STEPS CHECKLIST', styles['CardTitle']), ''],
        ['☐', Paragraph('<font color="#3b82f6">P1</font> Fix allergen emphasis + cocoa QUID', styles['SmallText'])],
        ['☐', Paragraph('<font color="#3b82f6">P1</font> Reconcile Label ↔ TDS sugar mismatch', styles['SmallText'])],
        ['☐', Paragraph('<font color="#3b82f6">P2</font> Add %RI to nutrition table', styles['SmallText'])],
        ['☐', Paragraph('<font color="#3b82f6">P2</font> Add storage conditions', styles['SmallText'])],
        ['☐', Paragraph('<font color="#3b82f6">P3</font> Complete print verification sign-off', styles['SmallText'])],
        ['☐', Paragraph('<font color="#3b82f6">P3</font> Resolve Halal certificate gaps (if exporting)', styles['SmallText'])],
    ]
    
    next_steps_table = Table(next_steps_data, colWidths=[20, 200])
    next_steps_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), LIGHT_BG),
        ('BOX', (0, 0), (-1, -1), 1, BORDER_COLOR),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('SPAN', (0, 0), (1, 0)),
    ]))
    
    # Audit trail
    audit_data = [
        [Paragraph('AUDIT TRAIL ARTIFACTS', styles['CardTitle'])],
        [Paragraph('''<font name="Courier" size="8" color="#64748b">/srv/ava/data/runs/SAMPLE-AVA-0001/</font><br/>
<font name="Courier" size="8" color="#94a3b8">├── label.pdf<br/>
├── tds.pdf<br/>
├── evidence_text.txt<br/>
├── request.json<br/>
├── report.json<br/>
└── report.pdf</font>''', styles['SmallText'])],
    ]
    
    audit_table = Table(audit_data, colWidths=[220])
    audit_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), DARK_BG),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
    ]))
    
    main_table = Table([[next_steps_table, audit_table]], colWidths=[235, 230])
    main_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    elements.append(main_table)
    elements.append(Spacer(1, 25))
    
    # Final CTA
    elements.append(Paragraph('READY TO PREFLIGHT YOUR LABELS?', styles['CardTitle']))
    elements.append(Paragraph('This is a sample report. Run your own preflight at nexodify.com', styles['SmallText']))
    elements.append(Spacer(1, 30))
    
    # Footer
    elements.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR))
    elements.append(Spacer(1, 10))
    footer_data = [[
        Paragraph('<font size="8" color="#94a3b8">Nexodify AVA · EU Label Compliance Preflight</font>', styles['SmallText']),
        Paragraph('<font size="8" color="#94a3b8">© 2025 Nexodify. All rights reserved.</font>', styles['SmallText']),
        Paragraph('<font size="8" color="#94a3b8">Confidential · Sample Report</font>', styles['SmallText']),
    ]]
    footer_table = Table(footer_data, colWidths=[160, 160, 160])
    footer_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (0, 0), 'LEFT'),
        ('ALIGN', (1, 0), (1, 0), 'CENTER'),
        ('ALIGN', (2, 0), (2, 0), 'RIGHT'),
    ]))
    elements.append(footer_table)
    
    return elements

def generate_pdf():
    """Generate the complete PDF report"""
    output_path = '/app/frontend/public/sample-report.pdf'
    
    # Create document
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        rightMargin=15*mm,
        leftMargin=15*mm,
        topMargin=15*mm,
        bottomMargin=20*mm,
    )
    
    # Create styles
    styles = create_styles()
    
    # Build all pages
    elements = []
    elements.extend(build_page1_executive_summary(styles))
    elements.extend(build_page2_findings_overview(styles))
    elements.extend(build_page3_evidence_details(styles))
    elements.extend(build_page4_crosscheck(styles))
    elements.extend(build_page5_print_pack(styles))
    elements.extend(build_page6_halal(styles))
    elements.extend(build_page7_next_steps(styles))
    
    # Build PDF
    print("Generating PDF...")
    doc.build(elements)
    
    # Verify
    file_size = os.path.getsize(output_path)
    print(f"✅ PDF generated successfully: {output_path}")
    print(f"   File size: {file_size / 1024:.1f} KB")

if __name__ == '__main__':
    generate_pdf()
