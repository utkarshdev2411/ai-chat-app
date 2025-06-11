const Session = require('../models/Session');
const { generateResponse } = require('../utils/gemini');

// Create a new session
exports.createSession = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const session = new Session({
      user: userId,
      history: [] // Start with empty history
    });
    
    await session.save();
    
    res.status(201).json({
      sessionId: session._id,
      createdAt: session.createdAt
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get session by ID
exports.getSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;
    
    const session = await Session.findOne({ _id: sessionId, user: userId });
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    res.json(session);
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all sessions for current user
exports.getUserSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const sessions = await Session.find({ user: userId })
      .select('_id createdAt updatedAt')
      .sort({ updatedAt: -1 });
    
    res.json(sessions);
  } catch (error) {
    console.error('Get user sessions error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add message to session and get AI response
exports.addMessage = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;
    
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ message: 'Message text is required' });
    }
    
    // Find the session
    const session = await Session.findOne({ _id: sessionId, user: userId });
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    // Add user message to history
    const userMessage = {
      role: 'user',
      text: text.trim(),
      timestamp: new Date()
    };
    
    session.history.push(userMessage);
    
    // Build the prompt for Gemini
    let prompt = '';
    for (const message of session.history) {
      prompt += `${message.role === 'user' ? 'User' : 'AI'}: ${message.text}\n`;
    }
    
    // Call Gemini API
    const aiText = await generateResponse(prompt);
    
    // Add AI response to history
    const aiMessage = {
      role: 'ai',
      text: aiText,
      timestamp: new Date()
    };
    
    session.history.push(aiMessage);
    
    // Save updated session
    await session.save();
    
    // Return the AI message
    res.json({
      aiMessage: aiMessage
    });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a session
exports.deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;
    
    const result = await Session.deleteOne({ _id: sessionId, user: userId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

