const allowedOrigin = process.env.FRONTEND_URL;

export const handleCORS = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, GET, PUT, DELETE, OPTIONS, HEAD',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

export const handlePreflight = (req, res) => {
  if (req.method === 'OPTIONS') {
    handleCORS(req, res);
    res.end();
    return true;
  }
  return false;
};

export const handleRouteNotFound = (req, res) => {
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Route not found' }));
};

export const handleMethodNotAllowed = (req, res) => {
  res.writeHead(405, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'method not allowed' }));
};
