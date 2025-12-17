import { findUserById } from '../../models/userModel.js';
import { revokeTokenAndClearCookie } from '../../utils/Cookies.js';
import { deleteUserById } from '../../models/userModel.js';
import { sendSuccess, sendUnauthorized } from '../../utils/sendResponse.js';
import { handleError } from '../../utils/errors.js';

export const deleteUser = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);

    if (!user) {
      return sendUnauthorized(res, { message: 'unauthorized' });
    }
    //delete
    await revokeTokenAndClearCookie(res, user._id);
    await deleteUserById(user._id);

    return sendSuccess(res, { message: 'user deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return handleError(res, error);
  }
};
