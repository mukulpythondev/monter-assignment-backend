import express from 'express';
import { getUserDetails, requestRegistration, verifyOTP } from '../controllers/userController.js';
import verifyToken from '../middleware/verifyToken.js'
const router = express.Router();

router.post('/register', requestRegistration);
router.post('/verify-otp', verifyOTP);
router.get('/details', verifyToken, getUserDetails);
export default router;
