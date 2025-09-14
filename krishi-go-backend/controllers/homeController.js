const { db } = require('../config/firebase');
const moment = require('moment');

// Get greeting based on time
const getGreeting = () => {
  const hour = moment().hour();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

// Get home dashboard data
const getHomeDashboard = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user data
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const userData = userDoc.data();
    const userName = userData.name || 'Farmer';
    
    // Get sustainability score
    const sustainabilityDoc = await db.collection('sustainability').doc(userId).get();
    const sustainabilityData = sustainabilityDoc.exists ? sustainabilityDoc.data() : {};
    const sustainabilityScore = sustainabilityData.score || 60;
    
    // Get invite data
    const invitesSnapshot = await db.collection('invites')
      .where('inviterId', '==', userId)
      .get();
    
    const totalInvites = invitesSnapshot.size;
    
    // Build home dashboard response
    const dashboard = {
      greeting: {
        message: getGreeting(),
        userName: userName.split(' ')[0], // First name only
        fullMessage: `${getGreeting()} ${userName.split(' ')[0]}!`
      },
      user: {
        id: userId,
        name: userData.name,
        totalPoints: userData.totalPoints || 0,
        level: userData.level || 1
      },
      quickActions: [
        {
          icon: 'course',
          label: 'My Course',
          route: '/courses',
          color: '#4CAF50'
        },
        {
          icon: 'rewards',
          label: 'Rewards', 
          route: '/rewards',
          color: '#4CAF50'
        },
        {
          icon: 'search',
          label: 'Search',
          route: '/search',
          color: '#4CAF50'
        },
        {
          icon: 'rewards',
          label: 'Rewards',
          route: '/rewards',
          color: '#4CAF50'
        }
      ],
      sustainability: {
        score: sustainabilityScore,
        bestScore: sustainabilityData.bestScore || 70,
        targetScore: 100,
        status: sustainabilityScore >= 70 ? 'Growing Strong' : 'Keep Growing',
        statusIcon: '🌱',
        canImprove: sustainabilityScore < 100,
        improvementUrl: '/sustainability'
      },
      inviteEarn: {
        title: 'Invite & Earn',
        subtitle: 'Share & Collect Rewards',
        description: 'Each Friend = Extra Points',
        bonusMessage: 'Bring a Friend, Grow Together!',
        totalInvites: totalInvites,
        pointsPerInvite: 100,
        totalEarned: totalInvites * 100,
        shareUrl: `https://krishigo.app/invite/${userId}`,
        inviteCode: `KRISHI${userId.substr(-6).toUpperCase()}`
      },
      stats: {
        totalPoints: userData.totalPoints || 0,
        sustainabilityScore: sustainabilityScore,
        totalInvites: totalInvites,
        level: userData.level || 1
      }
    };
    
    res.json(dashboard);
    
  } catch (error) {
    console.error('Home dashboard error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update sustainability score
const updateSustainabilityScore = async (req, res) => {
  try {
    const { userId } = req.params;
    const { score, metrics } = req.body;
    
    const sustainabilityData = {
      userId,
      score: parseInt(score),
      metrics: metrics || {},
      lastUpdated: new Date(),
      updatedBy: 'user'
    };
    
    // Update best score if this is higher
    const existingDoc = await db.collection('sustainability').doc(userId).get();
    if (existingDoc.exists) {
      const existing = existingDoc.data();
      if (score > (existing.bestScore || 0)) {
        sustainabilityData.bestScore = score;
      } else {
        sustainabilityData.bestScore = existing.bestScore;
      }
    } else {
      sustainabilityData.bestScore = score;
    }
    
    await db.collection('sustainability').doc(userId).set(sustainabilityData, { merge: true });
    
    res.json({
      message: 'Sustainability score updated',
      newScore: score,
      bestScore: sustainabilityData.bestScore
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create invite
const createInvite = async (req, res) => {
  try {
    const { userId } = req.params;
    const { friendEmail, friendName } = req.body;
    
    const inviteData = {
      inviterId: userId,
      friendEmail,
      friendName: friendName || '',
      inviteCode: `KRISHI${userId.substr(-6).toUpperCase()}`,
      status: 'sent',
      createdAt: new Date(),
      pointsEarned: 0
    };
    
    const inviteRef = await db.collection('invites').add(inviteData);
    
    res.json({
      message: 'Invite sent successfully',
      inviteId: inviteRef.id,
      inviteCode: inviteData.inviteCode
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user's invites
const getUserInvites = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const invitesSnapshot = await db.collection('invites')
      .where('inviterId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    const invites = [];
    invitesSnapshot.forEach(doc => {
      const data = doc.data();
      invites.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate()
      });
    });
    
    const totalPoints = invites
      .filter(invite => invite.status === 'accepted')
      .reduce((sum, invite) => sum + (invite.pointsEarned || 100), 0);
    
    res.json({
      invites,
      totalInvites: invites.length,
      acceptedInvites: invites.filter(i => i.status === 'accepted').length,
      totalPointsEarned: totalPoints
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getHomeDashboard,
  updateSustainabilityScore,
  createInvite,
  getUserInvites
};