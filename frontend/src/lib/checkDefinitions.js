/**
 * Halal Check Definitions - Single Source of Truth
 * Used by: Landing page sample, Run wizard, Interactive report
 * 
 * DO NOT hardcode check text elsewhere - always import from here
 */

export const HALAL_CHECK_DEFINITIONS = [
  {
    id: 'halal_certificate_provided',
    title: 'Halal Certificate Provided',
    description: 'Valid Halal certificate uploaded and verified',
    category: 'documentation',
    defaultSeverity: 'critical',
    whatToProvide: 'Provide a valid Halal certificate from an accredited certification body',
    whyItMatters: 'Export markets require proof of Halal certification from recognized bodies',
  },
  {
    id: 'certificate_expiry_valid',
    title: 'Certificate Expiry Valid',
    description: 'Certificate validity period covers production dates',
    category: 'documentation',
    defaultSeverity: 'warning',
    whatToProvide: 'Ensure certificate is current and covers your production timeline',
    whyItMatters: 'Expired certificates invalidate Halal status for export',
  },
  {
    id: 'certifying_body_recognized',
    title: 'Certifying Body Recognized',
    description: 'Issuing body is recognized in target export market',
    category: 'documentation',
    defaultSeverity: 'warning',
    whatToProvide: 'Verify your certifier is accepted by JAKIM (Malaysia), MUI (Indonesia), etc.',
    whyItMatters: 'Not all certification bodies are accepted in all markets',
  },
  {
    id: 'gelatin_source_declaration',
    title: 'Gelatin Source Declaration',
    description: 'Gelatin source is declared and verified as Halal-compliant',
    category: 'ingredients',
    defaultSeverity: 'critical',
    whatToProvide: 'Supplier declaration confirming plant or fish-based gelatin source',
    whyItMatters: 'Porcine gelatin is strictly prohibited; bovine requires slaughter verification',
  },
  {
    id: 'animal_derived_ingredients',
    title: 'Animal-Derived Ingredient Risk',
    description: 'All animal-derived ingredients identified and verified',
    category: 'ingredients',
    defaultSeverity: 'warning',
    whatToProvide: 'Supplier statements for all animal-derived ingredients confirming Halal source',
    whyItMatters: 'Meat, dairy, and derivatives require Halal slaughter/processing verification',
  },
  {
    id: 'e_number_source_verification',
    title: 'E-Number Source Verification',
    description: 'E-numbers verified for animal-derived origins',
    category: 'ingredients',
    defaultSeverity: 'warning',
    whatToProvide: 'Supplier statements for E120, E441, E471, E472, E542, E904, E920',
    whyItMatters: 'Many E-numbers can be animal-derived; source verification required',
  },
  {
    id: 'alcohol_solvent_carrier',
    title: 'Alcohol / Solvent / Carrier Flags',
    description: 'Flavourings and carriers checked for alcohol content',
    category: 'ingredients',
    defaultSeverity: 'warning',
    whatToProvide: 'Supplier spec sheets confirming non-alcohol carriers for flavourings',
    whyItMatters: 'Alcohol as carrier in flavourings may render product non-Halal',
  },
  {
    id: 'cross_contamination_statement',
    title: 'Cross-Contamination Statement',
    description: 'Facility cross-contamination controls documented',
    category: 'processing',
    defaultSeverity: 'critical',
    whatToProvide: 'Facility statement on dedicated lines or cleaning protocols between runs',
    whyItMatters: 'Shared equipment with non-Halal products creates contamination risk',
  },
  {
    id: 'traceability_fields',
    title: 'Traceability Fields Complete',
    description: 'Lot codes and supplier traceability documented',
    category: 'documentation',
    defaultSeverity: 'low',
    whatToProvide: 'Ensure lot codes link to supplier batches for full traceability',
    whyItMatters: 'Traceability is required for audit and recall scenarios',
  },
  {
    id: 'halal_logo_usage',
    title: 'Halal Logo Usage Check',
    description: 'Halal logo on label matches valid certification',
    category: 'labeling',
    defaultSeverity: 'warning',
    whatToProvide: 'Only display authorized Halal logo with active certification',
    whyItMatters: 'Unauthorized logo use is illegal and can result in export bans',
  },
];

// Get severity color classes
export const getSeverityColor = (severity) => {
  const colors = {
    critical: {
      bg: 'bg-rose-500/20',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      badge: 'High',
      icon: '⛔',
    },
    high: {
      bg: 'bg-rose-500/20',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      badge: 'High',
      icon: '⛔',
    },
    warning: {
      bg: 'bg-amber-500/20',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      badge: 'Medium',
      icon: '⚠️',
    },
    medium: {
      bg: 'bg-amber-500/20',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      badge: 'Medium',
      icon: '⚠️',
    },
    low: {
      bg: 'bg-emerald-500/20',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      badge: 'Low',
      icon: '✅',
    },
    pass: {
      bg: 'bg-emerald-500/20',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      badge: 'Pass',
      icon: '✅',
    },
    not_evaluated: {
      bg: 'bg-slate-500/20',
      text: 'text-slate-400',
      border: 'border-slate-500/30',
      badge: 'Not Evaluated',
      icon: '○',
    },
  };
  return colors[severity] || colors.warning;
};

// Sample checks for landing page (subset with predetermined results)
export const HALAL_SAMPLE_CHECKS = [
  { ...HALAL_CHECK_DEFINITIONS.find(c => c.id === 'halal_certificate_provided'), sampleResult: 'pass' },
  { ...HALAL_CHECK_DEFINITIONS.find(c => c.id === 'certificate_expiry_valid'), sampleResult: 'warning' },
  { ...HALAL_CHECK_DEFINITIONS.find(c => c.id === 'gelatin_source_declaration'), sampleResult: 'critical' },
  { ...HALAL_CHECK_DEFINITIONS.find(c => c.id === 'e_number_source_verification'), sampleResult: 'warning' },
];

// Generate mock Halal check results for a run
export const generateHalalCheckResults = () => {
  return HALAL_CHECK_DEFINITIONS.map(check => {
    const random = Math.random();
    let status;
    if (random < 0.3) status = 'pass';
    else if (random < 0.6) status = 'warning';
    else if (random < 0.85) status = 'critical';
    else status = 'not_evaluated';
    
    return {
      ...check,
      status,
      evaluated: status !== 'not_evaluated',
    };
  });
};

// EU Check definitions for consistency
export const EU_CHECK_DEFINITIONS = [
  {
    id: 'allergen_emphasis',
    title: 'Allergen Emphasis',
    description: 'Allergens distinguished in ingredients list (bold/caps)',
    source: 'Label',
    reference: 'Article 21(1)(b), Annex II',
  },
  {
    id: 'quid_percentage',
    title: 'QUID Percentage',
    description: 'Quantitative ingredient declaration where required',
    source: 'Label',
    reference: 'Article 22',
  },
  {
    id: 'net_quantity_format',
    title: 'Net Quantity Format',
    description: 'Net quantity declared with correct units and ℮ symbol',
    source: 'Label',
    reference: 'Article 23',
  },
  {
    id: 'nutrition_declaration',
    title: 'Nutrition Declaration',
    description: 'Mandatory nutrition information present and formatted',
    source: 'Label',
    reference: 'Article 30-35',
  },
  {
    id: 'nutrition_ri_percentage',
    title: 'Nutrition %RI',
    description: 'Reference Intake percentages where declared',
    source: 'Label',
    reference: 'Article 32',
  },
  {
    id: 'storage_conditions',
    title: 'Storage Conditions',
    description: 'Storage and use conditions specified',
    source: 'TDS',
    reference: 'Article 25',
  },
  {
    id: 'operator_address',
    title: 'Operator Address',
    description: 'Food business operator name and address present',
    source: 'Label',
    reference: 'Article 8',
  },
  {
    id: 'date_marking',
    title: 'Date Marking',
    description: 'Best before / Use by date format correct',
    source: 'Label',
    reference: 'Article 24',
  },
  {
    id: 'country_of_origin',
    title: 'Country of Origin',
    description: 'Origin declaration where required',
    source: 'Label',
    reference: 'Article 26',
  },
  {
    id: 'language_compliance',
    title: 'Language Compliance',
    description: 'Information in official language(s) of sale country',
    source: 'Label',
    reference: 'Article 15',
  },
];

// Generate EU check results
export const generateEUCheckResults = () => {
  return EU_CHECK_DEFINITIONS.map(check => {
    const random = Math.random();
    let status;
    if (random < 0.5) status = 'pass';
    else if (random < 0.8) status = 'warning';
    else status = 'critical';
    
    return {
      ...check,
      status,
    };
  });
};
