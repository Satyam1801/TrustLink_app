import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Link from 'next/link';

export const metadata = {
  title: 'TrustLink — Verified Identity, One Link',
  description: 'Build your verified digital identity. Share one trusted link everywhere. Start free or go premium.',
};

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Ambient background */}
      <div className="bg-mesh" />
      <div className="grid-lines" />
      {/* Floating orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <Navbar />
      <Hero />

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center space-y-16">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">How It Works</p>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-white">Up and running in <span className="gradient-text">60 seconds</span></h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up free in seconds. No credit card required.' },
              { step: '02', title: 'Add Your Links', desc: 'Add all your professional links, profiles, and social handles.' },
              { step: '03', title: 'Share Your Link', desc: 'Share one single TrustLink URL everywhere. Get verified.' },
            ].map((s) => (
              <div key={s.step} className="glass-card p-8 space-y-4 relative overflow-hidden group hover:-translate-y-2 transition-all duration-500">
                <div className="absolute top-4 right-6 text-7xl font-black text-white/[0.03] select-none group-hover:text-white/[0.06] transition-colors">{s.step}</div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm"
                  style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 0 24px rgba(99,102,241,0.4)' }}>
                  {s.step}
                </div>
                <h3 className="text-lg font-bold text-white">{s.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="relative z-10 py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6 glass-card p-10 sm:p-16"
          style={{ border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 0 80px rgba(99,102,241,0.08)' }}>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tighter">
            <span className="text-white">Build Your</span><br />
            <span className="gradient-text">Digital Trust Today</span>
          </h2>
          <p className="text-white/40 max-w-md mx-auto text-sm sm:text-base">Join thousands of professionals who trust TrustLink to manage their verified online identity.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register?plan=free" className="w-full sm:w-auto text-center font-bold text-sm px-8 py-4 rounded-xl text-white transition-all"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 8px 32px rgba(99,102,241,0.35)' }}>
              Start Free — No Card Needed
            </Link>
            <Link href="/register?plan=premium" className="w-full sm:w-auto text-center font-bold text-sm px-8 py-4 rounded-xl transition-all text-white/80 hover:text-white"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              Go Premium — $5/mo
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t py-10 px-4 sm:px-6" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2 font-bold text-white/70">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
              <span className="text-white text-xs font-black">T</span>
            </div>
            TrustLink
          </div>
          <p className="text-xs text-white/25">© 2026 TrustLink. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-white/30 font-medium mt-4 sm:mt-0">
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
