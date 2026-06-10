const { connectDb, registerAllModels, readBody } = require('./_shared');

const EXPRESS_ONLY = [
  /^\/download\//,
  /^\/public\//,
  /\/upload$/,
  /\/email\/test$/,
  /\/profile\/update$/,
  /\/report\/movements\/pdf$/,
];

const PUBLIC_POST = new Set(['/api/forgetpassword', '/api/resetpassword']);

let ready;

async function ensureReady() {
  if (!ready) {
    ready = (async () => {
      await connectDb();
      registerAllModels();
    })();
  }
  await ready;
}

async function requireAuth(req, res) {
  const isValidAuthToken = require('../src/controllers/middlewaresControllers/createAuthMiddleware/isValidAuthToken');
  let authed = false;
  await isValidAuthToken(req, res, () => {
    authed = true;
  }, { userModel: 'Admin' });
  return authed;
}

function getAppController(entity) {
  const { routesList } = require('../src/models/utils');
  const route = routesList.find((r) => r.entity === entity);
  if (!route) return null;

  const custom = ['clientController', 'invoiceController', 'paymentController', 'quoteController'];
  if (custom.includes(route.controllerName)) {
    return require(`../src/controllers/appControllers/${route.controllerName}`);
  }

  const createCRUDController = require('../src/controllers/middlewaresControllers/createCRUDController');
  return createCRUDController(route.modelName);
}

function buildParams(segments, action) {
  const params = {};

  if (['read', 'update', 'delete', 'convert'].includes(action) && segments[1]) {
    params.id = segments[1];
  }

  if (action === 'readBySettingKey' && segments[1]) {
    params.settingKey = segments[1];
  }

  if (action === 'updateBySettingKey' && segments[1]) {
    params.settingKey = segments[1];
  }

  if (action === 'password-update' && segments[1]) {
    params.id = segments[1];
  }

  return params;
}

function resolveHandler(pathname) {
  const path = pathname.split('?')[0];

  if (path.startsWith('/download/') || path.startsWith('/public/')) {
    return { expressOnly: true };
  }

  if (!path.startsWith('/api/')) {
    return null;
  }

  const segments = path.slice(5).split('/').filter(Boolean);
  if (!segments.length) return null;

  const [root, ...rest] = segments;

  if (root === 'setting') {
    const controller = require('../src/controllers/coreControllers/settingController');
    const action = rest[0];
    if (!controller[action]) return null;
    return { handler: controller[action], params: buildParams(rest, action) };
  }

  if (root === 'admin') {
    if (rest[0] === 'directory') {
      const controller = require('../src/controllers/coreControllers/adminDirectoryController');
      const action = rest[1];
      if (!controller[action]) return null;
      return { handler: controller[action], params: buildParams(rest.slice(1), action) };
    }

    const controller = require('../src/controllers/coreControllers/adminController');
    if (rest[0] === 'profile' && rest[1] === 'password') {
      return { handler: controller.updateProfilePassword, params: {} };
    }
    if (rest[0] === 'profile' && rest[1] === 'update') {
      return { expressOnly: true };
    }
    if (rest[0] === 'password-update') {
      return { handler: controller.updatePassword, params: { id: rest[1] } };
    }

    const action = rest[0];
    if (!controller[action]) return null;
    return { handler: controller[action], params: buildParams(rest, action) };
  }

  if (root === 'report') {
    const sub = rest.join('/');
    if (sub === 'movements/pdf') return { expressOnly: true };
    if (sub === 'movements') {
      const controller = require('../src/controllers/reportsController/movementsReport');
      return { handler: controller.list, params: {} };
    }
    return null;
  }

  if (root === 'email') {
    return { expressOnly: true };
  }

  const controller = getAppController(root);
  if (!controller) return null;

  const action = rest[0];
  if (!controller[action]) return null;

  if (action === 'mail' || action === 'convert') {
    return { handler: controller[action], params: buildParams(rest, action) };
  }

  return { handler: controller[action], params: buildParams(rest, action) };
}

async function prepareRequest(req) {
  const url = new URL(req.url, 'http://localhost');
  req.query = Object.fromEntries(url.searchParams.entries());

  if (!req.body || typeof req.body !== 'object') {
    req.body = {};
  }

  if (['POST', 'PUT', 'PATCH'].includes(req.method) && !Object.keys(req.body).length) {
    try {
      req.body = await readBody(req);
    } catch {
      req.body = {};
    }
  }
}

async function runHandler(handler, req, res) {
  try {
    await Promise.resolve(handler(req, res));
  } catch (error) {
    console.error('dispatch error:', error.message);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

async function tryDispatch(req, res) {
  const pathname = req.url.split('?')[0];

  if (EXPRESS_ONLY.some((pattern) => pattern.test(pathname))) {
    return false;
  }

  await ensureReady();

  if (req.method === 'POST' && PUBLIC_POST.has(pathname)) {
    await prepareRequest(req);
    const adminAuth = require('../src/controllers/coreControllers/adminAuth');
    const action = pathname === '/api/forgetpassword' ? 'forgetPassword' : 'resetPassword';
    await runHandler(adminAuth[action], req, res);
    return true;
  }

  if (req.method === 'POST' && pathname === '/api/logout') {
    await prepareRequest(req);
    const authed = await requireAuth(req, res);
    if (!authed) return true;
    const adminAuth = require('../src/controllers/coreControllers/adminAuth');
    await runHandler(adminAuth.logout, req, res);
    return true;
  }

  const resolved = resolveHandler(pathname);
  if (!resolved) return false;
  if (resolved.expressOnly) return false;

  const authed = await requireAuth(req, res);
  if (!authed) return true;

  await prepareRequest(req);
  req.params = { ...req.params, ...resolved.params };
  await runHandler(resolved.handler, req, res);
  return true;
}

module.exports = { tryDispatch };
