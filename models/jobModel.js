import { ObjectId } from 'mongodb';
import { readCollection } from '../Config/db.js';

const collection = 'jobs';

export const insertJob = async (job) => {
  try {
    const jobsCollection = await readCollection(collection);
    await jobsCollection.insertOne(job);
  } catch (error) {
    console.error('error creating job:', err);
    throw err;
  }
};

export const findJobById = async (id) => {
  try {
    const jobsCollection = await readCollection(collection);
    const job = await jobsCollection.findOne({
      _id: new ObjectId(id),
      isDeleted: { $ne: true },
    });
    return job;
  } catch (err) {
    console.error('error finding job by id:', err);
    throw err;
  }
};

export const updateJobById = async (jobId, updateData) => {
  try {
    const jobsCollection = await readCollection(collection);
    const result = await jobsCollection.findOneAndUpdate(
      { _id: new ObjectId(jobId) },
      { $set: updateData },
      { returnDocument: 'after' },
    );
    return result.value; // updated document
  } catch (err) {
    console.error('Error updating job:', err);
    throw err;
  }
};

export const deleteJobById = async (jobId) => {
  try {
    const jobsCollection = await readCollection(collection);

    await jobsCollection.updateOne(
      { _id: new ObjectId(jobId) },
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      },
    );
  } catch (err) {
    console.error('Error deleting job:', err);
    throw err;
  }
};
