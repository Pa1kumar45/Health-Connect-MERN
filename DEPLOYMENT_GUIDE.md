# 🚀 Health-Connect - Complete Deployment Guide (From Scratch)

## 📋 **Table of Contents**
1. [Prerequisites](#prerequisites)
2. [Pre-Deployment Cleanup](#pre-deployment-cleanup)
3. [Backend Deployment (Render)](#backend-deployment-render)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [Environment Variables Setup](#environment-variables-setup)
6. [Post-Deployment Testing](#post-deployment-testing)
7. [Common Issues & Solutions](#common-issues--solutions)

---

## ✅ **Prerequisites**

Before starting deployment, ensure you have:

### **Accounts Required:**
- [ ] GitHub account (for code repository)
- [ ] Vercel account (frontend hosting) - Sign up at https://vercel.com
- [ ] Render account (backend hosting) - Sign up at https://render.com
- [ ] MongoDB Atlas account (database) - Sign up at https://www.mongodb.com/cloud/atlas
- [ ] Cloudinary account (image hosting) - Sign up at https://cloudinary.com

### **Local Tools:**
- [ ] Git installed
- [ ] Node.js (v18+) installed
- [ ] Code editor (VS Code recommended)

### **Services Already Setup (from your .env):**
- [x] MongoDB Atlas: `mongodb+srv://ppk:ppk@cluster0.exakobi.mongodb.net/`
- [x] Cloudinary: Cloud name `dfjrbwspn`, API key available
- [x] JWT Secret: Generated

---

## 🧹 **Pre-Deployment Cleanup**

### **Step 1: Remove Sensitive Files from Git History**

**CRITICAL: Your `.env` file should NEVER be committed to Git!**

Run these commands in your terminal:

```powershell
# Navigate to project root
cd "c:\Users\Home\Desktop\INTERNSHIP\Intern- Health-Connect(working video, chat)\Health-Connect"

# Remove .env from Git tracking (if accidentally committed)
git rm --cached backend/.env
git rm --cached frontend/.env

# Commit the removal
git add .
git commit -m "Remove .env files from tracking"
```

### **Step 2: Update .gitignore**

Ensure `.gitignore` includes all sensitive files. I'll update it for you.

### **Step 3: Create Environment Variable Templates**

Create example files (without real values) for documentation.

### **Step 4: Clean Up Hardcoded URLs**

Check all files for hardcoded `localhost` URLs - these should use environment variables.

---

## 🖥️ **Backend Deployment (Render)**

### **Step 1: Prepare Backend for Production**

#### **1.1: Create `.env.example` file in backend folder**

```env
# Database
MONGODB_URI=your_mongodb_connection_string_here

# JWT
JWT_SECRET=your_jwt_secret_here

# Server
PORT=5000
NODE_ENV=production

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Frontend URL (for CORS)
FRONTEND_URL=your_vercel_frontend_url_here
```

#### **1.2: Update package.json engines** (already correct ✅)

Your `backend/package.json` already has the start script. Verify:

```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  }
}
```

#### **1.3: Verify MongoDB Atlas Network Access**

1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
   - This allows Render servers to connect
   - **Note:** For production, you can whitelist Render's IP ranges instead

### **Step 2: Push Code to GitHub**

```powershell
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for deployment"

# Create GitHub repository and push
# Go to github.com → New Repository → "Health-Connect-MERN"
# Then run:
git remote add origin https://github.com/Pa1kumar45/Health-Connect-MERN.git
git branch -M main
git push -u origin main
```

### **Step 3: Deploy on Render**

1. **Go to Render Dashboard:** https://dashboard.render.com/
2. **Click "New +" → "Web Service"**
3. **Connect GitHub:**
   - Click "Connect GitHub"
   - Select your repository: `Health-Connect-MERN`
   - Click "Connect"

4. **Configure Service:**
   ```
   Name: health-connect-backend
   Region: Choose closest to you (e.g., Oregon for US)
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

5. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable" → Add these:

   ```
   MONGODB_URI = mongodb+srv://ppk:ppk@cluster0.exakobi.mongodb.net/?appName=Cluster0
   JWT_SECRET = c2ab6104df0e5b289719499f605ecaf42288162b3ab706a84a0201cfdab73a30
   PORT = 5000
   NODE_ENV = production
   CLOUDINARY_CLOUD_NAME = dfjrbwspn
   CLOUDINARY_API_KEY = 336267127851455
   CLOUDINARY_API_SECRET = Y7DsEZXpCWW8kUo1CFmx1f4WoEY
   FRONTEND_URL = https://your-app.vercel.app
   ```

   **Note:** We'll update `FRONTEND_URL` after deploying frontend

6. **Click "Create Web Service"**

7. **Wait for Deployment** (5-10 minutes)
   - Render will clone your repo, install dependencies, and start the server
   - You'll get a URL like: `https://health-connect-backend.onrender.com`

8. **Test Backend:**
   - Visit: `https://health-connect-backend.onrender.com`
   - You should see: "Hello from the backend!"

---

## 🌐 **Frontend Deployment (Vercel)**

### **Step 1: Create Frontend Environment File**

#### **1.1: Create `frontend/.env.example`**

```env
VITE_BACKEND_URL=your_render_backend_url_here
```

#### **1.2: Create `frontend/.env.production`**

```env
VITE_BACKEND_URL=https://health-connect-backend.onrender.com
```

**Replace with your actual Render URL from previous step**

### **Step 2: Update Frontend .gitignore**

Ensure `frontend/.gitignore` includes:

```
# dependencies
node_modules

# environment variables
.env
.env.local
.env.production.local
.env.development.local

# build output
dist
dist-ssr
*.local

# logs
*.log
```

### **Step 3: Deploy on Vercel**

1. **Go to Vercel Dashboard:** https://vercel.com/dashboard
2. **Click "Add New..." → "Project"**
3. **Import Git Repository:**
   - Click "Import Git Repository"
   - Select `Health-Connect-MERN`
   - Click "Import"

4. **Configure Project:**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

5. **Add Environment Variables:**
   Click "Environment Variables" → Add:

   ```
   VITE_BACKEND_URL = https://health-connect-backend.onrender.com
   ```

   **Use your actual Render backend URL**

6. **Click "Deploy"**

7. **Wait for Deployment** (2-5 minutes)
   - Vercel will build your React app and deploy to CDN
   - You'll get a URL like: `https://health-connect-mern.vercel.app`

### **Step 4: Update Backend CORS**

Now that you have your Vercel URL, update the backend:

1. **Go to Render Dashboard** → Your backend service
2. **Environment** → Edit `FRONTEND_URL`
3. **Update to:** `https://health-connect-mern.vercel.app`
4. **Click "Save Changes"**
5. **Render will auto-redeploy** (wait 2-3 minutes)

---

## 🔐 **Environment Variables Setup Summary**

### **Backend (Render):**
```env
MONGODB_URI=mongodb+srv://ppk:ppk@cluster0.exakobi.mongodb.net/?appName=Cluster0
JWT_SECRET=c2ab6104df0e5b289719499f605ecaf42288162b3ab706a84a0201cfdab73a30
PORT=5000
NODE_ENV=production
CLOUDINARY_CLOUD_NAME=dfjrbwspn
CLOUDINARY_API_KEY=336267127851455
CLOUDINARY_API_SECRET=Y7DsEZXpCWW8kUo1CFmx1f4WoEY
FRONTEND_URL=https://your-app.vercel.app  👈 UPDATE THIS!
```

### **Frontend (Vercel):**
```env
VITE_BACKEND_URL=https://health-connect-backend.onrender.com  👈 UPDATE THIS!
```

---

## ✅ **Post-Deployment Testing**

### **Test 1: Backend API**
```
Visit: https://health-connect-backend.onrender.com
Expected: "Hello from the backend!"
```

### **Test 2: Frontend Loading**
```
Visit: https://health-connect-mern.vercel.app
Expected: Your React app loads (login/signup page)
```

### **Test 3: Registration**
1. Go to frontend → Sign Up
2. Fill form → Submit
3. Check browser console (F12) for errors
4. Expected: User created, redirected to dashboard

### **Test 4: Login**
1. Use registered credentials
2. Submit login form
3. Expected: JWT cookie set, user logged in

### **Test 5: Doctor Directory**
1. Login as patient
2. Navigate to "Find Doctors"
3. Expected: Doctors list loads (if any exist)

### **Test 6: Real-time Chat**
1. Login as doctor (one tab) and patient (another tab)
2. Start chat
3. Send message
4. Expected: Message appears instantly in both tabs

### **Test 7: Video Call**
1. Login as doctor and patient (separate browsers)
2. Click "Start Video Call"
3. Accept call
4. Expected: Video streams appear

---

## 🐛 **Common Issues & Solutions**

### **Issue 1: CORS Error**

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
1. Check `FRONTEND_URL` in Render matches your Vercel URL **exactly**
2. No trailing slash: `https://app.vercel.app` ✅ NOT `https://app.vercel.app/` ❌
3. Redeploy backend after changing

### **Issue 2: Cookie Not Set (Login Fails)**

**Error:** JWT cookie not sent to backend

**Solution:**
1. Verify `withCredentials: true` in `frontend/src/utils/axios.ts`
2. Check backend CORS includes `credentials: true`
3. Verify `sameSite: 'none'` and `secure: true` in cookie settings
4. Both frontend and backend MUST use HTTPS (Vercel/Render auto-provide)

### **Issue 3: MongoDB Connection Failed**

**Error:** `MongoServerError: bad auth`

**Solution:**
1. Check MongoDB Atlas → Database Access → User has correct password
2. Check Network Access → 0.0.0.0/0 is whitelisted
3. Verify `MONGODB_URI` in Render environment variables
4. Check MongoDB Atlas connection string includes `?appName=Cluster0`

### **Issue 4: Cloudinary Upload Fails**

**Error:** `Invalid signature`

**Solution:**
1. Verify all 3 Cloudinary variables in Render:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
2. Check for extra spaces in environment variables
3. Regenerate API secret if needed (Cloudinary dashboard)

### **Issue 5: Socket.IO Not Connecting**

**Error:** `WebSocket connection failed`

**Solution:**
1. Check `VITE_BACKEND_URL` in Vercel points to Render backend
2. Verify backend Socket.IO CORS allows frontend origin
3. Check browser console for WebSocket errors
4. Ensure Render service is running (not sleeping on free tier)

### **Issue 6: Video Call Not Working**

**Error:** `getUserMedia failed` or `ICE connection failed`

**Solution:**
1. Ensure HTTPS is used (WebRTC requires secure context)
2. Allow camera/microphone permissions in browser
3. Check STUN servers are accessible (Google STUN servers)
4. Test on different browsers (Chrome/Firefox recommended)

### **Issue 7: Render Free Tier Sleep**

**Problem:** Backend sleeps after 15 minutes of inactivity

**Solution:**
1. **Accept it** (wake-up takes ~30 seconds on first request)
2. **Upgrade to paid tier** ($7/month - no sleep)
3. **Use cron job** to ping backend every 14 minutes (keeps it awake)

### **Issue 8: Build Fails on Vercel**

**Error:** TypeScript compilation errors

**Solution:**
1. Run `npm run build` locally first
2. Fix all TypeScript errors
3. Push fixes to GitHub
4. Vercel will auto-redeploy

---

## 🔄 **Redeployment Process**

### **After Code Changes:**

```powershell
# 1. Test locally
npm run dev

# 2. Commit changes
git add .
git commit -m "Fix: description of changes"
git push origin main

# 3. Auto-deploy happens
# - Vercel: Automatically redeploys on push
# - Render: Automatically redeploys on push
```

### **Manual Redeploy:**
- **Vercel:** Dashboard → Deployments → Redeploy
- **Render:** Dashboard → Manual Deploy → Deploy latest commit

---

## 📊 **Monitoring & Logs**

### **Render Logs:**
1. Go to Render Dashboard → Your service
2. Click "Logs" tab
3. View real-time server logs
4. Check for errors: `MongoServerError`, `CORS`, etc.

### **Vercel Logs:**
1. Go to Vercel Dashboard → Your project
2. Click "Deployments"
3. Click on latest deployment → "View Function Logs"
4. Check build logs for errors

### **MongoDB Atlas Monitoring:**
1. Go to MongoDB Atlas → Cluster
2. Click "Metrics"
3. View connections, operations, storage

---

## 💰 **Cost Summary**

| Service | Free Tier | Usage | Cost |
|---------|-----------|-------|------|
| **Vercel** | 100GB bandwidth, unlimited deployments | Frontend hosting | $0 |
| **Render** | 750 hours/month, sleeps after 15min | Backend hosting | $0 |
| **MongoDB Atlas** | 512MB storage, shared cluster | Database | $0 |
| **Cloudinary** | 25GB bandwidth, 25GB storage | Image hosting | $0 |
| **TOTAL** | | | **$0/month** |

**For Production (No Sleep, Better Performance):**
- Render Starter: $7/month
- MongoDB M10: $9/month (optional, better performance)
- **Total:** ~$16-20/month

---

## 🎯 **Final Checklist**

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] MongoDB Atlas accessible (0.0.0.0/0)
- [ ] All environment variables set correctly
- [ ] CORS configured (Vercel URL in Render)
- [ ] Registration works
- [ ] Login works (JWT cookie set)
- [ ] Doctor directory loads
- [ ] Real-time chat works
- [ ] Video calls work
- [ ] Image upload works (Cloudinary)
- [ ] Appointment booking works
- [ ] `.env` files NOT in Git
- [ ] GitHub repository clean

---

## 🚀 **You're Live!**

**Frontend:** `https://health-connect-mern.vercel.app`  
**Backend:** `https://health-connect-backend.onrender.com`

Share your app, test thoroughly, and enjoy! 🎉

---

## 📞 **Need Help?**

Common debugging steps:
1. Check browser console (F12) for frontend errors
2. Check Render logs for backend errors
3. Verify environment variables (no typos, no extra spaces)
4. Test API endpoints directly (Postman/Thunder Client)
5. Check MongoDB Atlas metrics (connections active?)

---

**Created:** November 7, 2025  
**Last Updated:** November 7, 2025
