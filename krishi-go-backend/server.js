const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import Routes
const userRoutes = require('./routes/users');
const challengeRoutes = require('./routes/challenge');   // old challenge API
const rewardsRoute = require('./routes/rewards');
const homeRoutes = require('./routes/home');
const profileRoutes = require('./routes/profile');

// New Routes (Activities, Upload, Challenges v2)
const uploadRoutes = require('./routes/upload');
const activityRoutes = require('./routes/activities');
const challengesRoutes = require('./routes/challenge'); // new version

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ------------------ Routes ------------------
// Old APIs
app.use('/api/users', userRoutes);
app.use('/api/challenge', challengeRoutes);
app.use('/api/rewards', rewardsRoute);
app.use('/api/home', homeRoutes);
app.use('/api/profile', profileRoutes);

// New APIs
app.use('/api/upload', uploadRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/challenges', challengesRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🌱 KrishiGo Backend API is running!',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      challenge: '/api/challenge', // old
      challenges: '/api/challenges', // new
      rewards: '/api/rewards',
      home: {
        dashboard: '/api/home/:userId',
        sustainability: '/api/home/:userId/sustainability',
        invites: '/api/home/:userId/invites'
      },
      profile: {
        main: '/api/profile/:userId',
        settings: '/api/profile/:userId/settings',
        language: '/api/profile/:userId/language',
        stats: '/api/profile/:userId/stats'
      },
      upload: '/api/upload/image',
      activities: '/api/activities'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'krishigo-backend'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File too large' });
  }

  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ error: 'Too many files' });
  }

  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 KrishiGo Backend API running on http://localhost:${PORT}`);
  console.log(`👤 Profile: http://localhost:${PORT}/api/profile/USER_ID`);
  console.log(`🏠 Home Dashboard: http://localhost:${PORT}/api/home/USER_ID`);
  console.log(`📤 Upload: http://localhost:${PORT}/api/upload/image`);
  console.log(`🎯 Activities: http://localhost:${PORT}/api/activities`);
  console.log(`🏆 Challenges (new): http://localhost:${PORT}/api/challenges`);
  console.log(`💚 Health Check: http://localhost:${PORT}/health`);
});
