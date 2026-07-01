# =====================================================
# DEPLOYMENT CLEANUP SCRIPT - Health-Connect
# =====================================================
# Run this script to prepare your project for deployment
# This will remove sensitive files from Git tracking

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Health-Connect Deployment Cleanup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to project root
$projectRoot = "c:\Users\Home\Desktop\INTERNSHIP\Intern- Health-Connect(working video, chat)\Health-Connect"
Set-Location $projectRoot

Write-Host "[1/5] Checking Git status..." -ForegroundColor Yellow
git status

Write-Host ""
Write-Host "[2/5] Removing temporary files..." -ForegroundColor Yellow

# Remove temp.txt if exists
if (Test-Path "temp.txt") {
    Remove-Item "temp.txt" -Force
    Write-Host "  ✓ Removed temp.txt" -ForegroundColor Green
} else {
    Write-Host "  ℹ temp.txt not found (already removed)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "[3/5] Removing .env from Git tracking..." -ForegroundColor Yellow

# Remove backend/.env from Git (keep local copy)
if (Test-Path "backend\.env") {
    git rm --cached backend\.env 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Removed backend/.env from Git tracking" -ForegroundColor Green
        Write-Host "  ℹ Local copy preserved for development" -ForegroundColor Gray
    } else {
        Write-Host "  ℹ backend/.env not tracked in Git" -ForegroundColor Gray
    }
} else {
    Write-Host "  ℹ backend/.env not found" -ForegroundColor Gray
}

# Remove frontend/.env from Git if exists
if (Test-Path "frontend\.env") {
    git rm --cached frontend\.env 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✓ Removed frontend/.env from Git tracking" -ForegroundColor Green
    } else {
        Write-Host "  ℹ frontend/.env not tracked in Git" -ForegroundColor Gray
    }
} else {
    Write-Host "  ℹ frontend/.env not found" -ForegroundColor Gray
}

Write-Host ""
Write-Host "[4/5] Creating local development environment files..." -ForegroundColor Yellow

# Create frontend/.env.local for development (if doesn't exist)
if (-not (Test-Path "frontend\.env.local")) {
    Copy-Item "frontend\.env.example" "frontend\.env.local"
    Write-Host "  ✓ Created frontend/.env.local from template" -ForegroundColor Green
    Write-Host "  ℹ Update VITE_BACKEND_URL in this file for local dev" -ForegroundColor Gray
} else {
    Write-Host "  ℹ frontend/.env.local already exists" -ForegroundColor Gray
}

Write-Host ""
Write-Host "[5/5] Staging changes for commit..." -ForegroundColor Yellow

# Stage all changes
git add .

Write-Host "  ✓ Changes staged" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Cleanup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Review changes:" -ForegroundColor White
Write-Host "   git status" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Commit changes:" -ForegroundColor White
Write-Host "   git commit -m `"Prepare for deployment - remove sensitive files`"" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Push to GitHub:" -ForegroundColor White
Write-Host "   git push origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Follow deployment guide:" -ForegroundColor White
Write-Host "   - Backend: Deploy on Render (see DEPLOYMENT_GUIDE.md)" -ForegroundColor Gray
Write-Host "   - Frontend: Deploy on Vercel (see DEPLOYMENT_GUIDE.md)" -ForegroundColor Gray
Write-Host ""

Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "  - DEPLOYMENT_SUMMARY.md (Quick overview)" -ForegroundColor Gray
Write-Host "  - DEPLOYMENT_GUIDE.md (Detailed tutorial)" -ForegroundColor Gray
Write-Host "  - DEPLOYMENT_CHECKLIST.md (Step-by-step checklist)" -ForegroundColor Gray
Write-Host ""

Write-Host "⚠️  SECURITY REMINDER:" -ForegroundColor Red
Write-Host "  Consider changing MongoDB password from 'ppk' to something stronger" -ForegroundColor Yellow
Write-Host "  for production deployment!" -ForegroundColor Yellow
Write-Host ""
