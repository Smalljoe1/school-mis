const service = require('./report.service');
const asyncHandler = require('../../utils/asyncHandler');
const { success } = require('../../utils/apiResponse');

const studentTermReport = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const { sessionId, termId } = req.query;
  const report = await service.getStudentTermReport(studentId, sessionId, termId);
  success(res, report, 'Student term report generated');
});

const classReport = asyncHandler(async (req, res) => {
  const { classId } = req.params;
  const { sessionId, termId } = req.query;
  const report = await service.getClassReport(classId, sessionId, termId);
  success(res, report, 'Class report generated');
});

const enrolmentSummary = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const report = await service.getEnrolmentSummary(sessionId);
  success(res, report, 'Enrolment summary generated');
});

module.exports = { studentTermReport, classReport, enrolmentSummary };
