const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Check for token in headers
    let token = req.header('Authorization')?.replace('Bearer ', '');
    
    // If not in headers, check for token in cookies
    if (!token && req.cookies) {
      token = req.cookies.token;
    }
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Attach user to request object
    req.user = { id: user._id };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = authMiddleware;

