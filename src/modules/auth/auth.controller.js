const authService = require('./auth.service');
const asyncHandler = require('../../utils/asyncHandler');
const { success } = require('../../utils/apiResponse');

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  success(res, result, 'Login successful');
});

const getProfile = asyncHandler(async (req, res) => {
  const profile = await authService.getProfile(req.user.userId);
  success(res, profile, 'Profile retrieved');
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await authService.changePassword(req.user.userId, currentPassword, newPassword);
  success(res, null, 'Password changed successfully');
});

module.exports = { login, getProfile, changePassword };
