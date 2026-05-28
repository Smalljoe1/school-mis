const { body } = require('express-validator');

const createTeacherRules = [
  body('staffNo').notEmpty().withMessage('Staff number is required'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('gender').isIn(['Male', 'Female']).withMessage('Gender must be Male or Female'),
  body('email').optional().isEmail().withMessage('Valid email required').normalizeEmail(),
  body('phone').optional().isMobilePhone().withMessage('Valid phone required'),
  body('hireDate').optional().isISO8601().withMessage('Hire date must be a valid date'),
];

const updateTeacherRules = [
  body('firstName').optional().notEmpty(),
  body('lastName').optional().notEmpty(),
  body('gender').optional().isIn(['Male', 'Female']),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().isMobilePhone(),
  body('qualification').optional().notEmpty(),
];

module.exports = { createTeacherRules, updateTeacherRules };
