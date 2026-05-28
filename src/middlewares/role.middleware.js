const { error } = require('../utils/apiResponse');

/**
 * Allow only the specified roles to access the route.
 * @param  {...string} roles  Role names allowed
 */
const requireRoles = (...roles) => (req, res, next) => {
  if (!req.user) {
    return error(res, 'Not authenticated', 401);
  }
  if (!roles.includes(req.user.role)) {
    return error(res, 'You do not have permission to perform this action', 403);
  }
  next();
};

module.exports = { requireRoles };
