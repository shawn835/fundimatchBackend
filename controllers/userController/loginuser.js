import { findUser } from '../../models/userModel.js';
import { handleError } from '../../utils/errors.js';
import { parseJsonBody } from '../../utils/parseReqBody.js';
import {
  sendBadRequest,
  sendSuccess,
  sendNotFound,
} from '../../utils/sendResponse.js';
import { comparePassword } from '../../utils/hash.js';
import { setCookie } from '../../utils/Cookies.js';
import { validateLogin } from '../../utils/validator.js';
import { generateToken } from '../../utils/JWT.js';

// login
export const loginUser = async (req, res) => {
  try {
    const rawBody = await parseJsonBody(req);
    const { phone, password } = validateLogin(rawBody);

    const user = await findUser({ phone });

    if (!user) {
      return sendNotFound(res, { message: 'User not found, please register' });
    }

    // if (user.isVerified === false) {
    //   return sendBadRequest(res, {
    //     message: 'Please verify your account first',
    //   });
    // }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return sendBadRequest(res, { message: 'incorrect password' });
    }

    const payLoad = {
      id: user._id,
      version: user.tokenVersion,
    };

    const token = generateToken(payLoad);

    const maxAge = Number(process.env.COOKIE_MAX_AGE);

    setCookie(res, 'token', token, maxAge);

    // Return safe user object
    const safeUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      estate: user.estate || null,
      profileUrl: user.profileUrl || null,
    };

    return sendSuccess(res, {
      message: 'Logged in successfully',
      user: safeUser,
    });
  } catch (error) {
    console.error('Error when logging in', error);
    return handleError(res, error);
  }
};
