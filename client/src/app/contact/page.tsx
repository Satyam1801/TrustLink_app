'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate API call to backend feedback/support endpoint
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    }, 1200);
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0a0a0f]">
      <div className="bg-mesh" />
      <Navbar />

      <section className="relative z-10 py-24 px-4 sm:px-6 max-w-xl mx-auto">
        <div className="glass-card p-10 space-y-8" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black text-white">Contact & Support</h1>
            <p className="text-white/40 text-sm">Have a question or need help with a payment? Send us a message.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Your Name</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="John Doe"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Email Address</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Message</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                placeholder="How can we help?"
              />
            </div>

            {status === 'success' && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-3 rounded-lg text-sm text-center">
                Message sent successfully! We&apos;ll get back to you soon.
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full font-bold text-white py-4 rounded-xl transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
            >
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          <div className="pt-6 border-t border-white/10 text-center">
            <Link href="/" className="text-white/40 hover:text-white text-sm transition-colors">← Back to Home</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
