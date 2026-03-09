import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { validateEmail, validatePassword, validatePasswordMatch, sanitizeInput } from '../utils/validation';
import emailService from '../services/email.service';
import logger from '../utils/logger';

const prisma = new PrismaClient();

/**
 * Register a new user
 * POST /api/v1/auth/register
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email: rawEmail, password, confirmPassword } = req.body;

    // Sanitize and validate inputs
    const email = sanitizeInput(rawEmail).toLowerCase();
    
    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({
        success: false,
        errors: emailValidation.errors
      });
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        errors: passwordValidation.errors
      });
    }

    // Validate password match
    const passwordMatchValidation = validatePasswordMatch(password, confirmPassword);
    if (!passwordMatchValidation.isValid) {
      return res.status(400).json({
        success: false,
        errors: passwordMatchValidation.errors
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        errors: ['An account with this email already exists. Please login or use a different email.']
      });
    }

    // Hash password with bcrypt (salt rounds = 12)
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user (inactive until email verification)
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        isActive: false,
        emailVerified: false
      }
    });

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        token: verificationToken,
        expiresAt
      }
    });

    // Send verification email
    const emailSent = await emailService.sendVerificationEmail(email, verificationToken);
    
    if (!emailSent) {
      logger.warn(`Failed to send verification email to ${email}`);
      // Continue with registration even if email fails
    }

    // Log registration event
    logger.info(`New user registered: ${email}`);

    // Return success response (don't include sensitive data)
    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      data: {
        email: user.email,
        emailVerificationSent: emailSent
      }
    });

  } catch (error) {
    logger.error('Registration error:', error);
    next(error);
  }
};

/**
 * Verify email with token
 * GET /api/v1/auth/verify-email?token=xxx
 */
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({
        success: false,
        errors: ['Verification token is required']
      });
    }

    // Find verification token
    const verificationToken = await prisma.emailVerificationToken.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!verificationToken) {
      return res.status(404).json({
        success: false,
        errors: ['Invalid or expired verification token']
      });
    }

    // Check if token has expired
    if (new Date() > verificationToken.expiresAt) {
      return res.status(400).json({
        success: false,
        errors: ['Verification link has expired. Please request a new one.'],
        expired: true
      });
    }

    // Check if email is already verified
    if (verificationToken.user.emailVerified) {
      return res.status(200).json({
        success: true,
        message: 'Email has already been verified. You can now login.',
        alreadyVerified: true
      });
    }

    // Update user - activate account and mark email as verified
    await prisma.user.update({
      where: { id: verificationToken.userId },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
        isActive: true
      }
    });

    // Delete used verification token
    await prisma.emailVerificationToken.delete({
      where: { id: verificationToken.id }
    });

    // Send welcome email
    await emailService.sendWelcomeEmail(verificationToken.user.email);

    logger.info(`Email verified for user: ${verificationToken.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! You can now login to your account.'
    });

  } catch (error) {
    logger.error('Email verification error:', error);
    next(error);
  }
};

/**
 * Resend verification email
 * POST /api/v1/auth/resend-verification
 */
export const resendVerification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email: rawEmail } = req.body;
    const email = sanitizeInput(rawEmail).toLowerCase();

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({
        success: false,
        errors: emailValidation.errors
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a verification link has been sent.'
      });
    }

    // Check if already verified
    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        errors: ['Email is already verified. You can login to your account.']
      });
    }

    // Delete any existing verification tokens for this user
    await prisma.emailVerificationToken.deleteMany({
      where: { userId: user.id }
    });

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        token: verificationToken,
        expiresAt
      }
    });

    // Send verification email
    await emailService.sendVerificationEmail(email, verificationToken);

    logger.info(`Verification email resent to: ${email}`);

    res.status(200).json({
      success: true,
      message: 'If an account exists with this email, a verification link has been sent.'
    });

  } catch (error) {
    logger.error('Resend verification error:', error);
    next(error);
  }
};
