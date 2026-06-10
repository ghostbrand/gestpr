require('dotenv').config();

const serverless = require('serverless-http');

let handler;
let initPromise;

function fixRequestUrl(req) {
  const segments = req.query?.path;

  if (segments) {
    const joined = Array.isArray(segments) ? segments.join('/') : segments;
    const qs = req.url?.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';

    if (
      joined.startsWith('download/') ||
      joined === 'download' ||
      joined.startsWith('public/') ||
      joined === 'public'
    ) {
      req.url = `/${joined}${qs}`;
    } else {
      req.url = `/api/${joined}${qs}`;
    }
    return;
  }

  const original =
    req.headers['x-invoke-path'] ||
    req.headers['x-vercel-original-url'] ||
    req.headers['x-forwarded-uri'];

  if (!original || typeof original !== 'string') return;

  if (original.startsWith('http')) {
    try {
      const url = new URL(original);
      req.url = url.pathname + url.search;
    } catch {
      /* ignore */
    }
    return;
  }

  req.url = original.startsWith('/') ? original : `/${original}`;
}

function handleOptions(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  return res.status(204).end();
}

async function getHandler() {
  if (handler) return handler;

  if (!initPromise) {
    initPromise = (async () => {
      const { connectDatabase } = require('../src/db');
      await connectDatabase();
      const app = require('../src/app');
      handler = serverless(app, { binary: ['*/*'] });
    })().catch((error) => {
      initPromise = null;
      throw error;
    });
  }

  await initPromise;
  return handler;
}

async function handleRequest(req, res) {
  fixRequestUrl(req);

  if (req.method === 'OPTIONS') {
    return handleOptions(req, res);
  }

  try {
    const expressHandler = await getHandler();
    return expressHandler(req, res);
  } catch (error) {
    console.error('API error:', error.message);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: error.message,
        hint: error.message.includes('DATABASE')
          ? 'Add DATABASE in Vercel Environment Variables'
          : 'Check /api/health for MongoDB status',
      });
    }
  }
}

module.exports = { handleRequest, getHandler, fixRequestUrl };
