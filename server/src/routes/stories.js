const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session');
const authMiddleware = require('../middleware/auth');

// Protect all routes
router.use(authMiddleware);

// GET /api/stories/scenarios - Get all available scenarios
router.get('/scenarios', sessionController.getScenarios);

// GET /api/stories - Get all stories for current user
router.get('/', sessionController.getUserStories);

// POST /api/stories - Create a new story
router.post('/', sessionController.createStory);

// GET /api/stories/:sessionId - Get a specific story
router.get('/:sessionId', sessionController.getStory);

// POST /api/stories/:sessionId/action - Submit action to story and get continuation
router.post('/:sessionId/action', sessionController.submitAction);

// PUT /api/stories/:sessionId/title - Rename a story
router.put('/:sessionId/title', sessionController.renameStory);

// DELETE /api/stories/:sessionId - Delete a story
router.delete('/:sessionId', sessionController.deleteStory);

module.exports = router;

