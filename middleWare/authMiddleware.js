import { UnauthorizedError, handleError } from '../utils/errors.js';
import { findUserById } from '../models/userModel.js';
import { verifyToken } from '../utils/JWT.js';

export const requireAuth = async (req, res, next) => {
  try {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) throw new UnauthorizedError('authentication required');

    const token = getCookie(cookieHeader, 'token');
    if (!token) throw new UnauthorizedError('authentication required');

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      throw new UnauthorizedError('invalid or expired token');
    }

    const user = await findUserById(decoded.id);
    if (!user) throw new UnauthorizedError('user no longer exists');

    // if (user.isVerified === false) {
    //   throw new UnauthorizedError('Please verify your email first');
    // }

    // Always attach common fields
    req.user = {
      id: user._id.toString(),
    };

    next();
  } catch (error) {
    return handleError(res, error);
  }
};

function getCookie(cookieHeader, name) {
  const cookies = cookieHeader.split(';').map((c) => c.trim());
  const match = cookies.find((c) => c.startsWith(name + '='));
  return match ? match.split('=')[1] : null;
}
