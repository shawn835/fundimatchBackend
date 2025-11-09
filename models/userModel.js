import { readCollection } from '../Config/db.js';
import { ObjectId } from 'mongodb';

export const insertUser = async (user) => {
  try {
    const usersCollection = await readCollection('users');
    await usersCollection.insertOne(user);
  } catch (error) {
    console.error('error creating user:', err);
    throw err;
  }
};

export const findUserByPhone = async (phone) => {
  try {
    const usersCollection = await readCollection('users');
    const user = await usersCollection.findOne({
      phone,
    });
    return user;
  } catch (err) {
    console.error('error finding user by phone:', err);
    throw err;
  }
};

export const findUserByEmail = async (email) => {
  try {
    const usersCollection = await readCollection('users');
    const user = await usersCollection.findOne({
      email: email.trim().toLowerCase(),
    });
    return user;
  } catch (err) {
    console.error('error finding user by email:', err);
    throw err;
  }
};

export const findUserById = async (userId) => {
  try {
    const usersCollection = await readCollection('users');
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    return user;
  } catch (err) {
    console.error('Error finding user by ID:', err);
    throw err;
  }
};

export const updateUserById = async (userId, updateData) => {
  try {
    const usersCollection = await readCollection('users');
    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updateData },
      { returnDocument: 'after' },
    );
    return result.value; // updated document
  } catch (err) {
    console.error('Error updating user:', err);
    throw err;
  }
};
