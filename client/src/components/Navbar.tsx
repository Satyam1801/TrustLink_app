"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 w-full z-50 px-4 sm:px-8 py-4 flex justify-between items-center"
      style={{ background: 'rgba(4,5,10,0.7)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
      <Link href="/" className="flex items-center gap-2.5 font-extrabold text-xl tracking-tighter select-none">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <span className="gradient-text-blue">TrustLink</span>
      </Link>

      <div className="flex items-center gap-3">
        <Link href="/login" className="text-sm text-white/60 hover:text-white transition-colors font-medium px-4 py-2 hidden sm:block">
          Sign In
        </Link>
        <Link
          href="/register"
          className="text-sm font-bold px-5 py-2 rounded-xl text-white transition-all duration-300"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}
        >
          Get Started
        </Link>
      </div>
    </motion.nav>
  );
};

export default Navbar;
