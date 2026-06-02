require('module-alias/register');

// Make sure we are running node 20+
const [major] = process.versions.node.split('.').map(parseFloat);
if (major < 20) {
  console.log('Please upgrade your node.js version at least 20 or greater. 👌\n ');
  process.exit();
}

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const { connectDatabase } = require('./db');
const { loadModels } = require('./loadModels');

async function start() {
  try {
    await connectDatabase();
    loadModels();

    const app = require('./app');
    const port = Number(process.env.PORT) || 8888;
    app.set('port', port);

    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`Express running → On PORT : ${server.address().port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

start();
