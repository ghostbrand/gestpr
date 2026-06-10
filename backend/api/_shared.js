const mongoose = require('mongoose');

let dbPromise;

async function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

async function connectDb() {
  if (!process.env.DATABASE) {
    throw new Error('DATABASE is not set in Vercel Environment Variables');
  }

  if (mongoose.connection.readyState === 1) return;

  if (!dbPromise) {
    dbPromise = mongoose.connect(process.env.DATABASE, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
      maxPoolSize: 5,
    });
  }

  await dbPromise;
}

function registerAuthModels() {
  require('../src/models/coreModels/Admin');
  require('../src/models/coreModels/AdminPassword');
}

function registerAllModels() {
  require('../src/models/registerAll');
}

function handleOptions(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  return res.status(204).end();
}

module.exports = { readBody, connectDb, registerAuthModels, registerAllModels, handleOptions };
