# Demo Script for Xeno Shopify Insights Platform

This script will guide you through creating a demo video for the assignment submission.

---

## 📹 Demo Video Structure (Max 7 Minutes)

### Introduction (30 seconds)

**Script**:
> "Hello! I'm [Your Name], and this is my submission for the Xeno FDE Internship Assignment. I've built a multi-tenant Shopify data ingestion and insights service that helps retailers integrate and analyze their customer data. Let me walk you through what I've built."

**Actions**:
- Show yourself on camera
- Display the project title

---

## Part 1: Architecture Overview (1 minute)

**Script**:
> "Let me start with the high-level architecture. This is a full-stack Next.js application with a PostgreSQL database. It supports multiple Shopify stores as tenants, each with isolated data. The system ingests data through Shopify webhooks in real-time and also has a scheduled sync as a backup. Users can view comprehensive analytics through an authenticated dashboard."

**Actions**:
- Show architecture diagram from README
- Point out key components:
  - Shopify stores → Webhooks → API Routes
  - Database with multi-tenant design
  - Analytics dashboard
  - Scheduled sync service

---

## Part 2: Database Design (45 seconds)

**Script**:
> "The database is designed for multi-tenancy with tenant isolation. Each tenant represents a Shopify store. All data - customers, orders, products - are linked to a tenant ID. This ensures complete data isolation between stores. I'm using Prisma ORM for type-safe queries and PostgreSQL for reliable data storage."

**Actions**:
- Show `prisma/schema.prisma` file
- Highlight key models: Tenant, Customer, Order, Product
- Point out `tenantId` field and unique constraints

---

## Part 3: Live Demo - Registration (1 minute)

**Script**:
> "Let me show you the application in action. First, I'll register a new tenant. This creates both the tenant record and the admin user who can access the dashboard."

**Actions**:
1. Navigate to `/register`
2. Fill in the form:
   - Name: "Demo User"
   - Email: "demo@example.com"
   - Password: "••••••••"
   - Store Name: "Demo Shopify Store"
   - Shopify Domain: "demo-store.myshopify.com"
   - Access Token: "shpat_xxxxx"
3. Click "Register"
4. Show successful redirect to login

---

## Part 4: Live Demo - Login & Dashboard (1.5 minutes)

**Script**:
> "Now I'll log in and show you the analytics dashboard. This dashboard provides comprehensive insights into the store's performance."

**Actions**:
1. Login with credentials
2. Show dashboard loading
3. Highlight each section:
   
   **Summary Cards**:
   - "Here we have four key metrics: Total Customers, Total Orders, Total Revenue, and Average Order Value"
   
   **Date Filter**:
   - "Users can filter data by date range"
   - Change date range
   - Click "Apply Filter"
   - Show data updates
   
   **Charts**:
   - "Revenue Trend shows daily revenue over the last 7 days using an area chart"
   - "Customer Growth tracks new signups over the last 30 days"
   - "Orders Overview displays order counts by date in a bar chart"
   - "Top 5 Customers ranks customers by total spend"

---

## Part 5: Shopify Integration (1 minute)

**Script**:
> "Behind the scenes, this connects to Shopify in two ways. First, webhooks provide real-time updates. Whenever a customer is created, an order is placed, or a product is updated in Shopify, we receive an instant notification and update our database. Second, we have a scheduled sync that runs every 6 hours as a backup to ensure data consistency."

**Actions**:
1. Show webhook endpoint code (`app/api/webhooks/customers/route.ts`)
2. Highlight HMAC verification for security
3. Show sync service code (`lib/shopify-sync.ts`)
4. Explain pagination handling

---

## Part 6: Code Walkthrough (1.5 minutes)

**Script**:
> "Let me walk you through some key technical decisions. For multi-tenancy, I used a shared database with tenant discriminators. All queries are automatically filtered by tenant ID to ensure data isolation. For authentication, I implemented NextAuth with email and password credentials. The analytics API aggregates data efficiently using Prisma's aggregation functions and raw SQL for complex queries. The dashboard is built with React, TypeScript, and Recharts for beautiful visualizations."

**Actions**:

1. **Multi-tenancy** (`lib/auth.ts`):
   ```typescript
   // Show how tenantId is added to session
   ```

2. **Analytics API** (`app/api/analytics/route.ts`):
   ```typescript
   // Show tenant filtering
   // Show aggregation queries
   ```

3. **Dashboard** (`app/dashboard/page.tsx`):
   ```typescript
   // Show chart components
   // Show data fetching with date filters
   ```

---

## Part 7: Trade-offs & Decisions (45 seconds)

**Script**:
> "I made several architectural decisions. I chose a shared database for cost-effectiveness, though this requires careful query filtering. I implemented both webhooks and scheduled sync for reliability - webhooks for real-time updates, sync as a backup. I used Next.js for its excellent developer experience and built-in API routes. For the database, PostgreSQL with Prisma provides type safety and excellent querying capabilities."

**Actions**:
- Show README section on trade-offs
- Mention scalability considerations

---

## Conclusion (30 seconds)

**Script**:
> "To productionize this, I would add comprehensive testing, monitoring with Sentry, implement rate limiting, add caching with Redis, and enhance security with 2FA. The code is well-documented, deployed [mention platform], and ready to scale. Thank you for watching, and I look forward to discussing this further!"

**Actions**:
- Show README briefly
- Display deployment URL
- Show GitHub repository

---

## 🎬 Recording Tips

### Before Recording

1. **Prepare Shopify Store**:
   - Create development store
   - Add 10-15 dummy customers
   - Create 20-30 dummy orders
   - Add 5-10 products
   - Generate some test events

2. **Seed Database**:
   ```bash
   # Run manual sync to populate data
   curl -X POST http://localhost:3000/api/sync/manual
   ```

3. **Clean Up UI**:
   - Close unnecessary browser tabs
   - Clean desktop
   - Set browser to full screen
   - Increase font size for readability

4. **Test Run**:
   - Do a practice recording
   - Check audio levels
   - Ensure smooth screen transitions

### During Recording

1. **Camera Setup**:
   - Good lighting
   - Clean background
   - Frame yourself properly

2. **Screen Recording**:
   - Use OBS Studio or Loom
   - Record at 1080p
   - Enable microphone
   - Show face in corner (optional)

3. **Presentation**:
   - Speak clearly and confidently
   - Maintain steady pace
   - Avoid filler words ("um", "uh")
   - Smile and be enthusiastic

4. **Code Display**:
   - Use readable font size (14-16pt)
   - Syntax highlighting enabled
   - Dark theme (easier on eyes)
   - Zoom in on important code

### After Recording

1. **Edit**:
   - Trim dead space
   - Add intro/outro titles
   - Add timestamps in description
   - Export at high quality

2. **Upload**:
   - YouTube (unlisted)
   - Loom
   - Google Drive
   - Include link in README

---

## 📊 Demo Data Setup

### Create Test Data (If Needed)

```sql
-- Add test customer
INSERT INTO "Customer" (
  id, "shopifyCustomerId", "tenantId", email, 
  "firstName", "lastName", "ordersCount", "totalSpent",
  "createdAt", "updatedAt"
) VALUES (
  'test1', '123456', 'your-tenant-id', 'test@example.com',
  'John', 'Doe', 5, 499.99,
  NOW() - INTERVAL '30 days', NOW()
);

-- Add test orders
-- (Repeat for multiple orders with different dates)
```

### Or Use Shopify's Test Data

1. Use Shopify's bulk import
2. Generate random customer data
3. Create orders with various statuses
4. Add products across different categories

---

## 🎯 Key Points to Emphasize

1. **Technical Skills**:
   - Full-stack development
   - Database design
   - API integration
   - Authentication
   - Data visualization

2. **Problem Solving**:
   - Multi-tenancy strategy
   - Data synchronization approach
   - Error handling
   - Security considerations

3. **Best Practices**:
   - Type safety with TypeScript
   - ORM usage (Prisma)
   - Code organization
   - Documentation

4. **Completeness**:
   - All required features
   - Bonus features (cart abandonment)
   - Deployment ready
   - Well documented

---

## ⏱️ Time Allocation

- Introduction: 30s
- Architecture: 1m
- Database: 45s
- Registration Demo: 1m
- Dashboard Demo: 1m 30s
- Integration Explanation: 1m
- Code Walkthrough: 1m 30s
- Trade-offs: 45s
- Conclusion: 30s

**Total: ~7 minutes**

---

## 📝 Checklist Before Recording

- [ ] Application deployed and accessible
- [ ] Database populated with test data
- [ ] All features working correctly
- [ ] README and documentation complete
- [ ] GitHub repository public
- [ ] Clean code (no console.logs, comments)
- [ ] Environment variables properly configured
- [ ] Audio equipment tested
- [ ] Screen recording software ready
- [ ] Demo script reviewed
- [ ] Practice run completed

---

## 🔗 Resources to Show

1. **Live Application**: https://your-app.vercel.app
2. **GitHub Repository**: https://github.com/yourusername/xeno
3. **Documentation**:
   - README.md
   - ARCHITECTURE.md
   - API_DOCS.md
   - DEPLOYMENT.md

---

Good luck with your demo! 🚀
