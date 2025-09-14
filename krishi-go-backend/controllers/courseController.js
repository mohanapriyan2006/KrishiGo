const { db } = require("../config/firebase");

// Get all courses
exports.getCourses = async (req, res) => {
  try {
    const snapshot = await db.collection("courses").get();
    const courses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

// Add a new course
exports.addCourse = async (req, res) => {
  try {
    const { title, description, videoUrl, quiz } = req.body;

    const newCourse = {
      title,
      description,
      videoUrl,
      quiz: quiz || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await db.collection("courses").add(newCourse);
    res.json({ message: "Course added", id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to add course" });
  }
};

// Track user course progress
exports.updateCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    const { progress, completed } = req.body;

    const userCourseRef = db.collection("userCourses").doc(`${userId}_${courseId}`);
    await userCourseRef.set(
      {
        userId,
        courseId,
        progress,
        completed: completed || false,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    res.json({ message: "Progress updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update progress" });
  }
};
