const { Router } = require('express');
const controller = require('./alert.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { requireRoles } = require('../../middlewares/role.middleware');
const { ROLES } = require('../../utils/constants');

const router = Router();
router.use(authenticate);

const managers = [ROLES.ADMIN, ROLES.PRINCIPAL, ROLES.CLASS_TEACHER];

/**
 * @openapi
 * /alerts:
 *   get:
 *     summary: List alerts (?studentId=&status=)
 *     tags: [Alerts]
 *   post:
 *     summary: Create an alert
 *     tags: [Alerts]
 * /alerts/{id}/resolve:
 *   patch:
 *     summary: Resolve an alert
 *     tags: [Alerts]
 */
router.get('/',               requireRoles(...managers), controller.getAll);
router.post('/',              requireRoles(...managers), controller.create);
router.patch('/:id/resolve',  requireRoles(...managers), controller.resolve);

module.exports = router;
