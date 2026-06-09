const express = require('express');
const router = express.Router();
const { upload, isCloudinaryConfigured } = require('../middleware/upload');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, admin, (req, res) => {
  upload.single('file')(req, res, function (err) {
    if (err) {
      console.error('❌ Upload error:', err.message);
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select a file to upload' });
    }

    let fileUrl = '';
    
    if (isCloudinaryConfigured) {
      // Multer storage cloudinary puts url in path or secure_url
      fileUrl = req.file.path || req.file.secure_url;
    } else {
      // Local file
      const hostname = req.hostname === 'localhost' ? `http://localhost:${process.env.PORT || 5000}` : `https://${req.get('host')}`;
      fileUrl = `${hostname}/uploads/${req.file.filename}`;
    }

    res.json({
      success: true,
      message: 'Media uploaded successfully',
      url: fileUrl,
    });
  });
});

module.exports = router;
