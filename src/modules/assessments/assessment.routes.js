const { Router } = require('express');
const controller = require('./assessment.controller');
const { createAssessmentRules, updateAssessmentRules } = require('./assessment.validation');
const { validate } = require('../../middlewares/validate.middleware');
const { authenticate } = require('../../middlewares/auth.middleware');
const { requireRoles } = require('../../middlewares/role.middleware');
const { ROLES } = require('../../utils/constants');

const router = Router();
router.use(authenticate);

const teacherRoles = [ROLES.ADMIN, ROLES.PRINCIPAL, ROLES.TEACHER, ROLES.CLASS_TEACHER];

router.get('/',       requireRoles(...teacherRoles), controller.getAll);
router.post('/',      requireRoles(...teacherRoles), createAssessmentRules, validate, controller.create);
router.get('/:id',    requireRoles(...teacherRoles), controller.getById);
router.patch('/:id',  requireRoles(...teacherRoles), updateAssessmentRules, validate, controller.update);
router.delete('/:id', requireRoles(ROLES.ADMIN), controller.remove);

module.exports = router;
