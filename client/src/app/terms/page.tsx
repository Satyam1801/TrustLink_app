import Navbar from '@/components/Navbar';
import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions — TrustLink',
  description: 'Terms and Conditions for using TrustLink services.',
};

export default function TermsPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#0a0a0f]">
      <div className="bg-mesh" />
      <Navbar />

      <section className="relative z-10 py-24 px-4 sm:px-6 max-w-4xl mx-auto text-white/80">
        <h1 className="text-4xl font-black text-white mb-8">Terms & Conditions</h1>
        
        <div className="space-y-8 text-sm leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using TrustLink, you agree to comply with and be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">2. Description of Service</h2>
            <p>TrustLink provides a unified link-in-bio platform that offers verified identity checks and link aggregation services. Premium subscription plans provide access to advanced analytics, custom links, and the removal of TrustLink branding.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">3. User Accounts & Responsibilities</h2>
            <p>You must provide accurate and complete information when creating an account. You are responsible for maintaining the security of your password and account. You must not use the service for any illegal or unauthorized purpose.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">4. Payments, Refunds, and Credits</h2>
            <p>TrustLink uses credits for premium features and generation actions. Subscription payments are processed via third-party gateways (e.g., Razorpay). Refund requests are handled on a case-by-case basis. Extra credits can be purchased as one-time packs and they do not expire as long as your account remains active.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">5. Termination</h2>
            <p>We reserve the right to suspend or terminate your account at any time for violations of these Terms, impersonation, or malicious activity.</p>
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
