require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const { connectDatabase } = require('../src/db');
const { loadModels } = require('../src/loadModels');

let app;

module.exports = async (req, res) => {
  if (!app) {
    await connectDatabase();
    loadModels();
    app = require('../src/app');
  }
  return app(req, res);
};
