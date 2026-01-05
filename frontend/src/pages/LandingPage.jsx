import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ArrowRight,
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Upload,
  Zap,
  FileSearch,
  Lock,
  Download,
  ChevronDown,
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
  Beef,
  CakeSlice,
} from 'lucide-react';

// Severity badge component
const SeverityBadge = ({ level }) => {
  const styles = {
    high: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  };
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${styles[level]}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
};

// Issue card for the dashboard mockup
const IssueCard = ({ status, title, fix, source, severity }) => {
  const StatusIcon = status === 'fail' ? XCircle : status === 'warning' ? AlertTriangle : CheckCircle;
  const statusColor = status === 'fail' ? 'text-rose-400' : status === 'warning' ? 'text-amber-400' : 'text-emerald-400';
  
  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 hover:border-white/[0.12] transition-all">
      <div className="flex items-start gap-2">
        <StatusIcon className={`h-4 w-4 mt-0.5 ${statusColor} flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-white/90 text-sm font-medium truncate">{title}</span>
            <SeverityBadge level={severity} />
          </div>
          <p className="text-white/50 text-xs mb-1.5 line-clamp-2">{fix}</p>
          <span className="text-white/30 text-[10px] font-mono">Source: {source}</span>
        </div>
      </div>
    </div>
  );
};

// Feature card component
const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -4 }}
    className="group relative bg-gradient-to-b from-white/[0.04] to-white/[0.02] border border-white/[0.08] rounded-2xl p-6 hover:border-white/[0.14] transition-all duration-300"
    style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.55)' }}
  >
    <div className="w-10 h-10 rounded-xl bg-[#5B6CFF]/10 border border-[#5B6CFF]/20 flex items-center justify-center mb-4">
      <Icon className="h-5 w-5 text-[#5B6CFF]" />
    </div>
    <h3 className="text-lg font-semibold text-white/90 mb-2">{title}</h3>
    <p className="text-white/60 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

// Category chip component
const CategoryChip = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-full hover:border-white/[0.14] hover:bg-white/[0.05] transition-all cursor-default">
    <Icon className="h-4 w-4 text-[#5B6CFF]" />
    <span className="text-white/70 text-sm">{label}</span>
  </div>
);

// Step card for "How it works"
const StepCard = ({ number, title, description }) => (
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 rounded-full bg-[#5B6CFF]/10 border border-[#5B6CFF]/30 flex items-center justify-center flex-shrink-0">
      <span className="text-[#5B6CFF] font-semibold">{number}</span>
    </div>
    <div>
      <h4 className="text-white/90 font-semibold mb-1">{title}</h4>
      <p className="text-white/60 text-sm">{description}</p>
    </div>
  </div>
);

// FAQ Item
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="border-b border-white/[0.08] last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left hover:text-white/90 transition-colors"
      >
        <span className="text-white/80 font-medium pr-8">{question}</span>
        <ChevronDown className={`h-5 w-5 text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="pb-5 text-white/60 text-sm leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070A12] text-white antialiased">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#070A12]/60 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5">
              <ShieldCheck className="h-7 w-7 text-[#5B6CFF]" />
              <span className="text-lg font-semibold text-white/95">Nexodify</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/[0.06]">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button 
                  className="bg-[#5B6CFF] hover:bg-[#4A5BEE] text-white border-0 rounded-xl px-5 shadow-lg shadow-[#5B6CFF]/20 hover:shadow-[#5B6CFF]/30 transition-all"
                  data-testid="get-started-btn"
                >
                  Run a Preflight
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle gradient orbs */}
        <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-[#5B6CFF]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-[#22D3EE]/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Copy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#5B6CFF]/10 border border-[#5B6CFF]/30 rounded-full text-sm text-[#5B6CFF] mb-6">
                <ShieldCheck className="h-4 w-4" />
                EU 1169/2011 + Optional Halal Preflight
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-white/95 leading-[1.1] tracking-tight">
                EU Label Compliance,
                <br />
                <span className="bg-gradient-to-r from-[#5B6CFF] to-[#22D3EE] bg-clip-text text-transparent">
                  Preflighted.
                </span>
              </h1>
              <p className="mt-6 text-lg text-white/70 leading-relaxed max-w-xl">
                Upload Label + TDS. Get an evidence-linked report with issues, severity, fixes, and sources for Regulation (EU) 1169/2011 — across all food categories.
              </p>
              
              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link to="/sample-report">
                  <Button 
                    size="lg" 
                    className="bg-[#5B6CFF] hover:bg-[#4A5BEE] text-white h-12 px-7 rounded-xl text-base font-medium shadow-lg shadow-[#5B6CFF]/25 hover:shadow-[#5B6CFF]/40 transition-all duration-300"
                    data-testid="open-interactive-sample-btn"
                  >
                    Open Interactive Sample <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a href="/sample-report.pdf" download>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="bg-transparent border-white/[0.14] text-white/80 hover:bg-white/[0.04] hover:border-white/[0.18] hover:text-white h-12 px-7 rounded-xl text-base font-medium transition-all duration-300"
                    data-testid="download-sample-pdf-btn"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Sample PDF
                  </Button>
                </a>
              </div>

              {/* Micro-bullets */}
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                {['Evidence-linked findings', 'Label ↔ TDS cross-check', 'Print verification pack'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-white/60">
                    <CheckCircle className="h-4 w-4 text-[#5B6CFF]" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Product Proof Montage */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="grid grid-cols-5 gap-4">
                {/* Dashboard Mock - Left (3 cols) */}
                <div 
                  className="col-span-3 bg-gradient-to-b from-white/[0.04] to-white/[0.02] border border-white/[0.08] rounded-2xl p-5 relative overflow-hidden"
                  style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.55)' }}
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-white/80">EU Label Preflight</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-white/90">78</span>
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full border border-amber-500/30">
                        Issues Found
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <IssueCard 
                      status="fail"
                      title="Allergen Emphasis Missing"
                      fix="Apply bold to 'hazelnuts, milk' in ingredients"
                      source="Label"
                      severity="high"
                    />
                    <IssueCard 
                      status="warning"
                      title="Cocoa QUID Absent"
                      fix="Declare cocoa solids % per Article 22"
                      source="Label"
                      severity="medium"
                    />
                    <IssueCard 
                      status="fail"
                      title="Net Quantity Format"
                      fix="Use 'e' symbol with 100 g declaration"
                      source="Label"
                      severity="high"
                    />
                  </div>
                </div>

                {/* PDF Preview - Right (2 cols) */}
                <div 
                  className="col-span-2 bg-gradient-to-b from-white/[0.04] to-white/[0.02] border border-white/[0.08] rounded-2xl p-4 relative overflow-hidden"
                  style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.55)' }}
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-rose-400" />
                    <span className="text-xs font-medium text-white/70">PDF Report</span>
                  </div>

                  <div className="bg-white/[0.03] rounded-lg p-3 border border-white/[0.04]">
                    <div className="flex items-center gap-2 mb-3">
                      <ShieldCheck className="h-4 w-4 text-[#5B6CFF]" />
                      <span className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">Nexodify AVA</span>
                    </div>
                    <div className="h-1 w-16 bg-white/10 rounded mb-2" />
                    <div className="h-1 w-24 bg-white/10 rounded mb-4" />
                    
                    <div className="text-[9px] text-white/40 uppercase tracking-wider mb-1">Print Verification</div>
                    <div className="space-y-1 mb-3">
                      <div className="h-1 w-full bg-white/[0.06] rounded" />
                      <div className="h-1 w-4/5 bg-white/[0.06] rounded" />
                    </div>
                    
                    <div className="text-[9px] text-white/40 uppercase tracking-wider mb-1">Halal Preflight</div>
                    <div className="space-y-1">
                      <div className="h-1 w-full bg-white/[0.06] rounded" />
                      <div className="h-1 w-5/6 bg-white/[0.06] rounded" />
                    </div>
                  </div>

                  <a href="/sample-report.pdf" download className="block mt-3">
                    <button className="w-full flex items-center justify-center gap-1.5 py-2 bg-white/[0.04] hover:bg-white/[0.08] rounded-lg text-xs text-white/60 hover:text-white/80 transition-colors border border-white/[0.06]">
                      <Download className="h-3 w-3" />
                      Download PDF
                    </button>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0B1020]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white/95 tracking-tight">
              Compliance checks built for EU 1169/2011
            </h2>
            <p className="mt-4 text-lg text-white/60 max-w-2xl mx-auto">
              Systematic verification of food label requirements with evidence-linked findings.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            <FeatureCard
              icon={ShieldCheck}
              title="EU 1169/2011 Checks"
              description="Ingredients, allergens, QUID, net quantity, nutrition table, operator details, and claims verification."
            />
            <FeatureCard
              icon={FileSearch}
              title="Label ↔ TDS Cross-Check"
              description="Automatically flags mismatches between your label text and Technical Data Sheet declarations."
            />
            <FeatureCard
              icon={CheckCircle}
              title="Evidence + Sources"
              description="Each finding includes supporting extracted text and a specific regulation reference."
            />
            <FeatureCard
              icon={FileText}
              title="Print Verification Pack"
              description="Pre-press checklist + sign-off form for QA teams, suppliers, and print workflows."
            />
          </div>
        </div>
      </section>

      {/* Multi-Food Category Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#070A12]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white/95 tracking-tight">
              Built for every food category
            </h2>
            <p className="mt-4 text-lg text-white/60 max-w-2xl mx-auto">
              Category-aware checks for EU 1169/2011 labeling — from dairy to confectionery.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            <CategoryChip icon={Milk} label="Dairy" />
            <CategoryChip icon={Fish} label="Meat & Fish" />
            <CategoryChip icon={Cookie} label="Confectionery" />
            <CategoryChip icon={Croissant} label="Bakery" />
            <CategoryChip icon={Wine} label="Beverages" />
            <CategoryChip icon={Soup} label="Ready Meals & Sauces" />
            <CategoryChip icon={Droplets} label="Oils & Fats" />
            <CategoryChip icon={Snowflake} label="Frozen Foods" />
            <CategoryChip icon={Baby} label="Baby Food" />
            <CategoryChip icon={Pill} label="Supplements" />
            <CategoryChip icon={Beef} label="Processed Meat" />
            <CategoryChip icon={CakeSlice} label="Desserts" />
          </div>
        </div>
      </section>

      {/* Halal Export-Readiness Module */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0B1020]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-sm text-emerald-400 mb-6">
                Optional Module
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white/95 tracking-tight mb-4">
                Halal Export-Readiness Preflight
              </h2>
              <p className="text-lg text-white/60 leading-relaxed mb-6">
                Exporting to Halal markets? Preflight your Label + Supplier TDS to flag missing certificates, high-risk ingredients, and documentation gaps before you proceed.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Certificate validity & issuing body checks',
                  'Animal-derived ingredient risk flags',
                  'Alcohol / solvent / carrier flags',
                  'Cross-contamination statements',
                  'Traceability field verification',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/70 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/sample-report">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6">
                  View Halal Sample Checks
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div 
              className="bg-gradient-to-b from-white/[0.04] to-white/[0.02] border border-white/[0.08] rounded-2xl p-6"
              style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.55)' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded border border-emerald-500/30">
                  Sample Check
                </span>
              </div>
              <div className="space-y-3">
                {[
                  { title: 'Halal Certificate Provided', status: 'pass', severity: 'low' },
                  { title: 'Certificate Expiry Valid', status: 'warning', severity: 'medium' },
                  { title: 'Gelatin Source Declaration', status: 'fail', severity: 'high' },
                  { title: 'E-Number Source Verification', status: 'warning', severity: 'medium' },
                ].map((check, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                    <div className="flex items-center gap-2">
                      {check.status === 'pass' ? (
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                      ) : check.status === 'warning' ? (
                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-rose-400" />
                      )}
                      <span className="text-white/80 text-sm">{check.title}</span>
                    </div>
                    <SeverityBadge level={check.severity} />
                  </div>
                ))}
              </div>
              <p className="mt-4 text-white/40 text-xs">
                Halal determinations depend on target market and certification body. This module provides preflight risk flags, not certification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#070A12]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white/95 tracking-tight mb-6">
                How it works
              </h2>
              <p className="text-white/60 mb-10 max-w-lg">
                Three steps from upload to actionable compliance report.
              </p>

              <div className="space-y-8">
                <StepCard
                  number="1"
                  title="Upload Documents"
                  description="Upload your product label (PDF or image) and Technical Data Sheet."
                />
                <StepCard
                  number="2"
                  title="Automated Analysis"
                  description="OCR extracts text, then systematic checks against EU 1169/2011 requirements."
                />
                <StepCard
                  number="3"
                  title="Review & Export"
                  description="Get an interactive report with findings, print verification pack, and downloadable PDF."
                />
              </div>
            </div>

            <div className="relative">
              <div 
                className="bg-gradient-to-b from-white/[0.04] to-white/[0.02] border border-white/[0.08] rounded-2xl p-8 relative"
                style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.55)' }}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-[#5B6CFF]/20 flex items-center justify-center">
                    <Upload className="h-4 w-4 text-[#5B6CFF]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white/80">chocolate-label.pdf</div>
                    <div className="text-xs text-white/40">1.8 MB · Uploaded</div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-emerald-400 ml-auto" />
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-[#5B6CFF]/20 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-[#5B6CFF]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white/80">supplier-tds.pdf</div>
                    <div className="text-xs text-white/40">2.1 MB · Uploaded</div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-emerald-400 ml-auto" />
                </div>

                <div className="h-px bg-white/[0.08] my-6" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-[#5B6CFF]" />
                    <span className="text-sm text-white/70">Analysis complete</span>
                  </div>
                  <span className="text-xs text-white/40">8 seconds</span>
                </div>

                <div className="mt-6 p-4 bg-white/[0.02] rounded-xl border border-white/[0.06]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-white/80">Compliance Score</span>
                    <span className="text-2xl font-bold text-amber-400">78%</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-2 py-1 bg-rose-500/10 text-rose-400 text-xs rounded border border-rose-500/20">2 Critical</span>
                    <span className="px-2 py-1 bg-amber-500/10 text-amber-400 text-xs rounded border border-amber-500/20">4 Warnings</span>
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded border border-emerald-500/20">14 Passed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Audit Trail */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0B1020]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#5B6CFF]/10 border border-[#5B6CFF]/20 mb-6">
            <Lock className="h-7 w-7 text-[#5B6CFF]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white/95 tracking-tight mb-4">
            Security & audit trail
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto mb-10">
            Your documents are processed securely. Each run creates an immutable audit record with timestamps and version tracking.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { title: 'Encrypted Storage', desc: 'Files encrypted at rest and in transit' },
              { title: 'Audit Logging', desc: 'Complete history of all runs and corrections' },
              { title: 'Data Retention', desc: 'Configurable retention policies per your requirements' }
            ].map((item) => (
              <div key={item.title} className="p-5 bg-white/[0.02] border border-white/[0.08] rounded-xl">
                <div className="text-white/90 font-semibold mb-1">{item.title}</div>
                <div className="text-white/55 text-sm">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#070A12]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white/95 tracking-tight text-center mb-12">
            Frequently asked questions
          </h2>
          <div className="bg-gradient-to-b from-white/[0.04] to-white/[0.02] border border-white/[0.08] rounded-2xl px-6">
            <FAQItem
              question="What file formats are supported?"
              answer="We accept PDF, PNG, and JPEG files for both labels and Technical Data Sheets. Maximum file size is 20MB per document. For best OCR results, ensure your files are at least 150 DPI resolution."
            />
            <FAQItem
              question="Which food categories are supported?"
              answer="All food categories under EU 1169/2011 are supported — dairy, meat & fish, confectionery, bakery, beverages, ready meals, oils & fats, frozen foods, baby food, and supplements. Checks are category-aware."
            />
            <FAQItem
              question="How does the Halal preflight work?"
              answer="The optional Halal module analyzes your label and TDS to flag potential issues for Halal markets — missing certificates, high-risk ingredients, cross-contamination statements, etc. It provides risk flags, not certification."
            />
            <FAQItem
              question="Can I use this for print verification?"
              answer="Yes. Each report includes a Print Verification Pack with pre-press checklist, sign-off fields, and a summary of what to send to your printer. It's designed for QA and print workflow integration."
            />
            <FAQItem
              question="How is my data handled?"
              answer="Uploaded files and extracted text are stored securely for audit trail purposes. You can request data deletion at any time. We do not share your documents with third parties."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0B1020] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#5B6CFF]/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-white/95 tracking-tight mb-4">
            Ready to preflight your labels?
          </h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            See a full sample report with EU 1169/2011 checks, print verification pack, and optional Halal preflight.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/sample-report">
              <Button 
                size="lg" 
                className="bg-[#5B6CFF] hover:bg-[#4A5BEE] text-white h-12 px-8 rounded-xl text-base font-medium shadow-lg shadow-[#5B6CFF]/25 hover:shadow-[#5B6CFF]/40 transition-all duration-300"
              >
                Open Interactive Sample <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="/sample-report.pdf" download>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-transparent border-white/[0.14] text-white/80 hover:bg-white/[0.04] hover:border-white/[0.18] hover:text-white h-12 px-8 rounded-xl text-base font-medium transition-all duration-300"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Sample PDF
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-[#070A12] border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-white/40" />
              <span className="text-white/40 text-sm">© 2025 Nexodify. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/privacy" className="text-white/40 hover:text-white/70 transition-colors">Privacy</Link>
              <Link to="/terms" className="text-white/40 hover:text-white/70 transition-colors">Terms</Link>
              <a href="mailto:support@nexodify.com" className="text-white/40 hover:text-white/70 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
