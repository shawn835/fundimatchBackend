import {
  findUserById,
  findUserByEmail,
  findUserByPhone,
  updateUserById,
} from '../../models/userModel.js';
import { handleError } from '../../utils/errors.js';
import { parseJsonBody } from '../../utils/parseReqBody.js';
import { sendConflict, sendSuccess } from '../../utils/sendResponse.js';
import { validateCustomer } from '../../utils/validator.js';

//update profile
export const updateCustomer = async (req, res) => {
  try {
    const authUser = req.user;
    const dbUser = await findUserById(authUser.id);

    const body = await parseJsonBody(req);

    const { name, email, estate, phone } = validateCustomer(body, {
      requirePassword: false,
    });

    // Check uniqueness for email
    if (email && email !== dbUser.email) {
      const existing = await findUserByEmail(email);
      if (existing) {
        return sendConflict(res, { message: 'Email already in use' });
      }
    }

    // Check uniqueness for phone
    if (phone && phone !== dbUser.phone) {
      const existing = await findUserByPhone(phone);
      if (existing) {
        return sendConflict(res, { message: 'Phone already in use' });
      }
    }

    // Build updates object for fields other than email
    const updates = {};
    if (name !== dbUser.name) updates.name = name;
    if (phone !== dbUser.phone) updates.phone = phone;
    if (estate !== dbUser.estate) updates.estate = estate;

    // If email changed, handle pending verification
    if (email && email !== dbUser.email) {
      updates.newEmail = email;
      updates.isVerified = false;

      await updateUserById(dbUser._id, updates);

      //  await sendCode(email);

      return sendSuccess(res, {
        message:
          'Profile updated successfully. Verification code sent to new email.',
        pendingEmail: email,
      });
    }

    // If only non-email fields changed
    if (Object.keys(updates).length === 0) {
      return sendSuccess(res, { message: 'No changes to update.' });
    }

    const updatedUser = await updateUserById(dbUser._id, updates);

    return sendSuccess(res, {
      message: 'Profile updated successfully.',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        estate: updatedUser.estate,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error('Update customer failed:', error);
    return handleError(res, error);
  }
};
