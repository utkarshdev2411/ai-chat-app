const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session');
const authMiddleware = require('../middleware/auth');

// Protect all session routes
router.use(authMiddleware);

// GET /api/sessions - Get all sessions for current user
router.get('/', sessionController.getUserSessions);

// POST /api/sessions - Create a new session
router.post('/', sessionController.createSession);

// GET /api/sessions/:sessionId - Get a specific session
router.get('/:sessionId', sessionController.getSession);

// POST /api/sessions/:sessionId/message - Add message to session and get AI response
router.post('/:sessionId/message', sessionController.addMessage);

// DELETE /api/sessions/:sessionId - Delete a session
router.delete('/:sessionId', sessionController.deleteSession);

module.exports = router;

