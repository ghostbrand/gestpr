const BACKEND = process.env.BACKEND_URL || 'https://gestpr-backend.vercel.app';

async function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  try {
    const pathParam = req.query.path;
    const segments = Array.isArray(pathParam) ? pathParam.join('/') : pathParam || '';
    const qs = req.url?.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    const target = `${BACKEND}/api/${segments}${qs}`;

    const headers = { ...req.headers };
    delete headers.host;
    delete headers.connection;
    delete headers['content-length'];

    const options = { method: req.method, headers };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      options.body = await readBody(req);
    }

    const response = await fetch(target, options);
    const text = await response.text();

    if (text.includes('DEPLOYMENT_NOT_FOUND')) {
      return res.status(503).json({
        success: false,
        message: 'Backend offline. Redeploy o projeto gestpr-backend na Vercel.',
        backend: BACKEND,
      });
    }

    response.headers.forEach((value, key) => {
      if (!['transfer-encoding', 'connection'].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    res.status(response.status).send(text);
  } catch (error) {
    console.error('API proxy error:', error);
    res.status(502).json({
      success: false,
      message: error.message,
      backend: BACKEND,
    });
  }
};
