"use client";
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, ExternalLink, Trash2, CheckCircle2, TrendingUp, Settings,
  Edit3, MessageSquare, Star, Loader2, X, LogOut, Home
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ── Types ──────────────────────────────────────────────────────────────────
interface TrustLink {
  id: string;
  title: string;
  url: string;
  isVerified: boolean;
  clickCount: number;
  password?: string | null;
  expiresAt?: string | null;
}

interface Profile {
  trustScore: number;
  verified: boolean;
}

interface LinkFormData {
  id?: string;
  title: string;
  url: string;
  password: string;
  expiresAt: string;
}

// ── Dashboard ──────────────────────────────────────────────────────────────
export default function Dashboard() {
  const router = useRouter();
  const [links, setLinks] = useState<TrustLink[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [newLink, setNewLink] = useState<LinkFormData>({ title: '', url: '', password: '', expiresAt: '' });
  const [feedback, setFeedback] = useState({ message: '', rating: 5 });
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/links', {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',   // ✅ FIX: proper credentials
      });
      const data = await res.json();
      if (data.success) {
        setLinks(data.links ?? []);
        setProfile(data.profile ?? null);
      } else if (res.status === 401) {
        router.push('/login');
      } else {
        setError(data.message || 'Failed to load data.');
      }
    } catch {
      setError('Cannot reach server. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/links/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: newLink.title,
          url: newLink.url,
          password: newLink.password || null,
          expiresAt: newLink.expiresAt || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setLinks((prev) => [...prev, data.link]);
        closeAddModal();
      } else {
        setError(data.message || 'Failed to add link.');
      }
    } catch {
      setError('Failed to add link. Check server connection.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleUpdateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.id) return;
    setSaveLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/links/${newLink.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: newLink.title,
          url: newLink.url,
          password: newLink.password || null,
          expiresAt: newLink.expiresAt || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchDashboardData();
        closeAddModal();
      } else {
        setError(data.message || 'Failed to update link.');
      }
    } catch {
      setError('Failed to update link.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm('Delete this link permanently?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/links/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setLinks((prev) => prev.filter((l) => l.id !== id));
      } else {
        setError(data.message || 'Failed to delete link.');
      }
    } catch {
      setError('Failed to delete link.');
    }
  };

  const submitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(feedback),
      });
      const data = await res.json();
      if (data.success) {
        setShowFeedbackModal(false);
        setFeedback({ message: '', rating: 5 });
        alert('Feedback submitted! Thank you 🙏');
      }
    } catch {
      setError('Failed to submit feedback.');
    }
  };

  const handleLogout = async () => {
    await fetch('http://localhost:5000/api/auth/logout', { method: 'POST', credentials: 'include' });
    router.push('/');
  };

  const openEditModal = (link: TrustLink) => {
    setNewLink({
      id: link.id,
      title: link.title,
      url: link.url,
      password: link.password || '',
      expiresAt: link.expiresAt ? link.expiresAt.split('T')[0] : '',
    });
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setNewLink({ title: '', url: '', password: '', expiresAt: '' });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#04050a' }}>
      <Loader2 className="animate-spin text-indigo-400 w-10 h-10" />
    </div>
  );

  const totalClicks = links.reduce((acc, curr) => acc + (curr.clickCount || 0), 0);
  const verifiedCount = links.filter((l) => l.isVerified).length;

  return (
    <main className="min-h-screen py-20 px-4 sm:px-6" style={{ background: '#04050a' }}>
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* Top nav */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 flex justify-between items-center"
        style={{ background: 'rgba(4,5,10,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Link href="/" className="flex items-center gap-2 font-black text-lg text-white">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>T</div>
          TrustLink
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors">
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors px-3 py-1.5 rounded-lg"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-8 relative pt-8 z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-white">My Dashboard</h1>
            <p className="text-white/40 text-sm mt-1">Manage your verified links and profile</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => setShowFeedbackModal(true)}
              className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl transition-all text-white/70 hover:text-white"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <MessageSquare className="w-4 h-4" /> Feedback
            </button>
            <button onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl transition-all text-white"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 20px rgba(99,102,241,0.35)' }}>
              <Plus className="w-4 h-4" /> Add New Link
            </button>
          </div>
        </motion.div>

        {error && (
          <div className="bg-red-500/10 text-red-400 text-sm p-4 rounded-xl border border-red-500/20 flex items-center gap-3">
            <span>⚠</span> {error}
            <button onClick={() => setError('')} className="ml-auto text-red-400/50 hover:text-red-400"><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Trust Score', value: `${profile?.trustScore ?? 0}/100`, icon: TrendingUp, color: '#10b981' },
            { label: 'Total Clicks', value: totalClicks, icon: ExternalLink, color: '#6366f1' },
            { label: 'Verified Links', value: `${verifiedCount}/${links.length}`, icon: CheckCircle2, color: '#a78bfa' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
              className="glass-card p-5 flex items-center gap-4">
              <div className="p-3 rounded-xl flex-shrink-0" style={{ background: `${stat.color}18`, border: `1px solid ${stat.color}30` }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest">{stat.label}</p>
                <p className="text-xl font-black font-mono text-white">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Links list */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings className="w-4 h-4 text-white/30" /> Active Links ({links.length})
          </h2>

          {links.length === 0 ? (
            <div className="glass-card p-12 text-center space-y-4">
              <div className="text-5xl">🔗</div>
              <p className="text-white/40 text-sm">No links yet. Add your first TrustLink above!</p>
              <button onClick={() => setShowAddModal(true)} className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                + Add your first link
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {links.map((link, i) => (
                <motion.div key={link.id}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                  className="glass-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                  style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
                      <ExternalLink className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-white flex items-center gap-2">
                        <span className="truncate max-w-[180px] sm:max-w-none">{link.title}</span>
                        {link.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />}
                      </h3>
                      <p className="text-xs text-white/30 truncate">{link.url}</p>
                      <div className="flex gap-3 mt-1">
                        {link.expiresAt && <span className="text-[10px] text-red-400 font-bold">Expires {new Date(link.expiresAt).toLocaleDateString()}</span>}
                        {link.password && <span className="text-[10px] text-yellow-400 font-bold">🔒 Password Protected</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-auto flex-shrink-0">
                    <span className="text-xs text-white/30 px-2 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      {link.clickCount} clicks
                    </span>
                    <button onClick={() => openEditModal(link)}
                      className="p-2 rounded-lg transition-all"
                      style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}
                      title="Edit link">
                      <Edit3 className="w-4 h-4 text-indigo-400" />
                    </button>
                    <button onClick={() => handleDeleteLink(link.id)}
                      className="p-2 rounded-lg transition-all"
                      style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}
                      title="Delete link">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Add / Edit Link Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) closeAddModal(); }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="glass-card w-full max-w-lg p-7 space-y-5"
            style={{ border: '1px solid rgba(99,102,241,0.25)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-white">{newLink.id ? 'Edit Link' : 'Add New TrustLink'}</h3>
              <button onClick={closeAddModal} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={newLink.id ? handleUpdateLink : handleAddLink} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest block mb-1.5">Title</label>
                <input required type="text" placeholder="e.g. My Portfolio"
                  value={newLink.title} onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
              </div>
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest block mb-1.5">URL</label>
                <input required type="url" placeholder="https://yourwebsite.com"
                  value={newLink.url} onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
              </div>

              <div className="pt-2 pb-1">
                <p className="text-xs font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
                  🔒 Premium Security Features
                  <span className="normal-case font-normal text-indigo-400">(Upgrade to unlock)</span>
                </p>
              </div>
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest block mb-1.5">Password Protection</label>
                <input type="password" placeholder="Optional password for this link"
                  value={newLink.password} onChange={(e) => setNewLink({ ...newLink, password: e.target.value })}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }} />
              </div>
              <div>
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest block mb-1.5">Expiry Date</label>
                <input type="date"
                  value={newLink.expiresAt} onChange={(e) => setNewLink({ ...newLink, expiresAt: e.target.value })}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none [color-scheme:dark]"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }} />
              </div>

              <button type="submit" disabled={saveLoading}
                className="w-full font-bold py-3.5 rounded-xl text-white transition-all disabled:opacity-50 mt-2"
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 8px 24px rgba(99,102,241,0.35)' }}>
                {saveLoading ? 'Saving...' : newLink.id ? 'Save Changes' : 'Add Link'}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* ── Feedback Modal ── */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowFeedbackModal(false); }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="glass-card w-full max-w-md p-7 space-y-5"
            style={{ border: '1px solid rgba(16,185,129,0.2)' }}>
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-white">Share Your Feedback</h3>
              <button onClick={() => setShowFeedbackModal(false)} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={submitFeedback} className="space-y-4">
              <textarea required rows={4} placeholder="How can we improve TrustLink?"
                value={feedback.message} onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/40">Rating:</span>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map((n) => (
                    <button key={n} type="button" onClick={() => setFeedback({ ...feedback, rating: n })}
                      className="transition-transform hover:scale-110">
                      <Star className={`w-6 h-6 ${feedback.rating >= n ? 'text-yellow-400' : 'text-white/20'}`}
                        fill={feedback.rating >= n ? '#facc15' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full font-bold py-3.5 rounded-xl text-white transition-all"
                style={{ background: 'linear-gradient(135deg,#059669,#10b981)', boxShadow: '0 8px 24px rgba(16,185,129,0.3)' }}>
                Submit Feedback
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </main>
  );
}
