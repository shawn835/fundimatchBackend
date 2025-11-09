import { readCollection } from '../Config/db.js';
import {
  sendBadRequest,
  sendNotFound,
  sendSuccess,
  sendUnauthorized,
} from '../utils/sendResponse.js';
import { parseJsonBody } from '../utils/parseReqBody.js';
import { handleError } from '../utils/errors.js';

export const handleVerifyCode = async (req, res) => {
  try {
    const { email, code } = await parseJsonBody(req);

    const normalizedEmail = email.toLowerCase();

    const usersCollection = await readCollection('users');
    const emailVerificationsCollection = await readCollection(
      'emailVerifications',
    );
    const record = await emailVerificationsCollection.findOne({
      email: normalizedEmail,
    });

    if (!record) {
      return sendNotFound(res, { message: 'Code not found' });
    }

    if (record.expiresAt < Date.now()) {
      return sendUnauthorized(res, { message: 'Code expired!' });
    }

    if (record.code !== code) {
      return sendBadRequest(res, { message: 'Invalid code' });
    }

    await emailVerificationsCollection.deleteMany({ email: normalizedEmail });

    await usersCollection.updateOne({ email }, { $set: { isVerified: true } });

    return sendSuccess(res, { message: 'Verification successful!' });
  } catch (error) {
    console.error('Error in handleVerifyCode:', error);
    return handleError(res, error);
  }
};
