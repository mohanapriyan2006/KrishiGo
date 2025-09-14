// controllers/userController.js
// Here you can connect with Firebase/DB later

// Temporary in-memory users
let users = [
  { id: 1, name: "Anand", email: "anand@example.com" },
  { id: 2, name: "Krishi", email: "krishi@example.com" }
];

// Get all users
const getUsers = (req, res) => {
  res.json(users);
};

// Get user by ID
const getUserById = (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// Create user
const createUser = (req, res) => {
  const { name, email } = req.body;
  const newUser = {
    id: users.length + 1,
    name,
    email
  };
  users.push(newUser);
  res.status(201).json(newUser);
};

module.exports = {
  getUsers,
  getUserById,
  createUser
};
