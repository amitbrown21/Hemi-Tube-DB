const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const tokensServices = {
  createToken: async (username, password) => {
    console.log('Attempting to create token for username:', username);
    
    try {
      const user = await User.findOne({ username });
      console.log('User found:', user ? 'Yes' : 'No');
      
      if (!user) {
        console.log('User not found');
        throw new Error('Invalid username or password');
      }

      console.log('Comparing passwords');
      console.log('Provided password:', password);
      console.log('Stored password:', user.password);

      if (user.password !== password) {
        console.log('Password mismatch');
        throw new Error('Invalid username or password');
      }

      console.log('Password match, creating token');
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      console.log('Token created successfully');
      return { token, userId: user._id };
    } catch (error) {
      console.error('Error in createToken:', error);
      throw error;
    }
  },

  verifyToken: (token) => {
    console.log('Attempting to verify token');
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token verified successfully');
      return decoded;
    } catch (error) {
      console.error('Error verifying token:', error);
      throw new Error('Invalid token');
    }
  },
};

module.exports = tokensServices;