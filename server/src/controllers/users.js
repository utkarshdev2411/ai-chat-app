const User = require('../models/User');

// Update user preferences (avatar and theme)
exports.updatePreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const { avatar, theme } = req.body;
    
    // Validate theme
    if (theme && !['light', 'dark', 'blue', 'green'].includes(theme)) {
      return res.status(400).json({ message: 'Invalid theme selection' });
    }
    
    // Find user and update preferences
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        ...(avatar && { avatar }), 
        ...(theme && { theme })
      },
      { new: true }
    ).select('-passwordHash');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      userId: updatedUser._id,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      theme: updatedUser.theme
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

