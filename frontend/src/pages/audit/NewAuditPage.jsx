import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { runAPI } from '../../lib/api';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent } from '../../components/ui/card';
import { Checkbox } from '../../components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Progress } from '../../components/ui/progress';
import { cn, formatCredits } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  File,
  X,
  Check,
  Loader2,
  AlertCircle,
  FileText,
  Image,
  Coins,
} from 'lucide-react';

const COUNTRIES = [
  'United States',
  'European Union',
  'United Kingdom',
  'Canada',
  'Australia',
  'Japan',
  'China',
  'India',
  'Brazil',
  'Mexico',
  'Other',
];

const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Chinese',
  'Japanese',
  'Arabic',
  'Hindi',
];

const productSchema = z.object({
  product_name: z.string().min(2, 'Product name is required'),
  company_name: z.string().min(2, 'Company name is required'),
  country_of_sale: z.string().min(1, 'Select a country'),
  languages_provided: z.array(z.string()).min(1, 'Select at least one language'),
  halal_audit: z.boolean().optional(),
  attach_pdf: z.boolean().optional(),
  customer_name: z.string().optional(),
  customer_email: z.string().email().optional().or(z.literal('')),
});

export default function NewAuditPage() {
  const navigate = useNavigate();
  const { credits, refreshCredits } = useAuth();
  const [step, setStep] = useState(1);
  const [labelFile, setLabelFile] = useState(null);
  const [tdsFile, setTdsFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [runResult, setRunResult] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    trigger,
    getValues,
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      product_name: '',
      company_name: '',
      country_of_sale: '',
      languages_provided: ['English'],
      halal_audit: false,
      attach_pdf: true,
      customer_name: '',
      customer_email: '',
    },
  });

  const selectedLanguages = watch('languages_provided');

  // Label file dropzone
  const onLabelDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setLabelFile(acceptedFiles[0]);
    }
  }, []);

  const {
    getRootProps: getLabelRootProps,
    getInputProps: getLabelInputProps,
    isDragActive: isLabelDragActive,
  } = useDropzone({
    onDrop: onLabelDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    maxSize: 20 * 1024 * 1024, // 20MB
    multiple: false,
  });

  // TDS file dropzone
  const onTdsDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setTdsFile(acceptedFiles[0]);
    }
  }, []);

  const {
    getRootProps: getTdsRootProps,
    getInputProps: getTdsInputProps,
    isDragActive: isTdsDragActive,
  } = useDropzone({
    onDrop: onTdsDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    maxSize: 20 * 1024 * 1024,
    multiple: false,
  });

  const getFileIcon = (file) => {
    if (!file) return null;
    if (file.type === 'application/pdf') {
      return <FileText className="h-8 w-8 text-rose-500" />;
    }
    return <Image className="h-8 w-8 text-blue-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleNext = async () => {
    if (step === 1) {
      const isValid = await trigger(['product_name', 'company_name', 'country_of_sale', 'languages_provided']);
      if (isValid) setStep(2);
    } else if (step === 2) {
      if (!labelFile || !tdsFile) {
        setError('Please upload both Label and TDS files');
        return;
      }
      setError(null);
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setError(null);
  };

  const handleRunAudit = async () => {
    if (credits < 1) {
      setError('Insufficient credits. Please add more credits to continue.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      const values = getValues();
      
      formData.append('product_name', values.product_name);
      formData.append('company_name', values.company_name);
      formData.append('country_of_sale', values.country_of_sale);
      values.languages_provided.forEach(lang => {
        formData.append('languages_provided[]', lang);
      });
      formData.append('halal_audit', values.halal_audit ? 'true' : 'false');
      formData.append('attach_pdf', values.attach_pdf ? 'true' : 'false');
      if (values.customer_name) formData.append('customer_name', values.customer_name);
      if (values.customer_email) formData.append('customer_email', values.customer_email);
      formData.append('label_file', labelFile);
      formData.append('tds_file', tdsFile);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 300);

      const { data } = await runAPI.create(formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setRunResult(data);
      setStep(4);
      await refreshCredits();
    } catch (err) {
      console.error('Audit error:', err);
      setError(err.response?.data?.error || 'Failed to run audit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: 'Product Info' },
    { number: 2, title: 'Upload Files' },
    { number: 3, title: 'Run Audit' },
    { number: 4, title: 'Results' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto" data-testid="new-audit-page">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
          <h1 className="text-2xl font-semibold text-slate-900 font-heading tracking-tight">
            New Compliance Audit
          </h1>
          <p className="text-slate-600 mt-1">Complete the steps below to run your label audit</p>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => (
              <React.Fragment key={s.number}>
                <div className="flex items-center">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-colors',
                      step > s.number
                        ? 'bg-emerald-500 text-white'
                        : step === s.number
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-400'
                    )}
                  >
                    {step > s.number ? <Check className="h-5 w-5" /> : s.number}
                  </div>
                  <span
                    className={cn(
                      'ml-3 text-sm font-medium hidden sm:block',
                      step >= s.number ? 'text-slate-900' : 'text-slate-400'
                    )}
                  >
                    {s.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'flex-1 h-0.5 mx-4',
                      step > s.number ? 'bg-emerald-500' : 'bg-slate-200'
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <Card className="border-slate-200 shadow-lg">
          <CardContent className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Product Info */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 font-heading">Product Information</h2>
                    <p className="text-sm text-slate-600">Enter details about the product being audited</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product_name">Product Name *</Label>
                      <Input
                        id="product_name"
                        placeholder="e.g., Omega-3 Fish Oil Capsules"
                        data-testid="product-name-input"
                        {...register('product_name')}
                        className={errors.product_name ? 'border-rose-500' : ''}
                      />
                      {errors.product_name && (
                        <p className="text-sm text-rose-500">{errors.product_name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company_name">Company Name *</Label>
                      <Input
                        id="company_name"
                        placeholder="e.g., NutraLife Inc."
                        data-testid="company-name-input"
                        {...register('company_name')}
                        className={errors.company_name ? 'border-rose-500' : ''}
                      />
                      {errors.company_name && (
                        <p className="text-sm text-rose-500">{errors.company_name.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Country of Sale *</Label>
                      <Controller
                        name="country_of_sale"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger data-testid="country-select" className={errors.country_of_sale ? 'border-rose-500' : ''}>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                              {COUNTRIES.map((country) => (
                                <SelectItem key={country} value={country}>
                                  {country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.country_of_sale && (
                        <p className="text-sm text-rose-500">{errors.country_of_sale.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Languages on Label *</Label>
                      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded-sm">
                        {LANGUAGES.map((lang) => (
                          <Controller
                            key={lang}
                            name="languages_provided"
                            control={control}
                            render={({ field }) => (
                              <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <Checkbox
                                  checked={field.value?.includes(lang)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([...field.value, lang]);
                                    } else {
                                      field.onChange(field.value.filter((l) => l !== lang));
                                    }
                                  }}
                                />
                                {lang}
                              </label>
                            )}
                          />
                        ))}
                      </div>
                      {errors.languages_provided && (
                        <p className="text-sm text-rose-500">{errors.languages_provided.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-4">
                    <h3 className="text-sm font-medium text-slate-900">Optional Settings</h3>
                    <div className="flex flex-wrap gap-6">
                      <Controller
                        name="halal_audit"
                        control={control}
                        render={({ field }) => (
                          <label className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <span className="text-sm">Include Halal Audit</span>
                          </label>
                        )}
                      />
                      <Controller
                        name="attach_pdf"
                        control={control}
                        render={({ field }) => (
                          <label className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <span className="text-sm">Generate PDF Report</span>
                          </label>
                        )}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Upload Files */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 font-heading">Upload Documents</h2>
                    <p className="text-sm text-slate-600">Upload your product label and Technical Data Sheet (TDS)</p>
                  </div>

                  {error && (
                    <div className="p-3 rounded-sm bg-rose-50 border border-rose-200 text-sm text-rose-600 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Label Upload */}
                    <div className="space-y-3">
                      <Label>Label File *</Label>
                      {labelFile ? (
                        <div className="border border-slate-200 rounded-sm p-4">
                          <div className="flex items-center gap-3">
                            {getFileIcon(labelFile)}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-slate-900 truncate">
                                {labelFile.name}
                              </div>
                              <div className="text-xs text-slate-500">
                                {formatFileSize(labelFile.size)}
                              </div>
                            </div>
                            <button
                              onClick={() => setLabelFile(null)}
                              className="p-1 hover:bg-slate-100 rounded"
                            >
                              <X className="h-4 w-4 text-slate-400" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          {...getLabelRootProps()}
                          data-testid="label-dropzone"
                          className={cn(
                            'border-2 border-dashed rounded-sm p-8 text-center cursor-pointer transition-colors',
                            isLabelDragActive
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-slate-200 hover:border-slate-300'
                          )}
                        >
                          <input {...getLabelInputProps()} />
                          <Upload className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                          <p className="text-sm text-slate-600">
                            <span className="font-medium text-indigo-600">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-slate-500 mt-1">PDF, PNG, JPG up to 20MB</p>
                        </div>
                      )}
                    </div>

                    {/* TDS Upload */}
                    <div className="space-y-3">
                      <Label>Technical Data Sheet (TDS) *</Label>
                      {tdsFile ? (
                        <div className="border border-slate-200 rounded-sm p-4">
                          <div className="flex items-center gap-3">
                            {getFileIcon(tdsFile)}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-slate-900 truncate">
                                {tdsFile.name}
                              </div>
                              <div className="text-xs text-slate-500">
                                {formatFileSize(tdsFile.size)}
                              </div>
                            </div>
                            <button
                              onClick={() => setTdsFile(null)}
                              className="p-1 hover:bg-slate-100 rounded"
                            >
                              <X className="h-4 w-4 text-slate-400" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          {...getTdsRootProps()}
                          data-testid="tds-dropzone"
                          className={cn(
                            'border-2 border-dashed rounded-sm p-8 text-center cursor-pointer transition-colors',
                            isTdsDragActive
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-slate-200 hover:border-slate-300'
                          )}
                        >
                          <input {...getTdsInputProps()} />
                          <Upload className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                          <p className="text-sm text-slate-600">
                            <span className="font-medium text-indigo-600">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-slate-500 mt-1">PDF, PNG, JPG up to 20MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Run Audit */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 font-heading">Review & Run</h2>
                    <p className="text-sm text-slate-600">Confirm details and run your compliance audit</p>
                  </div>

                  {error && (
                    <div className="p-3 rounded-sm bg-rose-50 border border-rose-200 text-sm text-rose-600 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  )}

                  {/* Summary */}
                  <div className="bg-slate-50 rounded-sm p-6 space-y-4">
                    <h3 className="font-medium text-slate-900">Audit Summary</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-slate-500">Product</div>
                        <div className="font-medium text-slate-900">{getValues('product_name')}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Company</div>
                        <div className="font-medium text-slate-900">{getValues('company_name')}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Country</div>
                        <div className="font-medium text-slate-900">{getValues('country_of_sale')}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Languages</div>
                        <div className="font-medium text-slate-900">{selectedLanguages.join(', ')}</div>
                      </div>
                    </div>
                    <div className="border-t pt-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getFileIcon(labelFile)}
                          <span className="text-sm text-slate-600">{labelFile?.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getFileIcon(tdsFile)}
                          <span className="text-sm text-slate-600">{tdsFile?.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Credit Cost */}
                  <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-sm">
                    <div className="flex items-center gap-3">
                      <Coins className="h-5 w-5 text-indigo-600" />
                      <div>
                        <div className="font-medium text-slate-900">Credit Cost</div>
                        <div className="text-sm text-slate-600">1 credit per audit + OCR if needed</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-semibold text-slate-900 font-heading">~1.0</div>
                      <div className="text-sm text-slate-600">Your balance: {formatCredits(credits)}</div>
                    </div>
                  </div>

                  {isSubmitting && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Processing...</span>
                        <span className="font-medium">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 4: Results */}
              {step === 4 && runResult && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 text-center"
                >
                  <div className={cn(
                    'mx-auto w-20 h-20 rounded-full flex items-center justify-center',
                    runResult.status?.toLowerCase().includes('pass')
                      ? 'bg-emerald-100'
                      : 'bg-rose-100'
                  )}>
                    {runResult.status?.toLowerCase().includes('pass') ? (
                      <Check className="h-10 w-10 text-emerald-600" />
                    ) : (
                      <AlertCircle className="h-10 w-10 text-rose-600" />
                    )}
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900 font-heading">
                      Audit Complete
                    </h2>
                    <p className="text-slate-600 mt-2">
                      Your compliance audit has been processed successfully.
                    </p>
                  </div>

                  {runResult.score !== undefined && (
                    <div className="text-4xl font-bold text-slate-900 font-heading">
                      {Math.round(runResult.score * 100)}%
                    </div>
                  )}

                  <div className="flex justify-center gap-4">
                    <Button
                      onClick={() => navigate(`/runs/${runResult.run_id}`)}
                      className="bg-slate-900 hover:bg-slate-800"
                      data-testid="view-results-btn"
                    >
                      View Full Results
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/audit/new')}
                    >
                      Start New Audit
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            {step < 4 && (
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={step === 1 || isSubmitting}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                {step < 3 ? (
                  <Button onClick={handleNext} className="bg-slate-900 hover:bg-slate-800">
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleRunAudit}
                    disabled={isSubmitting || credits < 1}
                    className="bg-indigo-600 hover:bg-indigo-700"
                    data-testid="run-audit-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Run Audit
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
