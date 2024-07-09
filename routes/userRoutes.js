import express from 'express';
import { requestRegistration, verifyOTP } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', requestRegistration);
router.post('/verify-otp', verifyOTP);

export default router;
