const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const mockStore = require('../config/mockDb');

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_super_secret_jwt_key_novasphere_2026', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
  }

  try {
    if (global.dbConnected) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      const user = await User.create({
        name,
        email,
        password,
      });

      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      // Mock db path
      const userExists = mockStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const newUser = {
        _id: 'mock_user_' + Date.now(),
        name,
        email,
        password: hashedPassword,
        role: 'user',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
        createdAt: new Date(),
      };

      mockStore.users.push(newUser);

      // Trigger socket event for signup notify (we'll emit to admin room)
      if (global.io) {
        global.io.emit('notification', {
          type: 'signup',
          title: 'New User Registered',
          message: `${name} has joined Novasphere AI Universe.`,
          createdAt: new Date()
        });
      }

      res.status(201).json({
        success: true,
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        token: generateToken(newUser._id),
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  try {
    if (global.dbConnected) {
      const user = await User.findOne({ email }).select('+password');
      if (user && (await user.matchPassword(password))) {
        res.json({
          success: true,
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          token: generateToken(user._id),
        });
      } else {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    } else {
      // Mock db path
      const user = mockStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user && bcrypt.compareSync(password, user.password)) {
        res.json({
          success: true,
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          token: generateToken(user._id),
        });
      } else {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Simulate Google OAuth Login
// @route   POST /api/auth/google
// @access  Public
const googleAuthSimulate = async (req, res) => {
  const { name, email, googleId, avatar } = req.body;

  if (!email || !googleId) {
    return res.status(400).json({ success: false, message: 'Missing OAuth parameters' });
  }

  try {
    if (global.dbConnected) {
      let user = await User.findOne({ email });

      if (!user) {
        user = await User.create({
          name,
          email,
          googleId,
          avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
        });
      } else if (!user.googleId) {
        user.googleId = googleId;
        if (avatar) user.avatar = avatar;
        await user.save();
      }

      res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token: generateToken(user._id),
      });
    } else {
      // Mock path
      let user = mockStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        user = {
          _id: 'mock_google_user_' + Date.now(),
          name,
          email,
          googleId,
          role: 'user',
          avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
          createdAt: new Date()
        };
        mockStore.users.push(user);

        // Notify admins of new registration
        if (global.io) {
          global.io.emit('notification', {
            type: 'signup',
            title: 'New Google Sign Up',
            message: `${name} has joined via Google account integration.`,
            createdAt: new Date()
          });
        }
      }

      res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

module.exports = {
  registerUser,
  loginUser,
  googleAuthSimulate,
  getMe,
};
