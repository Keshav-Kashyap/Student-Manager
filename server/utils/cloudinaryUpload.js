const cloudinary = require('../config/cloudinary'); // path may vary

const uploadToCloudinary = async (filePath, folderName = 'studentPhotos') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folderName,
    });
    console.log(result);
    return result.secure_url;
  } catch (error) {
    console.error('❌ Cloudinary upload failed:', error);
    throw error;
  }
};

module.exports = uploadToCloudinary;
