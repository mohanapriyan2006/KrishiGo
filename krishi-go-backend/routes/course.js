const express = require("express");
const { getCourses, addCourse, updateCourseProgress } = require("../controllers/courseController");

const router = express.Router();

router.get("/", getCourses); // GET all courses
router.post("/", addCourse); // Add new course
router.post("/:userId/:courseId/progress", updateCourseProgress); // Update progress

module.exports = router;
