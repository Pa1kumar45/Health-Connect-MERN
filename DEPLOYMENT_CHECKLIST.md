# 🎯 Deployment Checklist - Health-Connect MERN App# 📋 Pre-Deployment Checklist - Health-Connect



Use this checklist to ensure successful deployment from scratch.Use this checklist to ensure everything is ready before deploying to production.



------



## 📦 **Phase 1: Pre-Deployment Preparation**## 🔍 Code Review



### **Local Environment Cleanup**### Backend

- [ ] Run `npm install` in both `/backend` and `/frontend`

- [ ] Test app locally:- [ ] All console.log statements removed or replaced with proper logging

  - [ ] Backend runs on `http://localhost:5000`- [ ] Error handling implemented in all routes

  - [ ] Frontend runs on `http://localhost:5173`- [ ] Input validation on all endpoints

  - [ ] Registration works- [ ] No hardcoded credentials or secrets in code

  - [ ] Login works- [ ] CORS properly configured

  - [ ] Chat works- [ ] Rate limiting considered (optional but recommended)

  - [ ] Video call works

### Frontend

### **Git & Repository Setup**

- [x] Create `.env.example` files (✅ DONE)- [ ] No console.log statements in production code

- [x] Update `.gitignore` (✅ DONE)- [ ] Error boundaries implemented

- [ ] Remove `temp.txt` file (if not needed)- [ ] Loading states for all async operations

- [ ] Remove `.env` from Git tracking:- [ ] Proper TypeScript types throughout

  ```powershell- [ ] Responsive design tested on multiple devices

  git rm --cached backend/.env- [ ] Accessibility (a11y) considerations addressed

  ```

- [ ] Commit cleanup changes:---

  ```powershell

  git add .## 🔐 Security

  git commit -m "Prepare for deployment - remove sensitive files"

  ```- [ ] `.env` files not committed to Git (.gitignore configured)

- [ ] Push to GitHub:- [ ] Strong JWT secret generated (32+ characters)

  ```powershell- [ ] Password hashing implemented (bcrypt)

  git push origin main- [ ] HTTP-only cookies for authentication

  ```- [ ] CORS whitelist configured (not using '\*')

- [ ] Input sanitization to prevent MongoDB injection

---- [ ] File upload size limits set

- [ ] HTTPS enforced in production (secure cookies)

## 🗄️ **Phase 2: Database Setup (MongoDB Atlas)**

---

### **MongoDB Atlas Configuration**

- [ ] Login to [MongoDB Atlas](https://cloud.mongodb.com/)## 🗄️ Database

- [ ] Verify your cluster is running: `cluster0.exakobi.mongodb.net`

- [ ] **Network Access:**- [ ] MongoDB Atlas account created

  - [ ] Go to "Network Access" → "Add IP Address"- [ ] Free tier (M0) cluster provisioned

  - [ ] Select "Allow Access from Anywhere" (0.0.0.0/0)- [ ] Database user created with strong password

  - [ ] Click "Confirm"- [ ] IP whitelist configured (0.0.0.0/0 for testing)

- [ ] **Database User:**- [ ] Connection string obtained and tested

  - [ ] Go to "Database Access"- [ ] Database name matches in connection string

  - [ ] Verify user `ppk` exists with correct password- [ ] Indexes defined for frequently queried fields

  - [ ] Ensure user has "Read and write to any database" role

- [ ] **Connection String:**---

  - [ ] Copy connection string (will use in Render):

    ```## ☁️ Cloud Services

    mongodb+srv://ppk:ppk@cluster0.exakobi.mongodb.net/?appName=Cluster0

    ```### MongoDB Atlas



---- [ ] Account created

- [ ] Cluster running

## ☁️ **Phase 3: Cloud Services Setup**- [ ] Connection string saved securely



### **Cloudinary (Image Hosting)**### Cloudinary

- [ ] Login to [Cloudinary](https://cloudinary.com/console)

- [ ] Copy credentials from dashboard:- [ ] Account created

  - [ ] Cloud Name: `dfjrbwspn`- [ ] Cloud name obtained

  - [ ] API Key: `336267127851455`- [ ] API key obtained

  - [ ] API Secret: `Y7DsEZXpCWW8kUo1CFmx1f4WoEY`- [ ] API secret obtained

- [ ] Upload presets configured (optional)

### **GitHub Repository**

- [ ] Repository created: `Health-Connect-MERN`### Deployment Platform (Render/Vercel/etc.)

- [ ] All code pushed to `main` branch

- [ ] `.env` files NOT in repository ✅- [ ] Account created

- [ ] GitHub repository connected

---- [ ] Payment method added (if using paid tier)



## 🖥️ **Phase 4: Backend Deployment (Render)**---



### **Render Account Setup**## 📦 Environment Variables

- [ ] Sign up/login at [Render](https://dashboard.render.com/)

- [ ] Connect GitHub account### Backend Variables



### **Create Web Service**- [ ] `PORT` set (default: 5000)

- [ ] Click "New +" → "Web Service"- [ ] `NODE_ENV` set to 'production'

- [ ] Select repository: `Health-Connect-MERN`- [ ] `MONGODB_URI` configured with MongoDB Atlas string

- [ ] Configure:- [ ] `JWT_SECRET` generated and set (min 32 chars)

  - **Name:** `health-connect-backend`- [ ] `FRONTEND_URL` set to deployed frontend URL (no trailing slash)

  - **Region:** Oregon (or closest)- [ ] `CLOUDINARY_CLOUD_NAME` set

  - **Branch:** `main`- [ ] `CLOUDINARY_API_KEY` set

  - **Root Directory:** `backend`- [ ] `CLOUDINARY_API_SECRET` set

  - **Runtime:** Node

  - **Build Command:** `npm install`### Frontend Variables

  - **Start Command:** `npm start`

  - **Instance Type:** Free- [ ] `VITE_BACKEND_URL` set to deployed backend URL



### **Environment Variables (Render)**---

Click "Advanced" → Add these variables:

## 🏗️ Build & Test

- [ ] `MONGODB_URI` = `mongodb+srv://ppk:ppk@cluster0.exakobi.mongodb.net/?appName=Cluster0`

- [ ] `JWT_SECRET` = `c2ab6104df0e5b289719499f605ecaf42288162b3ab706a84a0201cfdab73a30`### Local Testing

- [ ] `PORT` = `5000`

- [ ] `NODE_ENV` = `production`- [ ] Backend builds without errors: `npm install` in backend/

- [ ] `CLOUDINARY_CLOUD_NAME` = `dfjrbwspn`- [ ] Backend starts without errors: `npm start` in backend/

- [ ] `CLOUDINARY_API_KEY` = `336267127851455`- [ ] Frontend builds without errors: `npm run build` in frontend/

- [ ] `CLOUDINARY_API_SECRET` = `Y7DsEZXpCWW8kUo1CFmx1f4WoEY`- [ ] No TypeScript errors in frontend build

- [ ] `FRONTEND_URL` = `TEMP_VALUE` (update after frontend deployment)- [ ] All tests pass (if tests exist)



### **Deploy Backend**### Production Build Test

- [ ] Click "Create Web Service"

- [ ] Wait for deployment (5-10 minutes)- [ ] Backend tested with `NODE_ENV=production`

- [ ] Check logs for errors- [ ] Frontend build tested: `npm run build && npm run preview`

- [ ] Copy backend URL: `https://health-connect-backend.onrender.com`- [ ] No hardcoded localhost URLs in production build

- [ ] Test backend: Visit URL → Should see "Hello from the backend!"- [ ] Build artifacts are under size limits



------



## 🌐 **Phase 5: Frontend Deployment (Vercel)**## 🧪 Functionality Testing



### **Vercel Account Setup**### Authentication

- [ ] Sign up/login at [Vercel](https://vercel.com/dashboard)

- [ ] Click "Add New..." → "Project"- [ ] User registration works (doctor & patient)

- [ ] User login works

### **Import Repository**- [ ] Token persistence (refresh page stays logged in)

- [ ] Select `Health-Connect-MERN` repository- [ ] Logout works

- [ ] Click "Import"- [ ] Protected routes redirect to login

- [ ] Profile updates work

### **Configure Project**

- [ ] **Framework Preset:** Vite### Core Features

- [ ] **Root Directory:** `frontend`

- [ ] **Build Command:** `npm run build` (auto-detected)- [ ] Doctor list displays correctly

- [ ] **Output Directory:** `dist` (auto-detected)- [ ] Doctor profiles load

- [ ] **Install Command:** `npm install` (auto-detected)- [ ] Appointment creation works

- [ ] Appointment updates work

### **Environment Variables (Vercel)**- [ ] Appointment deletion works

Click "Environment Variables" → Add:- [ ] Real-time chat works (messages appear for both users)

- [ ] Video call connects successfully

- [ ] `VITE_BACKEND_URL` = `https://health-connect-backend.onrender.com`- [ ] Image uploads work (profile pictures, chat images)

  *(Use your actual Render URL from Phase 4)*

### Edge Cases

### **Deploy Frontend**

- [ ] Click "Deploy"- [ ] Invalid login credentials show error

- [ ] Wait for deployment (2-5 minutes)- [ ] Network errors handled gracefully

- [ ] Check build logs for errors- [ ] Empty states display properly

- [ ] Copy frontend URL: `https://health-connect-mern.vercel.app`- [ ] Long text doesn't break UI

- [ ] Large images handled correctly

---

---

## 🔄 **Phase 6: Update Backend CORS**

## 🌐 Deployment Readiness

### **Update FRONTEND_URL in Render**

- [ ] Go to Render Dashboard → `health-connect-backend`### Git Repository

- [ ] Click "Environment" tab

- [ ] Edit `FRONTEND_URL` variable- [ ] All changes committed

- [ ] Update to: `https://health-connect-mern.vercel.app`- [ ] Repository pushed to GitHub

  *(Use your actual Vercel URL from Phase 5)*- [ ] `.gitignore` configured correctly

- [ ] Click "Save Changes"- [ ] No `.env` files in repository

- [ ] Wait for auto-redeploy (2-3 minutes)- [ ] README.md updated

- [ ] Clean commit history (optional)

---

### Backend Deployment

## ✅ **Phase 7: Testing & Verification**

- [ ] Platform selected (Render/Railway/Vercel)

### **Backend Tests**- [ ] Repository connected

- [ ] Visit backend URL: `https://health-connect-backend.onrender.com`- [ ] Build command set: `npm install`

- [ ] Should see: "Hello from the backend!"- [ ] Start command set: `node src/index.js`

- [ ] Check Render logs for errors- [ ] Root directory set to `backend`

- [ ] All environment variables added

### **Frontend Tests**- [ ] Health check endpoint works: `GET /`

- [ ] Visit frontend URL: `https://health-connect-mern.vercel.app`

- [ ] App loads without console errors (F12 → Console)### Frontend Deployment

- [ ] No CORS errors

- [ ] Platform selected (Vercel/Netlify/Render)

### **User Registration**- [ ] Repository connected

- [ ] Click "Sign Up"- [ ] Build command set: `npm run build`

- [ ] Fill form (use test data)- [ ] Output directory set to `dist`

- [ ] Submit registration- [ ] Root directory set to `frontend`

- [ ] Should redirect to dashboard- [ ] Environment variable added: `VITE_BACKEND_URL`

- [ ] Check browser cookies (F12 → Application → Cookies)- [ ] SPA routing configured (redirects to index.html)

- [ ] JWT cookie should be set

---

### **User Login**

- [ ] Logout (if logged in)## 🔗 Post-Deployment

- [ ] Click "Login"

- [ ] Enter credentials### URL Configuration

- [ ] Submit login

- [ ] Should login successfully- [ ] Backend URL copied from deployment platform

- [ ] Frontend URL copied from deployment platform

### **Doctor Directory**- [ ] Backend `FRONTEND_URL` updated with actual frontend URL

- [ ] Login as patient- [ ] Frontend `VITE_BACKEND_URL` updated with actual backend URL

- [ ] Navigate to "Find Doctors"- [ ] Both services redeployed after URL updates

- [ ] Doctors list should load (if any exist)

- [ ] Click on doctor profile### CORS Verification

- [ ] Profile should display

- [ ] Frontend can make API calls to backend

### **Appointment Booking**- [ ] No CORS errors in browser console

- [ ] Select a doctor- [ ] Credentials (cookies) sent correctly

- [ ] Click "Book Appointment"

- [ ] Fill appointment form### WebSocket Testing

- [ ] Submit booking

- [ ] Appointment should be created- [ ] Socket.io connects successfully

- [ ] Real-time chat works

### **Real-time Chat**- [ ] Video call signaling works

- [ ] **Setup:** Open 2 browsers- [ ] Check browser console for socket errors

  - Browser 1: Login as Doctor

  - Browser 2: Login as Patient---

- [ ] Start chat between doctor and patient

- [ ] Send message from Browser 1## 🎯 Performance & Monitoring

- [ ] Message should appear INSTANTLY in Browser 2

- [ ] Send message from Browser 2### Performance

- [ ] Message should appear INSTANTLY in Browser 1

- [ ] Check browser console for WebSocket errors- [ ] Lighthouse score run on frontend (aim for 80+ on Performance)

- [ ] Images optimized (use WebP format if possible)

### **Video Call**- [ ] Bundle size reasonable (<500KB for main.js)

- [ ] **Setup:** Keep 2 browsers open (Doctor + Patient)- [ ] API response times acceptable (<2 seconds)

- [ ] Click "Start Video Call" in chat

- [ ] Accept call in other browser### Monitoring (Optional but Recommended)

- [ ] Video streams should appear in both browsers

- [ ] Test audio (speak and verify other side hears)- [ ] Error tracking setup (e.g., Sentry)

- [ ] Test "End Call" button- [ ] Uptime monitoring (e.g., UptimeRobot)

- [ ] Both sides should disconnect properly- [ ] Analytics setup (e.g., Google Analytics)

- [ ] Backend logging configured

### **Image Upload (Cloudinary)**- [ ] Database monitoring enabled (MongoDB Atlas charts)

- [ ] Login as doctor

- [ ] Go to profile---

- [ ] Upload profile picture

- [ ] Image should upload successfully## 🧪 Production Smoke Tests

- [ ] Image should display in profile

After deployment, run these tests on your live app:

---

### Basic Functionality

## 🐛 **Phase 8: Troubleshooting (if needed)**

1. [ ] Homepage loads without errors

### **If CORS Error:**2. [ ] Register a new patient account

- [ ] Verify `FRONTEND_URL` in Render = Vercel URL (exact match, no trailing slash)3. [ ] Login with new account

- [ ] Check backend CORS code: `origin: process.env.FRONTEND_URL`4. [ ] Update patient profile with avatar

- [ ] Redeploy backend after fixing5. [ ] View doctor list

6. [ ] Book an appointment

### **If Cookie Not Set:**7. [ ] Register a new doctor account

- [ ] Check axios config: `withCredentials: true`8. [ ] Doctor can view appointments

- [ ] Check backend cookie settings: `sameSite: 'none'`, `secure: true`9. [ ] Send chat message between doctor and patient

- [ ] Verify both apps use HTTPS (Vercel/Render auto-provide)10. [ ] Initiate video call (test in two browsers)



### **If MongoDB Connection Fails:**### Cross-Browser Testing

- [ ] Check MongoDB Atlas Network Access → 0.0.0.0/0 whitelisted

- [ ] Verify `MONGODB_URI` in Render (no typos)- [ ] Chrome (desktop & mobile)

- [ ] Check Render logs for error details- [ ] Firefox (desktop)

- [ ] Safari (desktop & mobile)

### **If Socket.IO Not Connecting:**- [ ] Edge (desktop)

- [ ] Check `VITE_BACKEND_URL` in Vercel = Render backend URL

- [ ] Verify backend Socket.IO CORS allows frontend origin### Device Testing

- [ ] Check browser console for WebSocket errors

- [ ] Desktop (1920x1080)

### **If Video Call Fails:**- [ ] Laptop (1366x768)

- [ ] Ensure HTTPS is used (required for WebRTC)- [ ] Tablet (768x1024)

- [ ] Allow camera/microphone in browser- [ ] Mobile (375x667)

- [ ] Test on Chrome/Firefox (best compatibility)

---

---

## 📱 Mobile Responsiveness

## 📊 **Phase 9: Monitoring Setup**

- [ ] Navigation menu works on mobile

### **Render Monitoring**- [ ] Forms are usable on small screens

- [ ] Bookmark Render dashboard: https://dashboard.render.com/- [ ] Chat interface readable on mobile

- [ ] Enable email notifications (Settings → Notifications)- [ ] Video call UI adapts to mobile

- [ ] Check logs regularly for errors- [ ] Images scale properly

- [ ] No horizontal scrolling

### **Vercel Monitoring**- [ ] Touch targets are large enough (min 44x44px)

- [ ] Bookmark Vercel dashboard: https://vercel.com/dashboard

- [ ] Check deployment status after code pushes---

- [ ] Review Function Logs for runtime errors

## 🔒 Security Verification

### **MongoDB Atlas Monitoring**

- [ ] Go to Cluster → Metrics- [ ] HTTPS enabled (check for padlock icon)

- [ ] Monitor connections, operations, storage- [ ] Cookies have `Secure` flag in production

- [ ] Set up alerts (optional)- [ ] No sensitive data in browser console

- [ ] No API keys visible in frontend bundle

---- [ ] CSP headers configured (optional but recommended)

- [ ] XSS protection headers set

## 🎉 **Final Verification**

---

- [ ] All Phase 7 tests passed ✅

- [ ] No console errors in browser ✅## 📊 Final Checks

- [ ] No errors in Render logs ✅

- [ ] No errors in Vercel logs ✅- [ ] All environment variables verified in deployment dashboard

- [ ] App is fully functional ✅- [ ] Database connection successful (check backend logs)

- [ ] Cloudinary uploads working

---- [ ] Email notifications working (if implemented)

- [ ] No 404 errors on page refresh (SPA routing)

## 📝 **Deployment URLs (Fill These In)**- [ ] Favicon displays correctly

- [ ] Page titles set correctly

| Service | URL | Status |- [ ] Meta tags for SEO (optional)

|---------|-----|--------|

| **Backend (Render)** | `https://_____________________.onrender.com` | ⬜ |---

| **Frontend (Vercel)** | `https://_____________________.vercel.app` | ⬜ |

| **MongoDB Atlas** | `cluster0.exakobi.mongodb.net` | ✅ |## 🚨 Rollback Plan

| **Cloudinary** | `dfjrbwspn.cloudinary.com` | ✅ |

In case something goes wrong:

---

- [ ] Previous working version tagged in Git

## 🚀 **Post-Deployment**- [ ] Database backup taken (MongoDB Atlas auto-backup enabled)

- [ ] Documented steps to revert deployment

### **Share Your App**- [ ] Emergency contact list ready

- [ ] Test app one final time

- [ ] Share frontend URL with users---

- [ ] Document any known issues

## 📞 Support & Documentation

### **Future Updates**

Whenever you push code changes:- [ ] `DEPLOYMENT.md` guide reviewed

1. `git add .`- [ ] `QUICK_START.md` tested by following steps

2. `git commit -m "description"`- [ ] `README.md` updated with deployment URLs

3. `git push origin main`- [ ] Known issues documented

4. Vercel auto-deploys frontend ✅- [ ] FAQ prepared for common questions

5. Render auto-deploys backend ✅

---

### **Monitor Free Tier Limits**

- **Render:** Backend sleeps after 15 min inactivity (wakes in ~30s)## ✅ Deployment Complete!

- **Vercel:** 100GB bandwidth/month

- **MongoDB Atlas:** 512MB storageOnce all items are checked:

- **Cloudinary:** 25GB bandwidth/month

1. **Announce**: Share your live URLs with stakeholders

---2. **Monitor**: Watch logs for first 24 hours

3. **Document**: Note any issues and resolutions

**Deployment Date:** _____________  4. **Iterate**: Plan for future improvements

**Deployed By:** _____________  

**Status:** ⬜ In Progress | ⬜ Completed | ⬜ Live---



---## 🎉 Congratulations!



**Congratulations! Your app is now live! 🎉**Your Health-Connect app is now live! 🚀


**Live URLs**:

- Frontend: `https://your-frontend-url.vercel.app`
- Backend: `https://your-backend-url.onrender.com`

**Next Steps**:

- Monitor user feedback
- Track error rates
- Plan feature enhancements
- Consider scaling options

---

**Date Deployed**: ******\_\_\_******  
**Deployed By**: ******\_\_\_******  
**Version**: ******\_\_\_******
