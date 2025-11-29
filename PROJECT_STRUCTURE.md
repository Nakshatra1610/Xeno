# Xeno Shopify Data Ingestion & Insights Service

## Project Overview

This is a comprehensive, production-ready monorepo containing a multi-tenant Shopify data ingestion and analytics platform. The project is structured into three main packages: **frontend**, **backend**, and **database**.

---

## 🏗️ Monorepo Structure

```
xeno/
│
├── frontend/                         # Next.js Frontend Dashboard (Port 3000)
│   ├── app/                          # App Router pages
│   │   ├── dashboard/page.tsx        # Main analytics dashboard
│   │   ├── login/page.tsx            # Login page
│   │   ├── register/page.tsx         # Multi-tenant registration
│   │   ├── layout.tsx                # Root layout with SessionProvider
│   │   ├── providers.tsx             # Client-side providers
│   │   ├── page.tsx                  # Home/redirect page
│   │   └── globals.css               # Global styles
│   ├── lib/                          # Frontend utilities
│   ├── middleware.ts                 # Route protection
│   ├── package.json                  # Frontend dependencies
│   ├── next.config.js                # API proxy configuration
│   ├── tsconfig.json                 # TypeScript config
│   ├── tailwind.config.ts            # TailwindCSS config
│   ├── postcss.config.js             # PostCSS config
│   ├── .env.example                  # Environment template
│   └── README.md                     # Frontend documentation
│
├── backend/                          # Next.js API Backend (Port 3001)
│   ├── app/api/                      # API routes
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts    # NextAuth handler
│   │   │   └── register/route.ts         # Tenant registration API
│   │   ├── webhooks/
│   │   │   ├── customers/route.ts        # Customer webhook handler
│   │   │   ├── orders/route.ts           # Order webhook handler
│   │   │   ├── products/route.ts         # Product webhook handler
│   │   │   └── carts/abandoned/route.ts  # Cart abandonment webhook
│   │   ├── analytics/route.ts            # Analytics data API
│   │   └── sync/
│   │       ├── route.ts                  # Scheduled sync (cron)
│   │       └── manual/route.ts           # Manual sync trigger
│   ├── lib/
│   │   ├── auth.ts                   # NextAuth configuration
│   │   ├── prisma.ts                 # Prisma client singleton
│   │   ├── shopify-utils.ts          # HMAC verification utilities
│   │   └── shopify-sync.ts           # Shopify API service class
│   ├── package.json                  # Backend dependencies
│   ├── next.config.js                # CORS and API config
│   ├── tsconfig.json                 # TypeScript config with database path
│   ├── .env.example                  # Environment template
│   └── README.md                     # Backend documentation
│
├── database/                         # Database Layer
│   ├── prisma/
│   │   └── schema.prisma             # Prisma schema (7 models)
│   ├── lib/
│   │   └── prisma.ts                 # Prisma client
│   ├── seed.ts                       # Database seeder with sample data
│   ├── package.json                  # Database dependencies
│   ├── tsconfig.json                 # TypeScript config
│   ├── .env.example                  # Environment template
│   └── README.md                     # Database documentation
│
├── docs/                             # Documentation
│   ├── API_DOCS.md                   # Complete API reference
│   ├── ARCHITECTURE.md               # System architecture deep dive
│   ├── DEPLOYMENT.md                 # Platform-specific deployment guides
│   ├── DEMO_SCRIPT.md                # 7-minute video demo structure
│   ├── QUICKSTART.md                 # 5-minute setup guide
│   ├── PROJECT_SUMMARY.md            # Comprehensive project overview
│   ├── SUBMISSION_CHECKLIST.md       # Pre-submission verification
│   └── CONTRIBUTING.md               # Development guidelines
│
├── README.md                         # Main project README
└── .gitignore                        # Git ignore rules
```

---

## 📦 Package Details

### 1. Frontend (`/frontend`)

**Purpose**: User-facing web application with authentication and analytics dashboard

**Technology Stack**:
- Next.js 14 (App Router)
- React 18
- TypeScript
- TailwindCSS
- Recharts (data visualization)
- NextAuth.js (authentication client)
- Axios (HTTP client)

**Key Features**:
- Email/password authentication
- Multi-tenant registration form
- Analytics dashboard with KPIs and charts
- Date range filtering
- Real-time data sync button
- Responsive design
- Protected routes via middleware

**Port**: 3000 (development)

**Environment Variables**:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
```

---

### 2. Backend (`/backend`)

**Purpose**: API server handling authentication, webhooks, data sync, and analytics

**Technology Stack**:
- Next.js 14 API Routes
- NextAuth.js (authentication server)
- Prisma Client
- Shopify Admin API
- TypeScript
- HMAC-SHA256 verification
- Node-cron (future)

**Key Features**:
- RESTful API endpoints
- Webhook handlers with signature verification
- Shopify API integration with pagination
- Multi-tenant session management
- Analytics data aggregation
- Scheduled and manual sync
- CORS configuration

**Port**: 3001 (development)

**Environment Variables**:
```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3001
SHOPIFY_WEBHOOK_SECRET=your-webhook-secret
CRON_SECRET=your-cron-secret
ALLOWED_ORIGINS=http://localhost:3000
```

**API Endpoints**:
- Authentication: `/api/auth/*`
- Webhooks: `/api/webhooks/*`
- Analytics: `/api/analytics`
- Sync: `/api/sync`, `/api/sync/manual`

---

### 3. Database (`/database`)

**Purpose**: Database schema, client, and seed data management

**Technology Stack**:
- PostgreSQL
- Prisma ORM
- TypeScript
- bcryptjs (password hashing)

**Database Models** (7 total):
1. **Tenant**: Multi-tenant configuration
   - Fields: `id`, `name`, `shopifyDomain` (unique), `shopifyAccessToken`, `createdAt`, `updatedAt`

2. **User**: Authentication and authorization
   - Fields: `id`, `email` (unique), `name`, `password`, `role`, `tenantId`, `createdAt`, `updatedAt`

3. **Customer**: Shopify customer data
   - Fields: `id`, `tenantId`, `shopifyCustomerId`, `email`, `firstName`, `lastName`, `totalSpent`, `ordersCount`, `tags`, timestamps

4. **Order**: Order information
   - Fields: `id`, `tenantId`, `shopifyOrderId`, `orderNumber`, `customerId`, `email`, `financialStatus`, `fulfillmentStatus`, `totalPrice`, `subtotalPrice`, `totalTax`, `currency`, `billingAddress` (JSON), `shippingAddress` (JSON), timestamps

5. **OrderItem**: Line items for orders
   - Fields: `id`, `tenantId`, `orderId`, `shopifyLineItemId`, `productId`, `title`, `quantity`, `price`, timestamps

6. **Product**: Product catalog
   - Fields: `id`, `tenantId`, `shopifyProductId`, `title`, `vendor`, `productType`, `status`, `tags`, timestamps

7. **CustomEvent**: Event tracking (cart abandonment, etc.)
   - Fields: `id`, `tenantId`, `eventType`, `customerId`, `metadata` (JSON), timestamp

**Key Features**:
- Composite unique indexes (tenantId + shopifyId)
- Multi-tenant data isolation
- Optimized queries with indexes
- Enums for type safety
- JSON fields for flexible data

**Environment Variables**:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/xeno_shopify
```

---

## 🔄 Data Flow

### 1. Webhook Flow (Real-time)
```
Shopify Event → Backend Webhook Handler → HMAC Verification → 
Database Upsert → Success Response
```

### 2. Scheduled Sync Flow (Every 6 hours)
```
Cron Job → Backend /api/sync → ShopifyService → 
Fetch All Data → Database Upsert → Log Results
```

### 3. Manual Sync Flow
```
User Clicks Sync → Frontend → POST /api/sync/manual → 
ShopifyService → Database Upsert → UI Update
```

### 4. Analytics Flow
```
User Selects Date Range → Frontend → GET /api/analytics → 
Prisma Aggregations → JSON Response → Charts Render
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Shopify development store

### Setup Steps

1. **Clone and install**:
   ```bash
   git clone <repo>
   cd xeno
   
   # Install all packages
   cd database && npm install
   cd ../backend && npm install
   cd ../frontend && npm install
   ```

2. **Configure environment**:
   ```bash
   # Copy .env.example to .env in each folder
   # Edit with your credentials
   ```

3. **Set up database**:
   ```bash
   cd database
   npm run generate
   npm run push
   npm run seed
   ```

4. **Run development**:
   ```bash
   # Terminal 1
   cd backend && npm run dev
   
   # Terminal 2
   cd frontend && npm run dev
   ```

5. **Access**:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001
   - Database: `cd database && npm run studio`

---

## 📊 Database Schema Diagram

```
┌─────────────┐
│   Tenant    │
├─────────────┤
│ id          │◄────────┐
│ name        │         │
│ domain      │         │
└─────────────┘         │
                        │
┌─────────────┐         │
│    User     │         │
├─────────────┤         │
│ id          │         │
│ email       │         │
│ tenantId    │─────────┤
└─────────────┘         │
                        │
┌─────────────┐         │
│  Customer   │         │
├─────────────┤         │
│ id          │◄────┐   │
│ tenantId    │─────┼───┤
│ shopifyId   │     │   │
│ totalSpent  │     │   │
└─────────────┘     │   │
                    │   │
┌─────────────┐     │   │
│   Order     │     │   │
├─────────────┤     │   │
│ id          │     │   │
│ tenantId    │─────┼───┤
│ customerId  │─────┘   │
│ totalPrice  │         │
└─────────────┘         │
       │                │
       │ 1:N            │
       ▼                │
┌─────────────┐         │
│ OrderItem   │         │
├─────────────┤         │
│ id          │         │
│ tenantId    │─────────┤
│ orderId     │         │
│ productId   │─────┐   │
└─────────────┘     │   │
                    │   │
┌─────────────┐     │   │
│  Product    │     │   │
├─────────────┤     │   │
│ id          │◄────┘   │
│ tenantId    │─────────┘
│ shopifyId   │
└─────────────┘
```

---

## 🧪 Testing Checklist

Before submission:

- [ ] All packages install successfully
- [ ] Database migrations run
- [ ] Seed data populates correctly
- [ ] Backend starts on port 3001
- [ ] Frontend starts on port 3000
- [ ] User can register a new tenant
- [ ] User can login
- [ ] Dashboard loads with data
- [ ] Charts render correctly
- [ ] Date filtering works
- [ ] Manual sync triggers successfully
- [ ] Webhooks verify HMAC correctly
- [ ] Multi-tenant data isolation verified

---

## 📖 Documentation Index

| Document | Purpose |
|----------|---------|
| [README.md](README.md) | Main project overview |
| [frontend/README.md](frontend/README.md) | Frontend setup and features |
| [backend/README.md](backend/README.md) | Backend API documentation |
| [database/README.md](database/README.md) | Database schema and setup |
| [docs/QUICKSTART.md](docs/QUICKSTART.md) | 5-minute setup guide |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design deep dive |
| [docs/API_DOCS.md](docs/API_DOCS.md) | Complete API reference |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Deployment guides |

---

## 🛠️ Development Commands

### Database
```bash
cd database
npm run generate    # Generate Prisma client
npm run migrate     # Run migrations
npm run push        # Push schema (dev)
npm run studio      # Open Prisma Studio
npm run seed        # Seed sample data
```

### Backend
```bash
cd backend
npm run dev         # Development server (port 3001)
npm run build       # Production build
npm start           # Production server
npm run lint        # Run ESLint
```

### Frontend
```bash
cd frontend
npm run dev         # Development server (port 3000)
npm run build       # Production build
npm start           # Production server
npm run lint        # Run ESLint
```

---

## 🚢 Deployment

### Option 1: Vercel (Recommended)
- Deploy frontend and backend separately
- Configure environment variables
- Enable cron jobs for backend

### Option 2: Railway
- Single deployment with monorepo support
- Managed PostgreSQL included
- Auto-deploy from Git

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.

---

## 📄 License

Developed for Xeno FDE Internship Assignment.

---

**Built with ❤️ by Raghu for Xeno**
