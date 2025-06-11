const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const authMiddleware = require('../middleware/auth');

// Update user preferences (protected route)
router.put('/:id/preferences', authMiddleware, userController.updatePreferences);

module.exports = router;

