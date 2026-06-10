const fs = require('fs');
const path = require('path');

const PUBLIC_ROOT = path.join(__dirname, '../public');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function downloadTarget(folder, fileName) {
  const base = process.env.VERCEL
    ? path.join('/tmp', 'gestpr-download', folder)
    : path.join(PUBLIC_ROOT, 'download', folder);

  ensureDir(base);
  return path.join(base, fileName);
}

module.exports = { PUBLIC_ROOT, downloadTarget, ensureDir };
