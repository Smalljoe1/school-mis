const { Router } = require('express');

const authRoutes       = require('../modules/auth/auth.routes');
const userRoutes       = require('../modules/users/user.routes');
const studentRoutes    = require('../modules/students/student.routes');
const teacherRoutes    = require('../modules/teachers/teacher.routes');
const classRoutes      = require('../modules/classes/class.routes');
const subjectRoutes    = require('../modules/subjects/subject.routes');
const enrolmentRoutes  = require('../modules/enrolments/enrolment.routes');
const attendanceRoutes = require('../modules/attendance/attendance.routes');
const assessmentRoutes = require('../modules/assessments/assessment.routes');
const reportRoutes     = require('../modules/reports/report.routes');
const analyticsRoutes  = require('../modules/analytics/analytics.routes');
const alertRoutes      = require('../modules/alerts/alert.routes');

const router = Router();

router.use('/auth',        authRoutes);
router.use('/users',       userRoutes);
router.use('/students',    studentRoutes);
router.use('/teachers',    teacherRoutes);
router.use('/classes',     classRoutes);
router.use('/subjects',    subjectRoutes);
router.use('/enrolments',  enrolmentRoutes);
router.use('/attendance',  attendanceRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/reports',     reportRoutes);
router.use('/analytics',   analyticsRoutes);
router.use('/alerts',      alertRoutes);

module.exports = router;
