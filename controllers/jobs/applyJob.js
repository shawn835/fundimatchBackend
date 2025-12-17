import { findJobById, updateJobById } from '../../models/jobModel.js';
import { handleError } from '../../utils/errors.js';
import {
  sendConflict,
  sendNotFound,
  sendSuccess,
  sendUnauthorized,
} from '../../utils/sendResponse.js';

export const applyJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.id;

    const job = await findJobById(jobId);
    if (!job || job.isDeleted) {
      return sendNotFound(res, { message: 'job not found' });
    }

    // Owner cannot apply
    if (job.userId.toString() === userId) {
      return sendUnauthorized(res, { message: 'cannot apply to your own job' });
    }

    // Initialize applicants array if not existing
    if (!job.applicants) job.applicants = [];

    // Convert all existing applicants to strings
    const applicantsStr = job.applicants.map((id) => id.toString());

    // Check if already applied
    if (applicantsStr.includes(userId)) {
      return sendConflict(res, {
        message: 'you have already applied for this job',
      });
    }

    // Add userId as string
    job.applicants.push(userId.toString());

    await updateJobById(jobId, { applicants: job.applicants });

    return sendSuccess(res, { message: 'job application successfull' });
  } catch (error) {
    console.error('Error in applyJob:', error);
    return handleError(req, error);
  }
};

export const getApplicantsForJob = async (req, res) => {};
