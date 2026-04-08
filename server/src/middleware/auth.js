// 🔐 TrustLink Authentication Middleware
// Protecting routes with JWT Verification

const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // 1. Extract Token from Cookies
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access Denied: No Token Provided' });
  }

  try {
    // 2. Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains id and role
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ success: false, message: 'Invalid or Expired Token' });
  }
};

module.exports = auth;
