const PDF_ENTITIES = new Set(['invoice', 'quote', 'payment', 'offer']);

function supportsPdf(entityOrModel) {
  return PDF_ENTITIES.has(String(entityOrModel).toLowerCase());
}

function modelNameFromDirectory(directory) {
  return directory.slice(0, 1).toUpperCase() + directory.slice(1);
}

module.exports = { PDF_ENTITIES, supportsPdf, modelNameFromDirectory };
