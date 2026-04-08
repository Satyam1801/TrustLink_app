// 💰 TrustLink Credits Routes
const express = require('express');
const router = express.Router();
const creditsController = require('../controllers/credits');
const auth = require('../middleware/auth');
const adminGuard = require('../middleware/adminGuard');

// 🔱 GET: Credit Balance
router.get('/balance', auth, creditsController.getBalance);

// 🔱 POST: Deduct Credits (authenticated user)
router.post('/deduct', auth, creditsController.deductCredits);

// 🔱 POST: Admin Grant/Revoke Credits
router.post('/grant/:userId', auth, adminGuard, creditsController.grantCredits);

module.exports = router;
