import {
  sanitizeInput,
  validateEmail,
  validatePhoneNumber,
  normalizedPhoneNumber,
  validatePassword,
} from './helper.js';
import { ValidationError } from './errors.js';

const allowedCustomerFields = ['name', 'email', 'password', 'phone', 'estate'];
const allowedFundiFields = [
  'name',
  'email',
  'password',
  'phone',
  'location',
  'yearsOfExperience',
  'category',
  'about',
];

const allowedLoginFields = ['phone', 'password'];
const jobFields = [
  'title',
  'description',
  'category',
  'location',
  'budget',
  'urgency',
  'phone',
];

const jobCategories = [
  'plumbing',
  'electrical',
  'carpentry',
  'painting',
  'cleaning',
];

const allowedUrgency = ['low', 'medium', 'high'];

export const validateCustomer = (rawBody, { requirePassword = true } = {}) => {
  // whitelist
  const body = {};
  for (const k of allowedCustomerFields) {
    if (rawBody[k] !== undefined) body[k] = rawBody[k];
  }

  const cleaned = sanitizeInput(body);
  if (!cleaned.name) throw new ValidationError('name is required');
  if (!cleaned.email) throw new ValidationError('email is required');
  if (requirePassword && !cleaned.password) {
    throw new ValidationError('password is required');
  }

  if (!cleaned.phone) throw new ValidationError('phone number is required');
  if (!cleaned.estate) throw new ValidationError('your residence is required ');

  // validation
  if (cleaned.name.length < 3) throw new ValidationError('name too short');
  if (!validateEmail(cleaned.email)) throw new ValidationError('invalid email');
  if (!validatePhoneNumber(cleaned.phone))
    throw new ValidationError('invalid phone');

  if (requirePassword) validatePassword(cleaned.password);

  cleaned.phone = normalizedPhoneNumber(cleaned.phone);

  return cleaned;
};

export const validateFundi = (fields, { requirePassword = true } = {}) => {
  const getFieldValue = (val) => (Array.isArray(val) ? val[0] : val);

  // whitelist
  const body = {};
  for (const key of allowedFundiFields) {
    if (fields[key] !== undefined) {
      body[key] = getFieldValue(fields[key]);
    }
  }

  const cleaned = sanitizeInput(body);

  if (!cleaned.name) throw new ValidationError('name is required');
  if (!cleaned.email) throw new ValidationError('email is required');
  if (requirePassword && !cleaned.password) {
    throw new ValidationError('password is required');
  }

  if (!cleaned.phone) throw new ValidationError('phone is required');
  if (!cleaned.location) throw new ValidationError('location is required');
  if (!cleaned.category) throw new ValidationError('category is required');

  if (cleaned.name.length < 3) throw new ValidationError('name too short');

  if (!validateEmail(cleaned.email)) throw new ValidationError('invalid email');

  if (!validatePhoneNumber(cleaned.phone))
    throw new ValidationError('invalid phone');

  if (requirePassword) {
    validatePassword(cleaned.password);
  }

  cleaned.phone = normalizedPhoneNumber(cleaned.phone);

  // convert yoe from string to NO:
  if (cleaned.yearsOfExperience) {
    cleaned.yearsOfExperience = parseInt(cleaned.yearsOfExperience, 10);
    if (isNaN(cleaned.yearsOfExperience) || cleaned.yearsOfExperience < 0) {
      throw new ValidationError('invalid yearsOfExperience');
    }
  }

  return cleaned;
};

export const validateLogin = (rawBody) => {
  const body = {};
  for (const k of allowedLoginFields) {
    if (rawBody[k] !== undefined) body[k] = rawBody[k];
  }

  const cleaned = sanitizeInput(body);
  const { phone, password } = cleaned;

  if (!phone) throw new ValidationError('phone number is required to login');
  if (!password) throw new ValidationError('password must be filled');

  cleaned.phone = normalizedPhoneNumber(phone);

  return cleaned;
};

export const validateJob = (rawBody) => {
  const body = {};
  for (const j of jobFields) {
    if (rawBody[j] !== undefined) body[j] = rawBody[j];
  }

  const cleaned = sanitizeInput(body);

  if (!cleaned.title) throw new ValidationError('job title is required');
  if (cleaned.title.length < 5 || cleaned.title.length > 100)
    throw new ValidationError('job title must be between 5 and 100 characters');
  if (!cleaned.description)
    throw new ValidationError('job description is required');
  if (!cleaned.phone) throw new ValidationError('phone number is required');
  if (!cleaned.category) throw new ValidationError('job category is required');
  if (!jobCategories.includes(cleaned.category))
    throw new ValidationError('invalid job category');
  if (!cleaned.location) throw new ValidationError('job location is required');
  if (!cleaned.budget) throw new ValidationError('budget is required');
  if (isNaN(cleaned.budget) || Number(cleaned.budget) <= 0) {
    throw new ValidationError('budget must be a valid positive number');
  }
  if (!cleaned.urgency) throw new ValidationError('urgency is required');
  if (!allowedUrgency.includes(cleaned.urgency)) {
    throw new ValidationError('invalid urgency level');
  }
  cleaned.phone = normalizedPhoneNumber(cleaned.phone);
  return cleaned;
};
