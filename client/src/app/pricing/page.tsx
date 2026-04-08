"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Sparkles, ArrowRight, CreditCard, Gift, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const PLANS = [
  {
    id: 'FREE',
    name: 'Free',
    price: '₹0',
    period: 'forever',
    icon: Zap,
    color: '#6366f1',
    features: ['3 Trust Links', 'Verified Badge', 'Basic Analytics', 'TrustLink Branding', '10 Credits/month'],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    id: 'BASIC',
    name: 'Basic',
    price: '₹399',
    period: '/month',
    icon: Sparkles,
    color: '#6366f1',
    features: ['20 Trust Links', 'Gold Verified Badge', 'Standard Analytics', 'No Branding', '100 Credits/month', 'Password-Protected Links', 'Email Support'],
    cta: 'Subscribe Now',
    popular: false,
  },
  {
    id: 'PRO',
    name: 'Pro',
    price: '₹999',
    period: '/month',
    icon: Crown,
    color: '#f59e0b',
    features: ['Unlimited Trust Links', 'Gold+ Verified Badge', 'Advanced Analytics', 'No Branding', '500 Credits/month', 'Password + Expiry Links', 'Priority Support', 'Custom Themes'],
    cta: 'Go Pro',
    popular: true,
  },
];

const CREDIT_PACKS = [
  { id: 'starter', name: 'Starter Pack', credits: 50, price: '₹149', priceNum: 149 },
  { id: 'growth', name: 'Growth Pack', credits: 200, price: '₹449', priceNum: 449 },
  { id: 'power', name: 'Power Pack', credits: 500, price: '₹899', priceNum: 899 },
];

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState<number | null>(null);
  const [couponError, setCouponError] = useState('');
  const [showCoupon, setShowCoupon] = useState(false);

  const validateCoupon = async () => {
    setCouponError('');
    try {
      const res = await fetch(`${API}/api/billing/coupon/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code: couponCode.toUpperCase() }),
      });
      const data = await res.json();
      if (data.success) {
        setCouponDiscount(data.coupon.discount);
      } else {
        setCouponError(data.message);
        setCouponDiscount(null);
      }
    } catch {
      setCouponError('Failed to validate coupon');
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (planId === 'FREE') {
      router.push('/register?plan=free');
      return;
    }

    setLoading(planId);
    try {
      const res = await fetch(`${API}/api/billing/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          type: 'subscription',
          planOrPack: planId,
          couponCode: couponDiscount ? couponCode.toUpperCase() : undefined,
        }),
      });
      const data = await res.json();

      if (!data.success) {
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        alert(data.message);
        return;
      }

      // Open Razorpay Checkout
      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'TrustLink',
        description: `${planId} Plan Subscription`,
        order_id: data.order.id,
        handler: async function (response: any) {
          const verifyRes = await fetch(`${API}/api/billing/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            router.push('/payment/success');
          } else {
            router.push('/payment/failed');
          }
        },
        modal: { ondismiss: () => setLoading(null) },
        theme: { color: '#6366f1' },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      alert('Payment initialization failed. Make sure you are logged in.');
    } finally {
      setLoading(null);
    }
  };

  const handleBuyPack = async (packId: string) => {
    setLoading(packId);
    try {
      const res = await fetch(`${API}/api/billing/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ type: 'credit_pack', planOrPack: packId }),
      });
      const data = await res.json();

      if (!data.success) {
        if (res.status === 401) { router.push('/login'); return; }
        alert(data.message);
        return;
      }

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'TrustLink',
        description: `Credit Pack — ${packId}`,
        order_id: data.order.id,
        handler: async function (response: any) {
          const verifyRes = await fetch(`${API}/api/billing/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) router.push('/payment/success');
          else router.push('/payment/failed');
        },
        modal: { ondismiss: () => setLoading(null) },
        theme: { color: '#6366f1' },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch {
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="min-h-screen relative" style={{ background: '#04050a' }}>
      {/* Razorpay SDK */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div className="bg-mesh" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* Header */}
      <div className="relative z-10 py-8 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-white/70 hover:text-white transition-colors">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
              <span className="text-white text-xs font-black">T</span>
            </div>
            TrustLink
          </Link>
          <div className="flex gap-3">
            <Link href="/login" className="text-sm text-white/50 hover:text-white transition-colors px-4 py-2">Sign In</Link>
            <Link href="/register" className="text-sm font-bold text-white px-4 py-2 rounded-xl" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>Sign Up</Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative z-10 pt-12 pb-20 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3">Pricing</p>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-white mb-4">
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h1>
          <p className="text-white/40 max-w-xl mx-auto text-sm sm:text-base">Start free. Upgrade when you need more. No hidden fees. Cancel anytime.</p>
        </motion.div>
      </section>

      {/* Coupon Bar */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 mb-10">
        {!showCoupon ? (
          <button onClick={() => setShowCoupon(true)} className="mx-auto flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
            <Gift className="w-4 h-4" /> Have a coupon code?
          </button>
        ) : (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="max-w-md mx-auto glass-card p-4">
            <div className="flex gap-2">
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
              <button onClick={validateCoupon} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                Apply
              </button>
              <button onClick={() => { setShowCoupon(false); setCouponDiscount(null); setCouponCode(''); }} className="p-2.5 rounded-xl text-white/40 hover:text-white" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            {couponDiscount && <p className="text-green-400 text-xs mt-2 font-bold">✅ Coupon applied! {couponDiscount}% off</p>}
            {couponError && <p className="text-red-400 text-xs mt-2">{couponError}</p>}
          </motion.div>
        )}
      </section>

      {/* Plan Cards */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.6 }}
              className={`relative glass-card p-8 flex flex-col gap-6 hover:-translate-y-2 transition-all duration-500 ${
                plan.popular ? 'ring-2 ring-yellow-400/40' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest"
                  style={{ background: 'linear-gradient(90deg,#f59e0b,#f97316)', color: '#fff', boxShadow: '0 4px 20px rgba(251,191,36,0.4)' }}>
                  Most Popular
                </div>
              )}
              <div>
                <plan.icon className="w-8 h-8 mb-3" style={{ color: plan.color }} />
                <h3 className="text-2xl font-black text-white">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-black text-white">{plan.price}</span>
                  <span className="text-white/30 text-sm">{plan.period}</span>
                </div>
                {couponDiscount && plan.id !== 'FREE' && (
                  <p className="text-green-400 text-xs mt-1 font-bold">
                    With coupon: ₹{Math.round(parseInt(plan.price.replace('₹', '')) * (1 - couponDiscount / 100))}{plan.period}
                  </p>
                )}
              </div>
              <ul className="space-y-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-white/60">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${plan.color}20` }}>
                      <Check className="w-3 h-3" style={{ color: plan.color }} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading === plan.id}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                style={{
                  background: plan.popular
                    ? 'linear-gradient(135deg,#f59e0b,#f97316)'
                    : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                  boxShadow: plan.popular
                    ? '0 8px 32px rgba(251,191,36,0.3)'
                    : '0 8px 32px rgba(99,102,241,0.3)',
                }}
              >
                {loading === plan.id ? (
                  <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing...</span>
                ) : (
                  <>{plan.cta} <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Credit Packs */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pb-24">
        <div className="text-center mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">Need More Credits?</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-white">
            Buy <span className="gradient-text">Credit Packs</span>
          </h2>
          <p className="text-white/40 text-sm mt-2">One-time purchase. No subscription required.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {CREDIT_PACKS.map((pack, i) => (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + 0.1 * i }}
              className="glass-card p-6 flex flex-col gap-4 hover:-translate-y-2 transition-all duration-500"
            >
              <CreditCard className="w-6 h-6 text-indigo-400" />
              <div>
                <h3 className="text-lg font-bold text-white">{pack.name}</h3>
                <p className="text-white/40 text-sm">{pack.credits} credits</p>
              </div>
              <p className="text-2xl font-black text-white">{pack.price}</p>
              <button
                onClick={() => handleBuyPack(pack.id)}
                disabled={loading === pack.id}
                className="w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50 text-white/80 hover:text-white"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                {loading === pack.id ? 'Processing...' : 'Buy Now'}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-10 px-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-6xl mx-auto text-center text-xs text-white/25">
          © 2026 TrustLink. All rights reserved. · <Link href="/terms" className="hover:text-white transition-colors">Terms</Link> · <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
        </div>
      </footer>
    </main>
  );
}
