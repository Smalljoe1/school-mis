const service = require('./attendance.service');
const asyncHandler = require('../../utils/asyncHandler');
const { success, error, paginated } = require('../../utils/apiResponse');

const getAll = asyncHandler(async (req, res) => {
  const { data, total, page, limit } = await service.getAll(req.query);
  paginated(res, data, total, page, limit, 'Attendance records retrieved');
});

const getById = asyncHandler(async (req, res) => {
  success(res, await service.getById(req.params.id), 'Attendance record retrieved');
});

const create = asyncHandler(async (req, res) => {
  const record = await service.create({ ...req.body, markedBy: req.user?.teacherId || null });
  success(res, record, 'Attendance recorded', 201);
});

const bulkCreate = asyncHandler(async (req, res) => {
  const records = await service.bulkCreate(req.body, req.user?.teacherId || null);
  success(res, records, 'Bulk attendance recorded', 201);
});

const getStudentRate = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const { sessionId, termId } = req.query;
  if (!sessionId || !termId) {
    return error(res, 'sessionId and termId query params required', 400);
  }
  const rate = await service.getStudentRate(studentId, sessionId, termId);
  success(res, rate, 'Attendance rate retrieved');
});

module.exports = { getAll, getById, create, bulkCreate, getStudentRate };
