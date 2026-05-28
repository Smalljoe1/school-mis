const { Router } = require('express');
const controller = require('./user.controller');
const { createUserRules, updateUserRules } = require('./user.validation');
const { validate } = require('../../middlewares/validate.middleware');
const { authenticate } = require('../../middlewares/auth.middleware');
const { requireRoles } = require('../../middlewares/role.middleware');
const { ROLES } = require('../../utils/constants');

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /users:
 *   get:
 *     summary: List all users (Admin only)
 *     tags: [Users]
 *   post:
 *     summary: Create a user (Admin only)
 *     tags: [Users]
 */
router.get('/',    requireRoles(ROLES.ADMIN), controller.getAll);
router.post('/',   requireRoles(ROLES.ADMIN), createUserRules, validate, controller.create);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *   patch:
 *     summary: Update a user
 *     tags: [Users]
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 */
router.get('/:id',    requireRoles(ROLES.ADMIN, ROLES.PRINCIPAL), controller.getById);
router.patch('/:id',  requireRoles(ROLES.ADMIN), updateUserRules, validate, controller.update);
router.delete('/:id', requireRoles(ROLES.ADMIN), controller.remove);

module.exports = router;
