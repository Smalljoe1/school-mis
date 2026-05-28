const { Router } = require('express');
const controller = require('./report.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { requireRoles } = require('../../middlewares/role.middleware');
const { ROLES } = require('../../utils/constants');

const router = Router();
router.use(authenticate);

const viewers = [ROLES.ADMIN, ROLES.PRINCIPAL, ROLES.TEACHER, ROLES.CLASS_TEACHER];

/**
 * @openapi
 * /reports/student/{studentId}:
 *   get:
 *     summary: Get student term report
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: termId
 *         required: true
 *         schema:
 *           type: integer
 */
router.get('/student/:studentId',       requireRoles(...viewers), controller.studentTermReport);
router.get('/class/:classId',           requireRoles(...viewers), controller.classReport);
router.get('/enrolment/:sessionId',     requireRoles(ROLES.ADMIN, ROLES.PRINCIPAL), controller.enrolmentSummary);

module.exports = router;
