"use client";
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  ExternalLink,
  Globe,
  MoreVertical,
  ArrowUpRight,
  TrendingUp,
  Link2
} from 'lucide-react';

export default function PublicProfile({ params }: { params: { username: string } }) {
  const { username } = params;

  // 🌐 Generic placeholder — will be replaced with real DB fetch in production
  const profile = {
    name: username.charAt(0).toUpperCase() + username.slice(1),
    bio: 'Building awesome things on the internet. Add a bio by upgrading your profile.',
    avatar: `https://ui-avatars.com/api/?name=${username}&background=1e3a5f&color=60a5fa&size=256&bold=true&format=png`,
    trustScore: 78,
    verified: true,
    isPremium: false,
    socials: [
      { id: 1, title: 'My Portfolio', url: '#', icon: Globe, type: 'Personal' },
      { id: 2, title: 'Professional Profile', url: '#', icon: ExternalLink, type: 'Professional' },
      { id: 3, title: 'My Website', url: '#', icon: Link2, type: 'Web' }
    ]
  };

  return (
    <main className="min-h-screen bg-mesh py-32 px-6 flex flex-col items-center">
      {/* 🔮 Profile Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`glass-card max-w-xl w-full p-8 md:p-12 text-center space-y-8 relative group ${profile.isPremium ? 'border-yellow-500/30 shadow-2xl shadow-yellow-500/10' : ''}`}
      >
        <div className="absolute top-6 right-6">
          <MoreVertical className="w-6 h-6 text-white/20 hover:text-white cursor-pointer" />
        </div>

        <div className="relative inline-block">
          <motion.img 
            initial={{ scale: 0.5, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            src={profile.avatar} 
            alt={profile.name}
            className={`w-32 h-32 rounded-full border-4 shadow-2xl ${profile.isPremium ? 'border-yellow-400/50 shadow-yellow-500/20' : 'border-white/10 shadow-blue-500/10'}`}
          />
          {profile.verified && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1 }}
              className={`absolute -bottom-2 -right-2 p-2 rounded-full shadow-lg ${profile.isPremium ? 'bg-gradient-to-br from-yellow-300 to-yellow-600' : 'bg-blue-500'}`}
            >
              <CheckCircle2 className="w-5 h-5 text-white" />
            </motion.div>
          )}
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tighter">
            {profile.name}
          </h1>
          <p className={`text-sm font-bold tracking-widest uppercase ${profile.isPremium ? 'text-yellow-400' : 'text-blue-400'}`}>
            @{username} • TRUST SCORE {profile.trustScore}%
          </p>
          <p className="text-white/60 leading-relaxed font-light text-lg">
            {profile.bio}
          </p>
        </div>

        <div className="pt-8 grid gap-4">
          {profile.socials.map((link, i) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (0.1 * i) }}
              className="glass-button w-full py-5 flex items-center justify-between group hover:scale-[1.02] transition-all"
            >
              <div className="flex items-center gap-4">
                <link.icon className={`w-6 h-6 ${profile.isPremium ? 'text-yellow-400' : 'text-blue-400'}`} />
                <div className="text-left">
                  <h4 className="font-bold text-lg">{link.title}</h4>
                  <p className="text-xs text-white/30 uppercase tracking-widest font-bold">{link.type}</p>
                </div>
              </div>
              <ArrowUpRight className="w-6 h-6 text-white/20 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </motion.a>
          ))}

          {/* 💰 ETHICAL AD INTEGRATION (Freemium Monetization) */}
          {!profile.isPremium && (
            <motion.a
              href="https://notion.so"
              target="_blank"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-button w-full py-5 flex items-center justify-between group hover:scale-[1.02] transition-all border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10"
            >
              <div className="flex items-center gap-4">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
                <div className="text-left">
                  <h4 className="font-bold text-lg text-emerald-200">Organize with Notion (Sponsored)</h4>
                  <p className="text-xs text-emerald-400/50 uppercase tracking-widest font-bold">ETHICAL AD</p>
                </div>
              </div>
              <ArrowUpRight className="w-6 h-6 text-emerald-400/50 group-hover:text-emerald-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </motion.a>
          )}
        </div>

        {/* ❌ REMOVE BRANDING IF PREMIUM */}
        {!profile.isPremium && (
          <div className="pt-12 text-xs text-white/20 flex flex-col items-center gap-2">
            <span>Powered by</span>
            <div className="flex items-center gap-2 font-bold text-white/50">
              <CheckCircle2 className="w-4 h-4" />
              TRUSTLINK VERIFIED
            </div>
          </div>
        )}
      </motion.div>

      {/* 🚀 Sticky Bottom CTA */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-8 px-6 py-3 glass-card flex items-center gap-4 shadow-2xl"
      >
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <span className="text-sm text-white/50">Want a verified profile like this?</span>
          <a href="/register" className="text-sm font-bold bg-white text-black px-6 py-2 rounded-xl hover:bg-blue-400 transition-colors whitespace-nowrap">
            Claim Yours Free →
          </a>
        </div>
      </motion.div>
    </main>
  );
}
