import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRETE = process.env.JWT_SECRETE;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '180d';

//create the tokjen
export const generateToken = (payload) => {
  const token = jwt.sign(payload, SECRETE, { expiresIn: JWT_EXPIRES_IN });
  return token;
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, SECRETE);
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    return null;
  }
};

//decode token
export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};
