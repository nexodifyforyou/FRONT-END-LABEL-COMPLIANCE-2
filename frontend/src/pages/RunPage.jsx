import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  ShieldCheck,
  ArrowLeft,
  Upload,
  FileText,
  Image,
  X,
  Loader2,
  AlertCircle,
  Coins,
  Moon,
  Check,
} from 'lucide-react';
import { generateEUCheckResults, generateHalalCheckResults } from '../lib/checkDefinitions';

const EU_COUNTRIES = [
  'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic',
  'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary',
  'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands',
  'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden',
];

const EU_LANGUAGES = [
  'English', 'German', 'French', 'Italian', 'Spanish', 'Portuguese', 'Dutch',
  'Polish', 'Czech', 'Greek', 'Hungarian', 'Swedish', 'Danish', 'Finnish',
  'Bulgarian', 'Romanian', 'Slovak', 'Slovenian', 'Croatian', 'Lithuanian',
  'Latvian', 'Estonian', 'Maltese', 'Irish',
];

// Generate unique run ID
function generateRunId() {
  const prefix = 'AVA';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// Generate mock compliance data
function generateMockResults(productName, companyName, halal) {
  const score = Math.floor(Math.random() * 30) + 65; // 65-95
  const evidenceConfidence = Math.floor(Math.random() * 15) + 80; // 80-95
  
  let verdict = 'PASS';
  if (score < 70) verdict = 'FAIL';
  else if (score < 85) verdict = 'CONDITIONAL';
  
  const checks = [
    { title: 'Allergen emphasis', status: Math.random() > 0.3 ? 'pass' : 'critical', source: 'Label' },
    { title: 'QUID percentage', status: Math.random() > 0.4 ? 'pass' : 'critical', source: 'Label' },
    { title: 'Net quantity format', status: Math.random() > 0.5 ? 'pass' : 'warning', source: 'Label' },
    { title: 'Nutrition declaration', status: Math.random() > 0.4 ? 'pass' : 'warning', source: 'Label' },
    { title: 'Storage conditions', status: Math.random() > 0.5 ? 'pass' : 'warning', source: 'TDS' },
    { title: 'Operator address', status: Math.random() > 0.6 ? 'pass' : 'warning', source: 'Label' },
  ];
  
  if (halal) {
    checks.push(
      { title: 'Halal certificate', status: Math.random() > 0.5 ? 'pass' : 'critical', source: 'Input' },
      { title: 'Animal-derived ingredients', status: Math.random() > 0.4 ? 'pass' : 'warning', source: 'TDS' },
      { title: 'Cross-contamination', status: Math.random() > 0.5 ? 'pass' : 'warning', source: 'TDS' },
    );
  }
  
  return {
    verdict,
    compliance_score: score,
    evidence_confidence: evidenceConfidence,
    checks,
  };
}

export default function RunPage() {
  const navigate = useNavigate();
  const { user, credits, creditsDisplay, isAdmin, hasEnoughCredits, deductCredits } = useAuth();
  
  // Form state
  const [productName, setProductName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [countryOfSale, setCountryOfSale] = useState('');
  const [languages, setLanguages] = useState(['English']);
  const [halalEnabled, setHalalEnabled] = useState(false);
  const [labelFile, setLabelFile] = useState(null);
  const [tdsFile, setTdsFile] = useState(null);
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showInsufficientCreditsModal, setShowInsufficientCreditsModal] = useState(false);

  // Calculate required credits
  const requiredCredits = halalEnabled ? 2 : 1;

  // Label file dropzone
  const onLabelDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setLabelFile(acceptedFiles[0]);
      setError(null);
    }
  }, []);

  const { getRootProps: getLabelRootProps, getInputProps: getLabelInputProps, isDragActive: isLabelDragActive } = useDropzone({
    onDrop: onLabelDrop,
    accept: { 'application/pdf': ['.pdf'], 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'] },
    maxSize: 20 * 1024 * 1024,
    multiple: false,
  });

  // TDS file dropzone
  const onTdsDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setTdsFile(acceptedFiles[0]);
      setError(null);
    }
  }, []);

  const { getRootProps: getTdsRootProps, getInputProps: getTdsInputProps, isDragActive: isTdsDragActive } = useDropzone({
    onDrop: onTdsDrop,
    accept: { 'application/pdf': ['.pdf'], 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'] },
    maxSize: 20 * 1024 * 1024,
    multiple: false,
  });

  const getFileIcon = (file) => {
    if (!file) return null;
    if (file.type === 'application/pdf') {
      return <FileText className="h-6 w-6 text-rose-500" />;
    }
    return <Image className="h-6 w-6 text-blue-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const toggleLanguage = (lang) => {
    if (languages.includes(lang)) {
      if (languages.length > 1) {
        setLanguages(languages.filter(l => l !== lang));
      }
    } else {
      setLanguages([...languages, lang]);
    }
  };

  const validateForm = () => {
    if (!productName.trim()) {
      setError('Product name is required');
      return false;
    }
    if (!companyName.trim()) {
      setError('Company name is required');
      return false;
    }
    if (!countryOfSale) {
      setError('Country of sale is required');
      return false;
    }
    if (languages.length === 0) {
      setError('At least one language is required');
      return false;
    }
    if (!labelFile) {
      setError('Label file is required');
      return false;
    }
    if (!tdsFile) {
      setError('TDS file is required');
      return false;
    }
    return true;
  };

  const handleRunPreflight = async () => {
    if (!validateForm()) return;

    // Check credits (unless admin)
    if (!isAdmin && !hasEnoughCredits(requiredCredits)) {
      setShowInsufficientCreditsModal(true);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate run ID and mock results
      const runId = generateRunId();
      const results = generateMockResults(productName, companyName, halalEnabled);

      // Create run record
      const runRecord = {
        run_id: runId,
        ts: new Date().toISOString(),
        product_name: productName,
        company_name: companyName,
        country_of_sale: countryOfSale,
        languages_provided: languages,
        halal: halalEnabled,
        verdict: results.verdict,
        compliance_score: results.compliance_score,
        evidence_confidence: results.evidence_confidence,
        checks: results.checks,
        pdf_type: halalEnabled ? 'halal' : 'eu',
        label_file_name: labelFile.name,
        tds_file_name: tdsFile.name,
      };

      // Save to localStorage
      const existingRuns = JSON.parse(localStorage.getItem('ava_runs') || '[]');
      existingRuns.push(runRecord);
      localStorage.setItem('ava_runs', JSON.stringify(existingRuns));

      // Deduct credits (unless admin)
      if (!isAdmin) {
        const reason = halalEnabled ? 'EU + Halal preflight' : 'EU preflight';
        deductCredits(requiredCredits, reason, runId);
      }

      // Navigate to report
      navigate(`/report/${runId}`);
    } catch (err) {
      console.error('Run error:', err);
      setError('Failed to run preflight. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#070A12]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/dashboard" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to Dashboard</span>
            </Link>
            <Link to="/" className="flex items-center gap-2.5">
              <ShieldCheck className="h-6 w-6 text-[#5B6CFF]" />
              <span className="text-lg font-semibold text-white/95">Nexodify</span>
            </Link>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-full">
              <Coins className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-medium text-white/90">
                {isAdmin ? <span className="text-emerald-400">Unlimited</span> : creditsDisplay}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white/95">Run Label Preflight</h1>
          <p className="text-white/50 mt-1">Upload your files and run EU 1169/2011 compliance checks</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-rose-400 flex-shrink-0" />
            <span className="text-rose-400 text-sm">{error}</span>
          </div>
        )}

        <div className="space-y-8">
          {/* Product Information */}
          <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white/95 mb-4">Product Information</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product_name" className="text-white/70">Product Name *</Label>
                <Input
                  id="product_name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g., Milk Chocolate Bar with Hazelnuts"
                  className="bg-white/[0.04] border-white/[0.12] text-white placeholder:text-white/30 focus:border-[#5B6CFF]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company_name" className="text-white/70">Company Name *</Label>
                <Input
                  id="company_name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., Example Foods S.r.l."
                  className="bg-white/[0.04] border-white/[0.12] text-white placeholder:text-white/30 focus:border-[#5B6CFF]"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-white/70">Country of Sale *</Label>
                <Select value={countryOfSale} onValueChange={setCountryOfSale}>
                  <SelectTrigger className="bg-white/[0.04] border-white/[0.12] text-white">
                    <SelectValue placeholder="Select EU country" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f1219] border-white/[0.12]">
                    {EU_COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country} className="text-white/90 focus:bg-white/[0.08]">
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-white/70">Languages on Label *</Label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-white/[0.02] border border-white/[0.08] rounded-lg">
                  {EU_LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${
                        languages.includes(lang)
                          ? 'bg-[#5B6CFF]/20 border-[#5B6CFF]/40 text-[#5B6CFF]'
                          : 'bg-white/[0.02] border-white/[0.08] text-white/50 hover:border-white/[0.16]'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* File Uploads */}
          <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white/95 mb-4">Upload Documents</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Label File */}
              <div className="space-y-2">
                <Label className="text-white/70">Label File *</Label>
                {labelFile ? (
                  <div className="border border-white/[0.12] rounded-xl p-4 bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                      {getFileIcon(labelFile)}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white/90 truncate">{labelFile.name}</div>
                        <div className="text-xs text-white/40">{formatFileSize(labelFile.size)}</div>
                      </div>
                      <button onClick={() => setLabelFile(null)} className="p-1.5 hover:bg-white/[0.06] rounded-lg">
                        <X className="h-4 w-4 text-white/40" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    {...getLabelRootProps()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                      isLabelDragActive ? 'border-[#5B6CFF] bg-[#5B6CFF]/5' : 'border-white/[0.12] hover:border-white/[0.24]'
                    }`}
                  >
                    <input {...getLabelInputProps()} />
                    <Upload className="h-8 w-8 text-white/30 mx-auto mb-3" />
                    <p className="text-sm text-white/50">
                      <span className="text-[#5B6CFF]">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-white/30 mt-1">PDF, PNG, JPG up to 20MB</p>
                  </div>
                )}
              </div>

              {/* TDS File */}
              <div className="space-y-2">
                <Label className="text-white/70">Technical Data Sheet (TDS) *</Label>
                {tdsFile ? (
                  <div className="border border-white/[0.12] rounded-xl p-4 bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                      {getFileIcon(tdsFile)}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white/90 truncate">{tdsFile.name}</div>
                        <div className="text-xs text-white/40">{formatFileSize(tdsFile.size)}</div>
                      </div>
                      <button onClick={() => setTdsFile(null)} className="p-1.5 hover:bg-white/[0.06] rounded-lg">
                        <X className="h-4 w-4 text-white/40" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    {...getTdsRootProps()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                      isTdsDragActive ? 'border-[#5B6CFF] bg-[#5B6CFF]/5' : 'border-white/[0.12] hover:border-white/[0.24]'
                    }`}
                  >
                    <input {...getTdsInputProps()} />
                    <Upload className="h-8 w-8 text-white/30 mx-auto mb-3" />
                    <p className="text-sm text-white/50">
                      <span className="text-[#5B6CFF]">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-white/30 mt-1">PDF, PNG, JPG up to 20MB</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white/95 mb-4">Preflight Options</h2>
            
            <div className="space-y-4">
              {/* EU Preflight (always on) */}
              <div className="flex items-center justify-between p-4 bg-[#5B6CFF]/5 border border-[#5B6CFF]/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-[#5B6CFF] flex items-center justify-center">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white/90">EU 1169/2011 Preflight</div>
                    <div className="text-xs text-white/50">Core compliance checks (always enabled)</div>
                  </div>
                </div>
                <span className="text-sm font-medium text-[#5B6CFF]">1 credit</span>
              </div>

              {/* Halal Option */}
              <div
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                  halalEnabled
                    ? 'bg-emerald-500/5 border-emerald-500/20'
                    : 'bg-white/[0.02] border-white/[0.08] hover:border-white/[0.16]'
                }`}
                onClick={() => setHalalEnabled(!halalEnabled)}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={halalEnabled}
                    onCheckedChange={setHalalEnabled}
                    className="border-white/30 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm font-medium text-white/90">Halal Export-Readiness Preflight</span>
                    </div>
                    <div className="text-xs text-white/50">Additional Halal compliance checks</div>
                  </div>
                </div>
                <span className="text-sm font-medium text-emerald-400">+1 credit</span>
              </div>
            </div>
          </div>

          {/* Credit Summary & Run Button */}
          <div className="bg-gradient-to-r from-[#5B6CFF]/10 to-transparent border border-[#5B6CFF]/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-white/50">Credits required</div>
                <div className="text-2xl font-bold text-white/95">{requiredCredits}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/50">Your balance</div>
                <div className="text-2xl font-bold">
                  {isAdmin ? (
                    <span className="text-emerald-400">Unlimited</span>
                  ) : (
                    <span className="text-white/95">{creditsDisplay}</span>
                  )}
                </div>
              </div>
            </div>

            <Button
              onClick={handleRunPreflight}
              disabled={isSubmitting}
              className="w-full bg-[#5B6CFF] hover:bg-[#4A5BEE] text-white h-12 rounded-xl text-base font-medium"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Running Preflight...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-5 w-5" />
                  Run Preflight
                </>
              )}
            </Button>
          </div>
        </div>
      </main>

      {/* Insufficient Credits Modal */}
      <Dialog open={showInsufficientCreditsModal} onOpenChange={setShowInsufficientCreditsModal}>
        <DialogContent className="bg-[#0f1219] border-white/[0.12] text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-400" />
              Not Enough Credits
            </DialogTitle>
            <DialogDescription className="text-white/60">
              You need {requiredCredits} credits to run this preflight, but you only have {credits} credits available.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowInsufficientCreditsModal(false)}
              className="border-white/[0.12] text-white/70 hover:bg-white/[0.04]"
            >
              Cancel
            </Button>
            <Button
              onClick={() => navigate('/billing')}
              className="bg-[#5B6CFF] hover:bg-[#4A5BEE]"
            >
              <Coins className="mr-2 h-4 w-4" />
              Top Up Credits
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
