const express = require('express');
const router = express.Router();
const {
  getHomeDashboard,
  updateSustainabilityScore,
  createInvite,
  getUserInvites
} = require('../controllers/homeController');

// GET /api/home/:userId - Get home dashboard data
router.get('/:userId', getHomeDashboard);

// POST /api/home/:userId/sustainability - Update sustainability score
router.post('/:userId/sustainability', updateSustainabilityScore);

// POST /api/home/:userId/invite - Create new invite
router.post('/:userId/invite', createInvite);

// GET /api/home/:userId/invites - Get user's invites
router.get('/:userId/invites', getUserInvites);

module.exports = router;