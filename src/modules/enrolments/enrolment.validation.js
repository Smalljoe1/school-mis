const { body } = require('express-validator');

const createEnrolmentRules = [
  body('studentId').isInt({ min: 1 }).withMessage('Valid student ID required'),
  body('classId').isInt({ min: 1 }).withMessage('Valid class ID required'),
  body('sessionId').isInt({ min: 1 }).withMessage('Valid session ID required'),
  body('termId').optional().isInt({ min: 1 }),
  body('status').optional().isIn(['active', 'inactive', 'transferred', 'graduated']),
];

const updateEnrolmentRules = [
  body('status').optional().isIn(['active', 'inactive', 'transferred', 'graduated']),
];

module.exports = { createEnrolmentRules, updateEnrolmentRules };
