// routes/upload.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

// POST upload image
router.post('/image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({
    message: 'File uploaded successfully',
    file: req.file
  });
});

module.exports = router;
