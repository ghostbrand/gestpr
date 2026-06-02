require('dotenv').config();
require('dotenv').config({ path: '.env.local' });

const serverless = require('serverless-http');
const { connectDatabase } = require('../src/db');
const { loadModels } = require('../src/loadModels');

let handler;

async function getHandler() {
  if (!handler) {
    await connectDatabase();
    loadModels();
    const app = require('../src/app');
    handler = serverless(app);
  }
  return handler;
}

module.exports = async (req, res) => {
  try {
    const fn = await getHandler();
    return await fn(req, res);
  } catch (error) {
    console.error('Serverless handler error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: error.message,
        hint:
          error.message.includes('DATABASE') || error.message.includes('Mongo')
            ? 'Check DATABASE on Vercel and MongoDB Atlas Network Access (0.0.0.0/0).'
            : undefined,
      });
    }
  }
};
