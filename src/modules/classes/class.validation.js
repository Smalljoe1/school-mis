const { body } = require('express-validator');

const createClassRules = [
  body('className').notEmpty().withMessage('Class name is required'),
  body('classLevel').optional().notEmpty(),
  body('classTeacherId').optional().isInt({ min: 1 }).withMessage('Class teacher ID must be a positive integer'),
];

const updateClassRules = [
  body('className').optional().notEmpty(),
  body('classLevel').optional().notEmpty(),
  body('classTeacherId').optional().isInt({ min: 1 }),
];

module.exports = { createClassRules, updateClassRules };
