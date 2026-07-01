# 🗑️ Files to Remove Before Deployment

This file lists potentially unwanted files in your project that should be cleaned up before deployment.

## ✅ Files to Keep

- All source code files (`.js`, `.ts`, `.tsx`)
- Configuration files (`package.json`, `tsconfig.json`, `vite.config.ts`)
- Documentation (`README.md`)
- `.gitignore` (updated version)
- `.env.example` files (templates)

## ❌ Files to Remove

### 1. **Sensitive Files**

```
backend/.env          # CRITICAL: Contains real credentials!
frontend/.env         # If it exists with production values
```

**Action:** These should be removed from Git tracking:

```powershell
git rm --cached backend/.env
git rm --cached frontend/.env
git commit -m "Remove sensitive environment files"
```

### 2. **Temporary/Working Files**

```
temp.txt              # Found in root - appears to be a working file
```

**Action:** Delete if not needed:

```powershell
Remove-Item "temp.txt" -Force
```

### 3. **Build Artifacts** (if present)

```
frontend/dist/
frontend/build/
backend/dist/
node_modules/         # Don't commit these!
```

**Action:** These should already be in `.gitignore` (now updated)

### 4. **Editor/IDE Files** (if present)

```
.vscode/settings.json (if it has personal settings)
.idea/
*.swp
*.swo
.DS_Store
Thumbs.db
```

**Action:** Covered by updated `.gitignore`

### 5. **Logs** (if present)

```
*.log
npm-debug.log*
yarn-debug.log*
logs/
```

**Action:** Covered by updated `.gitignore`

---

## 🔍 Quick Audit Commands

Run these in PowerShell to find unwanted files:

```powershell
# Check for .env files
Get-ChildItem -Recurse -Filter "*.env" -File

# Check for large node_modules
Get-ChildItem -Recurse -Directory -Filter "node_modules"

# Check for log files
Get-ChildItem -Recurse -Filter "*.log" -File

# Check for DS_Store (Mac OS files)
Get-ChildItem -Recurse -Filter ".DS_Store" -File
```

---

## ✨ Cleanup Script

Run this PowerShell script to clean up:

```powershell
# Navigate to project root
cd "c:\Users\Home\Desktop\INTERNSHIP\Intern- Health-Connect(working video, chat)\Health-Connect"

# Remove temp files
Remove-Item "temp.txt" -Force -ErrorAction SilentlyContinue

# Remove .env from Git (keep local copy for now)
git rm --cached backend/.env -ErrorAction SilentlyContinue
git rm --cached frontend/.env -ErrorAction SilentlyContinue

# Clean node_modules (will reinstall later)
# Remove-Item backend/node_modules -Recurse -Force -ErrorAction SilentlyContinue
# Remove-Item frontend/node_modules -Recurse -Force -ErrorAction SilentlyContinue

# Commit changes
git add .
git commit -m "Clean up project for deployment"
```

---

## 📝 Notes

1. **temp.txt** - This file is in your root directory. Check if it's needed before deleting.
2. **diagram.drawio** - Keep this if it documents your architecture.
3. **.env files** - MUST be removed from Git but keep local copies for development.

---

## ✅ Post-Cleanup Checklist

- [ ] `temp.txt` removed
- [ ] `.env` files removed from Git tracking
- [ ] `.gitignore` updated (already done ✅)
- [ ] `.env.example` files created (already done ✅)
- [ ] No `node_modules` in Git
- [ ] No build artifacts (`dist/`, `build/`) in Git
- [ ] All changes committed

---

**Last Updated:** November 7, 2025
