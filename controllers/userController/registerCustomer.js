import {
  findUserByEmail,
  findUserByPhone,
  insertUser,
} from '../../models/userModel.js';
import { handleError } from '../../utils/errors.js';
import { hashPassword } from '../../utils/hash.js';
import { parseJsonBody } from '../../utils/parseReqBody.js';
import { sendConflict, sendCreated } from '../../utils/sendResponse.js';
import { validateCustomer } from '../../utils/validator.js';

import { sendCode } from '../../Services/sendCode.js';

export const registerUserController = async (req, res) => {
  try {
    const rawBody = await parseJsonBody(req);
    const { name, email, password, estate, phone } = validateCustomer(rawBody, {
      requirePassword: true,
    });
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
    await sendCode(email);

    return sendCreated(res, {
      message: 'Registered! Check your email for a code',
    });
  } catch (error) {
    console.error('error in register user', error);
    return handleError(res, error);
  }
};
