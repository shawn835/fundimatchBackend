import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFundiProfileImage = async (file) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

  const maxFileSize = 2 * 1024 * 1024; //2mb

  if (file.size > maxFileSize) {
    throw new Error('Profile image must be under 2MB');
  }

  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new Error('Only JPEG, PNG and WEBP images are allowed');
  }

  try {
    const result = await cloudinary.uploader.upload(file.filepath, {
      folder: 'fundi_profiles',
      resource_type: 'image',

      //  Auto-resize + crop for profile images
      transformation: [
        {
          width: 500,
          height: 500,
          crop: 'fill', // fills the frame
          gravity: 'face', // focuses on the face
          quality: 'auto', // compress automatically
          fetch_format: 'auto', // convert to webp/avif automatically
        },
      ],
    });

    return result.secure_url;
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    throw new Error('Unable to upload profile image');
  }
};
