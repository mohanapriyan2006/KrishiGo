const express = require("express");
const { db } = require("../config/firebase");
const admin = require("firebase-admin");

const router = express.Router();

// 1. Get all rewards
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("rewards").get();
    const rewards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(rewards);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch rewards" });
  }
});

// 2. Claim a daily reward
router.post("/claim/:rewardId", async (req, res) => {
  try {
    const { rewardId } = req.params;
    const { userId } = req.body;

    // get reward
    const rewardDoc = await db.collection("rewards").doc(rewardId).get();
    if (!rewardDoc.exists) return res.status(404).json({ error: "Reward not found" });
    const reward = rewardDoc.data();

    // add points to user
    const userRef = db.collection("users").doc(userId);
    await userRef.update({
      points: admin.firestore.FieldValue.increment(reward.pointsRequired),
      updatedAt: new Date(),
    });

    // log claim
    await db.collection("user_rewards").add({
      userId,
      rewardId,
      status: "claimed",
      claimedAt: new Date(),
    });

    res.json({ message: "Reward claimed successfully!", reward });
  } catch (err) {
    res.status(500).json({ error: "Failed to claim reward" });
  }
});

// 3. Redeem a reward
router.post("/redeem/:rewardId", async (req, res) => {
  try {
    const { rewardId } = req.params;
    const { userId } = req.body;

    const rewardDoc = await db.collection("rewards").doc(rewardId).get();
    if (!rewardDoc.exists) return res.status(404).json({ error: "Reward not found" });
    const reward = rewardDoc.data();

    // check user points
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    const user = userDoc.data();

    if (user.points < reward.pointsRequired) {
      return res.status(400).json({ error: "Not enough points to redeem" });
    }

    // deduct points
    await userRef.update({
      points: user.points - reward.pointsRequired,
      updatedAt: new Date(),
    });

    // log redemption
    await db.collection("user_rewards").add({
      userId,
      rewardId,
      status: "redeemed",
      claimedAt: new Date(),
    });

    res.json({ message: "Reward redeemed successfully!", reward });
  } catch (err) {
    res.status(500).json({ error: "Failed to redeem reward" });
  }
});

// 4. Get reward history for a user
router.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const snapshot = await db
      .collection("user_rewards")
      .where("userId", "==", userId)
      .get();

    const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reward history" });
  }
});

module.exports = router;
