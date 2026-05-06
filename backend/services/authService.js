const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AppError('Email already registered', 409);

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  return {
    token,
    user: { id: user._id, name: user.name, email: user.email },
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken(user._id);
  return {
    token,
    user: { id: user._id, name: user.name, email: user.email },
  };
};

module.exports = { register, login };
