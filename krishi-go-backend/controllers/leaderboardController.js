const { db } = require("../config/firebase");

// Get top users (Leaderboard)
exports.getLeaderboard = async (req, res) => {
  try {
    const snapshot = await db
      .collection("users")
      .orderBy("points", "desc")
      .limit(10)
      .get();

    const leaderboard = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};

// Get rank of a specific user
exports.getUserRank = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get all users ordered by points
    const snapshot = await db.collection("users").orderBy("points", "desc").get();

    let rank = 0;
    let userData = null;

    snapshot.docs.forEach((doc, index) => {
      if (doc.id === userId) {
        rank = index + 1;
        userData = { id: doc.id, ...doc.data() };
      }
    });

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ rank, user: userData });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user rank" });
  }
};
