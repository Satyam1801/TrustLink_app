"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Shield, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',          // ✅ FIX: was 'true' (string), must be 'include'
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message || 'Login failed. Check your credentials.');
      } else {
        if (data.user.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }
    } catch {
      setError('Cannot reach server. Make sure backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Google OAuth requires a Google Cloud Console app setup.
    // Redirect to backend OAuth endpoint when configured.
    setError('Google Sign-In requires setup in Google Cloud Console. Use email/password for now.');
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6" style={{ background: '#04050a' }}>
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card max-w-md w-full p-8 sm:p-10 space-y-7 relative"
        style={{ border: '1px solid rgba(99,102,241,0.2)' }}
      >
        {/* Back button */}
        <Link href="/" className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors w-fit">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-4"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 0 32px rgba(99,102,241,0.4)' }}>
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Welcome Back</h2>
          <p className="text-white/40 text-sm">Sign in to your TrustLink account</p>
        </div>

        {error && (
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-4 rounded-xl">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white/50 uppercase tracking-widest flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" /> Email Address
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white/50 uppercase tracking-widest flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" /> Password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full font-bold py-3.5 rounded-xl text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: loading ? 'none' : '0 8px 32px rgba(99,102,241,0.4)' }}
          >
            {loading ? (
              <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing In...</span>
            ) : (
              <span className="flex items-center gap-2"><LogIn className="w-4 h-4" />Sign In</span>
            )}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }} /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="px-3 text-white/30" style={{ background: '#0d0e18' }}>Or continue with</span></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full font-bold py-3.5 rounded-xl text-white/70 hover:text-white transition-all flex items-center justify-center gap-3"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <div className="text-center space-y-3 pt-1">
          <p className="text-sm text-white/40">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">Sign Up Free</Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
