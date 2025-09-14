const express = require("express");
const router = express.Router();
const journeyController = require("../controllers/journeyController");
const auth = require("../middleware/auth");

// Start a new course
router.post("/start", auth, journeyController.startCourse);

// Get user's journey
router.get("/:userId", auth, journeyController.getJourney);

// Update course progress
router.put("/update", auth, journeyController.updateProgress);

module.exports = router;
