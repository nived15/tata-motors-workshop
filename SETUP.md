# Money Manager Application - Setup Guide

## Overview

A secure, full-stack Money Manager application for tracking income with interactive dashboards and robust data security. Built with React, Node.js, PostgreSQL, and Redis.

## 📋 Prerequisites

- **Node.js** 18.x or higher
- **PostgreSQL** 15.x or higher
- **Redis** 7.x (optional, for caching)
- **npm** or **yarn** package manager
- **Docker** and **Docker Compose** (optional, for containerized setup)

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended for Quick Setup)

1. **Clone the repository**
   ```bash
   cd "c:\Users\nvelayudhan\Copilot Workshops\tata-motors-workshop"
   ```

2. **Copy environment files**
   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

3. **Start all services**
   ```bash
   docker-compose up -d
   ```

4. **Run database migrations**
   ```bash
   docker-compose exec backend npx prisma migrate deploy
   docker-compose exec backend npm run seed
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Database: localhost:5432

### Option 2: Local Development Setup

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and update:
   - `DATABASE_URL` - PostgreSQL connection string
   - `JWT_SECRET` - Secure random string for JWT
   - `REDIS_HOST` and `REDIS_PORT` - Redis configuration

4. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```

5. **Run database migrations**
   ```bash
   npm run migrate
   ```

6. **Seed the database** (creates default categories)
   ```bash
   npm run seed
   ```

7. **Start the backend server**
   ```bash
   npm run dev
   ```
   Backend runs on http://localhost:3000

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Update `VITE_API_URL` to point to your backend (default: http://localhost:3000/api/v1)

4. **Start the development server**
   ```bash
   npm run dev
   ```
   Frontend runs on http://localhost:5173

## 🗂️ Project Structure

```
tata-motors-workshop/
├── backend/                    # Node.js/Express API
│   ├── src/
│   │   ├── middleware/        # Auth, error handling, rate limiting
│   │   ├── utils/             # Utilities and helpers
│   │   └── server.ts          # Express server entry point
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── migrations/        # Database migrations
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/                   # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/        # React components
│   │   │   └── layout/        # Layout components
│   │   ├── services/          # API client
│   │   ├── store/             # Zustand state management
│   │   ├── types/             # TypeScript types
│   │   ├── App.tsx            # Root component
│   │   └── main.tsx           # Entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example
│
├── docs/                       # Documentation
│   ├── BRD.md                 # Business Requirements
│   └── stories.md             # User Stories
│
├── docker-compose.yml          # Docker orchestration
├── .github/workflows/          # CI/CD pipelines
└── README.md
```

## 🛠️ Available Scripts

### Backend

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests with coverage
- `npm run lint` - Lint code
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with default data

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code with Prettier

## 🔒 Security Features

- **Authentication**: JWT-based with refresh tokens
- **Multi-Factor Authentication (MFA)**: TOTP support
- **Password Hashing**: Bcrypt with 12 salt rounds
- **Rate Limiting**: Configurable API and auth endpoint limits
- **Data Encryption**: AES-256 for sensitive data
- **Audit Logging**: Complete transaction history tracking
- **Session Management**: Secure session handling with automatic timeout

## 🗄️ Database Schema

### Main Tables

- **users** - User accounts with authentication details
- **sessions** - Active user sessions and tokens
- **categories** - Income categories (default + custom)
- **transactions** - Income transaction records
- **audit_logs** - Comprehensive audit trail

See [backend/prisma/schema.prisma](backend/prisma/schema.prisma) for detailed schema.

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test                 # Run all tests
npm run test:watch       # Watch mode
```

### Frontend Testing
```bash
cd frontend
npm test                 # Run all tests
npm run test:ui          # UI test runner
npm run test:coverage    # Coverage report
```

## 📦 Deployment

### Production Build

1. **Backend**
   ```bash
   cd backend
   npm run build
   npm start
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm run build
   ```
   Serve the `dist/` folder with nginx or any static hosting service.

### Docker Production Deployment

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3000)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `REDIS_HOST` - Redis host
- `CORS_ORIGIN` - Allowed frontend origin

#### Frontend (.env)
- `VITE_API_URL` - Backend API URL
- `VITE_ENV` - Environment

## 📚 API Documentation

API documentation will be available at:
- Development: http://localhost:3000/api/docs
- Production: [Your production URL]/api/docs

(Swagger/OpenAPI documentation will be added)

## 🤝 Development Workflow

1. Create a feature branch from `develop`
2. Make changes and commit (follow Conventional Commits)
3. Write tests for new functionality
4. Ensure all tests pass
5. Create a Pull Request to `develop`
6. Code review and merge

## 📝 Roadmap

### MVP (Phase 1) - 3-4 months
- ✅ Project scaffolding
- ⏳ User authentication with MFA
- ⏳ Income transaction CRUD
- ⏳ Dashboard with charts
- ⏳ Category management
- ⏳ Data export (CSV/PDF)

### Post-MVP (Phase 2)
- Expense tracking
- Budget goals and alerts
- Advanced filtering and search
- Mobile applications

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
docker-compose ps

# View logs
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up -d
```

### Port Already in Use
```bash
# Find process using port 3000 (backend)
netstat -ano | findstr :3000

# Find process using port 5173 (frontend)
netstat -ano | findstr :5173

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

## 📞 Support

For issues and questions:
- Review documentation in `/docs` folder
- Check existing issues on GitHub
- Create a new issue with detailed description

## 📄 License

This project is licensed under the ISC License.

## 👥 Contributors

Built for Tata Motors Workshop - January 2026
