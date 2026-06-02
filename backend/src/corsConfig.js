function getAllowedOrigin(origin) {
  if (!origin) return null;

  const allowed = [
    process.env.PUBLIC_APP_URL?.replace(/\/$/, ''),
    'https://gestpr-app.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
  ].filter(Boolean);

  if (allowed.includes(origin)) return origin;

  // Preview deployments Vercel: gestpr-app-xxx.vercel.app
  if (/^https:\/\/gestpr-app(-[a-z0-9-]+)?\.vercel\.app$/i.test(origin)) {
    return origin;
  }

  return null;
}

function applyCorsHeaders(req, res) {
  const origin = req.headers.origin;
  let allowed = getAllowedOrigin(origin);

  // Produção: garantir header mesmo se PUBLIC_APP_URL não estiver definido
  if (!allowed && origin && /gestpr-app/i.test(origin)) {
    allowed = origin;
  }
  if (!allowed && process.env.NODE_ENV === 'production') {
    allowed = 'https://gestpr-app.vercel.app';
  }

  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', allowed);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With, Accept, Origin'
  );
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Vary', 'Origin');
}

function createCorsMiddleware() {
  const cors = require('cors');

  return cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      const allowed = getAllowedOrigin(origin);
      if (allowed) return callback(null, allowed);
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  });
}

module.exports = { applyCorsHeaders, createCorsMiddleware, getAllowedOrigin };
