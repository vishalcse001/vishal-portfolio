const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// .env se credentials lena
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cloudinary me storage setup karna
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio_projects', // Cloudinary me is naam ka folder ban jayega
    allowedFormats: ['jpeg', 'png', 'jpg', 'webp'], // Sirf image allow karenge
  },
});

const upload = multer({ storage: storage });
module.exports = upload;