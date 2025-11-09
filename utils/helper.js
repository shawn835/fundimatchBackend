import { ValidationError } from './errors.js';

export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    // basic backend sanitization
    let value = input.trim();

    // remove script tags
    value = value.replace(/<script.*?>.*?<\/script>/gi, '');

    return value;
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }

  if (typeof input === 'object' && input !== null) {
    const sanitized = {};

    for (const key in input) {
      const value = input[key];

      // Don't sanitize password except trim
      if (key === 'password' || key === 'confirmPassword') {
        sanitized[key] = typeof value === 'string' ? value.trim() : value;
        continue;
      }

      // Normal fields
      if (typeof value === 'string') {
        sanitized[key] = sanitizeInput(value);
      } else if (typeof value === 'object') {
        sanitized[key] = sanitizeInput(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  return input;
};

export const validateEmail = (email) => {
  if (typeof email !== 'string') return false;

  const cleanedEmail = email.trim().toLowerCase();

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(cleanedEmail);
};

export const validatePhoneNumber = (phone) => {
  if (typeof phone !== 'string') return false;

  // Remove all whitespace
  const cleanedPhone = phone.replace(/\s+/g, '');

  //+2547x, +2541x, 07x, or 01x
  const regex = /^(?:\+254|0)(1\d{8}|7\d{8})$/;

  if (!regex.test(cleanedPhone)) return false;

  //correct length
  if (
    (cleanedPhone.startsWith('+254') && cleanedPhone.length !== 13) ||
    (!cleanedPhone.startsWith('+254') && cleanedPhone.length !== 10)
  ) {
    return false;
  }

  return true;
};

export const normalizedPhoneNumber = (phone) => {
  if (!phone) return '';

  const cleaned = phone.replace(/\s+/g, '');

  if (cleaned.startsWith('+254')) {
    return cleaned;
  } else if (cleaned.startsWith('0')) {
    return '+254' + cleaned.slice(1);
  } else {
    return '+254' + cleaned;
  }
};

export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    throw new ValidationError('password must be at least six characters');
  }

  if (!/[a-z]/.test(password)) {
    throw new ValidationError(
      'password must contain at least one lowercase letter',
    );
  }

  if (!/[A-Z]/.test(password)) {
    throw new ValidationError(
      'password must contain at least one uppercase letter',
    );
  }

  if (!/[0-9]/.test(password)) {
    throw new ValidationError('password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>_\-=+~`]/.test(password)) {
    throw new ValidationError(
      'password must contain at least one special character',
    );
  }

  return true;
};

export const generateEmailCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
