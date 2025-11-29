# Xeno Shopify Platform - Restructured

## ✅ Restructuring Complete!

Your project has been successfully reorganized into a well-structured monorepo with clear separation of concerns.

---

## 📁 New Project Structure

```
xeno/
│
├── 📂 frontend/                      # Next.js Frontend (Port 3000)
│   ├── app/                          # Pages & routes
│   │   ├── dashboard/                # Analytics dashboard
│   │   ├── login/                    # Login page
│   │   ├── register/                 # Registration page
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home page
│   │   ├── providers.tsx             # Client providers
│   │   └── globals.css               # Global styles
│   ├── lib/                          # Frontend utilities
│   ├── middleware.ts                 # Route protection
│   ├── package.json                  # Dependencies
│   ├── next.config.js                # Next.js config with API proxy
│   ├── tsconfig.json                 # TypeScript config
│   ├── tailwind.config.ts            # TailwindCSS config
│   ├── postcss.config.js             # PostCSS config
│   ├── vercel.json                   # Vercel deployment
│   ├── .env.example                  # Environment template
│   ├── .gitignore                    # Git ignore
│   └── README.md                     # Frontend docs
│
├── 📂 backend/                       # Next.js API Backend (Port 3001)
│   ├── app/api/                      # API routes
│   │   ├── auth/                     # Authentication endpoints
│   │   │   ├── [...nextauth]/route.ts    # NextAuth handler
│   │   │   └── register/route.ts         # Registration API
│   │   ├── webhooks/                 # Shopify webhooks
│   │   │   ├── customers/route.ts    # Customer events
│   │   │   ├── orders/route.ts       # Order events
│   │   │   ├── products/route.ts     # Product events
│   │   │   └── carts/abandoned/route.ts  # Cart abandonment
│   │   ├── analytics/route.ts        # Analytics API
│   │   └── sync/                     # Data sync
│   │       ├── route.ts              # Scheduled sync
│   │       └── manual/route.ts       # Manual sync
│   ├── lib/                          # Backend utilities
│   │   ├── auth.ts                   # NextAuth config
│   │   ├── prisma.ts                 # Prisma client
│   │   ├── shopify-sync.ts           # Shopify service
│   │   └── shopify-utils.ts          # HMAC verification
│   ├── package.json                  # Dependencies
│   ├── next.config.js                # Next.js config with CORS
│   ├── tsconfig.json                 # TypeScript config
│   ├── vercel.json                   # Vercel deployment + cron
│   ├── .env.example                  # Environment template
│   ├── .gitignore                    # Git ignore
│   └── README.md                     # Backend docs
│
├── 📂 database/                      # Database Layer
│   ├── prisma/                       # Prisma schema
│   │   └── schema.prisma             # 7 models (Tenant, User, Customer, etc.)
│   ├── lib/                          # Database utilities
│   │   └── prisma.ts                 # Prisma client singleton
│   ├── seed.ts                       # Sample data seeder
│   ├── package.json                  # Dependencies
│   ├── tsconfig.json                 # TypeScript config
│   ├── .env.example                  # Environment template
│   ├── .gitignore                    # Git ignore
│   └── README.md                     # Database docs
│
├── 📂 docs/                          # Comprehensive Documentation
│   ├── QUICKSTART.md                 # 5-minute setup guide
│   ├── ARCHITECTURE.md               # System architecture
│   ├── API_DOCS.md                   # API reference
│   ├── DEPLOYMENT.md                 # Deployment guides
│   ├── DEMO_SCRIPT.md                # Video demo structure
│   ├── PROJECT_SUMMARY.md            # Project overview
│   ├── SUBMISSION_CHECKLIST.md       # Pre-submission checklist
│   └── CONTRIBUTING.md               # Development guidelines
│
├── 📄 README.md                      # Main project documentation
├── 📄 PROJECT_STRUCTURE.md           # Detailed structure guide
├── 📄 QUICK_REFERENCE.md             # Quick command reference
├── 📄 .gitignore                     # Root Git ignore
├── 🔧 setup.ps1                      # Windows setup script
└── 🔧 setup.sh                       # Mac/Linux setup script
```

---

## 🎯 Key Improvements

### ✅ Separation of Concerns
- **Frontend**: Only UI components and client-side logic
- **Backend**: API routes, webhooks, and server-side logic
- **Database**: Schema, migrations, and seed data

### ✅ Independent Packages
Each folder (`frontend`, `backend`, `database`) is now a standalone package with:
- Its own `package.json`
- Its own `tsconfig.json`
- Its own `.env.example`
- Its own `README.md`
- Its own `.gitignore`

### ✅ Clear Dependencies
- **Frontend** depends on Backend API (via proxy)
- **Backend** depends on Database (via Prisma)
- **Database** is independent and can be used by both

### ✅ Easier Development
- Run packages independently
- Test components in isolation
- Deploy separately to different platforms
- Clear development workflow

### ✅ Better Documentation
- Main README for overview
- Package-specific READMEs for details
- Comprehensive docs folder
- Quick reference guide

---

## 🚀 Getting Started

### 1. Install Dependencies

**Option A - Automated (Recommended):**

Windows:
```powershell
.\setup.ps1
```

Mac/Linux:
```bash
chmod +x setup.sh
./setup.sh
```

**Option B - Manual:**
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
```

### 2. Configure Environment

Copy `.env.example` to `.env` in each package and configure:

**database/.env:**
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/xeno_shopify"
```

**backend/.env:**
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/xeno_shopify"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3001"
SHOPIFY_WEBHOOK_SECRET="your-webhook-secret"
CRON_SECRET="your-cron-secret"
ALLOWED_ORIGINS="http://localhost:3000"
```

**frontend/.env:**
```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="same-as-backend"
```

### 3. Set Up Database

```bash
cd database
npm run generate    # Generate Prisma client
npm run push        # Create tables
npm run seed        # Add sample data (optional)
```

### 4. Run Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

### 5. Access the Application

- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Prisma Studio**: `cd database && npm run studio`

---

## 📦 Package Overview

| Package | Purpose | Port | Main Tech |
|---------|---------|------|-----------|
| **frontend** | User interface & dashboard | 3000 | Next.js, React, TailwindCSS, Recharts |
| **backend** | API server & webhooks | 3001 | Next.js API, NextAuth, Shopify API |
| **database** | Data layer & schema | - | PostgreSQL, Prisma ORM |

---

## 🔄 Development Workflow

### Making Changes

1. **Frontend Changes**:
   - Edit files in `frontend/app/`
   - Hot reload at http://localhost:3000

2. **Backend Changes**:
   - Edit files in `backend/app/api/`
   - Restart server or use hot reload

3. **Database Changes**:
   - Edit `database/prisma/schema.prisma`
   - Run `npm run push` to update database
   - Run `npm run generate` to update client

### Testing

1. **Frontend**: Visit http://localhost:3000
2. **Backend API**: Use Postman or curl
3. **Database**: Use Prisma Studio

### Deployment

Each package can be deployed independently:

- **Frontend** → Vercel, Netlify, Cloudflare Pages
- **Backend** → Vercel, Railway, Render
- **Database** → Railway, Supabase, Neon

---

## 📚 Documentation

### Quick Access

- **New to the project?** → [README.md](README.md)
- **Want to get started fast?** → [docs/QUICKSTART.md](docs/QUICKSTART.md)
- **Need command reference?** → [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- **Understanding architecture?** → [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **API documentation?** → [docs/API_DOCS.md](docs/API_DOCS.md)
- **Deployment help?** → [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- **Detailed structure?** → [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

### Package Documentation

- **Frontend**: [frontend/README.md](frontend/README.md)
- **Backend**: [backend/README.md](backend/README.md)
- **Database**: [database/README.md](database/README.md)

---

## 🎓 What Changed?

### Before (Monolithic)
```
xeno/
├── app/                    # Mixed frontend & backend
├── lib/                    # Shared utilities
├── prisma/                 # Database
├── package.json            # All dependencies together
└── Many root-level configs
```

### After (Modular)
```
xeno/
├── frontend/               # UI only (Port 3000)
│   ├── app/                # Pages
│   ├── lib/                # Frontend utils
│   └── package.json        # Frontend deps
│
├── backend/                # API only (Port 3001)
│   ├── app/api/            # Endpoints
│   ├── lib/                # Backend utils
│   └── package.json        # Backend deps
│
├── database/               # Data layer
│   ├── prisma/             # Schema
│   └── package.json        # DB deps
│
└── docs/                   # All documentation
```

### Benefits

✅ **Clearer structure** - Each package has a single responsibility  
✅ **Independent deployment** - Deploy frontend/backend separately  
✅ **Easier testing** - Test components in isolation  
✅ **Better scalability** - Scale services independently  
✅ **Team collaboration** - Teams can work on different packages  
✅ **Maintainability** - Easier to understand and modify  

---

## 🚢 Next Steps

1. ✅ **Install dependencies** - Run `setup.ps1` or `setup.sh`
2. ✅ **Configure environment** - Edit `.env` files
3. ✅ **Set up database** - Run prisma commands
4. ✅ **Start dev servers** - Run both frontend and backend
5. ✅ **Test locally** - Verify everything works
6. ✅ **Deploy** - Push to Vercel/Railway
7. ✅ **Submit** - Follow docs/SUBMISSION_CHECKLIST.md

---

## 💡 Tips

- **Use the setup scripts** for quick installation
- **Read package READMEs** for specific details
- **Check QUICK_REFERENCE.md** for common commands
- **Follow docs/QUICKSTART.md** for fastest setup
- **Use Prisma Studio** for database visualization
- **Check docs/DEPLOYMENT.md** before deploying

---

## 🆘 Troubleshooting

### Port conflicts
```bash
# Kill process on port 3000/3001
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Database connection errors
- Verify DATABASE_URL in both `backend/.env` and `database/.env`
- Ensure PostgreSQL is running
- Check credentials

### Module not found
```bash
# In the affected package
npm install
```

### Prisma errors
```bash
cd database
npm run generate
```

---

## ✨ Summary

Your Xeno Shopify platform is now organized into a professional, production-ready monorepo structure with:

- ✅ 3 independent packages (frontend, backend, database)
- ✅ Clear separation of concerns
- ✅ Comprehensive documentation (10+ files)
- ✅ Setup automation scripts
- ✅ Independent deployment configs
- ✅ Package-specific READMEs
- ✅ Quick reference guides

**You're ready to develop, test, and deploy! 🚀**

---

**For detailed instructions, see [README.md](README.md) or [docs/QUICKSTART.md](docs/QUICKSTART.md)**
