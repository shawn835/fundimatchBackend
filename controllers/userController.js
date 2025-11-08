import { findUserByEmail, findUserByPhone, insertUser } from '../models/userModel.js';
import { handleError } from '../utils/errors.js';
import { uploadFundiProfileImage } from '../utils/handleFilesUpload.js';
import { hashPassword } from '../utils/hash.js';
import { parseJsonBody } from '../utils/parseReqBody.js';
import {
  sendBadRequest,
  sendConflict,
  sendCreated,
} from '../utils/sendResponse.js';
import { validateCustomer, validateFundi } from '../utils/validator.js';
import formidable from 'formidable';

export const registerUserController = async (req, res) => {
  try {
    const rawBody = await parseJsonBody(req);
    const { name, email, password, estate, phone } = validateCustomer(rawBody);
    const existingPhone = await findUserByPhone(phone);

    if (existingPhone) {
      return sendConflict(res, { message: 'phone number already in use' });
    }

    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      return sendConflict(res, { message: 'email already in use' });
    }

    const hashed = await hashPassword(password);

    const customer = {
      name,
      email,
      phone,
      estate,
      password: hashed,
      isVerified: false,
      role: 'customer',
      createdAt: new Date(),
    };
    await insertUser(customer);

    return sendCreated(res, {
      message: 'Registered! Check your email for a code',
    });
  } catch (error) {
    console.error('error in register user', error);
    return handleError(res, error);
  }
};

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
      } = validateFundi(fields);

      const existingPhone = await findUserByPhone(phone);
      if (existingPhone) {
        return sendConflict(res, { message: 'Phone number already in use' });
      }

      const existingEmail = await findUserByEmail(email);
      if (existingEmail) {
        return sendConflict(res, { message: 'Email already in use' });
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
        role: 'fundi',
        createdAt: new Date(),
      };

      await insertUser(fundi);

      return sendCreated(res, {
        message: 'Registered! Check your email for a verification code.',
      });
    } catch (error) {
      console.error('Error in register fundi:', error);
      return handleError(res, error);
    }
  });
};
