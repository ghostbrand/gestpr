const { globSync } = require('glob');
const path = require('path');

function loadModels() {
  const modelsFiles = globSync('./src/models/**/*.js');

  for (const filePath of modelsFiles) {
    require(path.resolve(filePath));
  }
}

module.exports = { loadModels };
