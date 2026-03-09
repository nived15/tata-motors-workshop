import express from 'express';
import { register, verifyEmail, resendVerification } from '../controllers/auth.controller';
import { registrationLimiter, authLimiter } from '../middleware/rateLimit';

const router = express.Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registrationLimiter, register);

/**
 * @route   GET /api/v1/auth/verify-email
 * @desc    Verify email with token
 * @access  Public
 */
router.get('/verify-email', verifyEmail);

/**
 * @route   POST /api/v1/auth/resend-verification
 * @desc    Resend verification email
 * @access  Public
 */
router.post('/resend-verification', authLimiter, resendVerification);

export default router;
