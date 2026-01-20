import { HALAL_CHECK_DEFINITIONS } from './halalChecks';

// Get severity color classes
export const getSeverityColor = (severity) => {
  const colors = {
    critical: {
      bg: 'bg-rose-500/20',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      badge: 'Critical',
      icon: '⛔',
    },
    high: {
      bg: 'bg-rose-500/20',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      badge: 'Critical',
      icon: '⛔',
    },
    warning: {
      bg: 'bg-amber-500/20',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      badge: 'Warning',
      icon: '⚠️',
    },
    medium: {
      bg: 'bg-amber-500/20',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      badge: 'Warning',
      icon: '⚠️',
    },
    low: {
      bg: 'bg-emerald-500/20',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      badge: 'Info',
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
  { ...HALAL_CHECK_DEFINITIONS.find(c => c.id === 'halal_certificate_provided'), sampleResult: 'warning' },
  { ...HALAL_CHECK_DEFINITIONS.find(c => c.id === 'certificate_expiry_valid'), sampleResult: 'warning' },
  { ...HALAL_CHECK_DEFINITIONS.find(c => c.id === 'gelatin_enzymes_check'), sampleResult: 'pass' },
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
