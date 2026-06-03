const mongoose = require('mongoose');
const { registerAllModels } = require('./registerAll');

function getModel(name) {
  registerAllModels();

  if (!mongoose.models[name]) {
    throw new Error(`Model ${name} is not registered`);
  }

  return mongoose.model(name);
}

module.exports = { getModel, registerAllModels };
