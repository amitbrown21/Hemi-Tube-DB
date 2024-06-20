const jwt = require('jsonwebtoken');
const User = require('../models/User');

const tokensServices = {
  createToken: async (username, password) => {
    const user = await User.findOne({ username });
    if (!user || !user.validatePassword(password)) {
      throw new Error('Invalid username or password');
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return token;
  },

  verifyToken: (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  },

  // Add more token-related services as needed
};

module.exports = tokensServices;