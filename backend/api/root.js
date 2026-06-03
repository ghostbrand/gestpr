module.exports = (req, res) => {
  res.status(200).json({
    ok: true,
    service: 'gestpr-api',
    message: 'API online. Frontend: https://gestpr-app.vercel.app',
    endpoints: {
      ping: '/api/ping',
      health: '/api/health',
      login: '/api/login',
    },
  });
};
