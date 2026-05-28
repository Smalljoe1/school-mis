const service = require('./user.service');
const asyncHandler = require('../../utils/asyncHandler');
const { success, paginated } = require('../../utils/apiResponse');

const getAll = asyncHandler(async (req, res) => {
  const { data, total, page, limit } = await service.getAll(req.query);
  paginated(res, data, total, page, limit, 'Users retrieved');
});

const getById = asyncHandler(async (req, res) => {
  const user = await service.getById(req.params.id);
  success(res, user, 'User retrieved');
});

const create = asyncHandler(async (req, res) => {
  const user = await service.create(req.body);
  success(res, user, 'User created', 201);
});

const update = asyncHandler(async (req, res) => {
  const user = await service.update(req.params.id, req.body);
  success(res, user, 'User updated');
});

const remove = asyncHandler(async (req, res) => {
  await service.remove(req.params.id);
  success(res, null, 'User deleted');
});

module.exports = { getAll, getById, create, update, remove };
