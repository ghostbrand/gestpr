const { registerAllModels } = require('./models/registerAll');

function loadModels() {
  registerAllModels();
}

module.exports = { loadModels };
