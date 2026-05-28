const service = require('./assessment.service');
const asyncHandler = require('../../utils/asyncHandler');
const { success, paginated } = require('../../utils/apiResponse');

const getAll = asyncHandler(async (req, res) => {
  const { data, total, page, limit } = await service.getAll(req.query);
  paginated(res, data, total, page, limit, 'Assessments retrieved');
});
const getById = asyncHandler(async (req, res) => {
  success(res, await service.getById(req.params.id), 'Assessment retrieved');
});
const create = asyncHandler(async (req, res) => {
  const record = await service.create({ ...req.body, enteredBy: req.user?.teacherId || null });
  success(res, record, 'Assessment created', 201);
});
const update = asyncHandler(async (req, res) => {
  success(res, await service.update(req.params.id, req.body), 'Assessment updated');
});
const remove = asyncHandler(async (req, res) => {
  await service.remove(req.params.id);
  success(res, null, 'Assessment deleted');
});

module.exports = { getAll, getById, create, update, remove };
