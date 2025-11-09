import { readCollection } from '../Config/db.js';
import { generateEmailCode } from '../utils/helper.js';
import { sendVerificationCode } from './resend.js';

export const sendCode = async (email) => {
  email = email.toLowerCase();
  const code = generateEmailCode();

  const emailVerificationCollection = await readCollection(
    'emailVerifications',
  );

  await emailVerificationCollection.deleteMany({ email });

  await emailVerificationCollection.insertOne({
    email,
    code,
    expiresAt: Date.now() + 10 * 60 * 100,
  });

  await sendVerificationCode(email, code)
};
