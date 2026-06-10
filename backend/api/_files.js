const fs = require('fs');
const path = require('path');
const { isPathInside } = require('../src/utils/is-path-inside');

const ROOT = path.join(__dirname, '../src/public');

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
};

function resolveAbsolutePath(joined) {
  if (!joined || typeof joined !== 'string') return null;

  if (joined.startsWith('public/')) {
    return path.join(ROOT, joined.slice('public/'.length));
  }

  if (joined.startsWith('download/')) {
    return path.join(ROOT, joined);
  }

  return null;
}

function contentType(filePath) {
  return MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
}

function serveFile(absolutePath, res) {
  if (!isPathInside(absolutePath, ROOT)) {
    return res.status(400).json({ success: false, message: 'Invalid filepath' });
  }

  if (!fs.existsSync(absolutePath)) {
    return res.status(404).json({ success: false, message: 'File not found' });
  }

  const stat = fs.statSync(absolutePath);
  if (!stat.isFile()) {
    return res.status(404).json({ success: false, message: 'Not a file' });
  }

  res.setHeader('Content-Type', contentType(absolutePath));
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Cache-Control', 'public, max-age=3600');

  const stream = fs.createReadStream(absolutePath);
  stream.on('error', () => {
    if (!res.headersSent) res.status(500).end();
  });
  stream.pipe(res);
}

module.exports = { resolveAbsolutePath, serveFile, ROOT };
