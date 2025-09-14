const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  updateUserSettings,
  changeLanguage,
  uploadProfileImage,
  getUserStats,
  logoutUser
} = require('../controllers/profileController');

// GET /api/profile/:userId - Get user profile
router.get('/:userId', getUserProfile);

// PUT /api/profile/:userId - Update user profile
router.put('/:userId', updateUserProfile);

// POST /api/profile/:userId/settings - Update user settings  
router.post('/:userId/settings', updateUserSettings);

// POST /api/profile/:userId/language - Change language
router.post('/:userId/language', changeLanguage);

// POST /api/profile/:userId/image - Upload profile image
router.post('/:userId/image', uploadProfileImage);

// GET /api/profile/:userId/stats - Get detailed user stats
router.get('/:userId/stats', getUserStats);

// POST /api/profile/:userId/logout - Logout user
router.post('/:userId/logout', logoutUser);

module.exports = router;