require('./registerAliases');

const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');
const compression = require('compression');

const cookieParser = require('cookie-parser');

const coreAuthRouter = require('./routes/coreRoutes/coreAuth');
const coreApiRouter = require('./routes/coreRoutes/coreApi');
const coreDownloadRouter = require('./routes/coreRoutes/coreDownloadRouter');
const corePublicRouter = require('./routes/coreRoutes/corePublicRouter');
const adminAuth = require('./controllers/coreControllers/adminAuth');

const errorHandlers = require('./handlers/errorHandlers');
const erpApiRouter = require('./routes/appRoutes/appApi');

const fileUpload = require('express-fileupload');
// create our Express app
const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(compression());

// // default options
// app.use(fileUpload());

// Here our API Routes

app.get('/', (req, res) => {
  const payload = {
    ok: true,
    service: 'gestpr-api',
    message: 'Isto é só o API. Os utilizadores devem abrir o site do frontend (projeto Vercel separado).',
    health: '/api/health',
    ping: '/api/ping',
    login: '/api/login',
  };

  if (req.accepts('html')) {
    return res.status(200).type('html').send(`<!DOCTYPE html>
<html lang="pt"><head><meta charset="utf-8"/><title>gestpr API</title></head>
<body style="font-family:system-ui;max-width:40rem;margin:3rem auto;padding:0 1rem">
<h1>gestpr — API</h1>
<p>Este URL é o <strong>backend</strong>, não a aplicação web.</p>
<p>Abre o projeto Vercel do <strong>frontend</strong> (pasta <code>frontend</code>) para ver o ERP.</p>
<p>Testes: <a href="/api/ping">/api/ping</a> · <a href="/api/health">/api/health</a></p>
</body></html>`);
  }

  res.json(payload);
});

app.get('/api/health', (req, res) => {
  const dbReady = mongoose.connection.readyState === 1;
  res.status(dbReady ? 200 : 503).json({
    ok: dbReady,
    db: dbReady ? 'connected' : 'disconnected',
  });
});

app.use('/api', coreAuthRouter);
app.use('/api', adminAuth.isValidAuthToken, coreApiRouter);
app.use('/api', adminAuth.isValidAuthToken, erpApiRouter);
app.use('/download', coreDownloadRouter);
app.use('/public', corePublicRouter);

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// production error handler
app.use(errorHandlers.productionErrors);

// done! we export it so we can start the site in start.js
module.exports = app;
