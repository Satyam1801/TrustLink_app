// 🔐 TrustLink Authentication Routes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const auth = require('../middleware/auth');

// 🔱 POST: Register User
router.post('/register', authController.register);

// 🔱 POST: Login User
router.post('/login', authController.login);

// 🔱 POST: Logout (also keep GET for browser nav)
router.post('/logout', authController.logout);
router.get('/logout', authController.logout);

// 🔱 GET: Current User
router.get('/me', auth, authController.getMe);

// 🔱 POST: Forgot Password
router.post('/forgot-password', authController.forgotPassword);

// 🔱 POST: Reset Password
router.post('/reset-password', authController.resetPassword);

module.exports = router;
