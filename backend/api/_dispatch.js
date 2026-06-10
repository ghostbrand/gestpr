const { connectDb, registerAllModels, readBody } = require('./_shared');
const { handleMultipartUpload } = require('./_multipart');

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

function requireDirectoryAccess(req, res) {
  const role = req.admin?.role;
  if (role === 'owner' || role === 'manager') return true;
  res.status(403).json({
    success: false,
    result: null,
    message: 'Sem permissão para esta operação.',
  });
  return false;
}

const APP_CONTROLLERS = {
  client: require('../src/controllers/appControllers/clientController'),
  invoice: require('../src/controllers/appControllers/invoiceController'),
  payment: require('../src/controllers/appControllers/paymentController'),
  quote: require('../src/controllers/appControllers/quoteController'),
  paymentmode: () =>
    require('../src/controllers/middlewaresControllers/createCRUDController')('PaymentMode'),
  serviceitem: () =>
    require('../src/controllers/middlewaresControllers/createCRUDController')('ServiceItem'),
  taxes: () => require('../src/controllers/middlewaresControllers/createCRUDController')('Taxes'),
};

function getAppController(entity) {
  const controller = APP_CONTROLLERS[entity];
  if (!controller) return null;
  return typeof controller === 'function' ? controller() : controller;
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

  if (!path.startsWith('/api/')) {
    return null;
  }

  const segments = path.slice(5).split('/').filter(Boolean);
  if (!segments.length) return null;

  const [root, ...rest] = segments;

  if (root === 'setting') {
    const controller = require('../src/controllers/coreControllers/settingController');

    if (rest[0] === 'upload') {
      return {
        handler: controller.updateBySettingKey,
        params: { settingKey: rest[1] },
        multipart: { entity: 'setting', fieldName: 'settingValue', fileType: 'image' },
        requireDirectoryAccess: true,
      };
    }

    const action = rest[0];
    if (!controller[action]) return null;

    const protectedActions = new Set(['create', 'update', 'updateBySettingKey', 'updateManySetting']);
    return {
      handler: controller[action],
      params: buildParams(rest, action),
      requireDirectoryAccess: protectedActions.has(action),
    };
  }

  if (root === 'admin') {
    if (rest[0] === 'directory') {
      const controller = require('../src/controllers/coreControllers/adminDirectoryController');
      const action = rest[1];
      if (!controller[action]) return null;
      return {
        handler: controller[action],
        params: buildParams(rest.slice(1), action),
        requireDirectoryAccess: true,
      };
    }

    const controller = require('../src/controllers/coreControllers/adminController');
    if (rest[0] === 'profile' && rest[1] === 'password') {
      return { handler: controller.updateProfilePassword, params: {} };
    }
    if (rest[0] === 'profile' && rest[1] === 'update') {
      return {
        handler: controller.updateProfile,
        params: {},
        multipart: { entity: 'admin', fieldName: 'photo', fileType: 'image' },
      };
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
    if (sub === 'movements/pdf') {
      const controller = require('../src/controllers/reportsController/movementsReport');
      return { handler: controller.pdf, params: {} };
    }
    if (sub === 'movements') {
      const controller = require('../src/controllers/reportsController/movementsReport');
      return { handler: controller.list, params: {} };
    }
    return null;
  }

  if (root === 'email' && rest[0] === 'test') {
    const controller = require('../src/controllers/coreControllers/emailController');
    return { handler: controller.test, params: {}, requireDirectoryAccess: true };
  }

  const controller = getAppController(root);
  if (!controller) return null;

  const action = rest[0];
  if (!controller[action]) return null;

  return { handler: controller[action], params: buildParams(rest, action) };
}

async function prepareRequest(req) {
  const url = new URL(req.url, 'http://localhost');
  req.query = Object.fromEntries(url.searchParams.entries());

  if (!req.body || typeof req.body !== 'object') {
    req.body = {};
  }

  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    return;
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

  const authed = await requireAuth(req, res);
  if (!authed) return true;

  if (resolved.requireDirectoryAccess && !requireDirectoryAccess(req, res)) {
    return true;
  }

  if (resolved.multipart) {
    try {
      await handleMultipartUpload(req, resolved.multipart);
    } catch (error) {
      if (!res.headersSent) {
        res.status(400).json({ success: false, message: error.message });
      }
      return true;
    }
  }

  await prepareRequest(req);
  req.params = { ...req.params, ...resolved.params };
  await runHandler(resolved.handler, req, res);
  return true;
}

module.exports = { tryDispatch };
