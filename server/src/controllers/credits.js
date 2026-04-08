// 💰 TrustLink Credits Controller
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ─── Get Credit Balance ─────────────────────────────────────────────────────
exports.getBalance = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { credits: true, plan: true },
    });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({ success: true, credits: user.credits, plan: user.plan });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch credit balance' });
  }
};

// ─── Deduct Credits (internal/system use) ───────────────────────────────────
exports.deductCredits = async (req, res) => {
  const { amount, reason } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid credit amount' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.credits < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient credits',
        credits: user.credits,
        required: amount,
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { credits: { decrement: amount } },
      select: { credits: true },
    });

    res.status(200).json({
      success: true,
      message: `${amount} credits deducted${reason ? ` for: ${reason}` : ''}`,
      credits: updatedUser.credits,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to deduct credits' });
  }
};

// ─── Admin: Grant Credits to a User ─────────────────────────────────────────
exports.grantCredits = async (req, res) => {
  const { userId } = req.params;
  const { amount, reason } = req.body;

  if (!amount || amount === 0) {
    return res.status(400).json({ success: false, message: 'Invalid credit amount' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const updateData = amount > 0
      ? { credits: { increment: amount } }
      : { credits: { decrement: Math.abs(amount) } };

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { id: true, username: true, credits: true },
    });

    res.status(200).json({
      success: true,
      message: `${amount > 0 ? 'Granted' : 'Revoked'} ${Math.abs(amount)} credits${reason ? ` — ${reason}` : ''}`,
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to adjust credits' });
  }
};
