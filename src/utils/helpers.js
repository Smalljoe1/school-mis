const { GRADE_SCALE } = require('./constants');

/**
 * Derive grade and remark from a numeric score.
 */
const computeGrade = (score) => {
  const entry = GRADE_SCALE.find((g) => score >= g.min && score <= g.max);
  return entry ? { grade: entry.grade, remark: entry.remark } : { grade: 'F', remark: 'Fail' };
};

/**
 * Parse and clamp a pagination page/limit from query params.
 */
const parsePagination = (query) => {
  const page  = Math.max(1, parseInt(query.page,  10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

/**
 * Sanitize a string by trimming whitespace.
 */
const sanitizeString = (str) => (typeof str === 'string' ? str.trim() : str);

module.exports = { computeGrade, parsePagination, sanitizeString };
