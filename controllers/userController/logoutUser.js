import { revokeTokenAndClearCookie } from '../../utils/Cookies.js';
import { sendSuccess } from '../../utils/sendResponse.js';
import { handleError } from '../../utils/errors.js';

export const logoutUser = async (req, res) => {
  try {
    await revokeTokenAndClearCookie(res, req.user.id);
    return sendSuccess(res, { message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error when logging out', error);
    return handleError(res, error);
  }
};
