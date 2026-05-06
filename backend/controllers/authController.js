const asyncHandler = require('../utils/asyncHandler');
const { sendResponse } = require('../utils/apiResponse');
const authService = require('../services/authService');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  sendResponse(res, 201, 'Registration successful', result);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  sendResponse(res, 200, 'Login successful', result);
});

const getMe = asyncHandler(async (req, res) => {
  sendResponse(res, 200, 'User retrieved', req.user);
});

module.exports = { register, login, getMe };
