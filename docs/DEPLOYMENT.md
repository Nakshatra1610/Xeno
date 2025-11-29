# Deployment Guide

This guide covers deployment options for the Xeno Shopify Insights Platform.

## Prerequisites

Before deployment, ensure you have:

- [ ] GitHub repository with your code
- [ ] PostgreSQL database URL
- [ ] Shopify app credentials
- [ ] Domain name (optional but recommended)

## Option 1: Vercel (Recommended)

### Advantages
- Zero-config deployment
- Automatic HTTPS
- Edge network (global CDN)
- Built-in preview deployments
- Free tier available

### Steps

1. **Prepare Repository**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create Vercel Account**
   - Visit [vercel.com](https://vercel.com)
   - Sign up with GitHub

3. **Import Project**
   - Click "Add New Project"
   - Select your repository
   - Framework preset: **Next.js**

4. **Configure Environment Variables**
   
   Add these in Vercel dashboard:
   ```
   DATABASE_URL=postgresql://user:password@host:5432/database
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=https://your-domain.vercel.app
   SHOPIFY_WEBHOOK_SECRET=your-webhook-secret
   CRON_SECRET=your-cron-secret
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project.vercel.app`

6. **Set Up Database**
   
   **Option A: Vercel Postgres**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login
   vercel login
   
   # Add Postgres
   vercel postgres create
   ```

   **Option B: External PostgreSQL (Railway, Supabase, etc.)**
   - Create database on your provider
   - Copy connection string
   - Add as `DATABASE_URL` in Vercel

7. **Run Migrations**
   ```bash
   # Using Vercel CLI
   vercel env pull .env.local
   npx prisma db push
   ```

8. **Configure Cron Jobs** (Optional)
   
   Create `vercel.json`:
   ```json
   {
     "crons": [{
       "path": "/api/sync",
       "schedule": "0 */6 * * *"
     }]
   }
   ```

9. **Update Shopify Webhooks**
   - Go to your Shopify app settings
   - Update webhook URLs to your Vercel domain

## Option 2: Railway

### Advantages
- Includes managed PostgreSQL
- Simple pricing
- Good for full-stack apps
- Auto-deploy from GitHub

### Steps

1. **Create Railway Account**
   - Visit [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add PostgreSQL**
   - In your project, click "New"
   - Select "Database" → "PostgreSQL"
   - Railway will provision a database

4. **Configure Environment Variables**
   
   Railway auto-sets `DATABASE_URL`. Add others:
   ```
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=https://your-app.railway.app
   SHOPIFY_WEBHOOK_SECRET=your-webhook-secret
   CRON_SECRET=your-cron-secret
   ```

5. **Configure Build**
   
   Railway auto-detects Next.js. Ensure `package.json` has:
   ```json
   {
     "scripts": {
       "build": "prisma generate && next build",
       "start": "next start"
     }
   }
   ```

6. **Deploy**
   - Click "Deploy"
   - Railway builds and deploys automatically

7. **Run Migrations**
   ```bash
   # Install Railway CLI
   npm i -g @railway/cli
   
   # Login
   railway login
   
   # Link project
   railway link
   
   # Run migration
   railway run npx prisma db push
   ```

8. **Set Up Cron** (External)
   
   Use cron-job.org or EasyCron:
   ```
   URL: https://your-app.railway.app/api/sync
   Method: POST
   Headers: Authorization: Bearer YOUR_CRON_SECRET
   Schedule: Every 6 hours
   ```

## Option 3: Render

### Steps

1. **Create Render Account**
   - Visit [render.com](https://render.com)

2. **Create Web Service**
   - New → Web Service
   - Connect GitHub repository

3. **Configure Service**
   ```
   Name: xeno-shopify-insights
   Environment: Node
   Build Command: npm install && npx prisma generate && npm run build
   Start Command: npm start
   ```

4. **Add PostgreSQL**
   - New → PostgreSQL
   - Copy Internal Database URL

5. **Set Environment Variables**
   - Add all variables from `.env.example`
   - Use Internal Database URL for `DATABASE_URL`

6. **Deploy**
   - Render builds and deploys automatically

## Post-Deployment Checklist

### 1. Verify Deployment

- [ ] Visit your deployed URL
- [ ] Check that homepage redirects to login
- [ ] Test registration flow
- [ ] Test login

### 2. Set Up First Tenant

- [ ] Register a new account
- [ ] Use your Shopify credentials
- [ ] Verify tenant is created in database

### 3. Configure Shopify Webhooks

Update webhook URLs in Shopify:
```
https://your-domain.com/api/webhooks/customers
https://your-domain.com/api/webhooks/orders
https://your-domain.com/api/webhooks/products
https://your-domain.com/api/webhooks/carts/abandoned
```

### 4. Test Webhooks

- [ ] Create a test customer in Shopify
- [ ] Create a test order
- [ ] Check database for new records
- [ ] View data in dashboard

### 5. Test Manual Sync

- [ ] Login to dashboard
- [ ] Trigger manual sync (if implemented)
- [ ] Verify data appears

### 6. Set Up Monitoring

- [ ] Configure Sentry or error tracking
- [ ] Set up uptime monitoring
- [ ] Configure alerting

## Database Providers

### Vercel Postgres
- **Pros**: Integrated with Vercel, easy setup
- **Cons**: Limited free tier
- **Pricing**: Pay as you go

### Railway PostgreSQL
- **Pros**: Included with Railway, generous free tier
- **Cons**: Tied to Railway platform
- **Pricing**: $5/month after free tier

### Supabase
- **Pros**: Free tier, good UI, realtime features
- **Cons**: Separate platform
- **Pricing**: Free tier, then $25/month

### Neon
- **Pros**: Serverless, generous free tier
- **Cons**: Newer platform
- **Pricing**: Free tier, then pay as you go

### Connection String Format
```
postgresql://username:password@host:port/database?sslmode=require
```

## Custom Domain Setup

### Vercel
1. Go to project settings → Domains
2. Add your domain
3. Configure DNS records as instructed
4. Update `NEXTAUTH_URL` to your domain

### Railway
1. Go to project settings → Domains
2. Add custom domain
3. Configure DNS CNAME record
4. Update `NEXTAUTH_URL`

## SSL/HTTPS

All deployment platforms provide automatic HTTPS:
- Vercel: Automatic Let's Encrypt
- Railway: Automatic SSL
- Render: Automatic SSL

No additional configuration needed.

## Environment-Specific Configuration

### Development
```env
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
```

### Production
```env
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
```

## Troubleshooting

### Build Fails

**Issue**: Prisma client not generated
```bash
# Solution: Ensure postinstall script in package.json
"postinstall": "prisma generate"
```

**Issue**: TypeScript errors
```bash
# Check tsconfig.json is present
# Ensure all dependencies installed
npm install
```

### Database Connection Issues

**Issue**: Can't connect to database
- Check `DATABASE_URL` is correct
- Verify database is accessible
- Check SSL mode: add `?sslmode=require`

### Webhook Not Working

**Issue**: Webhooks return 401
- Verify `SHOPIFY_WEBHOOK_SECRET` matches Shopify
- Check HMAC verification logic

**Issue**: Webhooks return 404
- Verify webhook URLs are correct
- Check deployment is live

### Dashboard Not Loading Data

**Issue**: No data in dashboard
- Check database has records
- Verify tenant ID in session
- Check API route responses

## Scaling Considerations

### Horizontal Scaling
- Vercel: Automatic
- Railway: Manual configuration
- Render: Auto-scaling available

### Database Scaling
- Add read replicas for heavy queries
- Consider connection pooling (PgBouncer)
- Monitor query performance

### Cost Optimization
- Use appropriate plan tiers
- Monitor resource usage
- Optimize database queries
- Implement caching

## Backup Strategy

### Database Backups

**Automated** (Recommended):
- Vercel Postgres: Built-in backups
- Railway: Daily backups in paid plans
- Supabase: Daily backups

**Manual**:
```bash
# PostgreSQL dump
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

### Code Backups
- GitHub repository (primary)
- Regular commits and tags
- Release branches for production

## Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use platform secret management
   - Rotate secrets regularly

2. **Database**
   - Use strong passwords
   - Enable SSL connections
   - Limit network access

3. **API Keys**
   - Store in environment variables
   - Use separate keys per environment
   - Monitor usage

4. **Authentication**
   - Use strong `NEXTAUTH_SECRET`
   - Implement rate limiting
   - Enable 2FA (future)

## Monitoring Setup

### Application Monitoring

**Sentry** (Recommended):
```bash
npm install @sentry/nextjs

# Configure in next.config.js
```

**Vercel Analytics**:
- Enable in Vercel dashboard
- View performance metrics

### Uptime Monitoring

**Options**:
- UptimeRobot (free)
- Pingdom
- StatusCake

**Configuration**:
- Monitor: `https://your-domain.com`
- Interval: 5 minutes
- Alert: Email/SMS on downtime

### Log Management

**Vercel**:
- View logs in dashboard
- Real-time tailing

**Railway**:
- View logs in project dashboard
- Download log archives

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run lint
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: vercel/actions/deploy@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

## Performance Optimization

1. **Image Optimization**
   - Use Next.js Image component
   - Configure image domains

2. **Code Splitting**
   - Already handled by Next.js
   - Use dynamic imports for heavy components

3. **Caching**
   - Configure Next.js cache headers
   - Use CDN for static assets

4. **Database**
   - Add indexes for common queries
   - Use connection pooling
   - Implement query caching (Redis)

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
