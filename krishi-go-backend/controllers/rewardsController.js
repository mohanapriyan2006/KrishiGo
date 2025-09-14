const { db } = require('../config/firebase');
const { REWARD_TYPES } = require('../models/rewardTypes');
const { isNewDay, getTodayStart, getTodayEnd } = require('../utils/dateUtils');
const { updateUserPoints } = require('./userController');

// Get user's reward status
const getUserRewards = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user exists
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const userData = userDoc.data();
    const todayStart = getTodayStart();
    const todayEnd = getTodayEnd();
    
    // Get today's claimed rewards
    const todayRewardsSnapshot = await db.collection('userRewards')
      .where('userId', '==', userId)
      .where('claimedAt', '>=', todayStart)
      .where('claimedAt', '<=', todayEnd)
      .get();
    
    const claimedToday = [];
    todayRewardsSnapshot.forEach(doc => {
      claimedToday.push(doc.data().rewardType);
    });
    
    // Prepare available rewards
    const availableRewards = {
      totalPoints: userData.totalPoints || 0,
      dailyRewards: [
        {
          id: REWARD_TYPES.DAILY_REWARD_1.id,
          name: REWARD_TYPES.DAILY_REWARD_1.name,
          points: REWARD_TYPES.DAILY_REWARD_1.points,
          description: REWARD_TYPES.DAILY_REWARD_1.description,
          claimed: claimedToday.includes(REWARD_TYPES.DAILY_REWARD_1.id),
          canClaim: !claimedToday.includes(REWARD_TYPES.DAILY_REWARD_1.id)
        },
        {
          id: REWARD_TYPES.DAILY_REWARD_2.id,
          name: REWARD_TYPES.DAILY_REWARD_2.name,
          points: REWARD_TYPES.DAILY_REWARD_2.points,
          description: REWARD_TYPES.DAILY_REWARD_2.description,
          claimed: claimedToday.includes(REWARD_TYPES.DAILY_REWARD_2.id),
          canClaim: !claimedToday.includes(REWARD_TYPES.DAILY_REWARD_2.id)
        }
      ],
      referralReward: {
        id: REWARD_TYPES.REFERRAL_BONUS.id,
        name: REWARD_TYPES.REFERRAL_BONUS.name,
        points: REWARD_TYPES.REFERRAL_BONUS.points,
        description: REWARD_TYPES.REFERRAL_BONUS.description
      }
    };
    
    res.json(availableRewards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Claim a reward
const claimReward = async (req, res) => {
  try {
    const { userId } = req.params;
    const { rewardType } = req.body;
    
    // Validate reward type
    const rewardConfig = Object.values(REWARD_TYPES).find(r => r.id === rewardType);
    if (!rewardConfig) {
      return res.status(400).json({ message: 'Invalid reward type' });
    }
    
    // Check if user exists
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // For daily rewards, check if already claimed today
    if (rewardConfig.category === 'daily') {
      const todayStart = getTodayStart();
      const todayEnd = getTodayEnd();
      
      const existingClaim = await db.collection('userRewards')
        .where('userId', '==', userId)
        .where('rewardType', '==', rewardType)
        .where('claimedAt', '>=', todayStart)
        .where('claimedAt', '<=', todayEnd)
        .get();
      
      if (!existingClaim.empty) {
        return res.status(400).json({ 
          message: 'Reward already claimed today',
          canClaimAgainAt: 'tomorrow'
        });
      }
    }
    
    // Record the reward claim
    const claimData = {
      userId,
      rewardType,
      rewardName: rewardConfig.name,
      pointsEarned: rewardConfig.points,
      claimedAt: new Date(),
      category: rewardConfig.category
    };
    
    await db.collection('userRewards').add(claimData);
    
    // Update user points
    const pointsUpdate = await updateUserPoints(userId, rewardConfig.points, `reward_${rewardType}`);
    
    res.json({
      message: 'Reward claimed successfully!',
      reward: {
        name: rewardConfig.name,
        points: rewardConfig.points
      },
      userPoints: {
        previous: pointsUpdate.newPoints - pointsUpdate.pointsAdded,
        current: pointsUpdate.newPoints,
        level: pointsUpdate.newLevel
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user's reward history
const getRewardHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    
    const rewardsSnapshot = await db.collection('userRewards')
      .where('userId', '==', userId)
      .orderBy('claimedAt', 'desc')
      .limit(limit)
      .get();
    
    const rewards = [];
    rewardsSnapshot.forEach(doc => {
      const data = doc.data();
      rewards.push({
        id: doc.id,
        ...data,
        claimedAt: data.claimedAt.toDate()
      });
    });
    
    res.json({ rewards, total: rewards.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Redeem points (placeholder for future implementation)
const redeemPoints = async (req, res) => {
  try {
    const { userId } = req.params;
    const { points, item } = req.body;
    
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const currentPoints = userDoc.data().totalPoints || 0;
    if (currentPoints < points) {
      return res.status(400).json({ message: 'Insufficient points' });
    }
    
    // Deduct points
    await updateUserPoints(userId, -points, `redemption_${item}`);
    
    // Record redemption
    await db.collection('redemptions').add({
      userId,
      item,
      pointsUsed: points,
      redeemedAt: new Date(),
      status: 'pending'
    });
    
    res.json({ message: 'Points redeemed successfully!', remainingPoints: currentPoints - points });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUserRewards,
  claimReward,
  getRewardHistory,
  redeemPoints
};