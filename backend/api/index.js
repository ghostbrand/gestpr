require('dotenv').config();
require('dotenv').config({ path: '.env.local' });

const serverless = require('serverless-http');
const { CORS_HEADERS } = require('./options');

let handler;
let initError;

async function getHandler() {
  if (initError) throw initError;
  if (!handler) {
    try {
      const { connectDatabase } = require('../src/db');
      await connectDatabase();
      const app = require('../src/app');
      handler = serverless(app);
    } catch (error) {
      initError = error;
      throw error;
    }
  }
  return handler;
}

function applyCors(req, res) {
  const origin = req.headers.origin;
  const allow =
    origin && /gestpr-app/i.test(origin) ? origin : CORS_HEADERS['Access-Control-Allow-Origin'];

  res.setHeader('Access-Control-Allow-Origin', allow);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', CORS_HEADERS['Access-Control-Allow-Methods']);
  res.setHeader('Access-Control-Allow-Headers', CORS_HEADERS['Access-Control-Allow-Headers']);
  res.setHeader('Access-Control-Max-Age', CORS_HEADERS['Access-Control-Max-Age']);
  res.setHeader('Vary', 'Origin');
}

module.exports = async (req, res) => {
  applyCors(req, res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      ...CORS_HEADERS,
      'Access-Control-Allow-Origin':
        req.headers.origin && /gestpr-app/i.test(req.headers.origin)
          ? req.headers.origin
          : CORS_HEADERS['Access-Control-Allow-Origin'],
    });
    return res.end();
  }

  try {
    const fn = await getHandler();
    return await fn(req, res);
  } catch (error) {
    console.error('Serverless handler error:', error);
    if (!res.headersSent) {
      applyCors(req, res);
      res.status(500).json({
        success: false,
        message: error.message,
        hint:
          error.message.includes('DATABASE') || error.message.includes('Mongo')
            ? 'Defina DATABASE nas Environment Variables do projeto gestpr-backend na Vercel.'
            : undefined,
      });
    }
  }
};
