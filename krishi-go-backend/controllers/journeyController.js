const admin = require("firebase-admin");
const db = admin.firestore();

// Add a new course to user's journey
exports.startCourse = async (req, res) => {
  try {
    const { userId, courseId, courseName } = req.body;

    const journeyRef = db.collection("users").doc(userId).collection("journey").doc(courseId);

    await journeyRef.set({
      courseId,
      courseName,
      status: "ongoing",
      progress: 0,
      lastAccessed: new Date().toISOString(),
    });

    res.status(200).json({ message: "Course started successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch user's journey (ongoing + completed)
exports.getJourney = async (req, res) => {
  try {
    const { userId } = req.params;

    const snapshot = await db.collection("users").doc(userId).collection("journey").get();

    const journey = [];
    snapshot.forEach(doc => journey.push(doc.data()));

    res.status(200).json(journey);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update course progress
exports.updateProgress = async (req, res) => {
  try {
    const { userId, courseId, progress, status } = req.body;

    const journeyRef = db.collection("users").doc(userId).collection("journey").doc(courseId);

    await journeyRef.update({
      progress,
      status,
      lastAccessed: new Date().toISOString(),
    });

    res.status(200).json({ message: "Progress updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
