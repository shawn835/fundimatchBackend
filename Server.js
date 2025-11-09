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

  const match = routes.find(
    (r) => r.route === req.url && r.method === req.method,
  );

  if (!match) {
    return sendNotFound(res, { message: 'route not found' });
  }

  if (match.protected) {
    return requireAuth(req, res, () => match.handler(req, res));
  }

  //public route
  return match.handler(req, res);
});

server.listen(PORT, HOST, () =>
  console.log(`Server running on http://${HOST}:${PORT}`),
);
