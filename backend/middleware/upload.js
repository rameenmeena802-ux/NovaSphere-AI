import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  console.log('☁️ Cloudinary File Storage Initialized.');
} else {
  // ===== FALLBACK: Local Storage (Vercel Compatible) =====
  const uploadDir = path.join(__dirname, '../uploads');
  
  // Check if directory exists, if not create it
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log(`📁 Uploads directory created: ${uploadDir}`);
    }
  } catch (err) {
    console.warn(`⚠️ Could not create uploads directory: ${err.message}`);
    console.warn('📁 Running without file upload support.');
  }

  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Check if directory exists, if not create it (safety check)
      if (!fs.existsSync(uploadDir)) {
        try {
          fs.mkdirSync(uploadDir, { recursive: true });
        } catch (err) {
          return cb(new Error('Upload directory not available'), null);
        }
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
  });

  console.warn('📁 Cloudinary credentials missing. Falling back to local disk storage.');
}

// File filter - only images
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

export { upload, isCloudinaryConfigured };