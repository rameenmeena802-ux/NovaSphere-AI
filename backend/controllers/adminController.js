const User = require('../models/User');
const Project = require('../models/Project');
const Blog = require('../models/Blog');
const Contact = require('../models/Contact');
const Notification = require('../models/Notification');
const mockStore = require('../config/mockDb');

// @desc    Get dashboard metrics & analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
  try {
    let counts = {
      users: 0,
      projects: 0,
      blogs: 0,
      contacts: 0,
      unreadNotifications: 0,
    };

    if (global.dbConnected) {
      counts.users = await User.countDocuments();
      counts.projects = await Project.countDocuments();
      counts.blogs = await Blog.countDocuments();
      counts.contacts = await Contact.countDocuments();
      counts.unreadNotifications = await Notification.countDocuments({ read: false });
    } else {
      counts.users = mockStore.users.length;
      counts.projects = mockStore.projects.length;
      counts.blogs = mockStore.blogs.length;
      counts.contacts = mockStore.contacts.length;
      counts.unreadNotifications = mockStore.notifications.filter(n => !n.read).length;
    }

    // Generate analytical charts data (cyberpunk luxury dashboard charts)
    const analyticsData = {
      counts,
      systemPerformance: [
        { label: '00:00', cpu: 22, memory: 40, latency: 12 },
        { label: '04:00', cpu: 30, memory: 45, latency: 15 },
        { label: '08:00', cpu: 65, memory: 60, latency: 32 },
        { label: '12:00', cpu: 85, memory: 75, latency: 45 },
        { label: '16:00', cpu: 55, memory: 70, latency: 25 },
        { label: '20:00', cpu: 40, memory: 55, latency: 18 },
        { label: '24:00', cpu: 25, memory: 42, latency: 11 },
      ],
      weeklySignups: [
        { day: 'Mon', count: 12 },
        { day: 'Tue', count: 19 },
        { day: 'Wed', count: 32 },
        { day: 'Thu', count: 25 },
        { day: 'Fri', count: 45 },
        { day: 'Sat', count: 60 },
        { day: 'Sun', count: 40 },
      ],
      categoryDistribution: [
        { name: 'AI Agents', value: 40 },
        { name: 'Neural Networks', value: 25 },
        { name: 'Quantum Computing', value: 15 },
        { name: 'Data Intelligence', value: 12 },
        { name: 'Cyber Security', value: 8 },
      ],
    };

    res.json({ success: true, data: analyticsData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    if (global.dbConnected) {
      const users = await User.find({}).sort({ createdAt: -1 });
      res.json({ success: true, count: users.length, data: users });
    } else {
      res.json({ success: true, count: mockStore.users.length, data: mockStore.users });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  const { role } = req.body;

  if (!role || !['user', 'admin'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role' });
  }

  try {
    if (global.dbConnected) {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      user.role = role;
      await user.save();
      res.json({ success: true, message: 'User role updated successfully', data: user });
    } else {
      const user = mockStore.users.find(u => u._id === req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      user.role = role;
      res.json({ success: true, message: 'User role updated successfully (Mock)', data: user });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    if (global.dbConnected) {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      if (user.role === 'admin' && user.email === 'admin@novasphere.ai') {
        return res.status(400).json({ success: false, message: 'Cannot delete primary root admin' });
      }
      await user.deleteOne();
      res.json({ success: true, message: 'User deleted successfully' });
    } else {
      const index = mockStore.users.findIndex(u => u._id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      const user = mockStore.users[index];
      if (user.role === 'admin' && user.email === 'admin@novasphere.ai') {
        return res.status(400).json({ success: false, message: 'Cannot delete primary root admin' });
      }
      mockStore.users.splice(index, 1);
      res.json({ success: true, message: 'User deleted successfully (Mock)' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all notifications
// @route   GET /api/admin/notifications
// @access  Private/Admin
const getNotifications = async (req, res) => {
  try {
    if (global.dbConnected) {
      const notifications = await Notification.find({}).sort({ createdAt: -1 });
      res.json({ success: true, data: notifications });
    } else {
      const notifications = [...mockStore.notifications];
      notifications.sort((a, b) => b.createdAt - a.createdAt);
      res.json({ success: true, data: notifications });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/admin/notifications/:id/read
// @access  Private/Admin
const markNotificationRead = async (req, res) => {
  try {
    if (global.dbConnected) {
      const notif = await Notification.findById(req.params.id);
      if (!notif) {
        return res.status(404).json({ success: false, message: 'Notification not found' });
      }
      notif.read = true;
      await notif.save();
      res.json({ success: true, data: notif });
    } else {
      const notif = mockStore.notifications.find(n => n._id === req.params.id);
      if (!notif) {
        return res.status(404).json({ success: false, message: 'Notification not found' });
      }
      notif.read = true;
      res.json({ success: true, data: notif });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAnalytics,
  getUsers,
  updateUserRole,
  deleteUser,
  getNotifications,
  markNotificationRead,
};
