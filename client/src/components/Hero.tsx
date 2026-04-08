"use client";
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, Zap, ShieldCheck, Globe, Link2, Star, Crown } from 'lucide-react';
import { useRef } from 'react';

// ─── 3D Tilt Card ──────────────────────────────────────────────────────────
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Floating Stat Badge ────────────────────────────────────────────────────
function FloatBadge({ text, delay, position }: { text: string; delay: number; position: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: [0, -10, 0] }}
      transition={{ delay, duration: 3, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
      className={`absolute hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold ${position}`}
      style={{ background: 'rgba(15,16,30,0.9)', border: '1px solid rgba(99,102,241,0.3)', backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(99,102,241,0.2)' }}
    >
      {text}
    </motion.div>
  );
}

// ─── Main Hero ──────────────────────────────────────────────────────────────
export default function Hero() {
  const router = useRouter();

  const handleSelect = (plan: 'free' | 'premium') => {
    if (plan === 'premium') {
      router.push('/register?plan=premium');
    } else {
      router.push('/register?plan=free');
    }
  };

  const features = [
    { icon: ShieldCheck, label: 'Verified Identity' },
    { icon: Globe, label: 'Universal Profile' },
    { icon: Zap, label: 'Instant Setup' },
    { icon: Link2, label: 'Smart Links' },
  ];

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-start pt-28 pb-32 px-4 sm:px-6 overflow-hidden">

      {/* ── Hero Content ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-4xl w-full text-center space-y-6 relative z-10"
      >
        {/* Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mx-auto"
          style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)' }}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-xs font-bold tracking-widest uppercase text-indigo-300">Next-Gen Identity Verification</span>
        </motion.div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[1.05]">
          <span className="text-white">Your Identity.</span>
          <br />
          <span className="shine-text">Verified. Trusted.</span>
        </h1>

        {/* Subtext */}
        <p className="text-base sm:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed font-light">
          One powerful link that proves who you are. Share your verified professional identity anywhere — in seconds.
        </p>

        {/* Features row */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {features.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-white/50"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <Icon className="w-3.5 h-3.5 text-indigo-400" />
              {label}
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Plan Selection Cards ── */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl w-full mt-16 md:mt-20 relative z-10"
      >
        {/* FREE PLAN */}
        <TiltCard className="plan-card plan-card-free">
          <button
            onClick={() => handleSelect('free')}
            className="plan-card-inner w-full text-left flex flex-col gap-5 group focus:outline-none"
          >
            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(99,102,241,0.1))', border: '1px solid rgba(99,102,241,0.3)' }}>
              <Zap className="w-7 h-7 text-indigo-400" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-2xl font-black text-white">Free</p>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)' }}>Forever Free</span>
              </div>
              <p className="text-white/40 text-sm leading-relaxed">Start building your verified digital presence with core features at zero cost.</p>
            </div>

            <ul className="space-y-2.5 text-sm text-white/60 flex-1">
              {['3 Trust Links', 'Verified Badge', 'Basic Analytics', 'TrustLink Branding'].map((f) => (
                <li key={f} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(99,102,241,0.2)' }}>
                    <span className="text-indigo-400 text-[10px]">✓</span>
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mt-2 group-hover:gap-3 transition-all">
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </TiltCard>

        {/* PREMIUM PLAN */}
        <TiltCard className="plan-card plan-card-premium">
          <button
            onClick={() => handleSelect('premium')}
            className="plan-card-inner w-full text-left flex flex-col gap-5 group focus:outline-none relative"
          >
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest"
              style={{ background: 'linear-gradient(90deg, #f59e0b, #f97316)', color: 'white', boxShadow: '0 4px 20px rgba(251,191,36,0.4)' }}>
              <Star className="w-3 h-3" fill="white" />
              Most Popular
            </div>

            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mt-1"
              style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.3), rgba(249,115,22,0.2))', border: '1px solid rgba(251,191,36,0.35)' }}>
              <Crown className="w-7 h-7 text-yellow-400" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-2xl font-black text-white">Premium</p>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(251,191,36,0.15)', color: '#fcd34d', border: '1px solid rgba(251,191,36,0.25)' }}>$5 / month</span>
              </div>
              <p className="text-white/40 text-sm leading-relaxed">Unlock the full power of TrustLink with advanced features and premium branding.</p>
            </div>

            <ul className="space-y-2.5 text-sm text-white/60 flex-1">
              {['Unlimited Trust Links', 'Gold Verified Badge', 'Advanced Analytics', 'No TrustLink Branding', 'Password-Protected Links', 'Custom Expiry Dates'].map((f) => (
                <li key={f} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(251,191,36,0.2)' }}>
                    <span className="text-yellow-400 text-[10px]">✓</span>
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm mt-2 group-hover:gap-3 transition-all">
              Upgrade to Premium
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </TiltCard>
      </motion.div>

      {/* ── Social proof ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-12 flex flex-col sm:flex-row items-center gap-4 sm:gap-8 z-10"
      >
        <div className="flex -space-x-3">
          {['I','K','A','M','R'].map((l, i) => (
            <div key={i} className="w-9 h-9 rounded-full border-2 border-[#04050a] flex items-center justify-center text-xs font-bold"
              style={{ background: `hsl(${220 + i * 30}, 70%, 45%)`, zIndex: 5 - i }}>
              {l}
            </div>
          ))}
        </div>
        <div className="text-center sm:text-left">
          <p className="text-white/70 text-sm font-semibold">Trusted by <span className="text-white font-bold">2,400+</span> professionals</p>
          <div className="flex items-center gap-1 justify-center sm:justify-start mt-0.5">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-yellow-400" fill="#facc15" />)}
            <span className="text-white/40 text-xs ml-1">4.9 / 5 rating</span>
          </div>
        </div>
      </motion.div>

      {/* Floating ambient label */}
      <FloatBadge text="🛡️ 2,400+ Verified Profiles" delay={1.2} position="top-40 left-8 lg:left-24" />
      <FloatBadge text="⚡ Link goes live instantly" delay={1.6} position="top-60 right-8 lg:right-24" />
      <FloatBadge text="✅ 100% Free to Start" delay={2.0} position="top-80 left-4 lg:left-16" />
    </section>
  );
}
