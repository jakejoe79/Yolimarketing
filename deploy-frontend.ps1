# Deploy Yolimarketing Frontend to Vercel (Windows PowerShell)
# This script builds and deploys the frontend

$BACKEND_URL = "https://yolimarketing-production.up.railway.app"

Write-Host "=== Yolimarketing Frontend Deployment ===" -ForegroundColor Cyan
Write-Host ""

# Navigate to frontend
cd frontend

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm ci

# Build production frontend
Write-Host "Building production frontend..." -ForegroundColor Yellow
npm run build

# Deploy to Vercel
Write-Host "Deploying to Vercel..." -ForegroundColor Yellow
vercel --prod --confirm

Write-Host ""
Write-Host "🎁 Deployment complete!" -ForegroundColor Green
Write-Host "Send this link to Liz:" -ForegroundColor Green
Write-Host ""
