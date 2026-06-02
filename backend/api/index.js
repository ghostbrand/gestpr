require('dotenv').config();

// Garante deps no bundle serverless antes de carregar models
require('mongoose-autopopulate');

const serverless = require('serverless-http');

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

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }

  try {
    const fn = await getHandler();
    return await fn(req, res);
  } catch (error) {
    console.error('API error:', error.message);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
};
