const { body } = require('express-validator');

const createAssessmentRules = [
  body('studentId').isInt({ min: 1 }).withMessage('Valid student ID required'),
  body('subjectId').isInt({ min: 1 }).withMessage('Valid subject ID required'),
  body('classId').isInt({ min: 1 }).withMessage('Valid class ID required'),
  body('sessionId').isInt({ min: 1 }).withMessage('Valid session ID required'),
  body('termId').isInt({ min: 1 }).withMessage('Valid term ID required'),
  body('testScore').isFloat({ min: 0, max: 30 }).withMessage('Test score must be 0–30'),
  body('assignmentScore').isFloat({ min: 0, max: 20 }).withMessage('Assignment score must be 0–20'),
  body('examScore').isFloat({ min: 0, max: 70 }).withMessage('Exam score must be 0–70'),
];

const updateAssessmentRules = [
  body('testScore').optional().isFloat({ min: 0, max: 30 }),
  body('assignmentScore').optional().isFloat({ min: 0, max: 20 }),
  body('examScore').optional().isFloat({ min: 0, max: 70 }),
];

module.exports = { createAssessmentRules, updateAssessmentRules };
