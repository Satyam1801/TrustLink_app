// 🔗 TrustLink Links Routes
const express = require('express');
const router = express.Router();
const linksController = require('../controllers/links');
const auth = require('../middleware/auth');

// 🔱 GET: Fetch all links for user
router.get('/', auth, linksController.getLinks);

// 🔱 POST: Add a new link (Protected)
router.post('/add', auth, linksController.addLink);

// 🔱 PUT: Update an existing link (Protected)
router.put('/:id', auth, linksController.updateLink);

// 🔱 DELETE: Remove a link (Protected)
router.delete('/:id', auth, linksController.deleteLink);

// 🔱 POST: Verify a link (Protected)
router.post('/:id/verify', auth, linksController.verifyLink);

module.exports = router;
