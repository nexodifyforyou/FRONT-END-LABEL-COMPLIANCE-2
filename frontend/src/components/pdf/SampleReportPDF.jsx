import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Svg,
  Path,
  Link,
} from '@react-pdf/renderer';

// Register fonts (using system fonts for compatibility)
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hjp-Ek-_EeA.woff2', fontWeight: 500 },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hjp-Ek-_EeA.woff2', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hjp-Ek-_EeA.woff2', fontWeight: 700 },
  ],
});

// Colors
const colors = {
  bg0: '#070A12',
  bg1: '#0B1020',
  surface: 'rgba(255,255,255,0.04)',
  surfaceLight: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.10)',
  borderLight: 'rgba(255,255,255,0.14)',
  textPrimary: 'rgba(255,255,255,0.92)',
  textSecondary: 'rgba(255,255,255,0.72)',
  textMuted: 'rgba(255,255,255,0.55)',
  textDim: 'rgba(255,255,255,0.40)',
  accent: '#5B6CFF',
  accentLight: 'rgba(91,108,255,0.15)',
  critical: '#F43F5E',
  criticalBg: 'rgba(244,63,94,0.15)',
  warning: '#F59E0B',
  warningBg: 'rgba(245,158,11,0.15)',
  pass: '#10B981',
  passBg: 'rgba(16,185,129,0.15)',
  white: '#FFFFFF',
};

// Styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.bg0,
    paddingTop: 50,
    paddingBottom: 60,
    paddingHorizontal: 50,
    fontFamily: 'Inter',
    fontSize: 10,
    color: colors.textSecondary,
  },
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerLogoText: {
    fontSize: 14,
    fontWeight: 600,
    color: colors.textPrimary,
  },
  headerTitle: {
    fontSize: 10,
    color: colors.textMuted,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 50,
    right: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  footerText: {
    fontSize: 8,
    color: colors.textDim,
  },
  // Cards
  card: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  cardSmall: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    padding: 12,
  },
  // Typography
  h1: {
    fontSize: 28,
    fontWeight: 700,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  h2: {
    fontSize: 18,
    fontWeight: 600,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  h3: {
    fontSize: 14,
    fontWeight: 600,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  h4: {
    fontSize: 11,
    fontWeight: 600,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 20,
  },
  label: {
    fontSize: 8,
    fontWeight: 500,
    color: colors.textDim,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  body: {
    fontSize: 10,
    color: colors.textSecondary,
    lineHeight: 1.5,
  },
  bodySmall: {
    fontSize: 9,
    color: colors.textMuted,
    lineHeight: 1.4,
  },
  // Chips
  chipRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  chipCritical: {
    backgroundColor: colors.criticalBg,
    borderWidth: 1,
    borderColor: 'rgba(244,63,94,0.3)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  chipWarning: {
    backgroundColor: colors.warningBg,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.3)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  chipPass: {
    backgroundColor: colors.passBg,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.3)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  chipSource: {
    backgroundColor: colors.accentLight,
    borderWidth: 1,
    borderColor: 'rgba(91,108,255,0.3)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  chipTextCritical: {
    fontSize: 8,
    fontWeight: 500,
    color: colors.critical,
  },
  chipTextWarning: {
    fontSize: 8,
    fontWeight: 500,
    color: colors.warning,
  },
  chipTextPass: {
    fontSize: 8,
    fontWeight: 500,
    color: colors.pass,
  },
  chipTextSource: {
    fontSize: 8,
    fontWeight: 500,
    color: colors.accent,
  },
  // Grid
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  col2: {
    flex: 1,
  },
  // Score
  scoreCard: {
    backgroundColor: colors.bg1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 700,
    color: colors.warning,
  },
  scoreLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  // Counters
  countersRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  counterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  counterText: {
    fontSize: 11,
    fontWeight: 500,
  },
  // Evidence box
  evidenceBox: {
    backgroundColor: colors.bg1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    padding: 12,
    marginVertical: 8,
  },
  evidenceText: {
    fontSize: 9,
    color: colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 1.5,
  },
  highlight: {
    color: colors.accent,
    fontWeight: 600,
  },
  // List
  listItem: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingLeft: 4,
  },
  listBullet: {
    width: 16,
    fontSize: 10,
    color: colors.accent,
  },
  listText: {
    flex: 1,
    fontSize: 10,
    color: colors.textSecondary,
    lineHeight: 1.4,
  },
  // Table
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 8,
  },
  tableLabel: {
    width: 140,
    fontSize: 9,
    color: colors.textMuted,
  },
  tableValue: {
    flex: 1,
    fontSize: 10,
    color: colors.textPrimary,
    fontWeight: 500,
  },
  // Section divider
  sectionDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 20,
  },
  // Page title
  pageTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: colors.textPrimary,
    marginBottom: 20,
  },
  // Accent line
  accentLine: {
    width: 40,
    height: 3,
    backgroundColor: colors.accent,
    borderRadius: 2,
    marginBottom: 16,
  },
  // Match indicators
  matchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  matchField: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  matchChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  matchText: {
    fontSize: 8,
    fontWeight: 500,
  },
});

// Shield icon component
const ShieldIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24">
    <Path
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      stroke={colors.accent}
      strokeWidth="2"
      fill="none"
    />
    <Path
      d="M9 12l2 2 4-4"
      stroke={colors.accent}
      strokeWidth="2"
      fill="none"
    />
  </Svg>
);

// Severity Chip component
const SeverityChip = ({ level }) => {
  const chipStyle = level === 'critical' ? styles.chipCritical : level === 'warning' ? styles.chipWarning : styles.chipPass;
  const textStyle = level === 'critical' ? styles.chipTextCritical : level === 'warning' ? styles.chipTextWarning : styles.chipTextPass;
  const label = level.charAt(0).toUpperCase() + level.slice(1);
  
  return (
    <View style={chipStyle}>
      <Text style={textStyle}>{label}</Text>
    </View>
  );
};

// Source Chip component
const SourceChip = ({ source }) => (
  <View style={styles.chipSource}>
    <Text style={styles.chipTextSource}>{source}</Text>
  </View>
);

// Header component
const Header = () => (
  <View style={styles.header}>
    <View style={styles.headerLogo}>
      <ShieldIcon />
      <Text style={styles.headerLogoText}>Nexodify AVA</Text>
    </View>
    <Text style={styles.headerTitle}>EU Label Compliance Preflight Report</Text>
  </View>
);

// Footer component
const Footer = ({ pageNumber }) => (
  <View style={styles.footer}>
    <Text style={styles.footerText}>Run ID: SAMPLE-AVA-0001</Text>
    <Text style={styles.footerText}>Generated: January 5, 2025 at 14:32 UTC</Text>
    <Text style={styles.footerText}>Page {pageNumber}</Text>
  </View>
);

// Finding Card component
const FindingCard = ({ title, severity, source, impact, fix }) => (
  <View style={styles.cardSmall}>
    <View style={[styles.chipRow, { marginBottom: 6 }]}>
      <SeverityChip level={severity} />
      <SourceChip source={source} />
    </View>
    <Text style={styles.h4}>{title}</Text>
    <Text style={[styles.bodySmall, { marginBottom: 4 }]}>{impact}</Text>
    <Text style={[styles.bodySmall, { color: colors.textDim }]}>Fix: {fix}</Text>
  </View>
);

// Page 1: Executive Summary
const ExecutiveSummary = () => (
  <Page size="A4" style={styles.page}>
    <Header />
    
    <View style={styles.accentLine} />
    <Text style={styles.h1}>EU Label Compliance,</Text>
    <Text style={[styles.h1, { color: colors.accent, marginBottom: 8 }]}>Preflighted.</Text>
    <Text style={styles.subtitle}>
      Automated compliance verification against Regulation (EU) 1169/2011
    </Text>
    
    {/* Product Info Card */}
    <View style={styles.card}>
      <Text style={styles.label}>Product Information</Text>
      <View style={styles.tableRow}>
        <Text style={styles.tableLabel}>Product Name</Text>
        <Text style={styles.tableValue}>Omega-3 Capsules 1000mg</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableLabel}>Company</Text>
        <Text style={styles.tableValue}>Example Nutrition S.r.l.</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableLabel}>Country of Sale</Text>
        <Text style={styles.tableValue}>Italy</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableLabel}>Languages Provided</Text>
        <Text style={styles.tableValue}>Italian, English</Text>
      </View>
      <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
        <Text style={styles.tableLabel}>Run ID</Text>
        <Text style={[styles.tableValue, { fontFamily: 'Courier' }]}>SAMPLE-AVA-0001</Text>
      </View>
    </View>
    
    {/* Score Card */}
    <View style={styles.scoreCard}>
      <View>
        <Text style={styles.label}>Compliance Score</Text>
        <Text style={styles.scoreValue}>72%</Text>
        <Text style={styles.scoreLabel}>Issues require attention</Text>
      </View>
      <View>
        <View style={styles.countersRow}>
          <View style={styles.counter}>
            <View style={[styles.counterDot, { backgroundColor: colors.critical }]} />
            <Text style={[styles.counterText, { color: colors.critical }]}>3 Critical</Text>
          </View>
        </View>
        <View style={styles.countersRow}>
          <View style={styles.counter}>
            <View style={[styles.counterDot, { backgroundColor: colors.warning }]} />
            <Text style={[styles.counterText, { color: colors.warning }]}>5 Warnings</Text>
          </View>
        </View>
        <View style={styles.countersRow}>
          <View style={styles.counter}>
            <View style={[styles.counterDot, { backgroundColor: colors.pass }]} />
            <Text style={[styles.counterText, { color: colors.pass }]}>12 Passed</Text>
          </View>
        </View>
      </View>
    </View>
    
    {/* What was checked */}
    <View style={styles.card}>
      <Text style={styles.h3}>What was checked</Text>
      <View style={styles.listItem}>
        <Text style={styles.listBullet}>•</Text>
        <Text style={styles.listText}>Mandatory particulars (Article 9): name, ingredients, allergens, net quantity, date marking, operator</Text>
      </View>
      <View style={styles.listItem}>
        <Text style={styles.listBullet}>•</Text>
        <Text style={styles.listText}>Allergen emphasis requirements (Article 21, Annex II)</Text>
      </View>
      <View style={styles.listItem}>
        <Text style={styles.listBullet}>•</Text>
        <Text style={styles.listText}>QUID requirements for characterising ingredients (Article 22)</Text>
      </View>
      <View style={styles.listItem}>
        <Text style={styles.listBullet}>•</Text>
        <Text style={styles.listText}>Nutrition declaration format and values (Articles 29-35)</Text>
      </View>
      <View style={styles.listItem}>
        <Text style={styles.listBullet}>•</Text>
        <Text style={styles.listText}>Label ↔ TDS cross-check for consistency</Text>
      </View>
    </View>
    
    {/* Disclaimer */}
    <View style={{ marginTop: 'auto' }}>
      <Text style={[styles.bodySmall, { color: colors.textDim, textAlign: 'center' }]}>
        Sample format preview only. This report does not constitute legal advice. 
        Consult qualified regulatory professionals for compliance decisions.
      </Text>
    </View>
    
    <Footer pageNumber={1} />
  </Page>
);

// Page 2: Findings Overview
const FindingsOverview = () => (
  <Page size="A4" style={styles.page}>
    <Header />
    
    <Text style={styles.pageTitle}>Findings Overview</Text>
    <Text style={[styles.body, { marginBottom: 20 }]}>
      8 issues identified across label and technical data sheet analysis.
    </Text>
    
    <View style={styles.row}>
      <View style={styles.col2}>
        <FindingCard
          title="Allergen emphasis missing"
          severity="critical"
          source="Label"
          impact="Allergens not visually distinguished in ingredients list"
          fix="Apply bold, CAPS, or underline to allergen names"
        />
        <FindingCard
          title="QUID percentage absent"
          severity="critical"
          source="Label"
          impact="Fish oil content not quantified despite prominence"
          fix="Add percentage declaration for fish oil"
        />
        <FindingCard
          title="Nutrition table incomplete"
          severity="warning"
          source="Label"
          impact="Missing %RI values for declared nutrients"
          fix="Add Reference Intake percentages per Article 32"
        />
        <FindingCard
          title="Operator address incomplete"
          severity="warning"
          source="Label"
          impact="Business operator details lack full postal address"
          fix="Include complete address with postal code"
        />
      </View>
      <View style={styles.col2}>
        <FindingCard
          title="Net quantity format inconsistent"
          severity="warning"
          source="Label"
          impact="Metric symbol placement non-standard"
          fix="Use 'e' symbol correctly with metric units"
        />
        <FindingCard
          title="Language mismatch"
          severity="critical"
          source="Label"
          impact="Storage instructions only in English for Italian market"
          fix="Provide Italian translation for all mandatory info"
        />
        <FindingCard
          title="Storage conditions missing"
          severity="warning"
          source="TDS"
          impact="No storage temperature specified for shelf life"
          fix="Add specific storage conditions (e.g., 'Store below 25°C')"
        />
        <FindingCard
          title="Claim wording verification"
          severity="warning"
          source="Label"
          impact="Health claim present; authorization status unclear"
          fix="Verify claim against EU Register of health claims"
        />
      </View>
    </View>
    
    <Footer pageNumber={2} />
  </Page>
);

// Page 3: Evidence & Fix Details (Part 1)
const EvidenceDetails1 = () => (
  <Page size="A4" style={styles.page}>
    <Header />
    
    <Text style={styles.pageTitle}>Evidence & Fix Details</Text>
    
    {/* Finding 1 */}
    <View style={styles.card}>
      <View style={[styles.chipRow, { marginBottom: 8 }]}>
        <SeverityChip level="critical" />
        <SourceChip source="Label" />
      </View>
      <Text style={styles.h3}>Allergen Emphasis Missing</Text>
      <Text style={styles.body}>
        Regulation (EU) 1169/2011 Article 21 requires allergens to be emphasised through typeset 
        that clearly distinguishes them from the rest of the ingredients list.
      </Text>
      
      <View style={styles.evidenceBox}>
        <Text style={styles.label}>Evidence (Label excerpt)</Text>
        <Text style={styles.evidenceText}>
          "Ingredients: Fish oil, gelatin capsule (bovine gelatin, glycerol), 
          <Text style={styles.highlight}> soy</Text> lecithin, mixed tocopherols. Contains: 
          <Text style={styles.highlight}> fish, soy</Text>."
        </Text>
        <Text style={[styles.bodySmall, { marginTop: 8, color: colors.textDim }]}>
          ↳ Allergens "soy" and "fish" appear in regular typeface, not distinguished
        </Text>
      </View>
      
      <View style={[styles.card, { backgroundColor: colors.bg1, marginTop: 12 }]}>
        <Text style={styles.label}>Recommended Fix</Text>
        <View style={[styles.listItem, { marginTop: 8 }]}>
          <Text style={styles.listBullet}>1.</Text>
          <Text style={styles.listText}>Update ingredients list to emphasize allergens using CAPITALS: "...FISH oil, gelatin capsule..."</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.listBullet}>2.</Text>
          <Text style={styles.listText}>Alternatively, use bold typeface for allergen names throughout</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.listBullet}>3.</Text>
          <Text style={styles.listText}>Ensure "Contains:" statement also uses emphasised text</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.listBullet}>4.</Text>
          <Text style={styles.listText}>Apply consistently across all label languages</Text>
        </View>
      </View>
      
      <Text style={[styles.bodySmall, { marginTop: 12, color: colors.textDim }]}>
        Reference: Regulation (EU) 1169/2011, Article 21(1)(b), Annex II
      </Text>
    </View>
    
    {/* Finding 2 */}
    <View style={styles.card}>
      <View style={[styles.chipRow, { marginBottom: 8 }]}>
        <SeverityChip level="critical" />
        <SourceChip source="Label" />
      </View>
      <Text style={styles.h3}>QUID Percentage Absent</Text>
      <Text style={styles.body}>
        When an ingredient is highlighted in the product name or by emphasis, its quantity 
        must be declared as a percentage (QUID - Quantitative Ingredient Declaration).
      </Text>
      
      <View style={styles.evidenceBox}>
        <Text style={styles.label}>Evidence (Label excerpt)</Text>
        <Text style={styles.evidenceText}>
          Product name: "<Text style={styles.highlight}>Omega-3</Text> Capsules 1000mg"
          {'\n'}Ingredients: "Fish oil, gelatin capsule..."
          {'\n\n'}↳ No percentage given for fish oil / omega-3 content
        </Text>
      </View>
      
      <View style={[styles.card, { backgroundColor: colors.bg1, marginTop: 12 }]}>
        <Text style={styles.label}>Recommended Fix</Text>
        <View style={[styles.listItem, { marginTop: 8 }]}>
          <Text style={styles.listBullet}>1.</Text>
          <Text style={styles.listText}>Add percentage of fish oil in ingredients: "Fish oil (72%), gelatin capsule..."</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.listBullet}>2.</Text>
          <Text style={styles.listText}>Verify percentage against TDS specification</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.listBullet}>3.</Text>
          <Text style={styles.listText}>Consider adding EPA/DHA content per capsule in nutrition panel</Text>
        </View>
      </View>
      
      <Text style={[styles.bodySmall, { marginTop: 12, color: colors.textDim }]}>
        Reference: Regulation (EU) 1169/2011, Article 22, Annex VIII
      </Text>
    </View>
    
    <Footer pageNumber={3} />
  </Page>
);

// Page 4: Evidence & Fix Details (Part 2)
const EvidenceDetails2 = () => (
  <Page size="A4" style={styles.page}>
    <Header />
    
    <Text style={styles.pageTitle}>Evidence & Fix Details (continued)</Text>
    
    {/* Finding 3 */}
    <View style={styles.card}>
      <View style={[styles.chipRow, { marginBottom: 8 }]}>
        <SeverityChip level="critical" />
        <SourceChip source="Label" />
      </View>
      <Text style={styles.h3}>Language Mismatch for Country of Sale</Text>
      <Text style={styles.body}>
        For products sold in Italy, mandatory particulars must be provided in Italian. 
        Some required information appears only in English.
      </Text>
      
      <View style={styles.evidenceBox}>
        <Text style={styles.label}>Evidence (Label excerpt)</Text>
        <Text style={styles.evidenceText}>
          Storage instructions: "<Text style={styles.highlight}>Store in a cool, dry place away from direct sunlight.</Text>"
          {'\n'}Usage directions: "<Text style={styles.highlight}>Take 1-2 capsules daily with food.</Text>"
          {'\n\n'}↳ Both statements in English only; Italian translation absent
        </Text>
      </View>
      
      <View style={styles.evidenceBox}>
        <Text style={styles.label}>Evidence (TDS excerpt)</Text>
        <Text style={styles.evidenceText}>
          Target markets: "IT, DE, FR, ES"
          {'\n'}Label languages: "EN" (English only)
          {'\n\n'}↳ TDS confirms English-only label for multi-country distribution
        </Text>
      </View>
      
      <View style={[styles.card, { backgroundColor: colors.bg1, marginTop: 12 }]}>
        <Text style={styles.label}>Recommended Fix</Text>
        <View style={[styles.listItem, { marginTop: 8 }]}>
          <Text style={styles.listBullet}>1.</Text>
          <Text style={styles.listText}>Add Italian translations for all mandatory particulars</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.listBullet}>2.</Text>
          <Text style={styles.listText}>Storage: "Conservare in luogo fresco e asciutto, al riparo dalla luce diretta."</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.listBullet}>3.</Text>
          <Text style={styles.listText}>Usage: "Assumere 1-2 capsule al giorno con il cibo."</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.listBullet}>4.</Text>
          <Text style={styles.listText}>Update TDS to reflect bilingual label</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.listBullet}>5.</Text>
          <Text style={styles.listText}>Consider separate SKU or multi-language label for each market</Text>
        </View>
      </View>
      
      <Text style={[styles.bodySmall, { marginTop: 12, color: colors.textDim }]}>
        Reference: Regulation (EU) 1169/2011, Article 15(1) — Member State language requirements
      </Text>
    </View>
    
    <View style={styles.sectionDivider} />
    
    {/* Additional context */}
    <View style={styles.card}>
      <Text style={styles.h3}>Severity Classification</Text>
      <Text style={[styles.body, { marginBottom: 12 }]}>
        Findings are classified based on regulatory impact and consumer safety implications:
      </Text>
      <View style={styles.listItem}>
        <View style={[styles.counterDot, { backgroundColor: colors.critical, marginRight: 8, marginTop: 3 }]} />
        <Text style={styles.listText}>
          <Text style={{ fontWeight: 600, color: colors.critical }}>Critical:</Text> Direct violation of mandatory requirements; potential enforcement action or consumer safety concern
        </Text>
      </View>
      <View style={styles.listItem}>
        <View style={[styles.counterDot, { backgroundColor: colors.warning, marginRight: 8, marginTop: 3 }]} />
        <Text style={styles.listText}>
          <Text style={{ fontWeight: 600, color: colors.warning }}>Warning:</Text> Non-compliance that may require correction; lower immediate risk but should be addressed
        </Text>
      </View>
      <View style={styles.listItem}>
        <View style={[styles.counterDot, { backgroundColor: colors.pass, marginRight: 8, marginTop: 3 }]} />
        <Text style={styles.listText}>
          <Text style={{ fontWeight: 600, color: colors.pass }}>Pass:</Text> Requirement met; no action needed
        </Text>
      </View>
    </View>
    
    <Footer pageNumber={4} />
  </Page>
);

// Page 5: Cross-Check Summary
const CrossCheckSummary = () => (
  <Page size="A4" style={styles.page}>
    <Header />
    
    <Text style={styles.pageTitle}>Label ↔ TDS Cross-Check</Text>
    <Text style={[styles.body, { marginBottom: 20 }]}>
      Automated comparison between label declarations and Technical Data Sheet specifications.
    </Text>
    
    {/* Matched Fields */}
    <View style={styles.card}>
      <Text style={styles.h3}>Matched Fields</Text>
      <Text style={[styles.bodySmall, { marginBottom: 12 }]}>
        The following declarations are consistent between Label and TDS:
      </Text>
      
      {[
        { field: 'Product Name', status: 'match' },
        { field: 'Net Quantity (1000mg × 60 capsules)', status: 'match' },
        { field: 'Ingredients Order', status: 'match' },
        { field: 'Best Before Format', status: 'match' },
        { field: 'Capsule Count', status: 'match' },
      ].map((item, i) => (
        <View key={i} style={styles.matchRow}>
          <Text style={styles.matchField}>{item.field}</Text>
          <View style={[styles.matchChip, { backgroundColor: colors.passBg, borderWidth: 1, borderColor: 'rgba(16,185,129,0.3)' }]}>
            <Text style={[styles.matchText, { color: colors.pass }]}>✓ Match</Text>
          </View>
        </View>
      ))}
    </View>
    
    {/* Mismatched Fields */}
    <View style={styles.card}>
      <Text style={styles.h3}>Mismatched Fields</Text>
      <Text style={[styles.bodySmall, { marginBottom: 12 }]}>
        Discrepancies requiring reconciliation:
      </Text>
      
      {[
        { field: 'Allergen List', label: 'Fish, Soy', tds: 'Fish, Soy, Shellfish', note: 'TDS includes shellfish not on label' },
        { field: 'EPA Content', label: '180mg', tds: '200mg', note: 'Label shows lower value than spec' },
        { field: 'Storage Temperature', label: 'Not specified', tds: '< 25°C', note: 'TDS has temp; label missing' },
      ].map((item, i) => (
        <View key={i} style={[styles.card, { backgroundColor: colors.bg1, marginBottom: 8, padding: 12 }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={[styles.h4, { marginBottom: 0 }]}>{item.field}</Text>
            <View style={[styles.matchChip, { backgroundColor: colors.criticalBg, borderWidth: 1, borderColor: 'rgba(244,63,94,0.3)' }]}>
              <Text style={[styles.matchText, { color: colors.critical }]}>Mismatch</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 20 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Label</Text>
              <Text style={styles.body}>{item.label}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>TDS</Text>
              <Text style={styles.body}>{item.tds}</Text>
            </View>
          </View>
          <Text style={[styles.bodySmall, { marginTop: 8, color: colors.warning }]}>
            ⚠ {item.note}
          </Text>
        </View>
      ))}
    </View>
    
    {/* Reconciliation Steps */}
    <View style={styles.card}>
      <Text style={styles.h3}>Recommended Reconciliation Steps</Text>
      <View style={[styles.listItem, { marginTop: 8 }]}>
        <Text style={styles.listBullet}>1.</Text>
        <Text style={styles.listText}>Review TDS shellfish cross-contact status; if applicable, add to label allergen statement</Text>
      </View>
      <View style={styles.listItem}>
        <Text style={styles.listBullet}>2.</Text>
        <Text style={styles.listText}>Confirm EPA content with supplier CoA; update label or TDS to match actual specification</Text>
      </View>
      <View style={styles.listItem}>
        <Text style={styles.listBullet}>3.</Text>
        <Text style={styles.listText}>Add storage temperature to label based on TDS stability data</Text>
      </View>
      <View style={styles.listItem}>
        <Text style={styles.listBullet}>4.</Text>
        <Text style={styles.listText}>Re-run preflight after corrections to verify alignment</Text>
      </View>
    </View>
    
    <Footer pageNumber={5} />
  </Page>
);

// Page 6: Next Steps & Audit Trail
const NextStepsAuditTrail = () => (
  <Page size="A4" style={styles.page}>
    <Header />
    
    <Text style={styles.pageTitle}>Next Steps & Audit Trail</Text>
    
    {/* Next Steps Checklist */}
    <View style={styles.card}>
      <Text style={styles.h3}>Next Steps Checklist</Text>
      <Text style={[styles.bodySmall, { marginBottom: 12 }]}>
        Priority actions to achieve compliance:
      </Text>
      
      {[
        { priority: 'P1', task: 'Address Critical findings: allergen emphasis, QUID, language translation', done: false },
        { priority: 'P1', task: 'Reconcile Label ↔ TDS mismatches with supplier/formulator', done: false },
        { priority: 'P2', task: 'Update nutrition table with %RI values', done: false },
        { priority: 'P2', task: 'Complete operator address with full postal details', done: false },
        { priority: 'P3', task: 'Verify health claim authorization status in EU Register', done: false },
        { priority: 'P3', task: 'Re-run preflight to confirm corrections', done: false },
      ].map((item, i) => (
        <View key={i} style={[styles.listItem, { paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.border }]}>
          <View style={{ width: 14, height: 14, borderWidth: 1, borderColor: colors.border, borderRadius: 3, marginRight: 10 }} />
          <View style={[styles.chipSource, { marginRight: 8, paddingHorizontal: 6, paddingVertical: 2 }]}>
            <Text style={[styles.chipTextSource, { fontSize: 7 }]}>{item.priority}</Text>
          </View>
          <Text style={[styles.listText, { flex: 1 }]}>{item.task}</Text>
        </View>
      ))}
    </View>
    
    {/* Audit Trail */}
    <View style={styles.card}>
      <Text style={styles.h3}>Audit Trail</Text>
      <Text style={[styles.body, { marginBottom: 12 }]}>
        This preflight run created the following artifacts for your records:
      </Text>
      
      <View style={[styles.card, { backgroundColor: colors.bg1 }]}>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Original Uploads</Text>
          <Text style={styles.tableValue}>label.pdf, tds.pdf</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Extracted Text</Text>
          <Text style={styles.tableValue}>label_text.txt, tds_text.txt, evidence_text.txt</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Request Payload</Text>
          <Text style={styles.tableValue}>request.json</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Report Data</Text>
          <Text style={styles.tableValue}>report.json</Text>
        </View>
        <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.tableLabel}>PDF Report</Text>
          <Text style={styles.tableValue}>report.pdf (this document)</Text>
        </View>
      </View>
      
      <Text style={[styles.bodySmall, { marginTop: 12 }]}>
        In production, artifacts are stored at:
      </Text>
      <View style={[styles.evidenceBox, { marginTop: 8 }]}>
        <Text style={{ fontFamily: 'Courier', fontSize: 9, color: colors.accent }}>
          /srv/ava/data/runs/SAMPLE-AVA-0001/
        </Text>
      </View>
    </View>
    
    {/* Disclaimer */}
    <View style={[styles.card, { backgroundColor: colors.accentLight, borderColor: 'rgba(91,108,255,0.3)' }]}>
      <Text style={[styles.h4, { color: colors.accent }]}>Important Notice</Text>
      <Text style={[styles.body, { marginTop: 4 }]}>
        This report is an automated preflight check and does not guarantee regulatory compliance. 
        Final compliance responsibility rests with the food business operator. For complex cases, 
        consult qualified food law professionals or contact the relevant national competent authority.
      </Text>
    </View>
    
    {/* Contact */}
    <View style={{ marginTop: 'auto', textAlign: 'center' }}>
      <Text style={[styles.bodySmall, { color: colors.textDim }]}>
        Questions about this report? Contact support@nexodify.com
      </Text>
      <Text style={[styles.bodySmall, { color: colors.textDim, marginTop: 4 }]}>
        © 2025 Nexodify. All rights reserved.
      </Text>
    </View>
    
    <Footer pageNumber={6} />
  </Page>
);

// Main Document
const SampleReportPDF = () => (
  <Document
    title="Nexodify AVA - EU Label Compliance Preflight Report (Sample)"
    author="Nexodify AVA"
    subject="Sample compliance report for Omega-3 Capsules"
    keywords="EU 1169/2011, food labelling, compliance, preflight"
  >
    <ExecutiveSummary />
    <FindingsOverview />
    <EvidenceDetails1 />
    <EvidenceDetails2 />
    <CrossCheckSummary />
    <NextStepsAuditTrail />
  </Document>
);

export default SampleReportPDF;
