const createCRUDController = require('../../middlewaresControllers/createCRUDController');
const convert = require('./convert');
const summary = require('./summary');

const methods = createCRUDController('Quote');

methods.summary = summary;
methods.convert = convert;

methods.mail = async (req, res) =>
  res.status(200).json({
    success: true,
    result: null,
    message: 'Envio de e-mail do PDF: use a exportação PDF a partir do ecrã do orçamento.',
  });

module.exports = methods;
