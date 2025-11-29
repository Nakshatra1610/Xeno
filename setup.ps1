# Setup Script for Xeno Shopify Platform
# PowerShell script to install all dependencies

Write-Host "🚀 Setting up Xeno Shopify Data Ingestion & Insights Service" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js installation
Write-Host "📦 Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check npm installation
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📁 Installing dependencies for all packages..." -ForegroundColor Yellow
Write-Host ""

# Install database dependencies
Write-Host "1️⃣  Installing database dependencies..." -ForegroundColor Cyan
Set-Location -Path "database"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install database dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Database dependencies installed" -ForegroundColor Green
Set-Location -Path ".."

Write-Host ""

# Install backend dependencies
Write-Host "2️⃣  Installing backend dependencies..." -ForegroundColor Cyan
Set-Location -Path "backend"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
Set-Location -Path ".."

Write-Host ""

# Install frontend dependencies
Write-Host "3️⃣  Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location -Path "frontend"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
Set-Location -Path ".."

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "✨ Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Configure environment variables in each package:" -ForegroundColor White
Write-Host "   - database/.env (DATABASE_URL)" -ForegroundColor Gray
Write-Host "   - backend/.env (All backend variables)" -ForegroundColor Gray
Write-Host "   - frontend/.env (NEXT_PUBLIC_API_URL)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Set up the database:" -ForegroundColor White
Write-Host "   cd database" -ForegroundColor Gray
Write-Host "   npm run generate" -ForegroundColor Gray
Write-Host "   npm run push" -ForegroundColor Gray
Write-Host "   npm run seed (optional)" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Start the development servers:" -ForegroundColor White
Write-Host "   Terminal 1: cd backend && npm run dev" -ForegroundColor Gray
Write-Host "   Terminal 2: cd frontend && npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "📖 For detailed instructions, see docs/QUICKSTART.md" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
