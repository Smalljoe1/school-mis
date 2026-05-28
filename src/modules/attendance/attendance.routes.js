const { Router } = require('express');
const controller = require('./attendance.controller');
const { createAttendanceRules, bulkAttendanceRules } = require('./attendance.validation');
const { validate } = require('../../middlewares/validate.middleware');
const { authenticate } = require('../../middlewares/auth.middleware');
const { requireRoles } = require('../../middlewares/role.middleware');
const { ROLES } = require('../../utils/constants');

const router = Router();
router.use(authenticate);

const teacherRoles = [ROLES.ADMIN, ROLES.PRINCIPAL, ROLES.TEACHER, ROLES.CLASS_TEACHER];

router.get('/',    requireRoles(...teacherRoles), controller.getAll);
router.post('/',   requireRoles(...teacherRoles), createAttendanceRules, validate, controller.create);
router.post('/bulk', requireRoles(...teacherRoles), bulkAttendanceRules, validate, controller.bulkCreate);
router.get('/student/:studentId/rate', requireRoles(...teacherRoles), controller.getStudentRate);
router.get('/:id', requireRoles(...teacherRoles), controller.getById);

module.exports = router;
