/**
 * Wrap an async route handler so errors are forwarded to Express error middleware.
 * @param {Function} fn  Async express handler
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
