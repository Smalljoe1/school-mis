const service = require('./student.service');
const asyncHandler = require('../../utils/asyncHandler');
const { success, paginated } = require('../../utils/apiResponse');

const getAll = asyncHandler(async (req, res) => {
  const { data, total, page, limit } = await service.getAll(req.query);
  paginated(res, data, total, page, limit, 'Students retrieved');
});

const getById = asyncHandler(async (req, res) => {
  const student = await service.getById(req.params.id);
  success(res, student, 'Student retrieved');
});

const create = asyncHandler(async (req, res) => {
  const student = await service.create(req.body);
  success(res, student, 'Student created', 201);
});

const update = asyncHandler(async (req, res) => {
  const student = await service.update(req.params.id, req.body);
  success(res, student, 'Student updated');
});

const remove = asyncHandler(async (req, res) => {
  await service.remove(req.params.id);
  success(res, null, 'Student deleted');
});

module.exports = { getAll, getById, create, update, remove };
