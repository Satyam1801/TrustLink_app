// 💎 TrustLink Profile Routes
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile');
const auth = require('../middleware/auth');

// 🔱 GET: Get Current User's Profile
router.get('/@me', auth, profileController.updateProfile); // Fetch profile via token

// 🔱 GET: Get Other Profiles by Username (Public)
router.get('/:username', profileController.getProfileByUsername);

// 🔱 PUT: Update Status/Bio
router.put('/update', auth, profileController.updateProfile);

module.exports = router;
