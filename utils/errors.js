import {
  sendBadRequest,
  sendNotFound,
  sendServerError,
  sendUnauthorized,
} from './sendResponse.js';

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = ' UnauthorizedError';
  }
}

export const handleError = (res, err) => {
  console.error(err.stack || err);

  switch (err.name) {
    case 'ValidationError':
      return sendBadRequest(res, { message: err.message });
    case 'NotFoundError':
      return sendNotFound(res, { message: err.message });
    case ' UnauthorizedError':
      return sendUnauthorized(res, { message: err.message });
    default:
      return sendServerError(res, { message: 'Internal Server Error' });
  }
};
