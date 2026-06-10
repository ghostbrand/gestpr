const { resolveAbsolutePath, serveFile } = require('./_files');

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(204).end();
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const raw = req.query?.path;
  const joined = Array.isArray(raw) ? raw.join('/') : raw || '';

  const absolutePath = resolveAbsolutePath(joined);
  if (!absolutePath) {
    return res.status(400).json({ success: false, message: 'Invalid path' });
  }

  return serveFile(absolutePath, res);
};
