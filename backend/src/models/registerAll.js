const mongoose = require('mongoose');
const path = require('path');

require('mongoose-autopopulate');

const MODEL_FILES = [
  'models/coreModels/Admin.js',
  'models/coreModels/AdminPassword.js',
  'models/coreModels/Setting.js',
  'models/coreModels/Upload.js',
  'models/appModels/Client.js',
  'models/appModels/Invoice.js',
  'models/appModels/Payment.js',
  'models/appModels/PaymentMode.js',
  'models/appModels/Quote.js',
  'models/appModels/ServiceItem.js',
  'models/appModels/Taxes.js',
];

let registered = false;

function registerAllModels() {
  if (registered) return;

  const srcDir = path.join(__dirname, '..');

  for (const file of MODEL_FILES) {
    require(path.join(srcDir, file));
  }

  registered = true;
}

registerAllModels();

module.exports = { registerAllModels, MODEL_FILES };
