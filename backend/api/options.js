const ALLOW_ORIGIN = 'https://gestpr-app.vercel.app';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': ALLOW_ORIGIN,
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, X-Requested-With, Accept, Origin',
  'Access-Control-Max-Age': '86400',
  Vary: 'Origin',
};

function resolveOrigin(requestOrigin) {
  if (requestOrigin && /gestpr-app/i.test(requestOrigin)) return requestOrigin;
  return ALLOW_ORIGIN;
}

module.exports = (req, res) => {
  res.writeHead(204, {
    ...CORS_HEADERS,
    'Access-Control-Allow-Origin': resolveOrigin(req.headers.origin),
  });
  res.end();
};

module.exports.CORS_HEADERS = CORS_HEADERS;
module.exports.resolveOrigin = resolveOrigin;
