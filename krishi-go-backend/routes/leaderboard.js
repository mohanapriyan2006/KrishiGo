const express = require("express");
const { getLeaderboard, getUserRank } = require("../controllers/leaderboardController");

const router = express.Router();

router.get("/", getLeaderboard); // GET top 10 leaderboard
router.get("/:userId", getUserRank); // GET specific user's rank

module.exports = router;
