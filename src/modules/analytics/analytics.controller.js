const service = require('./analytics.service');
const asyncHandler = require('../../utils/asyncHandler');
const { success } = require('../../utils/apiResponse');

const attendanceTrend = asyncHandler(async (req, res) => {
  const { classId, sessionId, termId } = req.query;
  const data = await service.attendanceTrend(classId, sessionId, termId);
  success(res, data, 'Attendance trend data retrieved');
});

const topPerformers = asyncHandler(async (req, res) => {
  const { classId, sessionId, termId, limit } = req.query;
  const data = await service.topPerformers(classId, sessionId, termId, Number(limit) || 10);
  success(res, data, 'Top performers retrieved');
});

const atRiskStudents = asyncHandler(async (req, res) => {
  const { sessionId, termId, minAttendanceRate, minAvgScore } = req.query;
  const data = await service.atRiskStudents(
    sessionId, termId,
    minAttendanceRate ? Number(minAttendanceRate) : 70,
    minAvgScore ? Number(minAvgScore) : 45,
  );
  success(res, data, 'At-risk students retrieved');
});

module.exports = { attendanceTrend, topPerformers, atRiskStudents };
