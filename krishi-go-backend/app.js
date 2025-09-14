const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/users');
const challengeRoutes = require('./routes/challenge'); 
const journeyRoutes = require("./routes/journey");
const rewardRoutes = require("./routes/rewards");
const courseRoutes = require("./routes/course");
const leaderboardRoutes = require("./routes/leaderboard");

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/challenge', challengeRoutes);
app.use("/api/journey", journeyRoutes);
app.use("/api/rewards", rewardRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/leaderboard", leaderboardRoutes);


app.get('/', (req, res) => {
  res.json({ message: 'KrishiGo Backend API is running!' });
});

module.exports = app;
