"use client";
import { motion } from 'framer-motion';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PaymentFailedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4" style={{ background: '#04050a' }}>
      <div className="bg-mesh" />
      <div className="orb orb-1" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card max-w-md w-full p-10 text-center relative"
        style={{ border: '1px solid rgba(239,68,68,0.2)', boxShadow: '0 0 80px rgba(239,68,68,0.08)' }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6"
          style={{ background: 'rgba(239,68,68,0.15)', border: '2px solid rgba(239,68,68,0.3)' }}
        >
          <XCircle className="w-10 h-10 text-red-400" />
        </motion.div>

        <h1 className="text-3xl font-black text-white mb-2">Payment Failed</h1>
        <p className="text-white/40 text-sm mb-8">
          Your payment could not be processed. No charges were made. Please try again or use a different payment method.
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/pricing"
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 8px 32px rgba(99,102,241,0.35)' }}>
            <RefreshCw className="w-4 h-4" /> Try Again
          </Link>
          <Link href="/dashboard"
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white/60 hover:text-white flex items-center justify-center gap-2 transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
