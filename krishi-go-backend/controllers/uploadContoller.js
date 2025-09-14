const { bucket } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

// Upload image to Firebase Storage
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const file = req.file;
    const fileName = `activities/${uuidv4()}_${file.originalname}`;
    
    // Upload to Firebase Storage
    const fileUpload = bucket.file(fileName);
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });
    
    stream.on('error', (error) => {
      console.error('Upload error:', error);
      // Clean up local file
      fs.unlinkSync(file.path);
      res.status(500).json({ error: 'Upload failed' });
    });
    
    stream.on('finish', async () => {
      try {
        // Make file public
        await fileUpload.makePublic();
        
        // Get public URL
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        
        // Clean up local file
        fs.unlinkSync(file.path);
        
        res.json({
          message: 'Image uploaded successfully',
          imageUrl: publicUrl,
          fileName: fileName
        });
      } catch (error) {
        console.error('Error making file public:', error);
        fs.unlinkSync(file.path);
        res.status(500).json({ error: 'Failed to make file public' });
      }
    });
    
    // Upload file
    fs.createReadStream(file.path).pipe(stream);
    
  } catch (error) {
    console.error('Upload controller error:', error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uploadImage
};