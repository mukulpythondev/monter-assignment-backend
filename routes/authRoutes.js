import express from 'express';
import { login, refreshToken, updateUserInfo } from '../controllers/authController.js';
import verifyToken from '../middleware/verifyToken.js'
const router = express.Router();

router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.put('/update-info', verifyToken, updateUserInfo);
export default router;
