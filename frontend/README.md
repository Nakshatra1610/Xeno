# Frontend Dashboard

This folder contains the frontend dashboard for the Xeno Shopify Data Ingestion Service.

## Structure

```
frontend/
├── app/
│   ├── dashboard/
│   │   └── page.tsx              # Main dashboard
│   ├── login/
│   │   └── page.tsx              # Login page
│   ├── register/
│   │   └── page.tsx              # Registration page
│   ├── layout.tsx                # Root layout
│   ├── providers.tsx             # Client providers
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── lib/                          # Shared utilities
├── middleware.ts                 # Route protection
├── package.json
├── next.config.js                # Next.js config with API proxy
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
└── .env.example
```

## Features

### Dashboard
- **KPI Cards**: Total customers, orders, revenue, avg order value
- **Charts**: 
  - Revenue trend (Area Chart)
  - Customer growth (Line Chart)
  - Orders by date (Bar Chart)
- **Date Filtering**: Custom date range selection
- **Top Customers**: Ranked by total spent
- **Manual Sync**: Trigger Shopify data sync

### Authentication
- Login with email/password
- Multi-tenant registration
- Session management with NextAuth
- Protected routes via middleware

### UI/UX
- Responsive design with TailwindCSS
- Loading states
- Error handling
- Real-time data updates

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit with your configuration
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

The frontend will be available at http://localhost:3000

## Environment Variables

Required variables (see `.env.example`):

- `NEXT_PUBLIC_API_URL` - Backend API URL (http://localhost:3001)
- `NEXTAUTH_URL` - Frontend URL (http://localhost:3000)
- `NEXTAUTH_SECRET` - Must match backend secret

## API Integration

The frontend connects to the backend API via:

1. **Next.js Rewrites**: Configured in `next.config.js` to proxy `/api/*` to backend
2. **Axios**: HTTP client for API calls
3. **NextAuth**: Session management

### API Calls

```typescript
// Analytics
const response = await fetch(`/api/analytics?from=${fromDate}&to=${toDate}`)
const data = await response.json()

// Manual Sync
await fetch('/api/sync/manual', { method: 'POST' })

// Authentication
await signIn('credentials', { email, password })
```

## Components

### Dashboard Page (`app/dashboard/page.tsx`)

Main analytics dashboard with:
- Date range selector
- 4 KPI metric cards
- 3 interactive charts (Recharts)
- Top 5 customers list
- Manual sync button

### Login Page (`app/login/page.tsx`)

Authentication form with:
- Email input
- Password input
- Form validation
- Error display
- Redirect to dashboard on success

### Register Page (`app/register/page.tsx`)

Multi-tenant registration with:
- User details (email, password, name)
- Tenant details (name, Shopify domain)
- Shopify access token
- Form validation

## Styling

Uses TailwindCSS with custom configuration:

- Responsive utilities
- Custom color palette
- Component classes
- Dark mode support (future)

## Development

Run in development mode:

```bash
npm run dev
```

Build for production:

```bash
npm run build
npm start
```

## Deployment

Deploy to Vercel (recommended):

```bash
vercel
```

Or other platforms:
- Netlify
- Cloudflare Pages
- AWS Amplify

See `/docs/DEPLOYMENT.md` for detailed instructions.

## Testing

Before deployment, test:

1. ✅ Login flow
2. ✅ Registration flow
3. ✅ Dashboard loads data
4. ✅ Charts render correctly
5. ✅ Date filtering works
6. ✅ Manual sync triggers
7. ✅ Responsive on mobile
8. ✅ Protected routes redirect

## Performance

Optimizations:
- Next.js App Router for SSR
- React Server Components where possible
- Client components only when needed
- Image optimization
- Code splitting
- Lazy loading
