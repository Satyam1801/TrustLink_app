import Navbar from '@/components/Navbar';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy — TrustLink',
  description: 'Privacy Policy and Data Protection for TrustLink users.',
};

export default function PrivacyPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0a0a0f]">
      <div className="bg-mesh" />
      <Navbar />

      <section className="relative z-10 py-24 px-4 sm:px-6 max-w-4xl mx-auto text-white/80">
        <h1 className="text-4xl font-black text-white mb-8">Privacy Policy</h1>
        
        <div className="space-y-8 text-sm leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
            <p>When you register for TrustLink, we collect your email address, username, and password (securely hashed). We also collect the links and profile information you choose to display on your public TrustLink page.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">2. How We Use Your Information</h2>
            <p>We use your information to operate and maintain the platform, process your secure payments, manage subscriptions, communicate critical system updates, and provide usage analytics to you.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">3. Data Sharing</h2>
            <p>We absolutely do not sell your personal data. We only share necessary information with our payment processors (e.g., Razorpay) to complete your transactions securely.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">4. Cookies and Tracking</h2>
            <p>TrustLink essentially relies on HTTP-only, secure cookies for secure authentication sessions. We may track generic click metrics on your public URLs to provide analytics data in your Dashboard.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">5. Data Security</h2>
            <p>We implement strict security measures to ensure your data is protected against unauthorized access, alteration, disclosure, or destruction.</p>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex justify-between">
            <Link href="/" className="text-indigo-400 hover:text-indigo-300">← Back to Home</Link>
            <p className="text-white/40 text-xs">Last updated: April 2026</p>
          </div>
        </div>
      </section>
    </main>
  );
}
