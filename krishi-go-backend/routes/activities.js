// routes/activities.js
const express = require('express');
const router = express.Router();

// In-memory activities (for demo)
let activities = [
  { id: 1, title: "Soil Testing", description: "Check soil health", completed: false },
  { id: 2, title: "Water Conservation", description: "Implement drip irrigation", completed: false }
];

// GET all activities
router.get('/', (req, res) => {
  res.json(activities);
});

// POST new activity
router.post('/', (req, res) => {
  const { title, description } = req.body;
  const newActivity = {
    id: activities.length + 1,
    title,
    description,
    completed: false
  };
  activities.push(newActivity);
  res.status(201).json(newActivity);
});

// PUT update activity status
router.put('/:id', (req, res) => {
  const activity = activities.find(a => a.id === parseInt(req.params.id));
  if (!activity) {
    return res.status(404).json({ error: "Activity not found" });
  }
  activity.completed = req.body.completed ?? activity.completed;
  res.json(activity);
});

// DELETE an activity
router.delete('/:id', (req, res) => {
  activities = activities.filter(a => a.id !== parseInt(req.params.id));
  res.json({ message: "Activity deleted" });
});

module.exports = router;
