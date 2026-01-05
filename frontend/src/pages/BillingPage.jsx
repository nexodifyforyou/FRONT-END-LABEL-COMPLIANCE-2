import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { billingAPI } from '../../lib/api';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { cn, formatCredits, formatDate } from '../../lib/utils';
import { motion } from 'framer-motion';
import {
  Coins,
  Check,
  Loader2,
  CreditCard,
  Zap,
  Building2,
  Users,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    credits: 10,
    description: 'Perfect for small producers',
    features: ['10 credits/month', 'Basic compliance checks', 'PDF reports', 'Email support'],
    icon: Zap,
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 79,
    credits: 30,
    description: 'For growing businesses',
    features: ['30 credits/month', 'All compliance checks', 'PDF reports', 'Priority support', 'Run history'],
    icon: Coins,
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 199,
    credits: 100,
    description: 'For compliance teams',
    features: ['100 credits/month', 'All features', 'Team seats (up to 5)', 'API access', 'Dedicated support'],
    icon: Users,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: null,
    credits: 'Custom',
    description: 'For large organizations',
    features: ['Unlimited credits', 'Custom integrations', 'SLA guarantee', 'Dedicated storage', 'Audit logs export'],
    icon: Building2,
  },
];

const TOPUP_PACKS = [
  { credits: 5, price: 15 },
  { credits: 15, price: 40 },
  { credits: 50, price: 120 },
];

export default function BillingPage() {
  const { credits, refreshCredits } = useAuth();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(null);
  const [billingConfigured, setBillingConfigured] = useState(true);

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        const [walletRes, ledgerRes] = await Promise.all([
          billingAPI.getWallet(),
          billingAPI.getLedger({ limit: 10 }),
        ]);
        setCurrentPlan(walletRes.data.plan);
        setLedger(ledgerRes.data.transactions || []);
      } catch (err) {
        console.error('Failed to fetch billing data:', err);
        if (err.response?.status === 503 || err.response?.data?.error?.includes('not configured')) {
          setBillingConfigured(false);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBillingData();
  }, []);

  const handleSubscribe = async (planId) => {
    if (!billingConfigured) {
      toast.error('Billing is not configured yet');
      return;
    }
    setCheckoutLoading(planId);
    try {
      const { data } = await billingAPI.createCheckoutSession(planId);
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to start checkout');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleTopUp = async (credits) => {
    if (!billingConfigured) {
      toast.error('Billing is not configured yet');
      return;
    }
    setCheckoutLoading(`topup-${credits}`);
    try {
      const { data } = await billingAPI.topUp(credits);
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to process top-up');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data } = await billingAPI.createPortalSession();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to open billing portal');
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'grant':
      case 'topup':
        return <span className="text-emerald-500">+</span>;
      case 'spend':
        return <span className="text-rose-500">-</span>;
      case 'refund':
        return <span className="text-blue-500">↺</span>;
      default:
        return null;
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

  return (
    <DashboardLayout>
      <div className="space-y-8" data-testid="billing-page">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 font-heading tracking-tight">
            Billing & Credits
          </h1>
          <p className="text-slate-600 mt-1">Manage your subscription and credits</p>
        </div>

        {!billingConfigured && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-sm flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <div>
              <div className="font-medium text-amber-800">Billing Not Configured</div>
              <div className="text-sm text-amber-700">
                Stripe billing is not yet configured. Contact admin to manually grant credits for testing.
              </div>
            </div>
          </div>
        )}

        {/* Credit Balance */}
        <Card className="border-slate-200 bg-gradient-to-br from-indigo-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600 uppercase tracking-wider">Current Balance</div>
                <div className="text-4xl font-bold text-slate-900 font-heading mt-1">
                  {formatCredits(credits)} <span className="text-lg font-normal text-slate-500">credits</span>
                </div>
                {currentPlan && (
                  <div className="text-sm text-slate-600 mt-2">
                    Current plan: <span className="font-medium">{currentPlan}</span>
                  </div>
                )}
              </div>
              {currentPlan && billingConfigured && (
                <Button variant="outline" onClick={handleManageSubscription}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Manage Subscription
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Plans */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 font-heading mb-4">Subscription Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLANS.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={cn(
                  'border-slate-200 h-full relative',
                  plan.popular && 'border-indigo-500 border-2'
                )}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-500 text-white text-xs font-medium rounded-full">
                      Most Popular
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <plan.icon className="h-5 w-5 text-indigo-500" />
                      <CardTitle className="font-heading text-lg">{plan.name}</CardTitle>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      {plan.price !== null ? (
                        <>
                          <span className="text-3xl font-bold text-slate-900 font-heading">${plan.price}</span>
                          <span className="text-slate-500">/month</span>
                        </>
                      ) : (
                        <span className="text-xl font-semibold text-slate-900 font-heading">Contact us</span>
                      )}
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                          <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={cn(
                        'w-full',
                        plan.popular ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-900 hover:bg-slate-800'
                      )}
                      disabled={checkoutLoading === plan.id || !billingConfigured}
                      onClick={() => plan.price !== null ? handleSubscribe(plan.id) : window.location.href = 'mailto:sales@nexodify.com'}
                      data-testid={`subscribe-${plan.id}-btn`}
                    >
                      {checkoutLoading === plan.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : plan.price !== null ? (
                        currentPlan === plan.id ? 'Current Plan' : 'Subscribe'
                      ) : (
                        'Contact Sales'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Top-up Packs */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="font-heading">Credit Top-ups</CardTitle>
            <CardDescription>Need more credits? Purchase a one-time pack.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {TOPUP_PACKS.map((pack) => (
                <div
                  key={pack.credits}
                  className="border border-slate-200 rounded-sm p-4 text-center hover:border-indigo-300 transition-colors"
                >
                  <div className="text-2xl font-bold text-slate-900 font-heading">{pack.credits}</div>
                  <div className="text-sm text-slate-500 mb-3">credits</div>
                  <div className="text-lg font-semibold text-slate-900">${pack.price}</div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full"
                    disabled={checkoutLoading === `topup-${pack.credits}` || !billingConfigured}
                    onClick={() => handleTopUp(pack.credits)}
                    data-testid={`topup-${pack.credits}-btn`}
                  >
                    {checkoutLoading === `topup-${pack.credits}` ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Buy Now'
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="font-heading">Transaction History</CardTitle>
            <CardDescription>Recent credit transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {ledger.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No transactions yet
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {ledger.map((tx, index) => (
                  <div key={index} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-lg font-bold">
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{tx.reason || tx.type}</div>
                        <div className="text-sm text-slate-500">{formatDate(tx.ts || tx.created_at)}</div>
                      </div>
                    </div>
                    <div className={cn(
                      'font-semibold',
                      tx.credits_delta > 0 ? 'text-emerald-600' : 'text-rose-600'
                    )}>
                      {tx.credits_delta > 0 ? '+' : ''}{tx.credits_delta}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
