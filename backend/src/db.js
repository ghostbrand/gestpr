const mongoose = require('mongoose');

const globalCache = global.__gestprMongoose || (global.__gestprMongoose = { promise: null });

function connectDatabase() {
  if (!process.env.DATABASE) {
    throw new Error(
      'DATABASE is not set. Add your MongoDB URI in Vercel → Settings → Environment Variables.'
    );
  }

  if (mongoose.connection.readyState === 1) {
    return Promise.resolve(mongoose.connection);
  }

  if (!globalCache.promise) {
    const isVercel = Boolean(process.env.VERCEL);
    globalCache.promise = mongoose
      .connect(process.env.DATABASE, {
        serverSelectionTimeoutMS: isVercel ? 10_000 : 60_000,
        connectTimeoutMS: isVercel ? 10_000 : 60_000,
        maxPoolSize: isVercel ? 5 : 10,
      })
      .then(() => mongoose.connection)
      .catch((error) => {
        globalCache.promise = null;
        throw error;
      });
  }

  return globalCache.promise;
}

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error.message);
});

module.exports = { connectDatabase };
