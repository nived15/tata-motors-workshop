# Money Manager Application 💰

A secure, full-stack income tracking application with interactive dashboards and comprehensive data security features.

## 🎯 Overview

Money Manager is a greenfield financial tracking platform designed to help users manage their income with robust visualization and data security. The application prioritizes data integrity, security, and user experience to deliver a reliable financial management tool.

## ✨ Key Features

- **Secure Authentication**: JWT-based authentication with multi-factor authentication (MFA) support
- **Income Tracking**: Create, edit, and delete income transactions with comprehensive validation
- **Category Management**: Organize income with default and custom categories
- **Interactive Dashboard**: Visual insights with charts, graphs, and summary cards
- **Data Security**: End-to-end encryption, audit logging, and ACID-compliant transactions
- **Data Export**: Export transactions and reports in CSV/PDF formats
- **Responsive Design**: Mobile-first approach, functional on all screen sizes

## 🛠️ Technology Stack

### Backend
- **Framework**: Node.js with Express
- **Language**: TypeScript
- **Database**: PostgreSQL 15+ (ACID compliance)
- **ORM**: Prisma
- **Caching**: Redis
- **Authentication**: JWT with refresh tokens

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **API Client**: Axios with React Query
- **Charts**: Chart.js with react-chartjs-2
- **Styling**: Tailwind CSS
- **Form Management**: React Hook Form with Zod validation

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Testing**: Jest (backend), Vitest (frontend)

## 📁 Project Structure

```
tata-motors-workshop/
├── backend/              # Node.js/Express API
│   ├── src/
│   │   ├── middleware/  # Authentication, error handling, rate limiting
│   │   ├── utils/       # Utilities and helpers
│   │   └── server.ts    # Express server
│   └── prisma/          # Database schema and migrations
│
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API client
│   │   ├── store/       # State management
│   │   └── types/       # TypeScript types
│   └── public/
│
├── docs/                # Documentation
│   ├── BRD.md          # Business Requirements
│   └── stories.md      # User Stories
│
├── .github/
│   └── workflows/       # CI/CD pipelines
│
├── docker-compose.yml   # Docker orchestration
├── SETUP.md            # Detailed setup instructions
└── CONTRIBUTING.md     # Contribution guidelines
```

- PostgreSQL 15+
- Redis 7+ (optional)
- Docker & Docker Compose (optional)

### Option 1: Docker Compose (Recommended)

```bash
# Clone and navigate to the project
cd "c:\Users\nvelayudhan\Copilot Workshops\tata-motors-workshop"

# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start all services
docker-compose up -d

# Run migrations and seed
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npm run seed
```

Access the application:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

### Option 2: Local Development

See [SETUP.md](SETUP.md) for detailed local setup instructions.

## 📚 Documentation

- **[Setup Guide](SETUP.md)** - Complete setup and installation instructions
- **[Business Requirements](docs/BRD.md)** - Detailed business requirements and technical specifications
- **[User Stories](docs/stories.md)** - User stories and acceptance criteria
- **[Contributing Guidelines](CONTRIBUTING.md)** - How to contribute to the project
- **[Project Plan](PLAN.md)** - Development roadmap and risk assessment

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test
npm run test:watch

# Frontend tests
cd frontend
npm test
npm run test:coverage
```

## 🔒 Security Features

- End-to-end encryption (AES-256 at rest, TLS 1.3 in transit)
- Multi-factor authentication (TOTP)
- Password hashing with bcrypt (12 salt rounds)
- Rate limiting on all endpoints
- Comprehensive audit logging
- ACID-compliant database transactions
- Session management with automatic timeout

## 📊 Roadmap

### ✅ MVP (Phase 1) - 3-4 months
- [x] Project scaffolding and infrastructure
- [ ] User authentication with MFA
- [ ] Income transaction CRUD operations
- [ ] Dashboard with data visualization
- [ ] Category management system
- [ ] Data export functionality

### 🔜 Post-MVP (Phase 2)
- Expense tracking
- Budget planning and goals
- Advanced filtering and search
- Transaction import from CSV
- Mobile applications (iOS/Android)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Team

Built for Tata Motors Workshop - January 2026

## 📞 Support

- Review documentation in the `/docs` folder
- Check existing GitHub issues
- Create a new issue for bug reports or feature requests

---

**Note**: This is a greenfield project currently under active development. See the roadmap above for current status and upcoming features.