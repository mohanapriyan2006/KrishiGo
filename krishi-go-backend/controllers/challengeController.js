const { db } = require('../config/firebase');

// Get all challenges
const getAllChallenges = async (req, res) => {
  try {
    const challengesSnapshot = await db.collection('challenges').get();
    const challenges = [];
    
    challengesSnapshot.forEach(doc => {
      challenges.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get specific challenge
const getChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const challengeDoc = await db.collection('challenges').doc(challengeId).get();
    
    if (!challengeDoc.exists) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    res.json({ id: challengeDoc.id, ...challengeDoc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new challenge
const createChallenge = async (req, res) => {
  try {
    const { title, description, points, difficulty, category, duration } = req.body;
    
    const challengeData = {
      title,
      description,
      points,
      difficulty,
      category,
      duration,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const challengeRef = await db.collection('challenges').add(challengeData);
    res.status(201).json({ id: challengeRef.id, ...challengeData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Complete challenge
const completeChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const { userId } = req.body;
    
    // Get challenge details
    const challengeDoc = await db.collection('challenges').doc(challengeId).get();
    if (!challengeDoc.exists) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    const challenge = challengeDoc.data();
    
    // Record completion
    const completionData = {
      userId,
      challengeId,
      challengeTitle: challenge.title,
      pointsEarned: challenge.points,
      completedAt: new Date()
    };
    
    await db.collection('completions').add(completionData);
    
    // Add points to user
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (userDoc.exists) {
      const currentPoints = userDoc.data().points || 0;
      await userRef.update({
        points: currentPoints + challenge.points,
        updatedAt: new Date()
      });
    }
    
    res.json({ 
      message: 'Challenge completed successfully!',
      pointsEarned: challenge.points 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllChallenges,
  getChallenge,
  createChallenge,
  completeChallenge
};