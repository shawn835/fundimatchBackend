import http from 'http';
import dotenv from 'dotenv';
import { handleCORS, handlePreflight } from './Config/Cors.js';
import { routes } from './routes/authRoutes.js';
import { requireAuth } from './middleWare/authMiddleware.js';
import { sendNotFound } from './utils/sendResponse.js';
dotenv.config();
const PORT = process.env.PORT || 5000;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1';

const server = http.createServer(async (req, res) => {
  if (handlePreflight(req, res)) return;
  handleCORS(req, res);

  let match = routes.find(
    (r) => r.method === req.method && r.route === req.url,
  );

  // if no exact match, try dynamic match
  // ***WHEN PAGINATING IS ADDED, THIS SECTION WILL NEED TO BE UPDATED TO HANDLE QUERY STRINGS PROPERLY***
  if (!match) {
    for (const r of routes) {
      if (r.method !== req.method) continue;

      const routeParts = r.route.split('/');
      const urlParts = req.url.split('/');

      if (
        routeParts.length === urlParts.length &&
        routeParts.every(
          (part, i) => part.startsWith(':') || part === urlParts[i],
        )
      ) {
        match = { ...r, params: {} };
        routeParts.forEach((part, i) => {
          if (part.startsWith(':')) {
            match.params[part.slice(1)] = urlParts[i];
          }
        });
        break;
      }
    }
  }

  if (!match) {
    return sendNotFound(res, { message: 'route not found' });
  }

  // attach params
  req.params = match.params || {};

  if (match.protected) {
    return requireAuth(req, res, () => match.handler(req, res));
  }

  return match.handler(req, res);
});

server.listen(PORT, HOST, () =>
  console.log(`Server running on http://${HOST}:${PORT}`),
);
