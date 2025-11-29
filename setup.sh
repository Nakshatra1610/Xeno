#!/bin/bash

# Setup Script for Xeno Shopify Platform
# Bash script to install all dependencies

echo "🚀 Setting up Xeno Shopify Data Ingestion & Insights Service"
echo "============================================================"
echo ""

# Check Node.js installation
echo "📦 Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Node.js version: $NODE_VERSION"

# Check npm installation
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

NPM_VERSION=$(npm --version)
echo "✅ npm version: $NPM_VERSION"

echo ""
echo "📁 Installing dependencies for all packages..."
echo ""

# Install database dependencies
echo "1️⃣  Installing database dependencies..."
cd database
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install database dependencies"
    exit 1
fi
echo "✅ Database dependencies installed"
cd ..

echo ""

# Install backend dependencies
echo "2️⃣  Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
echo "✅ Backend dependencies installed"
cd ..

echo ""

# Install frontend dependencies
echo "3️⃣  Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
echo "✅ Frontend dependencies installed"
cd ..

echo ""
echo "============================================================"
echo "✨ Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Configure environment variables in each package:"
echo "   - database/.env (DATABASE_URL)"
echo "   - backend/.env (All backend variables)"
echo "   - frontend/.env (NEXT_PUBLIC_API_URL)"
echo ""
echo "2. Set up the database:"
echo "   cd database"
echo "   npm run generate"
echo "   npm run push"
echo "   npm run seed (optional)"
echo ""
echo "3. Start the development servers:"
echo "   Terminal 1: cd backend && npm run dev"
echo "   Terminal 2: cd frontend && npm run dev"
echo ""
echo "📖 For detailed instructions, see docs/QUICKSTART.md"
echo "============================================================"
