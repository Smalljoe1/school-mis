const { Router } = require('express');
const controller = require('./student.controller');
const { createStudentRules, updateStudentRules } = require('./student.validation');
const { validate } = require('../../middlewares/validate.middleware');
const { authenticate } = require('../../middlewares/auth.middleware');
const { requireRoles } = require('../../middlewares/role.middleware');
const { ROLES } = require('../../utils/constants');

const router = Router();
router.use(authenticate);

/**
 * @openapi
 * /students:
 *   get:
 *     summary: List students (supports ?search=, ?page=, ?limit=)
 *     tags: [Students]
 *   post:
 *     summary: Register a new student
 *     tags: [Students]
 */
router.get('/',    requireRoles(ROLES.ADMIN, ROLES.PRINCIPAL, ROLES.TEACHER, ROLES.CLASS_TEACHER), controller.getAll);
router.post('/',   requireRoles(ROLES.ADMIN, ROLES.PRINCIPAL), createStudentRules, validate, controller.create);

/**
 * @openapi
 * /students/{id}:
 *   get:
 *     summary: Get student by ID
 *     tags: [Students]
 *   patch:
 *     summary: Update student
 *     tags: [Students]
 *   delete:
 *     summary: Delete student
 *     tags: [Students]
 */
router.get('/:id',    requireRoles(ROLES.ADMIN, ROLES.PRINCIPAL, ROLES.TEACHER, ROLES.CLASS_TEACHER), controller.getById);
router.patch('/:id',  requireRoles(ROLES.ADMIN, ROLES.PRINCIPAL), updateStudentRules, validate, controller.update);
router.delete('/:id', requireRoles(ROLES.ADMIN), controller.remove);

module.exports = router;
