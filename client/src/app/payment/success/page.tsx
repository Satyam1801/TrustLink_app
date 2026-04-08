"use client";
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4" style={{ background: '#04050a' }}>
      <div className="bg-mesh" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card max-w-md w-full p-10 text-center relative"
        style={{ border: '1px solid rgba(34,197,94,0.2)', boxShadow: '0 0 80px rgba(34,197,94,0.08)' }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6"
          style={{ background: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.3)' }}
        >
          <CheckCircle className="w-10 h-10 text-green-400" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h1 className="text-3xl font-black text-white mb-2">Payment Successful!</h1>
          <p className="text-white/40 text-sm mb-6">Your plan has been activated and credits have been added to your account.</p>

          <div className="flex items-center justify-center gap-2 text-green-400 text-sm font-bold mb-8">
            <Sparkles className="w-4 h-4" /> Premium features unlocked
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/dashboard"
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 8px 32px rgba(99,102,241,0.35)' }}>
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/billing"
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white/60 hover:text-white transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              View Billing History
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
