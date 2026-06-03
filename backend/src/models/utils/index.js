// Lista fixa — glob com cwd relativo falha na Vercel e causa "Model Setting does not exist"
const modelsFiles = [
  'Admin',
  'AdminPassword',
  'Setting',
  'Upload',
  'Client',
  'Invoice',
  'Payment',
  'PaymentMode',
  'Quote',
  'ServiceItem',
  'Taxes',
];

const routesList = [
  { entity: 'client', modelName: 'Client', controllerName: 'clientController' },
  { entity: 'invoice', modelName: 'Invoice', controllerName: 'invoiceController' },
  { entity: 'payment', modelName: 'Payment', controllerName: 'paymentController' },
  { entity: 'paymentmode', modelName: 'PaymentMode', controllerName: 'paymentModeController' },
  { entity: 'quote', modelName: 'Quote', controllerName: 'quoteController' },
  { entity: 'serviceitem', modelName: 'ServiceItem', controllerName: 'serviceItemController' },
  { entity: 'taxes', modelName: 'Taxes', controllerName: 'taxesController' },
];

const appModelsList = routesList.map((r) => r.modelName);
const entityList = routesList.map((r) => r.entity);
const constrollersList = routesList.map((r) => r.controllerName);

module.exports = { constrollersList, appModelsList, modelsFiles, entityList, routesList };
