# Xeno Shopify Data Ingestion & Insights Service

A production-ready, multi-tenant SaaS platform for ingesting Shopify store data and providing real-time analytics dashboards. Built as part of the Xeno FDE Internship Assignment.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)](https://www.prisma.io/)

## 🏗️ Project Structure

```
xeno/
├── frontend/                 # Next.js frontend dashboard (Port 3000)
│   ├── app/                  # Pages: dashboard, login, register
│   ├── lib/                  # Frontend utilities
│   ├── package.json
│   └── README.md
│
├── backend/                  # API backend services (Port 3001)
│   ├── app/api/              # Auth, webhooks, analytics, sync
│   ├── lib/                  # Shopify service, auth config
│   ├── package.json
│   └── README.md
│
├── database/                 # Database layer
│   ├── prisma/               # Schema with 7 models
│   ├── seed.ts               # Sample data
│   ├── package.json
│   └── README.md
│
├── docs/                     # Documentation (8 files)
│   ├── QUICKSTART.md         # 5-minute setup
│   ├── ARCHITECTURE.md       # System design
│   ├── API_DOCS.md           # API reference
│   └── DEPLOYMENT.md         # Deploy guides
│
├── README.md                 # This file
└── PROJECT_STRUCTURE.md      # Detailed structure guide
```

## ✨ Features

### Core Functionality
- ✅ **Multi-tenant Architecture**: Isolated data per Shopify store
- ✅ **Real-time Data Sync**: Webhook-based instant updates
- ✅ **Scheduled Sync**: Backup cron job every 6 hours
- ✅ **Analytics Dashboard**: KPIs, trends, and insights
- ✅ **Email Authentication**: Secure login with NextAuth.js
- ✅ **Role-based Access**: Admin and user roles

### Technical Highlights
- 🔐 HMAC-SHA256 webhook signature verification
- 🔄 Idempotent upsert operations
- 📊 Interactive charts with Recharts
- 🎨 Responsive UI with TailwindCSS
- 🛡️ Type-safe with TypeScript
- 🗄️ PostgreSQL with Prisma ORM
- ⚡ Next.js 14 App Router

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Shopify development store (free at [partners.shopify.com](https://partners.shopify.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd xeno
   ```

2. **Install all dependencies**
   ```bash
   # Database
   cd database
   npm install
   
   # Backend
   cd ../backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   cd ..
   ```

3. **Configure environment variables**
   ```bash
   # Database
   cd database
   cp .env.example .env
   # Edit .env with your DATABASE_URL
   
   # Backend
   cd ../backend
   cp .env.example .env
   # Edit .env with all required variables
   
   # Frontend
   cd ../frontend
   cp .env.example .env
   # Edit .env with NEXT_PUBLIC_API_URL
   cd ..
   ```

4. **Set up the database**
   ```bash
   cd database
   npm run generate      # Generate Prisma client
   npm run push          # Push schema to database
   npm run seed          # (Optional) Seed sample data
   cd ..
   ```

5. **Run the application**

   Open two separate terminals:

   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   # Backend runs on http://localhost:3001
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   # Frontend runs on http://localhost:3000
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Database UI: `cd database && npm run studio`

### Default Credentials (if seeded)
- Email: `demo@example.com`
- Password: `demo123`

## 📊 Architecture

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Shopify   │────────▶│   Backend    │────────▶│  PostgreSQL │
│    Store    │ Webhooks│   API        │  Prisma │  Database   │
└─────────────┘         └──────────────┘         └─────────────┘
                               │
                               │ REST API
                               ▼
                        ┌──────────────┐
                        │   Frontend   │
                        │  Dashboard   │
                        └──────────────┘
```

### Data Flow
1. **Shopify → Backend**: Real-time webhooks for customers, orders, products
2. **Backend → Database**: Validated and stored via Prisma ORM
3. **Frontend → Backend**: API calls for analytics data
4. **Backend → Shopify**: Scheduled sync for backup and initial load

## 📁 Package Details

| Package | Tech Stack | Port | Purpose |
|---------|-----------|------|---------|
| **Frontend** | Next.js 14, React, TailwindCSS, Recharts | 3000 | User interface with dashboard |
| **Backend** | Next.js API, NextAuth, Shopify API | 3001 | API endpoints and webhooks |
| **Database** | PostgreSQL, Prisma ORM | - | Data persistence (7 models) |

## 🔧 Environment Variables

### Database (`.env`)
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/xeno_shopify"
```

### Backend (`.env`)
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/xeno_shopify"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3001"
SHOPIFY_WEBHOOK_SECRET="your-webhook-secret"
CRON_SECRET="your-cron-secret"
ALLOWED_ORIGINS="http://localhost:3000"
```

### Frontend (`.env`)
```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="same-as-backend-secret"
```

## 📖 Documentation

Comprehensive documentation is available in the `/docs` folder:

- **[QUICKSTART.md](docs/QUICKSTART.md)**: 5-minute setup guide
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)**: Detailed system design
- **[API_DOCS.md](docs/API_DOCS.md)**: Complete API reference
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)**: Platform-specific deployment guides
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)**: Detailed project structure

## 🚢 Deployment

### Recommended Stack

- **Frontend**: Vercel (seamless Next.js integration)
- **Backend**: Vercel (with cron jobs) or Railway
- **Database**: Railway, Supabase, or Neon (managed PostgreSQL)

### Quick Deploy to Vercel

```bash
# Frontend
cd frontend
vercel

# Backend
cd backend
vercel
```

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.

## 🧪 Testing

### Test Scenarios
- ✅ User registration and login
- ✅ Dashboard loads with analytics
- ✅ Manual sync triggers Shopify data fetch
- ✅ Webhooks receive and process events
- ✅ Charts update with date filtering
- ✅ Multi-tenant data isolation

## 🛠️ Development Commands

### Database
```bash
cd database
npm run generate    # Generate Prisma client
npm run push        # Push schema to database
npm run studio      # Open Prisma Studio
npm run seed        # Seed sample data
```

### Backend
```bash
cd backend
npm run dev         # Development server
npm run build       # Production build
npm start           # Production server
```

### Frontend
```bash
cd frontend
npm run dev         # Development server
npm run build       # Production build
npm start           # Production server
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register tenant
- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout

### Webhooks
- `POST /api/webhooks/customers` - Customer events
- `POST /api/webhooks/orders` - Order events
- `POST /api/webhooks/products` - Product events
- `POST /api/webhooks/carts/abandoned` - Cart abandonment

### Analytics
- `GET /api/analytics?from=YYYY-MM-DD&to=YYYY-MM-DD` - Dashboard data

### Sync
- `POST /api/sync` - Scheduled sync (cron)
- `POST /api/sync/manual` - Manual sync trigger

## 🏆 Assignment Completion

This project fulfills all Xeno FDE Internship Assignment requirements:

- ✅ Shopify development store setup
- ✅ Multi-tenant data ingestion service
- ✅ PostgreSQL database with ORM (Prisma)
- ✅ Analytics dashboard with authentication
- ✅ Multiple metrics and trend charts
- ✅ Comprehensive documentation (8+ files)
- ✅ Deployment configuration
- ✅ Webhooks AND scheduler for data sync
- ✅ **Bonus**: Cart abandonment tracking

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TypeScript |
| Backend | Next.js API Routes, NextAuth.js |
| Database | PostgreSQL, Prisma ORM |
| Styling | TailwindCSS |
| Charts | Recharts |
| Auth | NextAuth.js with JWT |
| API | Shopify Admin API 2024-01 |
| Deployment | Vercel, Railway |

## 🤝 Contributing

See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for development guidelines.

## 📄 License

This project is developed as part of the Xeno FDE Internship Assignment.

## 👤 Author

**Raghu**
- GitHub: [@Nakshatra1610](https://github.com/Nakshatra1610)

## 🙏 Acknowledgments

- Xeno for the internship opportunity
- Shopify for excellent API documentation
- Next.js and Prisma teams



