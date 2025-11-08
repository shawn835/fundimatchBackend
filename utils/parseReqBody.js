import { ValidationError } from './errors.js';

export const parseJsonBody = (req, maxBytes = 1_000_000) => {
  return new Promise((resolve, reject) => {
    const contentType = (req.headers['content-type'] || '').toLowerCase();
    if (!contentType.includes('application/json')) {
      return reject(
        new ValidationError(`Expected application/json, got ${contentType}`),
      );
    }

    let chunks = [];
    let received = 0;
    req.on('data', (chunk) => {
      received += chunk.length;

      if (received > maxBytes) {
        req.destroy();
        return reject(new ValidationError('payload too large'));
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString();
        const body = raw ? JSON.parse(raw) : {};
        resolve(body);
      } catch (error) {
        reject(new ValidationError('invalid JSON format'));
      }
    });

    req.on('error', reject);
  });
};
