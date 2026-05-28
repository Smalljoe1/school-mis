const env = require('../config/env');

/**
 * Global Express error handler.
 * Must have 4 parameters to be recognised by Express as an error handler.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err.message, err.stack);

  // PostgreSQL unique-violation
  if (err.code === '23505') {
    return res.status(409).json({ success: false, message: 'Duplicate entry — record already exists.' });
  }

  // PostgreSQL foreign-key violation
  if (err.code === '23503') {
    return res.status(400).json({ success: false, message: 'Referenced record does not exist.' });
  }

  const statusCode = err.statusCode || err.status || 500;
  const message =
    env.nodeEnv === 'production' && statusCode === 500
      ? 'Internal server error'
      : err.message || 'Internal server error';

  res.status(statusCode).json({ success: false, message });
};

module.exports = { errorHandler };
