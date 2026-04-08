import Navbar from '@/components/Navbar';

export default function Explore() {
  return (
    <main className="min-h-screen bg-mesh py-32 px-6">
      <Navbar />
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tighter">Explore Verified Profiles</h1>
        <p className="text-white/50 text-sm mt-1">Discover industry leaders with high TrustScores.</p>
        <div className="flex flex-col items-center justify-center p-20 glass-card">
          <p className="text-xl font-bold">More profiles coming soon...</p>
        </div>
      </div>
    </main>
  );
}
