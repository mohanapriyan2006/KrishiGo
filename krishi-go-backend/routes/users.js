// routes/users.js
const express = require('express');
const router = express.Router();

// Sample in-memory users (replace with DB later)
let users = [
  { id: 1, name: 'Anand', email: 'anand@example.com' },
  { id: 2, name: 'Krishi', email: 'krishi@example.com' }
];

// GET all users
router.get('/', (req, res) => {
  res.json(users);
});

// GET user by ID
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// POST create user
router.post('/', (req, res) => {
  const { name, email } = req.body;
  const newUser = {
    id: users.length + 1,
    name,
    email
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

module.exports = router;
