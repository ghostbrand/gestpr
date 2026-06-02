module.exports = (req, res) => {
  res.status(200).json({
    ok: true,
    service: 'gestpr-api',
    hasDatabase: Boolean(process.env.DATABASE),
    hasJwtSecret: Boolean(process.env.JWT_SECRET),
    nodeEnv: process.env.NODE_ENV || 'not set',
  });
};
