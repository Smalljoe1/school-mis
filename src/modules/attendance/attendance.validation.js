const { body } = require('express-validator');

const createAttendanceRules = [
  body('studentId').isInt({ min: 1 }).withMessage('Valid student ID required'),
  body('classId').isInt({ min: 1 }).withMessage('Valid class ID required'),
  body('sessionId').isInt({ min: 1 }).withMessage('Valid session ID required'),
  body('termId').isInt({ min: 1 }).withMessage('Valid term ID required'),
  body('attendanceDate').isISO8601().withMessage('Valid attendance date required'),
  body('status').isIn(['Present', 'Absent', 'Late', 'Excused']).withMessage('Status must be Present, Absent, Late, or Excused'),
];

const bulkAttendanceRules = [
  body('records').isArray({ min: 1 }).withMessage('Records must be a non-empty array'),
  body('records.*.studentId').isInt({ min: 1 }),
  body('records.*.status').isIn(['Present', 'Absent', 'Late', 'Excused']),
  body('classId').isInt({ min: 1 }),
  body('sessionId').isInt({ min: 1 }),
  body('termId').isInt({ min: 1 }),
  body('attendanceDate').isISO8601(),
];

module.exports = { createAttendanceRules, bulkAttendanceRules };
