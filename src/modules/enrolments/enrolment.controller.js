const service = require('./enrolment.service');
const asyncHandler = require('../../utils/asyncHandler');
const { success, paginated } = require('../../utils/apiResponse');

const getAll = asyncHandler(async (req, res) => {
  const { data, total, page, limit } = await service.getAll(req.query);
  paginated(res, data, total, page, limit, 'Enrolments retrieved');
});
const getById = asyncHandler(async (req, res) => {
  success(res, await service.getById(req.params.id), 'Enrolment retrieved');
});
const create = asyncHandler(async (req, res) => {
  success(res, await service.create(req.body), 'Enrolment created', 201);
});
const update = asyncHandler(async (req, res) => {
  success(res, await service.update(req.params.id, req.body), 'Enrolment updated');
});
const remove = asyncHandler(async (req, res) => {
  await service.remove(req.params.id);
  success(res, null, 'Enrolment deleted');
});

module.exports = { getAll, getById, create, update, remove };
