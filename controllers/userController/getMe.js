import { handleError } from '../../utils/errors.js';
import { sendSuccess } from '../../utils/sendResponse.js';

export const getMeController = async (req, res) => {
  try {
    const user = req.user;
    return sendSuccess(res, {
      user: user,
    });
  } catch (error) {
    return handleError(res, error);
  }
};
