require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { connectDb, registerAllModels } = require('./_shared');
const { resolveAbsolutePath, serveFile, ROOT } = require('./_files');

let ready;

async function ensureReady() {
  if (!ready) {
    ready = (async () => {
      await connectDb();
      registerAllModels();
    })();
  }
  await ready;
}

module.exports = async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const raw = req.query?.path;
  const joined = Array.isArray(raw) ? raw.join('/') : raw || '';

  if (!joined.startsWith('download/')) {
    return res.status(400).json({ success: false, message: 'Invalid download path' });
  }

  const absolutePath = resolveAbsolutePath(joined);

  if (absolutePath && fs.existsSync(absolutePath)) {
    return serveFile(absolutePath, res);
  }

  const parts = joined.split('/').filter(Boolean);
  if (parts.length < 3) {
    return res.status(404).json({ success: false, message: 'File not found' });
  }

  const directory = parts[1];
  const file = parts[2];
  const id = file.slice(directory.length + 1).slice(0, -4);

  if (!id) {
    return res.status(400).json({ success: false, message: 'Invalid file name' });
  }

  try {
    await ensureReady();
    const downloadPdf = require('../src/handlers/downloadHandler/downloadPdf');
    return downloadPdf(req, res, { directory, id });
  } catch (error) {
    console.error('download error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
