const express = require('express');
const router = express.Router();
const { registerUser, loginUser, googleAuthSimulate, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuthSimulate);
router.get('/me', protect, getMe);

module.exports = router;
