const express = require('express');
const router = express.Router();
const {
  getAllChallenges,
  getChallenge,
  createChallenge,
  completeChallenge
} = require('../controllers/challengeController');

router.get('/', getAllChallenges);
router.get('/:challengeId', getChallenge);
router.post('/', createChallenge);
router.post('/:challengeId/complete', completeChallenge);

module.exports = router;