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
  ExternalLink,
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
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" style={{ height: '1px' }} />
    <div className="w-10 h-10 rounded-xl bg-[#5B6CFF]/10 border border-[#5B6CFF]/20 flex items-center justify-center mb-4">
      <Icon className="h-5 w-5 text-[#5B6CFF]" />
    </div>
    <h3 className="text-lg font-semibold text-white/90 mb-2">{title}</h3>
    <p className="text-white/55 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

// Step card for "How it works"
const StepCard = ({ number, title, description }) => (
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 rounded-full bg-[#5B6CFF]/10 border border-[#5B6CFF]/30 flex items-center justify-center flex-shrink-0">
      <span className="text-[#5B6CFF] font-semibold">{number}</span>
    </div>
    <div>
      <h4 className="text-white/90 font-semibold mb-1">{title}</h4>
      <p className="text-white/55 text-sm">{description}</p>
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
        <div className="pb-5 text-white/55 text-sm leading-relaxed">
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
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-white/95 leading-[1.1] tracking-tight">
                EU Label Compliance,
                <br />
                <span className="bg-gradient-to-r from-[#5B6CFF] to-[#22D3EE] bg-clip-text text-transparent">
                  Preflighted.
                </span>
              </h1>
              <p className="mt-6 text-lg text-white/70 leading-relaxed max-w-xl">
                Upload Label + TDS. Get an evidence-linked report with issues, severity, fixes, and sources for Regulation (EU) 1169/2011.
              </p>
              
              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button 
                    size="lg" 
                    className="bg-[#5B6CFF] hover:bg-[#4A5BEE] text-white h-12 px-7 rounded-xl text-base font-medium shadow-lg shadow-[#5B6CFF]/25 hover:shadow-[#5B6CFF]/40 transition-all duration-300"
                  >
                    Run a Preflight <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/sample-report">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="bg-transparent border-white/[0.14] text-white/80 hover:bg-white/[0.04] hover:border-white/[0.18] hover:text-white h-12 px-7 rounded-xl text-base font-medium transition-all duration-300"
                    data-testid="view-sample-report-btn"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    View Sample Report
                  </Button>
                </Link>
              </div>

              {/* Micro-bullets */}
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                {['Evidence-linked findings', 'Label ↔ TDS cross-check', 'Premium PDF audit report'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-white/55">
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
                  {/* Top highlight */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-white/80">EU Label Preflight</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-white/90">87</span>
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full border border-amber-500/30">
                        Issues Found
                      </span>
                    </div>
                  </div>

                  {/* Issues */}
                  <div className="space-y-2">
                    <IssueCard 
                      status="fail"
                      title="Allergen Declaration Missing"
                      fix="Add 'Contains: Milk, Soy' per Article 21"
                      source="Label"
                      severity="high"
                    />
                    <IssueCard 
                      status="warning"
                      title="Net Quantity Format"
                      fix="Use 'e' symbol with metric units"
                      source="Label"
                      severity="medium"
                    />
                    <IssueCard 
                      status="fail"
                      title="QUID Percentage Absent"
                      fix="Declare % for highlighted ingredients"
                      source="TDS"
                      severity="high"
                    />
                  </div>
                </div>

                {/* PDF Preview - Right (2 cols) */}
                <div 
                  className="col-span-2 bg-gradient-to-b from-white/[0.04] to-white/[0.02] border border-white/[0.08] rounded-2xl p-4 relative overflow-hidden"
                  style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.55)' }}
                >
                  {/* Top highlight */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  
                  {/* PDF Header */}
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-rose-400" />
                    <span className="text-xs font-medium text-white/70">PDF Report</span>
                  </div>

                  {/* Fake PDF content */}
                  <div className="bg-white/[0.03] rounded-lg p-3 border border-white/[0.04]">
                    <div className="flex items-center gap-2 mb-3">
                      <ShieldCheck className="h-4 w-4 text-[#5B6CFF]" />
                      <span className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">Nexodify AVA</span>
                    </div>
                    <div className="h-1 w-16 bg-white/10 rounded mb-2" />
                    <div className="h-1 w-24 bg-white/10 rounded mb-4" />
                    
                    <div className="text-[9px] text-white/40 uppercase tracking-wider mb-1">Executive Summary</div>
                    <div className="space-y-1 mb-3">
                      <div className="h-1 w-full bg-white/[0.06] rounded" />
                      <div className="h-1 w-4/5 bg-white/[0.06] rounded" />
                      <div className="h-1 w-3/4 bg-white/[0.06] rounded" />
                    </div>
                    
                    <div className="text-[9px] text-white/40 uppercase tracking-wider mb-1">Findings</div>
                    <div className="space-y-1">
                      <div className="h-1 w-full bg-white/[0.06] rounded" />
                      <div className="h-1 w-5/6 bg-white/[0.06] rounded" />
                    </div>
                  </div>

                  <Link to="/sample-report" className="block mt-3">
                    <button className="w-full flex items-center justify-center gap-1.5 py-2 bg-white/[0.04] hover:bg-white/[0.08] rounded-lg text-xs text-white/60 hover:text-white/80 transition-colors border border-white/[0.06]">
                      <Download className="h-3 w-3" />
                      View Full Report
                    </button>
                  </Link>
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
            <p className="mt-4 text-lg text-white/55 max-w-2xl mx-auto">
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
              title="Premium PDF Audit"
              description="Client-ready report for QA teams, suppliers, and print verification workflows."
            />
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
              <p className="text-white/55 mb-10 max-w-lg">
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
                  description="Get an interactive report with findings, fixes, and downloadable PDF."
                />
              </div>
            </div>

            {/* Visual placeholder */}
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
                    <div className="text-sm font-medium text-white/80">omega3-label.pdf</div>
                    <div className="text-xs text-white/40">2.4 MB · Uploaded</div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-emerald-400 ml-auto" />
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-[#5B6CFF]/20 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-[#5B6CFF]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white/80">omega3-tds.pdf</div>
                    <div className="text-xs text-white/40">1.8 MB · Uploaded</div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-emerald-400 ml-auto" />
                </div>

                <div className="h-px bg-white/[0.08] my-6" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-[#5B6CFF]" />
                    <span className="text-sm text-white/70">Analysis complete</span>
                  </div>
                  <span className="text-xs text-white/40">12 seconds</span>
                </div>

                <div className="mt-6 p-4 bg-white/[0.02] rounded-xl border border-white/[0.06]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-white/80">Compliance Score</span>
                    <span className="text-2xl font-bold text-amber-400">72%</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-rose-500/10 text-rose-400 text-xs rounded border border-rose-500/20">3 Critical</span>
                    <span className="px-2 py-1 bg-amber-500/10 text-amber-400 text-xs rounded border border-amber-500/20">5 Warnings</span>
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded border border-emerald-500/20">12 Passed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Example Findings */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0B1020]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white/95 tracking-tight">
              Example findings
            </h2>
            <p className="mt-4 text-white/55 max-w-2xl mx-auto">
              Each issue includes severity, a fix recommendation, and the source text.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              {
                status: 'fail',
                severity: 'high',
                title: 'Allergen Declaration Format',
                detail: 'Allergens must be emphasized (bold, CAPS, or underlined) within the ingredients list.',
                fix: 'Update "milk powder" to "MILK POWDER" in ingredients.',
                source: 'Article 21, Annex II'
              },
              {
                status: 'warning',
                severity: 'medium',
                title: 'Nutrition Reference Intake',
                detail: 'Percentage of Reference Intake (%RI) missing for declared nutrients.',
                fix: 'Add %RI column to nutrition table per Article 32.',
                source: 'Article 32(4)'
              },
              {
                status: 'fail',
                severity: 'high',
                title: 'Storage Instructions Absent',
                detail: 'Perishable product requires storage conditions for shelf life validity.',
                fix: 'Add "Store in a cool, dry place" or specific temperature.',
                source: 'Article 25'
              }
            ].map((finding, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gradient-to-b from-white/[0.04] to-white/[0.02] border border-white/[0.08] rounded-2xl p-5 hover:border-white/[0.14] transition-all"
                style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.55)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {finding.status === 'fail' ? (
                      <XCircle className="h-5 w-5 text-rose-400" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-400" />
                    )}
                    <SeverityBadge level={finding.severity} />
                  </div>
                </div>
                <h4 className="text-white/90 font-semibold mb-2">{finding.title}</h4>
                <p className="text-white/50 text-sm mb-3">{finding.detail}</p>
                <div className="p-3 bg-white/[0.02] rounded-lg border border-white/[0.04] mb-3">
                  <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Recommended Fix</div>
                  <p className="text-white/70 text-sm">{finding.fix}</p>
                </div>
                <div className="text-xs text-white/40 font-mono">
                  Source: {finding.source}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Report Preview */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#070A12]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white/95 tracking-tight mb-6">
                Client-ready PDF reports
              </h2>
              <p className="text-white/55 mb-6 max-w-lg">
                Professional audit documentation suitable for internal QA, supplier communication, and regulatory preparation.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Executive summary with compliance score',
                  'Detailed findings with evidence text',
                  'Regulation references for each issue',
                  'Recommended fixes with priority levels',
                  'Audit metadata and timestamp'
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/70 text-sm">
                    <CheckCircle className="h-4 w-4 text-[#5B6CFF] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/sample-report">
                <Button 
                  variant="outline"
                  className="bg-transparent border-white/[0.14] text-white/80 hover:bg-white/[0.04] hover:border-white/[0.18] hover:text-white rounded-xl px-6 transition-all duration-300"
                >
                  <Download className="mr-2 h-4 w-4" />
                  View Sample PDF
                </Button>
              </Link>
            </div>

            {/* PDF Preview Visual */}
            <div className="relative">
              <div 
                className="bg-white rounded-xl p-6 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500"
                style={{ boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}
              >
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                  <ShieldCheck className="h-6 w-6 text-[#5B6CFF]" />
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Nexodify AVA</div>
                    <div className="text-sm font-semibold text-gray-900">EU Label Compliance Report</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-2 w-32 bg-gray-200 rounded" />
                  <div className="h-2 w-48 bg-gray-100 rounded" />
                  <div className="h-2 w-40 bg-gray-100 rounded" />
                  <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="h-2 w-24 bg-amber-200 rounded mb-2" />
                    <div className="h-2 w-36 bg-amber-100 rounded" />
                  </div>
                  <div className="h-2 w-44 bg-gray-100 rounded" />
                  <div className="h-2 w-36 bg-gray-100 rounded" />
                </div>
              </div>
              {/* Subtle glow */}
              <div className="absolute -inset-4 bg-[#5B6CFF]/5 rounded-2xl blur-2xl -z-10" />
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
          <p className="text-white/55 max-w-2xl mx-auto mb-10">
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
                <div className="text-white/50 text-sm">{item.desc}</div>
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
              question="How does the OCR text extraction work?"
              answer="We use a combination of PDF text extraction (for digital PDFs) and optical character recognition (for scanned documents or images). The system automatically detects which method to use based on the file content."
            />
            <FAQItem
              question="Is this only for EU markets?"
              answer="The current checks are focused on Regulation (EU) 1169/2011. Support for additional regulations (FDA, UK FIC) is on our roadmap. Contact us if you need specific regional requirements."
            />
            <FAQItem
              question="Can I re-run after making corrections?"
              answer="Yes. You can submit correction notes and re-run the analysis. The system will use the same extracted text but apply updated context from your corrections. Re-runs are billed as new audits."
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
          <p className="text-white/55 mb-8 max-w-xl mx-auto">
            Upload your first label and TDS to see how AVA identifies compliance gaps.
          </p>
          <Link to="/register">
            <Button 
              size="lg" 
              className="bg-[#5B6CFF] hover:bg-[#4A5BEE] text-white h-12 px-8 rounded-xl text-base font-medium shadow-lg shadow-[#5B6CFF]/25 hover:shadow-[#5B6CFF]/40 transition-all duration-300"
            >
              Run a Preflight <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
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
