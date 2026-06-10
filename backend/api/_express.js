require('dotenv').config();

const serverless = require('serverless-http');

let handler;
let initPromise;

function fixRequestUrl(req) {
  const pathParam = req.query?.path;
  const extraQuery = req.url?.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  const qs = extraQuery.replace(/[?&]path=[^&]*/g, '').replace(/^&/, '?') || '';

  if (pathParam) {
    const joined = Array.isArray(pathParam) ? pathParam.join('/') : pathParam;

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

  // Rewrite /api/(.*) → /api strips the path; restore from Vercel headers
  const original =
    req.headers['x-invoke-path'] ||
    req.headers['x-vercel-original-url'] ||
    req.headers['x-forwarded-uri'] ||
    req.headers['x-matched-path'];

  if (original && typeof original === 'string') {
    if (original.startsWith('http')) {
      try {
        const url = new URL(original);
        req.url = url.pathname + url.search;
        return;
      } catch {
        /* ignore */
      }
    }

    req.url = original.startsWith('/') ? original : `/${original}`;
    return;
  }

  // Fallback when rewrite leaves only /api
  if (req.url === '/api' || req.url === '/api/') {
    const raw = req.headers['x-vercel-sc-headers'];
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.path) {
          req.url = parsed.path.startsWith('/') ? parsed.path : `/${parsed.path}`;
        }
      } catch {
        /* ignore */
      }
    }
  }
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
    const { tryDispatch } = require('./_dispatch');
    const dispatched = await tryDispatch(req, res);
    if (dispatched) return;

    if (process.env.VERCEL) {
      return res.status(404).json({
        success: false,
        message: `Route not available: ${req.method} ${req.url.split('?')[0]}`,
      });
    }

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
