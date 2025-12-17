import { deleteJobById, findJobById } from '../../models/jobModel.js';
import { sendSuccess } from '../../utils/sendResponse.js';
import { handleError } from '../../utils/errors.js';

export const deleteJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.id;

    const job = await findJobById(jobId);

    if (!job) {
      return sendNotFound(res, { message: 'job not found' });
    }

    if (job.userId.toString() !== userId) {
      return sendUnauthorized(res, {
        message: 'not authorized to delete this job',
      });
    }

    await deleteJobById(jobId);

    return sendSuccess(res, { message: 'job deleted successfully' });
  } catch (error) {
    console.error('Error in deleteJob:', error);
    return handleError(res, error);
  }
};
