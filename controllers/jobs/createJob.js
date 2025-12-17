import { validateJob } from '../../utils/validator.js';
import { parseJsonBody } from '../../utils/parseReqBody.js';
import { insertJob } from '../../models/jobModel.js';
import { sendCreated } from '../../utils/sendResponse.js';
import { handleError } from '../../utils/errors.js';

export const createJob = async (req, res) => {
  try {
    const user = req.user.id;

    const rawBody = await parseJsonBody(req);
    const { phone, description, urgency, title, category, location, budget } =
      validateJob(rawBody);

    const job = {
      userId: user,
      title,
      category,
      budget,
      phone,
      urgency,
      location,
      description,
      createdAt: new Date(),
    };

    await insertJob(job);

    return sendCreated(res, { message: 'job created successfully' });
  } catch (error) {
    console.error('Error in createJob', error);
    return handleError(res, error);
  }
};
