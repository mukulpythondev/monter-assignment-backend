
import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    throw new ApiError(401, 'Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; 
    next();
  } catch (err) {
    throw new ApiError(401, 'Invalid token');
  }
};

export default verifyToken;
