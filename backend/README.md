# Express.js Backend

This is the **proper Express.js backend** for the Xeno Shopify Data Ingestion & Insights Service, built according to the assignment specifications.

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe development
- **Prisma** - ORM for database access
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **node-cron** - Scheduled tasks
- **Axios** - HTTP client for Shopify API

## 📁 Structure

```
backend-express/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── webhook.controller.ts
│   │   ├── analytics.controller.ts
│   │   └── sync.controller.ts
│   ├── routes/               # API routes
│   │   ├── auth.routes.ts
│   │   ├── webhook.routes.ts
│   │   ├── analytics.routes.ts
│   │   └── sync.routes.ts
│   ├── middleware/           # Custom middleware
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   ├── services/             # Business logic
│   │   └── shopify-sync.service.ts
│   ├── config/               # Configuration
│   │   └── database.ts
│   └── index.ts              # Entry point
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## 🚀 Setup

### 1. Install Dependencies

```bash
cd backend-express
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=3001
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/xeno_shopify"
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="7d"
SHOPIFY_WEBHOOK_SECRET="your-webhook-secret"
CRON_SECRET="your-cron-secret"
ALLOWED_ORIGINS="http://localhost:3000"
```

### 3. Run Development Server

```bash
npm run dev
```

Server runs on **http://localhost:3001**

### 4. Build for Production

```bash
npm run build
npm start
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new tenant
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Webhooks (Shopify → Backend)
- `POST /api/webhooks/customers` - Customer events
- `POST /api/webhooks/orders` - Order events
- `POST /api/webhooks/products` - Product events
- `POST /api/webhooks/carts/abandoned` - Cart abandonment

### Analytics (Protected)
- `GET /api/analytics?from=YYYY-MM-DD&to=YYYY-MM-DD` - Get dashboard data

### Sync (Protected)
- `POST /api/sync/manual` - Manual sync trigger
- `POST /api/sync` - Scheduled sync (cron job with secret)

## 🔐 Authentication

Uses JWT tokens with httpOnly cookies:

```javascript
// Login returns token
{
  "token": "eyJhbGc...",
  "user": { ... }
}

// Include in requests via:
// 1. Cookie (automatic)
// 2. Authorization: Bearer <token>
```

## 🔄 Shopify Integration

### Webhook Verification
All webhooks verify HMAC-SHA256 signatures:
```typescript
X-Shopify-Hmac-SHA256: base64_encoded_hash
```

### Scheduled Sync
Cron job runs every 6 hours:
```typescript
cron.schedule('0 */6 * * *', syncAllTenants);
```

## 🧪 Testing

### Test Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demo123"}'
```

### Test Analytics
```bash
curl http://localhost:3001/api/analytics \
  -H "Authorization: Bearer <your-token>"
```

## 🚢 Deployment

### Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Heroku
```bash
# Create app
heroku create xeno-backend

# Set env vars
heroku config:set DATABASE_URL="..."
heroku config:set JWT_SECRET="..."

# Deploy
git push heroku main
```

## 📊 Features

✅ RESTful API with Express.js
✅ TypeScript for type safety  
✅ JWT authentication with cookies
✅ HMAC webhook verification
✅ Multi-tenant data isolation
✅ Prisma ORM integration
✅ Scheduled cron jobs
✅ Rate limiting
✅ Security headers (Helmet)
✅ CORS configuration
✅ Request logging (Morgan)
✅ Error handling middleware

---

**This is the correct Express.js backend as per assignment requirements!** 🎯
