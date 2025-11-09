import { findUserById, updateUserById } from '../../models/userModel.js';
import { handleError } from '../../utils/errors.js';
import { comparePassword, hashPassword } from '../../utils/hash.js';
import { validatePassword } from '../../utils/helper.js';
import { parseJsonBody } from '../../utils/parseReqBody.js';
import {
  sendBadRequest,
  sendNotFound,
  sendSuccess,
} from '../../utils/sendResponse.js';

import {
  rateLimitPasswordUpdate,
  resetPasswordRateLimit,
} from '../../utils/rateLimit.js';

// updatePasswordController.js
export const updatePassword = async (req, res) => {
  try {
    const user = req.user;
    const { currentPassword, newPassword } = await parseJsonBody(req);

    if (!currentPassword || !newPassword) {
      return sendBadRequest(res, {
        message: 'Both current and new passwords are required',
      });
    }

    // Rate limit check
    if (rateLimitPasswordUpdate(user.id)) {
      return sendBadRequest(res, {
        message: 'Too many password attempts. Try again later.',
      });
    }

    // Validate new password (throws if invalid)
    const safePassword = validatePassword(newPassword);

    // Fetch user from DB to get hashed password
    const currentUser = await findUserById(user.id);
    if (!currentUser) {
      return sendNotFound(res, { message: 'User not found' });
    }

    // Verify current password
    const isMatch = await comparePassword(
      currentPassword,
      currentUser.password,
    );
    if (!isMatch) {
      return sendBadRequest(res, { message: 'Current password is incorrect' });
    }

    // Optional: prevent using the same password
    const isSamePassword = await comparePassword(
      safePassword,
      currentUser.password,
    );
    if (isSamePassword) {
      return sendBadRequest(res, {
        message: 'New password cannot be the same as current password',
      });
    }

    // Hash and update
    const hashedPassword = await hashPassword(safePassword);
    await updateUserById(user.id, { password: hashedPassword });
    resetPasswordRateLimit(user.id);

    return sendSuccess(res, { message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    return handleError(res, error);
  }
};
