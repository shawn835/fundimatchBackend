import formidable from 'formidable';
import { handleError } from '../../utils/errors.js';
import {
  sendBadRequest,
  sendConflict,
  sendSuccess,
  sendUnauthorized,
} from '../../utils/sendResponse.js';
import {
  updateUserById,
  findUserById,
  findUser,
} from '../../models/userModel.js';
import { sendCode } from '../../Services/sendCode.js';
import {
  uploadFundiProfileImage,
  extractPublicId,
  deleteFromCloudinary,
} from '../../utils/handleFilesUpload.js';

export const updateFundi = async (req, res) => {
  const form = formidable({ multiples: false, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return sendBadRequest(res, { message: 'Invalid form data' });

    try {
      const dbUser = await findUserById(req.user.id);

      if (!dbUser) {
        return sendUnauthorized(res, { message: 'unauthorized' });
      }

      // 1. Parse file if uploaded
      const profileFile = files.profileImg
        ? Array.isArray(files.profileImg)
          ? files.profileImg[0]
          : files.profileImg
        : null;

      // 2. Validate text fields (password not required)
      const {
        name,
        email,
        phone,
        about,
        location,
        category,
        yearsOfExperience,
      } = validateFundi(fields, { requirePassword: false });

      // 3. Unique email checks (only if changed)
      if (email && email !== dbUser.email) {
        const exists = await findUser({ email });
        if (exists) return sendConflict(res, { message: 'Email in use' });
      }

      // Unique phone check
      if (phone && phone !== dbUser.phone) {
        const exists = await findUser({ phone });
        if (exists) return sendConflict(res, { message: 'Phone in use' });
      }

      const profileChanged = !!profile; // if a new file was uploaded

      const isSame =
        !profileChanged &&
        name === dbUser.name &&
        phone === dbUser.phone &&
        email === dbUser.email &&
        about === dbUser.about &&
        location === dbUser.location &&
        category === dbUser.category &&
        yearsOfExperience == dbUser.yearsOfExperience;

      if (isSame) {
        return sendSuccess(res, { message: 'No changes to update.' });
      }

      // Build updates object ONLY with changed fields
      const updates = {};

      if (name !== dbUser.name) updates.name = name;
      if (phone !== dbUser.phone) updates.phone = phone;
      if (location !== dbUser.location) updates.location = location;
      if (about !== dbUser.about) updates.about = about;
      if (category !== dbUser.category) updates.category = category;
      if (yearsOfExperience != dbUser.yearsOfExperience)
        updates.yearsOfExperience = yearsOfExperience;

      // 7. Handle profile image
      if (profileChanged) {
        // delete previous if it exists
        if (dbUser.profileUrl) {
          const publicId = extractPublicId(dbUser.profileUrl);
          await deleteFromCloudinary(publicId);
        }

        // upload new
        const uploaded = await uploadFundiProfileImage(profileFile);

        updates.profileUrl = uploaded;
      }

      // 8. If email changed → start verification flow
      if (email !== dbUser.email) {
        updates.newEmail = email;
        updates.isVerified = false;

        // await sendCode(email); // uncomment when ready
        return sendSuccess(res, {
          pendingEmail: email,
          message: 'Verification code sent to new email.',
        });
      }

      // 9. Save changes
      const updatedUser = await updateUserById(user.id, updates);

      return sendSuccess(res, {
        message: 'Fundi profile updated successfully',
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          profileUrl: updatedUser.profileUrl,
          category: updatedUser.category,
          about: updatedUser.about,
          location: updatedUser.location,
          yearsOfExperience: updatedUser.yearsOfExperience,
        },
      });
    } catch (error) {
      console.error('Fundi update error:', error);
      return handleError(res, error);
    }
  });
};
