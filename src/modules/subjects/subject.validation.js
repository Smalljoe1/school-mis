const { body } = require('express-validator');

const createSubjectRules = [
  body('subjectName').notEmpty().withMessage('Subject name is required'),
  body('subjectCode').optional().notEmpty(),
];

const updateSubjectRules = [
  body('subjectName').optional().notEmpty(),
  body('subjectCode').optional().notEmpty(),
];

module.exports = { createSubjectRules, updateSubjectRules };
