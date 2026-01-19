# Quick Start Guide

## Running the Application

### 1. Start the Database
Make sure PostgreSQL is running with the database `money_manager` created.

### 2. Start the Backend
```bash
cd backend

# Install dependencies (first time only)
npm install

# Generate Prisma client (first time only)
npm run prisma:generate

# Run migrations (first time only)
npm run migrate

# Start development server
npm run dev
```

Backend will be available at: http://localhost:3000

### 3. Start the Frontend
```bash
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

Frontend will be available at: http://localhost:5173

## Test the Registration System

1. Navigate to http://localhost:5173/register
2. Fill in the registration form with:
   - Email: `test@example.com`
   - Password: `TestPassword123!` (must meet all requirements)
   - Confirm Password: `TestPassword123!`
3. Submit the form
4. Check backend console for verification email link
5. Copy the verification URL and open in browser
6. Account will be activated!

## Available API Endpoints

- `POST /api/v1/auth/register` - Register new user
- `GET /api/v1/auth/verify-email?token=xxx` - Verify email
- `POST /api/v1/auth/resend-verification` - Resend verification email
- `GET /health` - Health check

## Features Implemented ✅

### US-1: Secure Account Registration
- ✅ Email validation and uniqueness check
- ✅ Password complexity requirements (12+ chars, uppercase, lowercase, number, special char)
- ✅ Password strength indicator (real-time visual feedback)
- ✅ Password confirmation matching
- ✅ bcrypt password hashing (salt rounds = 12)
- ✅ Email verification with 24-hour expiration
- ✅ Rate limiting (5 registrations per IP per hour)
- ✅ Clear error messages
- ✅ Responsive UI with loading states

For detailed setup instructions, see [REGISTRATION_SETUP.md](REGISTRATION_SETUP.md)
