# Quick Reference Guide

## Project Structure

```
xeno/
├── frontend/          # Dashboard UI (Port 3000)
├── backend/           # API Server (Port 3001)
├── database/          # Database Layer
├── docs/              # Documentation
├── README.md          # Main documentation
├── PROJECT_STRUCTURE.md  # Detailed structure
├── setup.ps1          # Windows setup script
└── setup.sh           # Unix setup script
```

## Quick Commands

### Initial Setup (One-time)

**Windows:**
```powershell
.\setup.ps1
```

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

### Environment Configuration

1. **Database** (`database/.env`)
   ```env
   DATABASE_URL="postgresql://user:pass@localhost:5432/xeno_shopify"
   ```

2. **Backend** (`backend/.env`)
   ```env
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="your-secret"
   NEXTAUTH_URL="http://localhost:3001"
   SHOPIFY_WEBHOOK_SECRET="your-secret"
   CRON_SECRET="your-secret"
   ALLOWED_ORIGINS="http://localhost:3000"
   ```

3. **Frontend** (`frontend/.env`)
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:3001"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="same-as-backend"
   ```

### Database Setup

```bash
cd database
npm run generate    # Generate Prisma client
npm run push        # Create database tables
npm run seed        # Add sample data (optional)
```

### Run Development

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### Access Points

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Database Studio: `cd database && npm run studio`

### Default Login (if seeded)

- Email: `demo@example.com`
- Password: `demo123`

## Development Workflow

1. **Make changes** to code in respective folders
2. **Test locally** on ports 3000/3001
3. **Commit changes** to git
4. **Deploy** to Vercel/Railway

## Package Commands

### Database
```bash
npm run generate    # Generate Prisma client
npm run migrate     # Run migrations
npm run push        # Push schema (dev)
npm run studio      # Open GUI
npm run seed        # Seed data
```

### Backend
```bash
npm run dev         # Dev server
npm run build       # Build
npm start           # Production
```

### Frontend
```bash
npm run dev         # Dev server
npm run build       # Build
npm start           # Production
```

## Deployment

### Vercel (Recommended)

**Frontend:**
```bash
cd frontend
vercel
```

**Backend:**
```bash
cd backend
vercel
```

### Railway

1. Connect GitHub repo
2. Select `backend` or `frontend` folder
3. Configure environment variables
4. Deploy

## Troubleshooting

### Port already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Database connection error
- Check DATABASE_URL in both backend and database .env
- Ensure PostgreSQL is running
- Verify credentials

### Prisma client not generated
```bash
cd database
npm run generate
```

### Module not found errors
```bash
# In the specific package folder
npm install
```

## Documentation

- [README.md](README.md) - Main overview
- [docs/QUICKSTART.md](docs/QUICKSTART.md) - 5-min setup
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - System design
- [docs/API_DOCS.md](docs/API_DOCS.md) - API reference
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) - Deploy guides
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Detailed structure

## Support

For issues or questions about the Xeno FDE assignment, refer to the comprehensive documentation in the `/docs` folder.

---

**Happy Coding! 🚀**
