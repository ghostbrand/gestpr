const mongoose = require('mongoose');

let connectionPromise = null;

function connectDatabase() {
  if (!process.env.DATABASE) {
    throw new Error('DATABASE is not set. Add your MongoDB connection string to the environment.');
  }

  if (mongoose.connection.readyState === 1) {
    return Promise.resolve(mongoose.connection);
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.DATABASE, {
        serverSelectionTimeoutMS: 60_000,
        connectTimeoutMS: 60_000,
      })
      .then(() => mongoose.connection);
  }

  return connectionPromise;
}

mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error.message);
});

module.exports = { connectDatabase };
