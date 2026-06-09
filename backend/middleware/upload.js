const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

let storage;

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const isCloudinaryConfigured = cloudName && apiKey && apiSecret;

if (isCloudinaryConfigured) {
  // Configure Cloudinary SDK
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  // Setup Cloudinary Storage
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'novasphere-uploads',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif'],
    },
  });

  console.log('☁️  Cloudinary File Storage Initialized.');
} else {
  // Fallback to local storage
  const uploadDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
  });

  console.warn('📁 Cloudinary credentials missing. Falling back to local disk storage in /backend/uploads.');
}

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

module.exports = { upload, isCloudinaryConfigured };
