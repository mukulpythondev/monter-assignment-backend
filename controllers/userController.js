import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { ApiResponse } from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

export const registerUser = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      throw new ApiError(400, 'User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      email,
      username,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json(new ApiResponse(201, { message: 'User registered successfully' }));
  } catch (err) {
      res.status(500).json(new ApiError(500));
  }
};
