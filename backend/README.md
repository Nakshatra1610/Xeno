# Backend API

This folder contains the backend API services for the Xeno Shopify Data Ingestion Service.

## Structure

```
backend/
├── app/
│   └── api/
│       ├── auth/
│       │   ├── [...nextauth]/route.ts    # NextAuth handler
│       │   └── register/route.ts         # Tenant registration
│       ├── webhooks/
│       │   ├── customers/route.ts        # Customer webhooks
│       │   ├── orders/route.ts           # Order webhooks
│       │   ├── products/route.ts         # Product webhooks
│       │   └── carts/abandoned/route.ts  # Cart abandonment
│       ├── analytics/route.ts            # Analytics endpoint
│       └── sync/
│           ├── route.ts                  # Scheduled sync
│           └── manual/route.ts           # Manual sync trigger
├── lib/
│   ├── auth.ts                           # NextAuth config
│   ├── prisma.ts                         # Prisma client
│   ├── shopify-utils.ts                  # HMAC verification
│   └── shopify-sync.ts                   # Shopify API service
├── package.json
├── next.config.js
├── tsconfig.json
└── .env.example
```

## Features

### Authentication
- NextAuth.js with JWT sessions
- Credentials provider with bcrypt
- Role-based access control
- Multi-tenant session context

### Webhooks
- HMAC signature verification
- Real-time data sync from Shopify
- Upsert operations for idempotency
- Event tracking

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new tenant
- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout

#### Webhooks (Shopify → Backend)
- `POST /api/webhooks/customers` - Customer create/update
- `POST /api/webhooks/orders` - Order create/update
- `POST /api/webhooks/products` - Product create/update
- `POST /api/webhooks/carts/abandoned` - Cart abandonment

#### Analytics
- `GET /api/analytics?from=YYYY-MM-DD&to=YYYY-MM-DD` - Get dashboard data

#### Sync
- `POST /api/sync` - Scheduled sync (cron job)
- `POST /api/sync/manual` - Manual sync trigger

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit with your credentials
   ```

3. **Link database**:
   Ensure the database is set up first (see `/database/README.md`)

4. **Run development server**:
   ```bash
   npm run dev
   ```

The API will be available at http://localhost:3001

## Environment Variables

Required variables (see `.env.example`):

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Secret for JWT encryption
- `NEXTAUTH_URL` - Backend URL
- `SHOPIFY_WEBHOOK_SECRET` - Webhook signature verification
- `CRON_SECRET` - Protect cron endpoints
- `ALLOWED_ORIGINS` - CORS configuration

## Shopify Integration

### Webhook Configuration

In your Shopify admin, configure webhooks pointing to your backend:

1. Customers create/update → `https://your-backend.com/api/webhooks/customers`
2. Orders create/update → `https://your-backend.com/api/webhooks/orders`
3. Products create/update → `https://your-backend.com/api/webhooks/products`

### API Sync

The ShopifyService class handles:
- Paginated data fetching (250 items/page)
- Rate limiting respect
- Error handling and retries
- Multi-tenant processing

## Security

- HMAC-SHA256 webhook verification
- Session-based authentication
- Tenant data isolation
- CORS protection
- Environment-based secrets

## Development

Run in development mode with hot reload:

```bash
npm run dev
```

Build for production:

```bash
npm run build
npm start
```

## Deployment

Deploy to your preferred platform:
- Vercel (recommended for cron jobs)
- Railway
- Render
- AWS/GCP/Azure

See `/docs/DEPLOYMENT.md` for detailed instructions.
