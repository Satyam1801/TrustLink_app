// 🛡️ TrustLink Admin Routes — Full Admin Panel
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const creditsController = require('../controllers/credits');
const auth = require('../middleware/auth');
const adminGuard = require('../middleware/adminGuard');

// All admin routes require auth + admin role
router.use(auth, adminGuard);

// 🔱 GET: Fetch all users
router.get('/users', adminController.getUsers);

// 🔱 DELETE: Delete a user
router.delete('/users/:id', adminController.deleteUser);

// 🔱 PUT: Block/Unblock a user
router.put('/users/:id/block', adminController.blockUser);

// 🔱 GET: Revenue Summary
router.get('/revenue', adminController.getRevenue);

// 🔱 GET: All Transactions
router.get('/transactions', adminController.getTransactions);

// 🔱 POST: Create Coupon
router.post('/coupons', adminController.createCoupon);

// 🔱 GET: List Coupons
router.get('/coupons', adminController.getCoupons);

// 🔱 PATCH: Toggle Coupon active/inactive
router.patch('/coupons/:id', adminController.toggleCoupon);

// 🔱 POST: Grant/Revoke Credits to User
router.post('/credits/:userId', creditsController.grantCredits);

// 🔱 GET: Analytics Overview
router.get('/analytics', adminController.getAnalytics);

module.exports = router;
