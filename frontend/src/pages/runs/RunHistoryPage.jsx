import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { runAPI, API_BASE_URL } from '../../lib/api';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { cn, formatDate, truncate } from '../../lib/utils';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  FileSearch,
  ChevronLeft,
  ChevronRight,
  Download,
  ArrowUpDown,
} from 'lucide-react';
import { formatVerdictLabel, normalizeVerdict } from '../../utils/verdict';

export default function RunHistoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const hasWarnedRunShape = useRef(false);

  const getRunTs = (run) => run?.ts || run?.created_at || run?.updated_at;

  const normalizeScore = (score) => {
    if (score === null || score === undefined) return null;
    return score <= 1 ? Math.round(score * 100) : Math.round(score);
  };

  useEffect(() => {
    const fetchRuns = async () => {
      setLoading(true);
      try {
        const params = {
          page: pagination.page,
          limit: pagination.limit,
        };
        if (search) params.search = search;
        if (statusFilter !== 'all') params.status = statusFilter;

        const data = await runAPI.list(params);
        const runsData = Array.isArray(data?.items) ? data.items : [];
        if (!Array.isArray(data?.items) && data?.items && !hasWarnedRunShape.current) {
          console.warn('Expected runs response with items array, received:', data);
          hasWarnedRunShape.current = true;
        }
        setRuns(runsData);
        setPagination(prev => ({ ...prev, total: data?.total || runsData.length }));
      } catch (err) {
        console.error('Failed to fetch runs:', err);
        setRuns([]);
        setPagination(prev => ({ ...prev, total: 0 }));
      } finally {
        setLoading(false);
      }
    };
    fetchRuns();
  }, [pagination.page, pagination.limit, search, statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    setSearchParams({ search, status: statusFilter });
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pass':
      case 'passed':
      case 'compliant':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'fail':
      case 'failed':
      case 'non-compliant':
        return <XCircle className="h-4 w-4 text-rose-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('pass') || statusLower.includes('compliant')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (statusLower.includes('fail')) {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  const handleDownloadPdf = async (runId) => {
    try {
      await runAPI.downloadPremiumPdf(runId);
    } catch (error) {
      console.error('PDF download error:', error);
      window.open(`${API_BASE_URL}/api/runs/${runId}/report.pdf`, '_blank');
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <DashboardLayout>
      <div className="space-y-6" data-testid="run-history-page">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 font-heading tracking-tight">
              Run History
            </h1>
            <p className="text-slate-600 mt-1">
              View and manage all your compliance audits
            </p>
          </div>
          <Link to="/audit/new">
            <Button className="bg-slate-900 hover:bg-slate-800" data-testid="new-audit-btn">
              <Plus className="mr-2 h-4 w-4" />
              New Audit
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by product or company..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                  data-testid="search-input"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
              >
                <SelectTrigger className="w-full sm:w-[180px]" data-testid="status-filter">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pass">Passed</SelectItem>
                  <SelectItem value="fail">Failed</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card className="border-slate-200">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
              </div>
            ) : runs.length === 0 ? (
              <div className="text-center py-16">
                <FileSearch className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 font-heading">No audits found</h3>
                <p className="text-slate-600 mt-1">
                  {search || statusFilter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Start your first compliance audit'}
                </p>
                <Link to="/audit/new">
                  <Button className="mt-4 bg-slate-900 hover:bg-slate-800">
                    <Plus className="mr-2 h-4 w-4" />
                    Start Audit
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="font-medium">Product</TableHead>
                        <TableHead className="font-medium">Company</TableHead>
                        <TableHead className="font-medium">Country</TableHead>
                        <TableHead className="font-medium">Status</TableHead>
                        <TableHead className="font-medium">Score</TableHead>
                        <TableHead className="font-medium">Date</TableHead>
                        <TableHead className="font-medium text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {runs.map((run, index) => (
                        <motion.tr
                          key={run.run_id || index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.03 }}
                          className="hover:bg-slate-50 cursor-pointer"
                          onClick={() => window.location.href = `/runs/${run.run_id}`}
                          data-testid={`run-row-${run.run_id}`}
                        >
                          <TableCell className="font-medium">
                            {truncate(run.product_name || 'Untitled', 30)}
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {truncate(run.company_name || 'Unknown', 25)}
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {run.country_of_sale || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {(() => {
                              const runStatus = normalizeVerdict(run.verdict || run.status);
                              return (
                            <span className={cn(
                              'inline-flex items-center gap-1.5 px-2 py-1 rounded-sm text-xs font-medium border',
                              getStatusBadge(runStatus)
                            )}>
                              {getStatusIcon(runStatus)}
                              {formatVerdictLabel(runStatus) || 'Pending'}
                            </span>
                              );
                            })()}
                          </TableCell>
                          <TableCell>
                            {(() => {
                              const scoreValue = normalizeScore(run.score ?? run.compliance_score);
                              return (
                                <span className="font-medium">
                                  {scoreValue !== null ? `${scoreValue}%` : '-'}
                                </span>
                              );
                            })()}
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {getRunTs(run) ? formatDate(getRunTs(run)) : '—'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleDownloadPdf(run.run_id);
                                }}
                                className="p-1.5 hover:bg-slate-100 rounded"
                                title="Download Executive PDF"
                              >
                                <Download className="h-4 w-4 text-slate-500" />
                              </a>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 border-t">
                  <div className="text-sm text-slate-600">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                    {pagination.total} results
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-slate-600">
                      Page {pagination.page} of {totalPages || 1}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page >= totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
