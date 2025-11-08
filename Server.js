import http from 'http';
import dotenv from 'dotenv';
import { handleCORS, handlePreflight } from './Config/Cors.js';
import { authRoutes } from './routes/authRoutes.js';
dotenv.config();
const PORT = process.env.PORT || 5000;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1';

const server = http.createServer(async (req, res) => {
  if (handlePreflight(req, res)) return;
  handleCORS(req, res);

  const match = authRoutes.find(
    (r) => r.route === req.url && r.method === req.method,
  );

  if (match) return await match.handler(req, res);
});

server.listen(PORT, HOST, () =>
  console.log(`Server running on http://${HOST}:${PORT}`),
);
