const Session = require('../models/Session');
const Scenario = require('../models/Scenario');
const { generateStoryResponse } = require('../utils/gemini');

// Get all available scenarios
exports.getScenarios = async (req, res) => {
  try {
    const scenarios = await Scenario.find()
      .select('name key description image');
    
    res.json(scenarios);
  } catch (error) {
    console.error('Get scenarios error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new story session
exports.createStory = async (req, res) => {
  try {
    const { scenarioKey = 'space-colony', character = { name: 'Commander', role: 'Colony Leader' } } = req.body;
    const userId = req.user.id;
    
    // Get the scenario template
    const scenario = await Scenario.findOne({ key: scenarioKey });
    if (!scenario) {
      return res.status(404).json({ message: 'Scenario not found' });
    }
    
    // Create a session with the initial story prompt
    const session = new Session({
      user: userId,
      title: `${character.name}'s ${scenario.name} Adventure`,
      scenario: scenarioKey,
      character,
      history: [
        {
          role: 'system',
          text: scenario.systemInstructions,
          timestamp: new Date(),
          inputType: 'narration'
        },
        {
          role: 'ai',
          text: scenario.initialPrompt,
          timestamp: new Date(),
          inputType: 'narration'
        }
      ]
    });
    
    await session.save();
    
    res.status(201).json({
      sessionId: session._id,
      title: session.title,
      scenario: scenarioKey,
      character,
      initialStory: scenario.initialPrompt,
      createdAt: session.createdAt
    });
  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get story session by ID
exports.getStory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;
    
    const session = await Session.findOne({ _id: sessionId, user: userId });
    
    if (!session) {
      return res.status(404).json({ message: 'Story not found' });
    }
    
    // Filter out system messages for the frontend
    const visibleHistory = session.history.filter(msg => msg.role !== 'system');
    
    res.json({
      _id: session._id,
      title: session.title,
      scenario: session.scenario,
      character: session.character,
      history: visibleHistory,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt
    });
  } catch (error) {
    console.error('Get story error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all stories for current user
exports.getUserStories = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const sessions = await Session.find({ user: userId })
      .select('_id title scenario character createdAt updatedAt')
      .sort({ updatedAt: -1 });
    
    res.json(sessions);
  } catch (error) {
    console.error('Get user stories error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Submit a custom action to the story
exports.submitAction = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { text, actionType = 'action' } = req.body;
    const userId = req.user.id;
    
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ message: 'Action text is required' });
    }
    
    if (!['action', 'continue'].includes(actionType)) {
      return res.status(400).json({ message: 'Invalid action type' });
    }
    
    // Find the session
    const session = await Session.findOne({ _id: sessionId, user: userId });
    
    if (!session) {
      return res.status(404).json({ message: 'Story not found' });
    }
    
    // Get scenario information for context
    const scenario = await Scenario.findOne({ key: session.scenario });
    if (!scenario) {
      return res.status(404).json({ message: 'Scenario template not found' });
    }
    
    // Add user action to history
    const userAction = {
      role: 'user',
      text: actionType === 'continue' ? 'Continue the story...' : text.trim(),
      timestamp: new Date(),
      inputType: actionType
    };
    
    session.history.push(userAction);
    
    // Generate AI story continuation based on the action
    const isContinue = actionType === 'continue';
    const storyText = await generateStoryResponse(
      text.trim(),
      session.history,
      scenario,
      isContinue
    );
    
    // Add AI response to history
    const aiMessage = {
      role: 'ai',
      text: storyText,
      timestamp: new Date(),
      inputType: 'narration'
    };
    
    session.history.push(aiMessage);
    
    // Save updated session
    await session.save();
    
    // Return the AI story continuation
    res.json({
      storyUpdate: aiMessage
    });
  } catch (error) {
    console.error('Submit action error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a story session
exports.deleteStory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;
    
    const result = await Session.deleteOne({ _id: sessionId, user: userId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Story not found' });
    }
    
    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Delete story error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Rename a story
exports.renameStory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { title } = req.body;
    const userId = req.user.id;
    
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    const session = await Session.findOneAndUpdate(
      { _id: sessionId, user: userId },
      { title: title.trim() },
      { new: true }
    );
    
    if (!session) {
      return res.status(404).json({ message: 'Story not found' });
    }
    
    res.json({
      _id: session._id,
      title: session.title
    });
  } catch (error) {
    console.error('Rename story error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

