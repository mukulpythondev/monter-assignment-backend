// controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';
import 'dotenv/config';

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(400, 'Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(400, 'Invalid email or password');
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(200).json(new ApiResponse(200, { accessToken, refreshToken }, 'Login successful'));
  } catch (err) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const errors = err.errors || [];

    res.status(statusCode).json({
      statusCode,
      message,
      data: null,
      success: false,
      errors,
    });
  }
};

export const updateUserInfo = async (req, res) => {
  const userId = req.userId; 
  const { location, age, work, dob, description } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { location, age, work, dob, description },
      { new: true }
    );

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.status(200).json(new ApiResponse(200, user, 'User information updated successfully'));
  } catch (err) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const errors = err.errors || [];

    res.status(statusCode).json({
      statusCode,
      message,
      data: null,
      success: false,
      errors,
    });
  }
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json(new ApiResponse(400, null, false, ['Refresh token is missing']));
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = generateAccessToken(decoded.id);

    res.status(200).json(new ApiResponse(200, { accessToken }, 'Access token refreshed successfully'));
  } catch (err) {
    const statusCode = err.statusCode || 401;
    const message = err.message || 'Invalid refresh token';
    const errors = err.errors || [];

    res.status(statusCode).json({
      statusCode,
      message,
      data: null,
      success: false,
      errors,
    });
  }
};
