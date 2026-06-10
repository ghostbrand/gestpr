const createCRUDController = require('../middlewaresControllers/createCRUDController');
const { routesList } = require('../../models/utils');

// Lista fixa — glob com cwd relativo falha ou bloqueia na Vercel serverless
const controllerDirectories = [
  'clientController',
  'invoiceController',
  'paymentController',
  'quoteController',
];

const appControllers = () => {
  const controllers = {};
  const hasCustomControllers = [];

  controllerDirectories.forEach((controllerName) => {
    try {
      const customController = require('./' + controllerName);

      if (customController) {
        hasCustomControllers.push(controllerName);
        controllers[controllerName] = customController;
      }
    } catch (err) {
      throw new Error(err.message);
    }
  });

  routesList.forEach(({ modelName, controllerName }) => {
    if (!hasCustomControllers.includes(controllerName)) {
      controllers[controllerName] = createCRUDController(modelName);
    }
  });

  return controllers;
};

module.exports = appControllers();
