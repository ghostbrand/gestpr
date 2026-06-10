const multer = require('multer');
const { saveUploadedFile, applyUploadToBody } = require('./_upload');

const memoryUpload = multer({ storage: multer.memoryStorage() });

function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    memoryUpload.any()(req, {}, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function getUploadedFile(req) {
  if (req.file) return req.file;
  if (Array.isArray(req.files) && req.files.length) {
    return req.files.find((f) => f.fieldname === 'file') || req.files[0];
  }
  return null;
}

async function handleMultipartUpload(req, options) {
  const contentType = req.headers['content-type'] || '';
  if (!contentType.includes('multipart/form-data')) return;

  await parseMultipart(req);

  const file = getUploadedFile(req);
  if (!file) return;

  const filePath = saveUploadedFile({
    buffer: file.buffer,
    originalname: file.originalname,
    mimetype: file.mimetype,
    entity: options.entity,
    fieldName: options.fieldName,
    seotitle: req.body?.seotitle,
    fileType: options.fileType || 'image',
  });

  applyUploadToBody(req, filePath, options.fieldName);
}

module.exports = { parseMultipart, handleMultipartUpload };
