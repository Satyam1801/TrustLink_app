// 🛡️ TrustLink Admin Role Guard Middleware
// Must be used AFTER the auth middleware

const adminGuard = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Access denied: Admin privileges required' });
  }

  next();
};

module.exports = adminGuard;
