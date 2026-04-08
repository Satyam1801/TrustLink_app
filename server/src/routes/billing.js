// 💳 TrustLink Billing Routes
const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billing');
const auth = require('../middleware/auth');

// 🔱 POST: Create Razorpay Order
router.post('/create-order', auth, billingController.createOrder);

// 🔱 POST: Verify Payment (HMAC Signature)
router.post('/verify-payment', auth, billingController.verifyPayment);

// 🔱 POST: Razorpay Webhook (no auth — uses signature verification)
router.post('/webhook', billingController.webhook);

// 🔱 GET: Transaction History
router.get('/history', auth, billingController.getHistory);

// 🔱 GET: Current Subscription
router.get('/subscription', auth, billingController.getSubscription);

// 🔱 POST: Validate Coupon Code
router.post('/coupon/validate', auth, billingController.validateCoupon);

module.exports = router;
