const { Router } = require('express');
const controller = require('./analytics.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { requireRoles } = require('../../middlewares/role.middleware');
const { ROLES } = require('../../utils/constants');

const router = Router();
router.use(authenticate);

const viewers = [ROLES.ADMIN, ROLES.PRINCIPAL, ROLES.TEACHER, ROLES.CLASS_TEACHER];

/**
 * @openapi
 * /analytics/attendance-trend:
 *   get:
 *     summary: Daily attendance trend for a class
 *     tags: [Analytics]
 * /analytics/top-performers:
 *   get:
 *     summary: Top performing students in a class
 *     tags: [Analytics]
 * /analytics/at-risk:
 *   get:
 *     summary: Students at risk (low attendance or low scores)
 *     tags: [Analytics]
 */
router.get('/attendance-trend', requireRoles(...viewers), controller.attendanceTrend);
router.get('/top-performers',   requireRoles(...viewers), controller.topPerformers);
router.get('/at-risk',          requireRoles(ROLES.ADMIN, ROLES.PRINCIPAL, ROLES.CLASS_TEACHER), controller.atRiskStudents);

module.exports = router;
