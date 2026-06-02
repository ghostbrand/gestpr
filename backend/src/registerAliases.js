const path = require('path');
const moduleAlias = require('module-alias');

// Absolute path so `@/` works on Vercel serverless (cwd differs from local)
moduleAlias.addAlias('@', path.resolve(__dirname));
