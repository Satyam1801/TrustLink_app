// 💳 TrustLink Billing Controller — Razorpay Integration
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const { sendPaymentConfirmationEmail } = require('../utils/email');
const prisma = new PrismaClient();

// ─── Plan Config ────────────────────────────────────────────────────────────
const PLAN_CONFIG = {
  BASIC: { amount: 39900, credits: 100, name: 'Basic Plan', currency: 'INR' },
  PRO:   { amount: 99900, credits: 500, name: 'Pro Plan',   currency: 'INR' },
};

const CREDIT_PACKS = {
  starter: { amount: 14900, credits: 50,  name: 'Starter Pack', currency: 'INR' },
  growth:  { amount: 44900, credits: 200, name: 'Growth Pack',  currency: 'INR' },
  power:   { amount: 89900, credits: 500, name: 'Power Pack',   currency: 'INR' },
};

// ─── Razorpay instance ──────────────────────────────────────────────────────
let razorpay;
try {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
  });
} catch (e) {
  console.warn('⚠️  Razorpay credentials not configured. Payment features disabled.');
}

// ─── Create Order (Subscription or Credit Pack) ─────────────────────────────
exports.createOrder = async (req, res) => {
  const { type, planOrPack } = req.body;
  // type: "subscription" | "credit_pack"

  if (!razorpay) {
    return res.status(503).json({ success: false, message: 'Payment gateway not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env' });
  }

  try {
    let config;

    if (type === 'subscription') {
      config = PLAN_CONFIG[planOrPack?.toUpperCase()];
      if (!config) return res.status(400).json({ success: false, message: 'Invalid plan. Use BASIC or PRO.' });
    } else if (type === 'credit_pack') {
      config = CREDIT_PACKS[planOrPack?.toLowerCase()];
      if (!config) return res.status(400).json({ success: false, message: 'Invalid credit pack. Use starter, growth, or power.' });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid type. Use subscription or credit_pack.' });
    }

    // Apply coupon discount if provided
    let finalAmount = config.amount;
    let couponCode = req.body.couponCode || null;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
      if (!coupon || !coupon.isActive) {
        return res.status(400).json({ success: false, message: 'Invalid or inactive coupon code' });
      }
      if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
        return res.status(400).json({ success: false, message: 'Coupon has expired' });
      }
      if (coupon.usedCount >= coupon.maxUses) {
        return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
      }
      finalAmount = Math.round(config.amount * (1 - coupon.discount / 100));
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: finalAmount,           // in paise
      currency: config.currency,
      receipt: `tl_${Date.now()}`,
      notes: {
        userId: req.user.id,
        type,
        planOrPack,
        couponCode: couponCode || '',
      },
    });

    // Save pending transaction
    await prisma.transaction.create({
      data: {
        userId: req.user.id,
        amount: finalAmount / 100,     // store in rupees
        currency: config.currency,
        type,
        status: 'pending',
        razorpayOrderId: order.id,
        planOrPack,
        creditsAdded: config.credits,
        couponUsed: couponCode,
      },
    });

    res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ success: false, message: 'Failed to create payment order' });
  }
};

// ─── Verify Payment (HMAC Signature Verification) ──────────────────────────
exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    // 1. Verify HMAC signature — NEVER trust frontend alone
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed. Invalid signature.' });
    }

    // 2. Find the pending transaction
    const transaction = await prisma.transaction.findFirst({
      where: { razorpayOrderId: razorpay_order_id },
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // 3. Prevent duplicate processing
    if (transaction.status === 'success') {
      return res.status(200).json({ success: true, message: 'Payment already processed' });
    }

    // 4. Update transaction status
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: 'success',
        razorpayPaymentId: razorpay_payment_id,
      },
    });

    // 5. Update user plan + credits
    const updateData = { credits: { increment: transaction.creditsAdded || 0 } };

    if (transaction.type === 'subscription') {
      updateData.plan = transaction.planOrPack.toUpperCase();

      // Create subscription record
      const now = new Date();
      const periodEnd = new Date(now);
      periodEnd.setMonth(periodEnd.getMonth() + 1);

      await prisma.subscription.create({
        data: {
          userId: transaction.userId,
          plan: transaction.planOrPack.toUpperCase(),
          status: 'active',
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
        },
      });
    }

    await prisma.user.update({
      where: { id: transaction.userId },
      data: updateData,
    });

    // 6. Increment coupon usage
    if (transaction.couponUsed) {
      await prisma.coupon.update({
        where: { code: transaction.couponUsed },
        data: { usedCount: { increment: 1 } },
      });
    }

    // 7. Send confirmation email
    try {
      const user = await prisma.user.findUnique({ where: { id: transaction.userId } });
      if (user) {
        await sendPaymentConfirmationEmail(user.email, {
          plan: transaction.planOrPack,
          amount: transaction.amount,
          currency: transaction.currency,
          transactionId: transaction.id,
        });
      }
    } catch (emailErr) {
      console.warn('Email send failed (non-critical):', emailErr.message);
    }

    res.status(200).json({ success: true, message: 'Payment verified and plan activated!' });
  } catch (err) {
    console.error('Verify payment error:', err);
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
};

// ─── Razorpay Webhook (Server-to-Server) ────────────────────────────────────
exports.webhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

  // Verify webhook signature
  const shasum = crypto.createHmac('sha256', secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  if (digest !== req.headers['x-razorpay-signature']) {
    return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
  }

  const event = req.body.event;
  const payload = req.body.payload;

  try {
    if (event === 'payment.captured') {
      const orderId = payload.payment?.entity?.order_id;
      if (orderId) {
        // Mark transaction as success if not already
        await prisma.transaction.updateMany({
          where: { razorpayOrderId: orderId, status: 'pending' },
          data: { status: 'success', razorpayPaymentId: payload.payment?.entity?.id },
        });
      }
    }

    if (event === 'payment.failed') {
      const orderId = payload.payment?.entity?.order_id;
      if (orderId) {
        await prisma.transaction.updateMany({
          where: { razorpayOrderId: orderId, status: 'pending' },
          data: { status: 'failed' },
        });
      }
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ success: false });
  }
};

// ─── Get Transaction History ────────────────────────────────────────────────
exports.getHistory = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ success: true, transactions });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch billing history' });
  }
};

// ─── Get Current Subscription ───────────────────────────────────────────────
exports.getSubscription = async (req, res) => {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: { userId: req.user.id, status: 'active' },
      orderBy: { createdAt: 'desc' },
    });

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { plan: true, credits: true },
    });

    res.status(200).json({ success: true, subscription, plan: user.plan, credits: user.credits });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch subscription' });
  }
};

// ─── Validate Coupon ────────────────────────────────────────────────────────
exports.validateCoupon = async (req, res) => {
  const { code } = req.body;

  try {
    const coupon = await prisma.coupon.findUnique({ where: { code } });

    if (!coupon || !coupon.isActive) {
      return res.status(400).json({ success: false, message: 'Invalid coupon code' });
    }
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ success: false, message: 'Coupon has expired' });
    }
    if (coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
    }

    res.status(200).json({
      success: true,
      coupon: { code: coupon.code, discount: coupon.discount },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to validate coupon' });
  }
};
