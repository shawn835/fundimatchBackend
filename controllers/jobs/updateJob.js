import { findJobById, updateJobById } from '../../models/jobModel.js';
import { handleError } from '../../utils/errors.js';
import { parseJsonBody } from '../../utils/parseReqBody.js';
import {
  sendNotFound,
  sendSuccess,
  sendUnauthorized,
} from '../../utils/sendResponse.js';
import { validateJob } from '../../utils/validator.js';

export const updateJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.id;

    const rawBody = await parseJsonBody(req);
    const updateData = validateJob(rawBody);

    const job = await findJobById(jobId);

    if (!job) return sendNotFound(res, { message: 'job not found' });
    if (job.userId.toString() !== userId)
      return sendUnauthorized(res, { message: 'not authorized' });

    await updateJobById(jobId, { ...updateData, updatedAt: new Date() });

    return sendSuccess(res, { message: 'job updated successfully' });
  } catch (error) {
    console.error('Error in updateJob:', error);
    return handleError(res, error);
  }
};
