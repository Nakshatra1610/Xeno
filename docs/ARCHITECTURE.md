# Architecture Documentation

## System Architecture Overview

This document provides a detailed explanation of the Xeno Shopify Insights Platform architecture.

## Components

### 1. Frontend Layer (Next.js App Router)

**Technology**: React 18, Next.js 14, TypeScript

**Pages**:
- `/` - Home (redirects to login/dashboard)
- `/login` - Authentication page
- `/register` - Tenant onboarding
- `/dashboard` - Main analytics dashboard

**Features**:
- Server-side rendering (SSR) for SEO
- Client-side state management with React hooks
- Real-time session management
- Responsive design with TailwindCSS

### 2. API Layer (Next.js API Routes)

**Webhook Handlers** (`/api/webhooks/*`):
- Receive Shopify events
- Verify HMAC signatures
- Process and store data

**Analytics API** (`/api/analytics`):
- Aggregate data per tenant
- Support date range filtering
- Return dashboard metrics

**Sync API** (`/api/sync`):
- Manual trigger endpoint
- Scheduled cron endpoint
- Full data synchronization

**Authentication API** (`/api/auth/*`):
- NextAuth configuration
- Registration endpoint
- Session management

### 3. Business Logic Layer

**ShopifyService** (`lib/shopify-sync.ts`):
- Interfaces with Shopify Admin API
- Handles pagination
- Performs full data sync
- Manages rate limits

**Authentication** (`lib/auth.ts`):
- NextAuth configuration
- JWT token management
- Session callbacks

**Utilities** (`lib/shopify-utils.ts`):
- HMAC verification
- Domain extraction
- Helper functions

### 4. Data Layer

**Prisma ORM**:
- Type-safe database queries
- Migration management
- Multi-tenant data isolation

**PostgreSQL Database**:
- Relational data storage
- ACID compliance
- Indexing for performance

## Data Flow

### Webhook Flow

```
Shopify Event
    ↓
Webhook Endpoint (API Route)
    ↓
HMAC Verification
    ↓
Tenant Lookup
    ↓
Data Validation
    ↓
Prisma ORM
    ↓
PostgreSQL Database
```

### Dashboard Data Flow

```
User Request (Dashboard)
    ↓
Session Validation
    ↓
API Route (/api/analytics)
    ↓
Tenant Filter Applied
    ↓
Database Aggregation
    ↓
Data Transformation
    ↓
Response to Client
    ↓
Chart Rendering (Recharts)
```

### Sync Flow

```
Cron Trigger / Manual Request
    ↓
Get Active Tenants
    ↓
For Each Tenant:
    ├─ Sync Products
    ├─ Sync Customers
    └─ Sync Orders
        ↓
Shopify Admin API
    ↓
Handle Pagination
    ↓
Upsert Data (Prisma)
    ↓
PostgreSQL Database
```

## Multi-Tenancy Strategy

### Data Isolation

**Approach**: Shared database with tenant discriminator

**Implementation**:
- All data tables have `tenantId` foreign key
- Database queries always filtered by `tenantId`
- Session includes tenant information
- Middleware ensures tenant context

**Advantages**:
- Cost-effective for many tenants
- Easy to manage and backup
- Simple schema changes

**Trade-offs**:
- Requires careful query filtering
- Potential for data leaks if not careful
- Limited ability to customize per tenant

### Alternative Approaches (Future)

1. **Schema per Tenant**: Separate schemas in same database
2. **Database per Tenant**: Complete isolation
3. **Hybrid**: Small tenants share, large tenants separate

## Security Architecture

### Authentication

```
User Login
    ↓
Credentials Provider (NextAuth)
    ↓
Password Verification (bcryptjs)
    ↓
JWT Token Generation
    ↓
Secure HTTP-only Cookie
    ↓
Session Storage
```

### Webhook Security

```
Shopify Webhook
    ↓
Extract HMAC Header
    ↓
Compute HMAC (SHA256)
    ↓
Compare Signatures
    ↓
If Valid: Process
If Invalid: Reject (401)
```

### API Security

- **Session-based Auth**: NextAuth sessions for dashboard
- **Bearer Token**: Cron endpoints require secret
- **Tenant Isolation**: All queries scoped to tenant
- **Input Validation**: Zod schemas (to be added)
- **Rate Limiting**: To be implemented

## Database Schema Design

### Key Design Decisions

1. **Composite Unique Keys**: `(tenantId, shopifyId)` ensures uniqueness per tenant
2. **Cascade Deletes**: When tenant deleted, all data removed
3. **JSON Fields**: Flexible storage for addresses and event data
4. **Decimal Type**: Accurate monetary calculations
5. **Indexes**: Optimized for common queries

### Relationships

```
Tenant (1:N)
    ├─ User
    ├─ Customer (1:N) → Order
    ├─ Product (1:N) → OrderItem
    ├─ Order (1:N) → OrderItem
    └─ CustomEvent
```

## Performance Considerations

### Database Optimization

1. **Indexes**:
   - `tenantId` on all tables
   - `shopifyCreatedAt` for date queries
   - `email` for customer lookup

2. **Query Optimization**:
   - Use aggregations for analytics
   - Limit result sets
   - Use pagination for large datasets

3. **Caching Strategy** (Future):
   - Redis for session storage
   - Cache analytics results
   - Invalidate on webhook updates

### API Optimization

1. **Pagination**: Shopify API calls use 250 items/page
2. **Parallel Processing**: Can sync multiple tenants concurrently
3. **Background Jobs**: Heavy operations run async

## Scalability

### Current Limitations

- Single server deployment
- No horizontal scaling
- Database can be bottleneck

### Future Improvements

1. **Horizontal Scaling**:
   - Stateless API design
   - Load balancer distribution
   - Database read replicas

2. **Caching Layer**:
   - Redis for session storage
   - Cache dashboard analytics
   - CDN for static assets

3. **Queue System**:
   - Bull/BullMQ for background jobs
   - Webhook processing queue
   - Retry logic for failures

4. **Database Sharding**:
   - Partition by tenant ID
   - Separate read/write databases

## Monitoring & Observability

### Recommended Tools

1. **Application Monitoring**: Sentry, DataDog
2. **Log Aggregation**: LogDNA, Papertrail
3. **Metrics**: Prometheus + Grafana
4. **Uptime**: Pingdom, StatusCake

### Key Metrics to Track

- API response times
- Database query performance
- Webhook processing rate
- Sync success/failure rates
- User session duration
- Error rates by endpoint

## Deployment Architecture

### Vercel Deployment

```
GitHub Repository
    ↓
Vercel Build Process
    ├─ Install Dependencies
    ├─ Build Next.js App
    └─ Generate Prisma Client
        ↓
Edge Network Distribution
    ↓
Serverless Functions (API Routes)
    ↓
External PostgreSQL
```

### Railway Deployment

```
GitHub Repository
    ↓
Railway Build
    ├─ Docker Container
    ├─ Internal Network
    └─ Managed PostgreSQL
        ↓
Single Region Deployment
```

## API Integration Patterns

### Webhook Pattern

**Advantages**:
- Real-time updates
- Event-driven architecture
- No polling required

**Challenges**:
- Must handle failures
- Requires public endpoint
- Webhook verification needed

### Polling Pattern (Scheduled Sync)

**Advantages**:
- Guaranteed consistency
- Can recover from missed webhooks
- Controlled timing

**Challenges**:
- Delayed updates
- API rate limits
- Higher resource usage

### Hybrid Approach (Implemented)

- Webhooks for real-time updates
- Scheduled sync as backup
- Manual sync option for users

## Error Handling Strategy

### Current Implementation

1. Try-catch blocks in API routes
2. Console logging for errors
3. Generic error responses to clients

### Recommended Improvements

1. **Structured Logging**:
   ```typescript
   logger.error('Webhook processing failed', {
     tenantId,
     webhookType: 'customer',
     error: error.message,
     timestamp: new Date()
   })
   ```

2. **Retry Logic**:
   - Exponential backoff
   - Dead letter queue
   - Alert on repeated failures

3. **Circuit Breaker**:
   - Stop calling failing services
   - Automatic recovery

## Future Architecture Considerations

### Microservices

Breaking monolith into services:
- **Auth Service**: User authentication
- **Ingestion Service**: Webhook processing
- **Analytics Service**: Data aggregation
- **Sync Service**: Shopify API integration

### Event-Driven Architecture

Using message queues (RabbitMQ, Kafka):
- Decouple webhook reception from processing
- Enable event replay
- Support multiple consumers

### GraphQL API

Replace REST with GraphQL:
- Flexible data fetching
- Reduced over-fetching
- Better client-server contract
