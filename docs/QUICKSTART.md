# Quick Start Guide

This guide will help you get the Xeno Shopify Insights Platform up and running in minutes.

## Prerequisites

- Node.js 18 or higher
- PostgreSQL database
- Shopify development store

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Environment

Create a `.env` file:

```bash
cp .env.example .env
```

Update the following in `.env`:

```env
# Required
DATABASE_URL="postgresql://user:password@localhost:5432/xeno_shopify"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# Get from Shopify
SHOPIFY_WEBHOOK_SECRET="your-webhook-secret-from-shopify"

# For scheduled sync
CRON_SECRET="any-random-secret-string"
```

## Step 3: Set Up Database

```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

## Step 4: Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Step 5: Create Your First Tenant

1. Go to `/register`
2. Fill in the form:
   - Your email and password
   - Store name
   - Shopify domain (e.g., `mystore.myshopify.com`)
   - Shopify access token (from your Shopify app)

## Step 6: Set Up Shopify Webhooks

In your Shopify app settings, add these webhook endpoints:

```
http://localhost:3000/api/webhooks/customers
http://localhost:3000/api/webhooks/orders
http://localhost:3000/api/webhooks/products
http://localhost:3000/api/webhooks/carts/abandoned
```

For local testing, use [ngrok](https://ngrok.com):

```bash
ngrok http 3000
# Use the ngrok URL for webhooks
```

## Step 7: Test the Integration

1. Create a test customer in Shopify
2. Create a test order
3. Check your dashboard for data

Or use the manual sync button in the dashboard!

## Common Issues

### Database Connection Error

```bash
# Check PostgreSQL is running
psql -U postgres

# Verify DATABASE_URL format
postgresql://username:password@host:5432/database
```

### Prisma Client Not Generated

```bash
npx prisma generate
```

### Webhooks Not Working

- Check ngrok is running
- Verify webhook URLs in Shopify
- Check SHOPIFY_WEBHOOK_SECRET matches

## Next Steps

- Read [README.md](./README.md) for full documentation
- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment guide
- Review [API_DOCS.md](./API_DOCS.md) for API reference

## Getting Help

- Check the documentation
- Review error logs in console
- Open an issue on GitHub

Happy coding! 🚀
