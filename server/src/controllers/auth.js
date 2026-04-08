// 🔐 TrustLink Auth Controller
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const { sendPasswordResetEmail, sendWelcomeEmail } = require('../utils/email');
const prisma = new PrismaClient();

// 🔱 Register User
exports.register = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    // Validation
    if (!email || !password || !username) {
      return res.status(400).json({ success: false, message: 'Email, username, and password are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }
    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({ success: false, message: 'Username must be 3–30 characters' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email or Username already taken' });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Determine plan from query/body
    const selectedPlan = (req.body.plan || 'FREE').toUpperCase();
    const validPlans = ['FREE', 'BASIC', 'PRO'];
    const plan = validPlans.includes(selectedPlan) ? selectedPlan : 'FREE';

    // Create User & Profile
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        plan,
        credits: 10,  // Free starter credits
        profile: {
          create: {
            trustScore: 10,
          }
        }
      },
      include: { profile: true }
    });

    // Generate JWT
    const token = jwt.sign({ id: newUser.id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Send Token in HTTP-Only Cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Send welcome email (non-blocking)
    sendWelcomeEmail(email, username).catch(e => console.warn('Welcome email failed:', e.message));

    res.status(201).json({
      success: true,
      user: { id: newUser.id, username: newUser.username, email: newUser.email, plan: newUser.plan, credits: newUser.credits }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// 🔱 Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid Credentials' });
    }

    // Block BLOCKED users
    if (user.role === 'BLOCKED') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended. Contact support.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid Credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      user: { id: user.id, username: user.username, email: user.email, role: user.role, plan: user.plan, credits: user.credits }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// 🔱 Logout
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// 🔱 Get Current User
exports.getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, username: true, role: true, plan: true, credits: true, isVerified: true, profile: true }
    });
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching user profile' });
  }
};

// 🔱 Forgot Password — Send Reset Email
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success (prevent email enumeration)
    if (!user) {
      return res.status(200).json({ success: true, message: 'If that email is registered, a reset link has been sent.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Invalidate any existing reset tokens for this user
    await prisma.passwordReset.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });

    // Create new reset token
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt,
      },
    });

    // Send email
    await sendPasswordResetEmail(email, resetToken);

    res.status(200).json({ success: true, message: 'If that email is registered, a reset link has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ success: false, message: 'Server error processing password reset' });
  }
};

// 🔱 Reset Password — Using Token
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Token and new password are required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    // Find valid reset token
    const resetRecord = await prisma.passwordReset.findUnique({ where: { token } });

    if (!resetRecord || resetRecord.used) {
      return res.status(400).json({ success: false, message: 'Invalid or already used reset token' });
    }

    if (new Date(resetRecord.expiresAt) < new Date()) {
      return res.status(400).json({ success: false, message: 'Reset token has expired. Please request a new one.' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: resetRecord.userId },
      data: { password: hashedPassword },
    });

    // Mark token as used
    await prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { used: true },
    });

    res.status(200).json({ success: true, message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ success: false, message: 'Server error resetting password' });
  }
};
