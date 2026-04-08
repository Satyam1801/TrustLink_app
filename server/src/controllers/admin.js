// 🛡️ TrustLink Admin Controller — Upgraded with Revenue, Analytics, Coupons
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ─── Get All Users ──────────────────────────────────────────────────────────
exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        plan: true,
        credits: true,
        isVerified: true,
        createdAt: true,
        profile: {
          select: {
            trustScore: true,
            verified: true,
            _count: { select: { links: true } }
          }
        },
      },
      orderBy: { createdAt: 'desc' }
    });

    const usersWithCount = users.map(u => ({
      ...u,
      _count: { links: u.profile?._count?.links ?? 0 }
    }));

    res.status(200).json({ success: true, users: usersWithCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error fetching users' });
  }
};

// ─── Delete User ────────────────────────────────────────────────────────────
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.transaction.deleteMany({ where: { userId: id } });
    await prisma.subscription.deleteMany({ where: { userId: id } });
    await prisma.passwordReset.deleteMany({ where: { userId: id } });
    await prisma.feedback.deleteMany({ where: { userId: id } });

    // Delete links through profile
    const profile = await prisma.profile.findUnique({ where: { userId: id } });
    if (profile) {
      await prisma.link.deleteMany({ where: { profileId: profile.id } });
    }
    await prisma.profile.deleteMany({ where: { userId: id } });

    await prisma.user.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'User and all associated data deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error deleting user' });
  }
};

// ─── Block / Unblock User ───────────────────────────────────────────────────
exports.blockUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const newRole = user.role === 'BLOCKED' ? 'USER' : 'BLOCKED';
    await prisma.user.update({ where: { id }, data: { role: newRole } });

    res.status(200).json({ success: true, message: `User ${newRole === 'BLOCKED' ? 'blocked' : 'unblocked'} successfully` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error blocking user' });
  }
};

// ─── Revenue Summary ────────────────────────────────────────────────────────
exports.getRevenue = async (req, res) => {
  try {
    const allTransactions = await prisma.transaction.findMany({
      where: { status: 'success' },
    });

    const totalRevenue = allTransactions.reduce((sum, t) => sum + t.amount, 0);

    // MRR = sum of all subscription transactions in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSubs = allTransactions.filter(
      t => t.type === 'subscription' && new Date(t.createdAt) >= thirtyDaysAgo
    );
    const mrr = recentSubs.reduce((sum, t) => sum + t.amount, 0);

    const activeSubscriptions = await prisma.subscription.count({
      where: { status: 'active' },
    });

    const totalUsers = await prisma.user.count();
    const paidUsers = await prisma.user.count({ where: { plan: { not: 'FREE' } } });

    res.status(200).json({
      success: true,
      revenue: {
        total: totalRevenue,
        mrr,
        activeSubscriptions,
        totalUsers,
        paidUsers,
        conversionRate: totalUsers > 0 ? ((paidUsers / totalUsers) * 100).toFixed(1) : 0,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch revenue data' });
  }
};

// ─── All Transactions ───────────────────────────────────────────────────────
exports.getTransactions = async (req, res) => {
  try {
    const { status, type, limit = 50, offset = 0 } = req.query;

    const where = {};
    if (status) where.status = status;
    if (type) where.type = type;

    const transactions = await prisma.transaction.findMany({
      where,
      include: { user: { select: { username: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset),
    });

    const total = await prisma.transaction.count({ where });

    res.status(200).json({ success: true, transactions, total });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch transactions' });
  }
};

// ─── Create Coupon ──────────────────────────────────────────────────────────
exports.createCoupon = async (req, res) => {
  const { code, discount, maxUses, expiresAt } = req.body;

  try {
    if (!code || !discount || !maxUses) {
      return res.status(400).json({ success: false, message: 'Code, discount, and maxUses are required' });
    }

    if (discount < 1 || discount > 100) {
      return res.status(400).json({ success: false, message: 'Discount must be between 1 and 100' });
    }

    const existing = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Coupon code already exists' });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discount,
        maxUses,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    res.status(201).json({ success: true, coupon });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create coupon' });
  }
};

// ─── List Coupons ───────────────────────────────────────────────────────────
exports.getCoupons = async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    res.status(200).json({ success: true, coupons });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch coupons' });
  }
};

// ─── Toggle Coupon Active/Inactive ──────────────────────────────────────────
exports.toggleCoupon = async (req, res) => {
  const { id } = req.params;
  try {
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });

    const updated = await prisma.coupon.update({
      where: { id },
      data: { isActive: !coupon.isActive },
    });

    res.status(200).json({ success: true, coupon: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to toggle coupon' });
  }
};

// ─── Analytics Overview ─────────────────────────────────────────────────────
exports.getAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const totalUsers = await prisma.user.count();
    const newSignups30d = await prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } });
    const newSignups7d = await prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } });
    const paidUsers = await prisma.user.count({ where: { plan: { not: 'FREE' } } });
    const blockedUsers = await prisma.user.count({ where: { role: 'BLOCKED' } });

    const totalTransactions = await prisma.transaction.count({ where: { status: 'success' } });
    const failedTransactions = await prisma.transaction.count({ where: { status: 'failed' } });

    const totalLinks = await prisma.link.count();
    const verifiedLinks = await prisma.link.count({ where: { isVerified: true } });

    const planDistribution = {
      free: await prisma.user.count({ where: { plan: 'FREE' } }),
      basic: await prisma.user.count({ where: { plan: 'BASIC' } }),
      pro: await prisma.user.count({ where: { plan: 'PRO' } }),
    };

    res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        newSignups30d,
        newSignups7d,
        paidUsers,
        blockedUsers,
        conversionRate: totalUsers > 0 ? ((paidUsers / totalUsers) * 100).toFixed(1) : 0,
        totalTransactions,
        failedTransactions,
        failedCheckoutRate: totalTransactions + failedTransactions > 0
          ? ((failedTransactions / (totalTransactions + failedTransactions)) * 100).toFixed(1) : 0,
        totalLinks,
        verifiedLinks,
        planDistribution,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
  }
};
