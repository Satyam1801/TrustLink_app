// 📧 TrustLink Email Utility — Nodemailer
const nodemailer = require('nodemailer');

// Create transporter (uses ENV variables in production)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

// ─── Send Password Reset Email ──────────────────────────────────────────────
async function sendPasswordResetEmail(email, resetToken) {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: `"TrustLink" <${process.env.SMTP_USER || 'noreply@trustlink.app'}>`,
    to: email,
    subject: '🔐 Reset Your TrustLink Password',
    html: `
      <div style="font-family:'Inter',sans-serif;max-width:520px;margin:0 auto;background:#0d0e18;border-radius:20px;padding:40px;border:1px solid rgba(99,102,241,0.2);">
        <div style="text-align:center;margin-bottom:30px;">
          <div style="display:inline-block;width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#6366f1,#8b5cf6);line-height:48px;font-weight:900;color:#fff;font-size:20px;">T</div>
          <h2 style="color:#fff;margin:16px 0 4px;font-size:24px;">Password Reset</h2>
          <p style="color:rgba(255,255,255,0.4);font-size:14px;">You requested a password reset for your TrustLink account.</p>
        </div>
        <a href="${resetUrl}" style="display:block;text-align:center;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;padding:14px 24px;border-radius:12px;font-weight:700;font-size:14px;text-decoration:none;margin:24px 0;">
          Reset My Password
        </a>
        <p style="color:rgba(255,255,255,0.3);font-size:12px;text-align:center;margin-top:24px;">
          This link expires in 1 hour. If you did not request this, ignore this email.
        </p>
        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:24px 0;" />
        <p style="color:rgba(255,255,255,0.2);font-size:11px;text-align:center;">© 2026 TrustLink. All rights reserved.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

// ─── Send Welcome Email ─────────────────────────────────────────────────────
async function sendWelcomeEmail(email, username) {
  const mailOptions = {
    from: `"TrustLink" <${process.env.SMTP_USER || 'noreply@trustlink.app'}>`,
    to: email,
    subject: '🎉 Welcome to TrustLink!',
    html: `
      <div style="font-family:'Inter',sans-serif;max-width:520px;margin:0 auto;background:#0d0e18;border-radius:20px;padding:40px;border:1px solid rgba(99,102,241,0.2);">
        <div style="text-align:center;margin-bottom:30px;">
          <div style="display:inline-block;width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#6366f1,#8b5cf6);line-height:48px;font-weight:900;color:#fff;font-size:20px;">T</div>
          <h2 style="color:#fff;margin:16px 0 4px;font-size:24px;">Welcome, ${username}!</h2>
          <p style="color:rgba(255,255,255,0.4);font-size:14px;">Your verified identity journey starts now.</p>
        </div>
        <div style="background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.2);border-radius:12px;padding:20px;margin:20px 0;">
          <p style="color:rgba(255,255,255,0.6);font-size:13px;margin:0;">🎁 You've received <strong style="color:#a5b4fc;">10 free credits</strong> to get started. Add your links, get verified, and share your TrustLink profile!</p>
        </div>
        <a href="${process.env.CLIENT_URL}/dashboard" style="display:block;text-align:center;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;padding:14px 24px;border-radius:12px;font-weight:700;font-size:14px;text-decoration:none;margin:24px 0;">
          Open Dashboard
        </a>
        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:24px 0;" />
        <p style="color:rgba(255,255,255,0.2);font-size:11px;text-align:center;">© 2026 TrustLink. All rights reserved.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

// ─── Send Payment Confirmation Email ────────────────────────────────────────
async function sendPaymentConfirmationEmail(email, { plan, amount, currency, transactionId }) {
  const mailOptions = {
    from: `"TrustLink" <${process.env.SMTP_USER || 'noreply@trustlink.app'}>`,
    to: email,
    subject: '✅ Payment Confirmed — TrustLink',
    html: `
      <div style="font-family:'Inter',sans-serif;max-width:520px;margin:0 auto;background:#0d0e18;border-radius:20px;padding:40px;border:1px solid rgba(99,102,241,0.2);">
        <div style="text-align:center;margin-bottom:30px;">
          <div style="display:inline-block;width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#6366f1,#8b5cf6);line-height:48px;font-weight:900;color:#fff;font-size:20px;">T</div>
          <h2 style="color:#fff;margin:16px 0 4px;font-size:24px;">Payment Confirmed!</h2>
          <p style="color:rgba(255,255,255,0.4);font-size:14px;">Your ${plan} plan is now active.</p>
        </div>
        <div style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.2);border-radius:12px;padding:20px;margin:20px 0;">
          <table style="width:100%;color:rgba(255,255,255,0.6);font-size:13px;">
            <tr><td style="padding:4px 0;">Plan</td><td style="text-align:right;font-weight:700;color:#fff;">${plan}</td></tr>
            <tr><td style="padding:4px 0;">Amount</td><td style="text-align:right;font-weight:700;color:#fff;">${currency} ${amount}</td></tr>
            <tr><td style="padding:4px 0;">Transaction ID</td><td style="text-align:right;font-weight:700;color:#fff;font-size:11px;">${transactionId}</td></tr>
          </table>
        </div>
        <a href="${process.env.CLIENT_URL}/billing" style="display:block;text-align:center;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;padding:14px 24px;border-radius:12px;font-weight:700;font-size:14px;text-decoration:none;margin:24px 0;">
          View Billing History
        </a>
        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:24px 0;" />
        <p style="color:rgba(255,255,255,0.2);font-size:11px;text-align:center;">© 2026 TrustLink. All rights reserved.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = {
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendPaymentConfirmationEmail,
};
