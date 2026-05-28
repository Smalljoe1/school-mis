const { Router } = require('express');
const controller = require('./subject.controller');
const { createSubjectRules, updateSubjectRules } = require('./subject.validation');
const { validate } = require('../../middlewares/validate.middleware');
const { authenticate } = require('../../middlewares/auth.middleware');
const { requireRoles } = require('../../middlewares/role.middleware');
const { ROLES } = require('../../utils/constants');

const router = Router();
router.use(authenticate);

router.get('/',       requireRoles(ROLES.ADMIN, ROLES.PRINCIPAL, ROLES.TEACHER, ROLES.CLASS_TEACHER), controller.getAll);
router.post('/',      requireRoles(ROLES.ADMIN), createSubjectRules, validate, controller.create);
router.get('/:id',    requireRoles(ROLES.ADMIN, ROLES.PRINCIPAL, ROLES.TEACHER, ROLES.CLASS_TEACHER), controller.getById);
router.patch('/:id',  requireRoles(ROLES.ADMIN), updateSubjectRules, validate, controller.update);
router.delete('/:id', requireRoles(ROLES.ADMIN), controller.remove);

module.exports = router;
