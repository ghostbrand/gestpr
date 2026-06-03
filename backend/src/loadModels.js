// Carregamento explícito — glob falha no bundle Vercel e deixa modelos por registar
require('mongoose-autopopulate');

const path = require('path');

const MODEL_FILES = [
  'src/models/coreModels/Admin.js',
  'src/models/coreModels/AdminPassword.js',
  'src/models/coreModels/Setting.js',
  'src/models/coreModels/Upload.js',
  'src/models/appModels/Client.js',
  'src/models/appModels/Invoice.js',
  'src/models/appModels/Payment.js',
  'src/models/appModels/PaymentMode.js',
  'src/models/appModels/Quote.js',
  'src/models/appModels/ServiceItem.js',
  'src/models/appModels/Taxes.js',
];

function loadModels() {
  const rootDir = path.join(__dirname, '..');

  for (const file of MODEL_FILES) {
    require(path.join(rootDir, file));
  }
}

module.exports = { loadModels };
