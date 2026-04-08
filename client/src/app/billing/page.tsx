"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Crown, Clock, CheckCircle, XCircle, ArrowLeft, Download, Coins } from 'lucide-react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  type: string;
  status: string;
  planOrPack: string | null;
  creditsAdded: number | null;
  couponUsed: string | null;
  createdAt: string;
}

export default function BillingPage() {
  const [subscription, setSubscription] = useState<any>(null);
  const [plan, setPlan] = useState('FREE');
  const [credits, setCredits] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/billing/subscription`, { credentials: 'include' }).then(r => r.json()),
      fetch(`${API}/api/billing/history`, { credentials: 'include' }).then(r => r.json()),
    ]).then(([subData, histData]) => {
      if (subData.success) {
        setSubscription(subData.subscription);
        setPlan(subData.plan || 'FREE');
        setCredits(subData.credits || 0);
      }
      if (histData.success) {
        setTransactions(histData.transactions || []);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const planColors: Record<string, string> = { FREE: '#6366f1', BASIC: '#6366f1', PRO: '#f59e0b' };
  const statusIcons: Record<string, any> = { success: CheckCircle, failed: XCircle, pending: Clock };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: '#04050a' }}>
        <div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen relative" style={{ background: '#04050a' }}>
      <div className="bg-mesh" />
      <div className="orb orb-1" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        <Link href="/dashboard" className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors w-fit mb-8">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">Billing & Subscription</h1>
          <p className="text-white/40 text-sm mb-10">Manage your plan, view transaction history, and download invoices.</p>
        </motion.div>

        {/* Current Plan Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: `${planColors[plan]}20`, border: `1px solid ${planColors[plan]}40` }}>
                <Crown className="w-6 h-6" style={{ color: planColors[plan] }} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{plan} Plan</h2>
                {subscription ? (
                  <p className="text-white/40 text-sm">
                    Renews {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                ) : (
                  <p className="text-white/40 text-sm">Free forever</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="text-xl font-black text-white">{credits}</span>
                </div>
                <p className="text-white/30 text-xs">credits remaining</p>
              </div>
              <Link href="/pricing"
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 20px rgba(99,102,241,0.3)' }}>
                {plan === 'FREE' ? 'Upgrade' : 'Change Plan'}
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Transaction History */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-400" /> Transaction History
          </h2>

          {transactions.length === 0 ? (
            <div className="glass-card p-10 text-center">
              <CreditCard className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-sm">No transactions yet.</p>
              <Link href="/pricing" className="text-indigo-400 text-sm font-bold hover:text-indigo-300 transition-colors mt-2 inline-block">
                View Plans →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx, i) => {
                const StatusIcon = statusIcons[tx.status] || Clock;
                const statusColor = tx.status === 'success' ? '#22c55e' : tx.status === 'failed' ? '#ef4444' : '#f59e0b';
                return (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="glass-card p-5 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <StatusIcon className="w-5 h-5 flex-shrink-0" style={{ color: statusColor }} />
                      <div>
                        <p className="text-sm font-bold text-white">
                          {tx.type === 'subscription' ? `${tx.planOrPack} Plan` : `${tx.planOrPack} Credit Pack`}
                        </p>
                        <p className="text-xs text-white/30">
                          {new Date(tx.createdAt).toLocaleDateString()} · {tx.status}
                          {tx.couponUsed && ` · Coupon: ${tx.couponUsed}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">{tx.currency} {tx.amount}</p>
                      {tx.creditsAdded && <p className="text-xs text-green-400">+{tx.creditsAdded} credits</p>}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
