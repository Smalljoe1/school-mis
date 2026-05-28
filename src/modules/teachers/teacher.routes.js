const { Router } = require('express');
const controller = require('./teacher.controller');
const { createTeacherRules, updateTeacherRules } = require('./teacher.validation');
const { validate } = require('../../middlewares/validate.middleware');
const { authenticate } = require('../../middlewares/auth.middleware');
const { requireRoles } = require('../../middlewares/role.middleware');
const { ROLES } = require('../../utils/constants');

const router = Router();
router.use(authenticate);

router.get('/',    requireRoles(ROLES.ADMIN, ROLES.PRINCIPAL), controller.getAll);
router.post('/',   requireRoles(ROLES.ADMIN), createTeacherRules, validate, controller.create);
router.get('/:id', requireRoles(ROLES.ADMIN, ROLES.PRINCIPAL), controller.getById);
router.patch('/:id',  requireRoles(ROLES.ADMIN), updateTeacherRules, validate, controller.update);
router.delete('/:id', requireRoles(ROLES.ADMIN), controller.remove);

module.exports = router;
