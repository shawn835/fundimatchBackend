import { sendSuccess, sendBadRequest } from '../utils/sendResponse.js';
import { parseJsonBody } from '../utils/parseReqBody.js';
import { findUserByEmail } from '../models/userModel.js';
import { sendCode } from './sendCode.js';
import { handleError } from '../utils/errors.js';

export const resendCode = async (req, res) => {
  try {
    const { email } = await parseJsonBody(req);

    const normalizedEmail = email.toLowerCase();
    const user = await findUserByEmail(normalizedEmail);
    if (!user) {
      return sendNotFound(res, { message: 'No account with that email.' });
    }

    if (user.isVerified) {
      return sendBadRequest(res, { message: 'Account already verified.' });
    }

    await sendCode(normalizedEmail);
    return sendSuccess(res, { message: 'Verification code resent!' });
  } catch (err) {
    console.error('Resend code error:', err);
    return handleError(res, { message: 'Internal server error' });
  }
};
