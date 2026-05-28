const { body } = require('express-validator');

const createUserRules = [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('roleId').isInt({ min: 1 }).withMessage('Valid role ID is required'),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number required'),
];

const updateUserRules = [
  body('fullName').optional().notEmpty().withMessage('Full name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').optional().isMobilePhone().withMessage('Valid phone number required'),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Status must be active or inactive'),
];

module.exports = { createUserRules, updateUserRules };
