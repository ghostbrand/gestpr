const fs = require('fs');
const path = require('path');
const { slugify } = require('transliteration');
const fileFilter = require('../src/middlewares/uploadMiddleware/utils/LocalfileFilter');

const UPLOAD_TMP = path.join('/tmp', 'gestpr-uploads');
const UPLOAD_LOCAL = path.join(__dirname, '../src/public/uploads');

function uploadRoot() {
  return process.env.VERCEL ? UPLOAD_TMP : UPLOAD_LOCAL;
}

function saveUploadedFile({ buffer, originalname, mimetype, entity, fieldName, seotitle, fileType = 'image' }) {
  const filter = fileFilter(fileType);
  const fakeFile = { mimetype, originalname };
  let allowed = false;
  let filterError = null;
  filter(null, fakeFile, (err, ok) => {
    filterError = err;
    allowed = Boolean(ok);
  });
  if (filterError) throw filterError;
  if (!allowed) {
    throw new Error(`${mimetype} File type not supported!`);
  }

  const ext = path.extname(originalname);
  const uniqueId = Math.random().toString(36).slice(2, 7);
  const base = seotitle
    ? slugify(String(seotitle).toLowerCase())
    : slugify(path.parse(originalname).name.toLowerCase());
  const fileName = `${base}-${uniqueId}${ext}`;
  const dir = path.join(uploadRoot(), entity);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, fileName), buffer);
  const filePath = `public/uploads/${entity}/${fileName}`;
  return filePath;
}

function applyUploadToBody(req, filePath, fieldName) {
  if (!req.body || typeof req.body !== 'object') req.body = {};
  req.body[fieldName] = filePath;
}

module.exports = { saveUploadedFile, applyUploadToBody, uploadRoot };
