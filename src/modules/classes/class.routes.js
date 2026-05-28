const { Router } = require('express');
const controller = require('./class.controller');
const { createClassRules, updateClassRules } = require('./class.validation');
const { validate } = require('../../middlewares/validate.middleware');
const { authenticate } = require('../../middlewares/auth.middleware');
const { requireRoles } = require('../../middlewares/role.middleware');
const { ROLES } = require('../../utils/constants');

const router = Router();
router.use(authenticate);

router.get('/',       requireRoles(ROLES.ADMIN, ROLES.PRINCIPAL, ROLES.TEACHER, ROLES.CLASS_TEACHER), controller.getAll);
router.post('/',      requireRoles(ROLES.ADMIN), createClassRules, validate, controller.create);
router.get('/:id',    requireRoles(ROLES.ADMIN, ROLES.PRINCIPAL, ROLES.TEACHER, ROLES.CLASS_TEACHER), controller.getById);
router.patch('/:id',  requireRoles(ROLES.ADMIN), updateClassRules, validate, controller.update);
router.delete('/:id', requireRoles(ROLES.ADMIN), controller.remove);

module.exports = router;
