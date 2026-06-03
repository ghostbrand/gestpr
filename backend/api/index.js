require('dotenv').config();

const serverless = require('serverless-http');

let handler;
let initError;
let initPromise;

function init() {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    require('mongoose-autopopulate');
    require('../src/models/registerAll');

    const { connectDatabase } = require('../src/db');
    await connectDatabase();

    const app = require('../src/app');
    handler = serverless(app);
  })().catch((error) => {
    initError = error;
    initPromise = null;
    throw error;
  });

  return initPromise;
}

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }

  try {
    await init();
    return handler(req, res);
  } catch (error) {
    console.error('API error:', error.message);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: error.message,
        hint: error.message.includes('DATABASE')
          ? 'Add DATABASE in Vercel Environment Variables'
          : 'Check /api/health for MongoDB status',
      });
    }
  }
};
