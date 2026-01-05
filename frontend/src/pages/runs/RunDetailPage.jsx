import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { runAPI } from '../../lib/api';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../components/ui/accordion';
import { cn, formatDate, getSeverityLabel } from '../../lib/utils';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Download,
  FileJson,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  Send,
  RefreshCw,
  ExternalLink,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';

export default function RunDetailPage() {
  const { runId } = useParams();
  const navigate = useNavigate();
  const { refreshCredits } = useAuth();
  const [run, setRun] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [correctionText, setCorrectionText] = useState('');
  const [isRerunning, setIsRerunning] = useState(false);

  useEffect(() => {
    const fetchRun = async () => {
      try {
        const { data } = await runAPI.get(runId);
        setRun(data);
      } catch (err) {
        console.error('Failed to fetch run:', err);
        setError(err.response?.data?.error || 'Failed to load audit results');
      } finally {
        setLoading(false);
      }
    };
    fetchRun();
  }, [runId]);

  const handleRerun = async () => {
    if (!correctionText.trim()) {
      toast.error('Please enter correction details');
      return;
    }

    setIsRerunning(true);
    try {
      await runAPI.saveCorrection(runId, correctionText);
      const { data } = await runAPI.rerun(runId, correctionText);
      setRun(data);
      setCorrectionText('');
      await refreshCredits();
      toast.success('Audit re-run completed');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to re-run audit');
    } finally {
      setIsRerunning(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pass':
      case 'passed':
      case 'compliant':
        return <CheckCircle className="h-6 w-6 text-emerald-500" />;
      case 'fail':
      case 'failed':
      case 'non-compliant':
        return <XCircle className="h-6 w-6 text-rose-500" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-amber-500" />;
    }
  };

  const getCheckStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'pass':
      case 'passed':
        return 'border-l-4 border-l-emerald-500 bg-emerald-50/50';
      case 'fail':
      case 'failed':
        return 'border-l-4 border-l-rose-500 bg-rose-50/50';
      case 'warning':
        return 'border-l-4 border-l-amber-500 bg-amber-50/50';
      default:
        return 'border-l-4 border-l-slate-300 bg-slate-50/50';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !run) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <XCircle className="h-12 w-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 font-heading">{error || 'Audit not found'}</h2>
          <Link to="/runs">
            <Button className="mt-4" variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to History
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const checks = run.report?.checks || run.checks || [];
  const passedChecks = checks.filter(c => c.status?.toLowerCase().includes('pass')).length;
  const failedChecks = checks.filter(c => c.status?.toLowerCase().includes('fail')).length;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6" data-testid="run-detail-page">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate('/runs')}
              className="mb-2 -ml-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to History
            </Button>
            <h1 className="text-2xl font-semibold text-slate-900 font-heading tracking-tight">
              {run.product_name || 'Audit Results'}
            </h1>
            <p className="text-slate-600 mt-1">
              {run.company_name} · {run.country_of_sale} · {formatDate(run.created_at)}
            </p>
          </div>
          <div className="flex gap-2">
            <a href={runAPI.downloadPdf(runId)} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" data-testid="download-pdf-btn">
                <FileText className="mr-2 h-4 w-4" /> PDF Report
              </Button>
            </a>
            <a href={runAPI.downloadJson(runId)} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" data-testid="download-json-btn">
                <FileJson className="mr-2 h-4 w-4" /> JSON
              </Button>
            </a>
          </div>
        </div>

        {/* Score Card */}
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getStatusIcon(run.status)}
                <div>
                  <div className="text-sm text-slate-500 uppercase tracking-wider">Overall Status</div>
                  <div className={cn(
                    'text-2xl font-semibold font-heading',
                    run.status?.toLowerCase().includes('pass') ? 'text-emerald-600' : 'text-rose-600'
                  )}>
                    {run.status || 'Pending'}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-slate-500">Compliance Score</div>
                <div className="text-4xl font-bold text-slate-900 font-heading">
                  {run.score !== undefined ? `${Math.round(run.score * 100)}%` : 'N/A'}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t flex gap-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span className="text-slate-600">{passedChecks} Passed</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-rose-500" />
                <span className="text-slate-600">{failedChecks} Failed</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <span className="text-slate-600">{checks.length - passedChecks - failedChecks} Warnings</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Check Results */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="font-heading">Compliance Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="space-y-2">
              {checks.map((check, index) => (
                <AccordionItem
                  key={index}
                  value={`check-${index}`}
                  className={cn('rounded-sm overflow-hidden', getCheckStatusStyle(check.status))}
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex items-center gap-4 flex-1 text-left">
                      {check.status?.toLowerCase().includes('pass') ? (
                        <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                      ) : check.status?.toLowerCase().includes('fail') ? (
                        <XCircle className="h-5 w-5 text-rose-500 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-900">{check.title || `Check ${index + 1}`}</div>
                        {check.severity && (
                          <span className={cn(
                            'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1',
                            getSeverityLabel(check.severity).color
                          )}>
                            {getSeverityLabel(check.severity).label}
                          </span>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4 pt-2 border-t border-slate-200/50">
                      {check.detail && (
                        <div>
                          <div className="text-sm font-medium text-slate-700 mb-1">Details</div>
                          <p className="text-sm text-slate-600">{check.detail}</p>
                        </div>
                      )}
                      {check.fix && (
                        <div>
                          <div className="text-sm font-medium text-slate-700 mb-1">Recommended Fix</div>
                          <p className="text-sm text-slate-600">{check.fix}</p>
                        </div>
                      )}
                      {check.sources && check.sources.length > 0 && (
                        <div>
                          <div className="text-sm font-medium text-slate-700 mb-1">Sources</div>
                          <ul className="text-sm text-slate-600 space-y-1">
                            {check.sources.map((source, i) => (
                              <li key={i} className="flex items-center gap-1">
                                <ExternalLink className="h-3 w-3" />
                                {source}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {checks.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <Info className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                No checks available for this audit.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Correction Box */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="font-heading flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Submit Correction & Re-run
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-sm text-sm text-slate-600">
                <Info className="h-4 w-4 inline mr-2" />
                If you have updated your label or have additional context, provide the correction details below and re-run the audit.
              </div>
              <div className="space-y-2">
                <Label htmlFor="correction">Correction Details</Label>
                <Textarea
                  id="correction"
                  placeholder="Describe the corrections made to your label or provide additional context..."
                  value={correctionText}
                  onChange={(e) => setCorrectionText(e.target.value)}
                  rows={4}
                  data-testid="correction-textarea"
                />
              </div>
              <Button
                onClick={handleRerun}
                disabled={isRerunning || !correctionText.trim()}
                className="bg-indigo-600 hover:bg-indigo-700"
                data-testid="rerun-btn"
              >
                {isRerunning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Re-running...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Save Correction & Re-run (1 credit)
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Run Metadata */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="font-heading text-base">Run Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-slate-500">Run ID</div>
                <div className="font-mono text-slate-900">{run.run_id}</div>
              </div>
              <div>
                <div className="text-slate-500">Created</div>
                <div className="text-slate-900">{formatDate(run.created_at)}</div>
              </div>
              <div>
                <div className="text-slate-500">Languages</div>
                <div className="text-slate-900">{run.languages_provided?.join(', ') || 'N/A'}</div>
              </div>
              <div>
                <div className="text-slate-500">Credits Used</div>
                <div className="text-slate-900">{run.credits_used || '1.0'}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
