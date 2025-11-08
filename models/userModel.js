import { readCollection } from '../Config/db.js';

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
