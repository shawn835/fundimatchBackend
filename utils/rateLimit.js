// rateLimit.js
const passwordAttempts = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

// Check if user is rate-limited
export const rateLimitPasswordUpdate = (userId) => {
  const now = Date.now();
  const attempt = passwordAttempts.get(userId) || {
    count: 0,
    firstAttempt: now,
  };

  // Reset window
  if (now - attempt.firstAttempt > WINDOW_MS) {
    passwordAttempts.set(userId, { count: 1, firstAttempt: now });
    return false;
  }

  // Blocked
  if (attempt.count >= MAX_ATTEMPTS) {
    return true;
  }

  // Increment
  attempt.count += 1;
  passwordAttempts.set(userId, attempt);
  return false;
};

export const resetPasswordRateLimit = (userId) => {
  passwordAttempts.delete(userId);
};
