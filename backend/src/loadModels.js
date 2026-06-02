// Dependências usadas via require() dinâmico nos models — força o bundle da Vercel a incluí-las
require('mongoose-autopopulate');

const { globSync } = require('glob');
const path = require('path');

function loadModels() {
  const rootDir = path.join(__dirname, '..');
  const modelsFiles = globSync('src/models/**/*.js', { cwd: rootDir });

  if (modelsFiles.length === 0) {
    throw new Error(`No models found under ${path.join(rootDir, 'src/models')}`);
  }

  for (const filePath of modelsFiles) {
    require(path.join(rootDir, filePath));
  }
}

module.exports = { loadModels };
