const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getUsers,
  updateUserRole,
  deleteUser,
  getNotifications,
  markNotificationRead,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

// Apply protection & admin checking globally to these routes
router.use(protect);
router.use(admin);

router.get('/analytics', getAnalytics);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);

module.exports = router;
