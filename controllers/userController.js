import bcrypt from 'bcrypt';
import TempUser from '../models/tempUser.js';
import User from '../models/user.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { generateOTP, sendOTPEmail } from '../utils/email.js';

export const requestRegistration = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    let tempUser = await TempUser.findOne({ email });
    if (tempUser) {
      throw new ApiError(400, 'OTP already sent. Please check your email.');
    }

    let user = await User.findOne({ email });
    if (user) {
      throw new ApiError(400, 'User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    tempUser = new TempUser({
      email,
      username,
      password: hashedPassword,
      otp,
      otpExpires: Date.now() + 3600000, // OTP expires in 1 hour
    });

    await tempUser.save();
    await sendOTPEmail(email, otp);

    res.status(201).json(new ApiResponse(201, null, 'OTP sent to email. Please verify to complete registration.'));
  } catch (err) {
    res.status(err.statusCode || 500).json(new ApiError(err.statusCode || 500, err.message || "Something went wrong registering the user!"));
  }
};

export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const tempUser = await TempUser.findOne({ email });
    if (!tempUser) {
      throw new ApiError(400, 'No registration request found');
    }

    if (tempUser.otp !== otp || tempUser.otpExpires < Date.now()) {
      await TempUser.deleteOne({ email });
      throw new ApiError(400, 'Invalid or expired OTP. Please register again.');
    }

    const user = new User({
      email: tempUser.email,
      username: tempUser.username,
      password: tempUser.password,
      isVerified: true,
    });

    await user.save();
    await TempUser.deleteOne({ email });

    res.status(200).json(new ApiResponse(200, null, 'OTP verified successfully. Registration complete.'));
  } catch (err) {
    res.status(err.statusCode || 500).json(new ApiError(err.statusCode || 500, err.message || "Something went wrong verifying the user!"));
  }
};
