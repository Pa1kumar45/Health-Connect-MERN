# 🚀 Quick Deployment Commands

Run these commands in order. Copy-paste each one.

---

## Step 1: Deploy Backend to Render

**You MUST do this via web browser** (https://render.com)

I've already prepared YOUR exact configuration in: `YOUR_DEPLOYMENT_GUIDE.md`

Open that file and follow Step 1.

**Your environment variables are ready** - just copy-paste from the guide!

---

## Step 2: Deploy Frontend to Vercel

### 2.1 Update Frontend .env

After you get your backend URL from Render, run:

```powershell
# Navigate to frontend
cd frontend

# Open .env in notepad
notepad .env
```

Replace `VITE_BACKEND_URL` with your actual Render backend URL (e.g., `https://health-connect-backend.onrender.com`)

Save and close.

### 2.2 Deploy to Vercel

```powershell
# Deploy frontend
vercel --prod
```

**Answer the prompts:**

- Set up and deploy? → `Y`
- Which scope? → Select your account
- Link to existing project? → `N`
- Project name? → `health-connect-frontend`
- Directory? → Press Enter (uses current)
- Override settings? → `N`

Wait for deployment to complete.

### 2.3 Add Environment Variable in Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Click your project: `health-connect-frontend`
3. Settings → Environment Variables
4. Add:
   - Key: `VITE_BACKEND_URL`
   - Value: `https://your-backend.onrender.com` (YOUR actual URL)
5. Select all environments
6. Save

### 2.4 Redeploy

```powershell
# Still in frontend directory
vercel --prod
```

Or use dashboard: Deployments → Latest → ⋯ → Redeploy

---

## Step 3: Update CORS

1. Go to: https://dashboard.render.com
2. Click: `health-connect-backend`
3. Environment tab
4. Edit `FRONTEND_URL` variable
5. Set to: `https://your-frontend.vercel.app` (YOUR actual URL)
6. Save (auto-redeploys)

---

## Step 4: Test Everything

Open your frontend URL in browser:

```
https://your-frontend.vercel.app
```

Test:

- ✅ Registration
- ✅ Login
- ✅ Profile update with image
- ✅ Chat (open 2 browsers)
- ✅ Video call

---

## Quick Checks

### Check backend is live:

```powershell
# In PowerShell
curl https://your-backend.onrender.com
```

Should return: "Hello from the backend!"

### Check frontend build locally:

```powershell
cd frontend
npm run build
npm run preview
```

Visit: http://localhost:4173

---

## Your Configuration

**MongoDB**: Already configured ✅

```
mongodb+srv://new_user_2:pavan2005@pav2.kc1lw5c.mongodb.net/health-connect
```

**Cloudinary**: Already configured ✅

```
Cloud Name: dfjrbwspn
API Key: 336267127851455
```

**JWT Secret**: Already generated ✅

```
c2ab6104df0e5b289719499f605ecaf42288162b3ab706a84a0201cfdab73a30
```

---

## If Something Goes Wrong

**CORS Error:**

- Check `FRONTEND_URL` in Render exactly matches Vercel URL
- No trailing slash!

**API Not Working:**

- Check `VITE_BACKEND_URL` in Vercel environment variables
- Redeploy frontend after changes

**Backend Slow:**

- Free tier sleeps after 15 min
- First request takes 30-60 seconds (normal)

---

## Full Detailed Guide

See: `YOUR_DEPLOYMENT_GUIDE.md`

It has:

- Step-by-step screenshots descriptions
- Troubleshooting for every issue
- Testing checklist
- Your exact configuration values

---

Good luck! 🚀
