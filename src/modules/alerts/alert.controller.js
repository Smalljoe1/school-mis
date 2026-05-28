const service = require('./alert.service');
const asyncHandler = require('../../utils/asyncHandler');
const { success, paginated } = require('../../utils/apiResponse');

const getAll = asyncHandler(async (req, res) => {
  const { data, total, page, limit } = await service.getAll(req.query);
  paginated(res, data, total, page, limit, 'Alerts retrieved');
});

const create = asyncHandler(async (req, res) => {
  const alert = await service.create(req.body);
  success(res, alert, 'Alert created', 201);
});

const resolve = asyncHandler(async (req, res) => {
  const alert = await service.resolve(req.params.id);
  success(res, alert, 'Alert resolved');
});

module.exports = { getAll, create, resolve };
