"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, Link as LinkIcon, MessageSquare, Trash2, DollarSign, Ban } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function AdminDashboard() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const resFb = await fetch('http://localhost:5000/api/feedback', {
          headers: { 'Content-Type': 'application/json' },
        });
        const dataFb = await resFb.json();
        if (dataFb.success) setFeedbacks(dataFb.feedbacks);

        const resUsr = await fetch('http://localhost:5000/api/admin/users', {
          headers: { 'Content-Type': 'application/json' },
        });
        const dataUsr = await resUsr.json();
        if (dataUsr.success) setUsersList(dataUsr.users);

      } catch (err) {
        setError('Failed to load admin data. Ensure you are an Admin.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleBlockUser = async (id: string) => {
    await fetch(`http://localhost:5000/api/admin/users/${id}/block`, { method: 'PUT' });
    setUsersList(usersList.map(u => u.id === id ? { ...u, role: 'BLOCKED' } : u));
  };

  const handleDeleteUser = async (id: string) => {
    if(confirm('Are you sure you want to completely delete this user?')) {
      await fetch(`http://localhost:5000/api/admin/users/${id}`, { method: 'DELETE' });
      setUsersList(usersList.filter(u => u.id !== id));
    }
  };

  if (loading) return <div className="min-h-screen bg-mesh flex items-center justify-center text-white">Loading Admin Panel...</div>;

  return (
    <main className="min-h-screen bg-mesh py-32 px-6">
      <Navbar />
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <ShieldCheck className="w-10 h-10 text-emerald-400" />
          <div>
            <h1 className="text-4xl font-extrabold tracking-tighter">Admin Portal</h1>
            <p className="text-white/50 text-sm">System oversight and user management.</p>
          </div>
        </div>

        {error && <div className="bg-red-500/10 text-red-500 p-4 rounded-xl border border-red-500/30 font-semibold">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Users', value: usersList.length, icon: Users, color: 'text-blue-400' },
            { label: 'Active Links', value: usersList.reduce((acc, curr) => acc + curr._count.links, 0), icon: LinkIcon, color: 'text-purple-400' },
            { label: 'Feedback Items', value: feedbacks.length, icon: MessageSquare, color: 'text-yellow-400' },
            { label: 'Pro Revenue', value: '$8,400', icon: DollarSign, color: 'text-emerald-400' }
          ].map((stat, i) => (
            <motion.div key={i} className="glass-card p-6 flex flex-col items-center justify-center gap-4 text-center">
              <div className={`bg-white/5 p-4 rounded-xl border border-white/10 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono">{stat.value}</p>
                <p className="text-xs text-white/40 uppercase tracking-widest">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 👥 User Management */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-white/50" /> User Management
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/70 glass-card">
              <thead className="bg-white/5 text-xs uppercase text-white/50">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role / Status</th>
                  <th className="px-6 py-4">Links</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((user) => (
                  <tr key={user.id} className="border-b border-white/5">
                    <td className="px-6 py-4 font-medium text-white">
                      {user.username}
                      <div className="text-xs text-white/40">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${user.role === 'BLOCKED' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>{user.role}</span>
                    </td>
                    <td className="px-6 py-4">{user._count.links}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => handleBlockUser(user.id)} className="p-2 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 rounded-lg" title="Block User">
                        <Ban className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteUser(user.id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg" title="Delete User">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 💬 Feedback Management */}
        <div className="space-y-4 pt-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-white/50" /> User Feedback Log
          </h2>
          
          <div className="grid gap-4">
            {feedbacks.length === 0 ? (
              <p className="text-white/50">No feedback entries yet.</p>
            ) : feedbacks.map((fb, i) => (
              <motion.div key={fb.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} className="glass-card p-6 flex items-start justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-blue-400">@{fb.user.username}</span>
                    <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full">{fb.rating} Stars</span>
                    <span className="text-xs text-white/30">{new Date(fb.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-white/80">{fb.message}</p>
                </div>
                <button className="text-red-400 hover:text-red-300 transition-colors p-2 bg-red-500/10 rounded-lg">
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 💰 Monetization Controls */}
        <div className="space-y-4 pt-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-white/50" /> Monetization Settings
          </h2>
          <div className="glass-card p-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-emerald-500/20">
            <div>
              <h3 className="font-bold text-lg mb-2 text-emerald-400">Freemium Limits</h3>
              <p className="text-sm text-white/50 mb-4">Control how many links free accounts can generate.</p>
              <div className="flex gap-4 items-center">
                <input type="number" defaultValue="3" className="w-20 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-center" />
                <button className="glass-button bg-white/10 text-sm py-2">Save Limit</button>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2 text-emerald-400">Ad Integrations</h3>
              <p className="text-sm text-white/50 mb-4">Toggle sponsored links actively injecting into free profiles.</p>
              <button className="glass-button bg-emerald-600 border-none font-bold shadow-lg shadow-emerald-500/20 text-sm py-2">
                Disable Network Ads
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
