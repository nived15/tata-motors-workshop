# Account Registration System - Setup Guide

## Overview
This guide will help you set up and test the account registration system with email verification, password validation, and rate limiting.

## Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the backend directory:
```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://postgres:password@localhost:5432/money_manager?schema=public"
CORS_ORIGIN=http://localhost:5173
APP_URL=http://localhost:5173
EMAIL_FROM=noreply@moneymanager.com
```

### 3. Run Database Migrations
```bash
npm run migrate
```

### 4. Generate Prisma Client
```bash
npm run prisma:generate
```

### 5. Start Backend Server
```bash
npm run dev
```

The backend server will start on http://localhost:3000

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_APP_NAME=Money Manager
VITE_APP_URL=http://localhost:5173
```

### 3. Start Frontend Development Server
```bash
npm run dev
```

The frontend will start on http://localhost:5173

## Features Implemented

### ✅ Backend Features

1. **User Registration Endpoint** (`POST /api/v1/auth/register`)
   - Email validation (format, uniqueness)
   - Password complexity validation (min 12 chars, uppercase, lowercase, number, special char)
   - Password confirmation matching
   - bcrypt password hashing (salt rounds = 12)
   - Email verification token generation
   - Rate limiting (5 attempts per IP per hour)

2. **Email Verification Endpoint** (`GET /api/v1/auth/verify-email?token=xxx`)
   - Token validation and expiration check (24 hours)
   - Account activation upon successful verification
   - Automatic cleanup of used tokens

3. **Resend Verification Endpoint** (`POST /api/v1/auth/resend-verification`)
   - Generate new verification token
   - Send new verification email
   - Rate limiting protection

4. **Email Service**
   - Verification email templates (HTML and plain text)
   - Welcome email after verification
   - Password reset email template (for future use)
   - Development mode logging (emails logged to console)

5. **Security Features**
   - Rate limiting on registration endpoint
   - Password strength validation
   - Email verification required before account activation
   - bcrypt password hashing
   - Audit logging ready

### ✅ Frontend Features

1. **Registration Form Component**
   - Real-time form validation with Zod schema
   - Email and password input fields
   - Password confirmation field
   - Show/hide password toggle
   - Loading states and error handling
   - Success state with instructions

2. **Password Strength Indicator**
   - Visual strength meter (5 levels: 0-4)
   - Color-coded feedback (red to green)
   - Real-time suggestions for improvement
   - Requirements checklist display

3. **Email Verification Page**
   - Automatic token verification on page load
   - Loading, success, and error states
   - Auto-redirect to login after successful verification
   - Resend verification option for expired tokens

4. **API Integration**
   - Axios-based API client with interceptors
   - Auth service with TypeScript interfaces
   - Error handling and toast notifications

## Testing the Registration Flow

### 1. Register a New Account
1. Navigate to http://localhost:5173/register
2. Enter email: test@example.com
3. Create a password meeting all requirements:
   - At least 12 characters
   - One uppercase letter
   - One lowercase letter
   - One number
   - One special character
   - Example: `TestPassword123!`
4. Confirm the password
5. Click "Create Account"

### 2. Check Email Verification
In development mode, the verification email will be logged to the backend console:
```
=== EMAIL PREVIEW ===
To: test@example.com
Subject: Verify Your Email - Money Manager
---
[Verification link will be shown here]
===================
```

### 3. Verify Email
1. Copy the verification URL from the console
2. Paste it in your browser
3. You should see "Email Verified!" message
4. Auto-redirect to login page after 3 seconds

### 4. Test Rate Limiting
Try registering more than 5 accounts from the same IP within an hour:
- You should receive: "Too many registration attempts from this IP. Please try again later."

## API Endpoints

### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Registration successful! Please check your email to verify your account.",
  "data": {
    "email": "user@example.com",
    "emailVerificationSent": true
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "errors": [
    "Password must be at least 12 characters long",
    "Password must contain at least one special character"
  ]
}
```

### Verify Email
```http
GET /api/v1/auth/verify-email?token=abc123xyz
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Email verified successfully! You can now login to your account."
}
```

### Resend Verification
```http
POST /api/v1/auth/resend-verification
Content-Type: application/json

{
  "email": "user@example.com"
}
```

## Validation Rules

### Email Validation
- Required field
- Valid email format
- Maximum 255 characters
- Must be unique (no duplicate accounts)

### Password Validation
- Minimum 12 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&*()_+-=[]{}..., etc.)

### Password Strength Scoring
- **0 - Very Weak**: Missing most requirements
- **1 - Weak**: Basic requirements not met
- **2 - Moderate**: Some requirements met
- **3 - Strong**: All requirements met
- **4 - Very Strong**: All requirements + extra length (16+ chars)

## Security Features

### Rate Limiting
- **Registration**: 5 attempts per IP per hour
- **Resend Verification**: 10 attempts per 15 minutes
- Prevents brute force attacks and spam

### Password Hashing
- bcrypt algorithm with salt rounds = 12
- Passwords never stored in plain text
- Computationally expensive to crack

### Email Verification
- Cryptographically secure random tokens (32 bytes)
- 24-hour expiration
- One-time use (deleted after verification)
- Account inactive until verified

## Database Schema

### Users Table
- `id`: UUID (primary key)
- `email`: String (unique)
- `passwordHash`: String (bcrypt hashed)
- `isActive`: Boolean (false until verified)
- `emailVerified`: Boolean
- `emailVerifiedAt`: DateTime
- Standard timestamps

### EmailVerificationTokens Table
- `id`: UUID (primary key)
- `userId`: String (foreign key)
- `token`: String (unique)
- `expiresAt`: DateTime
- `createdAt`: DateTime

## Next Steps

To complete the authentication system, you'll need to implement:

1. **Login Functionality** (US-2 part 1)
   - Login endpoint with email/password
   - JWT token generation
   - Session management

2. **Multi-Factor Authentication** (US-2 part 2)
   - TOTP authenticator app support
   - SMS backup option
   - Backup codes generation

3. **Password Reset**
   - Forgot password flow
   - Reset token generation
   - Password update endpoint

## Troubleshooting

### Issue: Emails not appearing
- Check backend console for email preview logs
- Verify `APP_URL` and `EMAIL_FROM` in `.env`
- In production, configure real email service (SendGrid, AWS SES)

### Issue: Database connection error
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Run migrations: `npm run migrate`

### Issue: Rate limit not working
- Clear cookies/localStorage
- Try from different IP or wait for window to reset
- Check rate limiter configuration in `rateLimit.ts`

### Issue: Frontend can't connect to backend
- Verify backend is running on port 3000
- Check CORS configuration in `server.ts`
- Verify `VITE_API_URL` in frontend `.env`

## Production Considerations

Before deploying to production:

1. **Email Service Integration**
   - Set up SendGrid, AWS SES, or similar
   - Update `email.service.ts` with real implementation
   - Configure DNS records (SPF, DKIM, DMARC)

2. **Security Enhancements**
   - Use HTTPS for all connections
   - Set secure environment variables
   - Enable CSRF protection
   - Implement proper session management

3. **Database**
   - Use connection pooling
   - Set up database backups
   - Configure read replicas for scaling

4. **Monitoring**
   - Set up error tracking (Sentry)
   - Configure application monitoring
   - Set up alerts for failed registrations

## Support

For issues or questions, refer to:
- [BRD.md](../docs/BRD.md) - Business requirements
- [stories.md](../docs/stories.md) - User stories and acceptance criteria
- [tasks.md](../docs/tasks.md) - Task breakdown
