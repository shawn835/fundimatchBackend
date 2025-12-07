import { readCollection } from '../Config/db.js';
import { ObjectId } from 'mongodb';

export function setCookie(res, name, value) {
  const cookieOptions = [
    `${name}=${value}`,
    'HttpOnly',
    'Path=/',
    `Max-Age=${process.env.COOKIE_MAX_AGE || 3600}`,
  ];

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.push('Secure', 'SameSite=None');
  } else {
    // Localhost dev
    cookieOptions.push('SameSite=Lax');
  }

  res.setHeader('Set-Cookie', cookieOptions.join('; '));
}

export const revokeTokenAndClearCookie = async (res, userId) => {
  const usersCollection = await readCollection('users');

   const _id = typeof userId === 'string' ? new ObjectId(userId) : userId;

  // increvment tokenVersion to invalidate all existing JWTs
  await usersCollection.updateOne({ _id }, { $inc: { tokenVersion: 1 } });

  // Clear cookie in response
  const cookieOptions = [
    `token=; HttpOnly; Path=/; Max-Age=0`,
    process.env.NODE_ENV === 'production'
      ? 'Secure; SameSite=None'
      : 'SameSite=Lax',
  ];

  res.setHeader('Set-Cookie', cookieOptions.join('; '));
};
