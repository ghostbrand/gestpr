const mongoose = require('mongoose');

module.exports = async (req, res) => {
  const hasDatabase = Boolean(process.env.DATABASE);

  if (!hasDatabase) {
    return res.status(503).json({
      ok: false,
      db: 'missing',
      message: 'DATABASE not set in Vercel Environment Variables',
    });
  }

  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.DATABASE, {
        serverSelectionTimeoutMS: 8000,
        connectTimeoutMS: 8000,
      });
    }

    return res.status(200).json({
      ok: true,
      db: 'connected',
    });
  } catch (error) {
    return res.status(503).json({
      ok: false,
      db: 'error',
      message: error.message,
      hint: 'Check MongoDB Atlas Network Access (0.0.0.0/0) and DATABASE URI',
    });
  }
};
