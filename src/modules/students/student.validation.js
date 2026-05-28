const { body } = require('express-validator');

const createStudentRules = [
  body('admissionNo').notEmpty().withMessage('Admission number is required'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('gender').isIn(['Male', 'Female']).withMessage('Gender must be Male or Female'),
  body('dateOfBirth').optional().isISO8601().withMessage('Date of birth must be a valid date'),
  body('parentPhone').optional().isMobilePhone().withMessage('Valid parent phone required'),
];

const updateStudentRules = [
  body('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
  body('gender').optional().isIn(['Male', 'Female']).withMessage('Gender must be Male or Female'),
  body('dateOfBirth').optional().isISO8601().withMessage('Date of birth must be a valid date'),
];

module.exports = { createStudentRules, updateStudentRules };
