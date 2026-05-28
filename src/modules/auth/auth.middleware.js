// Re-export the shared auth middleware so modules can import from here.
const { authenticate } = require('../../middlewares/auth.middleware');
const { requireRoles } = require('../../middlewares/role.middleware');

module.exports = { authenticate, requireRoles };
