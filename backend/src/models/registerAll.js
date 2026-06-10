const mongoose = require('mongoose');

require('mongoose-autopopulate');

// Requires estáticos — path dinâmico não entra no bundle da Vercel
require('./coreModels/Admin');
require('./coreModels/AdminPassword');
require('./coreModels/Setting');
require('./coreModels/Upload');
require('./appModels/Client');
require('./appModels/Invoice');
require('./appModels/Payment');
require('./appModels/PaymentMode');
require('./appModels/Quote');
require('./appModels/ServiceItem');
require('./appModels/Taxes');

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
  registered = true;
}

registerAllModels();

module.exports = { registerAllModels, MODEL_FILES };
