# Database Layer

This folder contains the database schema, migrations, and seed data for the Xeno Shopify Data Ingestion Service.

## Structure

```
database/
├── prisma/
│   └── schema.prisma        # Prisma schema with all models
├── lib/
│   └── prisma.ts            # Prisma client singleton
├── seed.ts                  # Database seed script
├── package.json             # Database dependencies
├── tsconfig.json            # TypeScript config
└── .env.example             # Environment template
```

## Models

- **Tenant**: Multi-tenant configuration with Shopify credentials
- **User**: Authentication and authorization
- **Customer**: Shopify customer data
- **Order**: Order information with relationships
- **OrderItem**: Line items for each order
- **Product**: Product catalog
- **CustomEvent**: Event tracking (cart abandonment, etc.)

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your DATABASE_URL
   ```

3. **Generate Prisma Client**:
   ```bash
   npm run generate
   ```

4. **Push schema to database**:
   ```bash
   npm run push
   ```

5. **Seed sample data** (optional):
   ```bash
   npm run seed
   ```

## Available Scripts

- `npm run generate` - Generate Prisma Client
- `npm run migrate` - Run database migrations
- `npm run push` - Push schema to database (dev)
- `npm run studio` - Open Prisma Studio GUI
- `npm run seed` - Seed database with sample data

## Database Schema

The schema uses PostgreSQL with the following key features:

- **Multi-tenancy**: All tables include `tenantId` for data isolation
- **Indexes**: Optimized for common queries (tenantId, email, dates)
- **Composite Keys**: Unique constraints on (tenantId + shopifyId)
- **JSON Fields**: Flexible storage for addresses and metadata
- **Enums**: Type-safe status fields

## Prisma Studio

Open a visual database editor:

```bash
npm run studio
```

This will launch Prisma Studio at http://localhost:5555
