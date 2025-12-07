import { findUser, insertUser } from '../../models/userModel.js';
import { handleError } from '../../utils/errors.js';
import { uploadFundiProfileImage } from '../../utils/handleFilesUpload.js';
import { hashPassword } from '../../utils/hash.js';
import {
  sendBadRequest,
  sendConflict,
  sendCreated,
} from '../../utils/sendResponse.js';
import { validateFundi } from '../../utils/validator.js';
import formidable from 'formidable';

import { sendCode } from '../../Services/sendCode.js';
export const registerFundiController = async (req, res) => {
  const form = formidable({ multiples: false, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return sendBadRequest(res, { message: 'Error parsing form data' });
    }

    try {
      const profile = files.profileImg
        ? Array.isArray(files.profileImg)
          ? files.profileImg[0]
          : files.profileImg
        : null;

      if (!profile) {
        return sendBadRequest(res, { message: 'Profile image is required' });
      }

      const {
        name,
        email,
        password,
        location,
        phone,
        yearsOfExperience,
        about,
        category,
      } = validateFundi(fields, { requirePassword: true });

      const alreadyExists = await findUser({ email, phone });
      if (alreadyExists) {
        return sendConflict(res, {
          message: 'Phone number or email already in use',
        });
      }

      const profileUrl = await uploadFundiProfileImage(profile);

      const hashedPassword = await hashPassword(password);

      const fundi = {
        name,
        email,
        phone,
        category,
        about,
        profileUrl,
        yearsOfExperience,
        location,
        password: hashedPassword,
        isVerified: false,
        tokenVersion: 0,
        role: 'fundi',
        createdAt: new Date(),
      };

      await insertUser(fundi);

      await sendCode(email);

      return sendCreated(res, {
        message: 'Registered! Check your email for a verification code.',
      });
    } catch (error) {
      console.error('Error in register fundi:', error);
      return handleError(res, error);
    }
  });
};
