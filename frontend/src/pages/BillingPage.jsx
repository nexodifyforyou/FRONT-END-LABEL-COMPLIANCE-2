import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  ShieldCheck,
  ArrowLeft,
  Coins,
  Plus,
  History,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

export default function BillingPage() {
  const navigate = useNavigate();
  const { wallet, isAdmin, creditsDisplay, addCredits, refreshWallet } = useAuth();
  const [topUpAmount, setTopUpAmount] = useState('20');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Calculate credits from EUR amount (€20 = 10 credits, linear)
  const euroAmount = parseFloat(topUpAmount) || 0;
  const creditsToAdd = Math.floor(euroAmount / 2); // €2 = 1 credit

  // Validate minimum
  const isValidAmount = euroAmount >= 20;

  const handleTopUp = async () => {
    if (!isValidAmount) {
      setError('Minimum top-up amount is €20');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add credits
      addCredits(creditsToAdd, euroAmount);
      
      // Show success
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        refreshWallet();
      }, 2000);
      
      // Reset form
      setTopUpAmount('20');
    } catch (err) {
      setError('Failed to process payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Get ledger entries (newest first)
  const ledgerEntries = [...(wallet?.ledger || [])].reverse();

  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#070A12]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm hidden sm:inline">Dashboard</span>
              </Link>
              <Link to="/" className="flex items-center gap-2.5">
                <ShieldCheck className="h-6 w-6 text-[#5B6CFF]" />
                <span className="text-lg font-semibold text-white/95">Nexodify</span>
              </Link>
            </div>
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
          <h1 className="text-2xl font-bold text-white/95">Credits & Billing</h1>
          <p className="text-white/50 mt-1">Manage your credits and view transaction history</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Current Credits Card */}
          <div className="bg-gradient-to-br from-[#5B6CFF]/10 to-transparent border border-[#5B6CFF]/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#5B6CFF]/20 flex items-center justify-center">
                <Coins className="h-6 w-6 text-[#5B6CFF]" />
              </div>
              <div>
                <div className="text-sm text-white/50">Current Balance</div>
                <div className="text-3xl font-bold">
                  {isAdmin ? (
                    <span className="text-emerald-400">Unlimited</span>
                  ) : (
                    <span className="text-white/95">{wallet?.credits_available || 0}</span>
                  )}
                </div>
              </div>
            </div>

            {!isAdmin && (
              <>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-white/50 mb-1">
                    <span>Plan: {wallet?.plan?.charAt(0).toUpperCase() + wallet?.plan?.slice(1) || 'Starter'}</span>
                    <span>{wallet?.credits_available || 0} / {wallet?.monthly_credits || 10}</span>
                  </div>
                  <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#5B6CFF] to-[#7B8CFF] rounded-full transition-all"
                      style={{ width: `${Math.min(100, ((wallet?.credits_available || 0) / (wallet?.monthly_credits || 10)) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="text-xs text-white/40">
                  Renews: {wallet?.renewal_date || 'N/A'}
                </div>
              </>
            )}

            {isAdmin && (
              <div className="text-sm text-emerald-400/70">
                Admin accounts have unlimited credits
              </div>
            )}
          </div>

          {/* Top Up Card */}
          {!isAdmin && (
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center">
                  <Plus className="h-6 w-6 text-white/70" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-white/95">Top Up Credits</div>
                  <div className="text-sm text-white/50">Minimum €20</div>
                </div>
              </div>

              {/* Success Message */}
              {showSuccess && (
                <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-400 text-sm">Credits added successfully!</span>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-400" />
                  <span className="text-rose-400 text-sm">{error}</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white/70">Amount (EUR)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">€</span>
                    <Input
                      type="number"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value)}
                      min="20"
                      step="5"
                      className="pl-8 bg-white/[0.04] border-white/[0.12] text-white focus:border-[#5B6CFF]"
                    />
                  </div>
                </div>

                <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">Credits to receive</span>
                    <span className="text-2xl font-bold text-[#5B6CFF]">{creditsToAdd}</span>
                  </div>
                  <div className="text-xs text-white/30 mt-1">€2 per credit</div>
                </div>

                {!isValidAmount && topUpAmount && (
                  <div className="text-xs text-amber-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Minimum amount is €20
                  </div>
                )}

                <Button
                  onClick={handleTopUp}
                  disabled={!isValidAmount || isProcessing}
                  className="w-full bg-[#5B6CFF] hover:bg-[#4A5BEE] text-white h-11 rounded-xl"
                >
                  {isProcessing ? (
                    'Processing...'
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Credits
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Admin View - Plan Info */}
          {isAdmin && (
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-white/95">Admin Account</div>
                  <div className="text-sm text-emerald-400">Unlimited access enabled</div>
                </div>
              </div>
              <p className="text-white/50 text-sm">
                Your account has been granted unlimited credits. All preflight runs are free.
              </p>
            </div>
          )}
        </div>

        {/* Transaction History */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <History className="h-5 w-5 text-white/50" />
            <h2 className="text-lg font-semibold text-white/95">Transaction History</h2>
          </div>

          {ledgerEntries.length === 0 ? (
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-8 text-center">
              <History className="h-8 w-8 text-white/20 mx-auto mb-2" />
              <p className="text-white/40 text-sm">No transactions yet</p>
            </div>
          ) : (
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden">
              <div className="divide-y divide-white/[0.04]">
                {ledgerEntries.map((entry, i) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        entry.type === 'topup' || entry.type === 'grant'
                          ? 'bg-emerald-500/10'
                          : 'bg-rose-500/10'
                      }`}>
                        {entry.type === 'topup' || entry.type === 'grant' ? (
                          <ArrowDown className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <ArrowUp className="h-4 w-4 text-rose-400" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm text-white/90">{entry.reason}</div>
                        <div className="text-xs text-white/40">
                          {new Date(entry.ts).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className={`font-medium ${
                      entry.delta > 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {entry.delta > 0 ? '+' : ''}{entry.delta}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pricing Info */}
        {!isAdmin && (
          <div className="mt-8 p-6 bg-white/[0.02] border border-white/[0.08] rounded-2xl">
            <h3 className="text-lg font-semibold text-white/95 mb-4">Credit Usage</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70">EU 1169/2011 Preflight</span>
                  <span className="text-[#5B6CFF] font-medium">1 credit</span>
                </div>
                <p className="text-xs text-white/40">Core compliance checks for EU labeling</p>
              </div>
              <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70">+ Halal Module</span>
                  <span className="text-emerald-400 font-medium">+1 credit</span>
                </div>
                <p className="text-xs text-white/40">Additional Halal export-readiness checks</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
