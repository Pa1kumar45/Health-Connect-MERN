# Health-Connect MERN Deployment Guide

This guide provides step-by-step instructions to deploy the Health-Connect telemedicine application to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
4. [Backend Deployment Options](#backend-deployment-options)
5. [Frontend Deployment Options](#frontend-deployment-options)
6. [Post-Deployment Configuration](#post-deployment-configuration)
7. [Testing Your Deployment](#testing-your-deployment)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- [ ] A GitHub account (to host your code)
- [ ] Node.js 18+ installed locally (for testing)
- [ ] MongoDB Atlas account (for database hosting)
- [ ] Cloudinary account (for image uploads)
- [ ] A deployment platform account (Render/Railway/Vercel)

---

## Environment Setup

### Step 1: Set Up Environment Variables

#### Backend Environment Variables

Create a `.env` file in the `backend/` directory (use `.env.example` as template):

```env
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/health-connect
JWT_SECRET=your-super-secret-jwt-key-32-chars-min
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Important Notes:**

- Generate a strong JWT secret: Run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `FRONTEND_URL` must match your deployed frontend URL exactly (no trailing slash)
- Never commit `.env` files to Git!

#### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_BACKEND_URL=https://your-backend-domain.com
```

**Important:** For Vite, all environment variables MUST start with `VITE_`

---

## Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account (M0 cluster - sufficient for development)
3. Click "Build a Database" → Select "Shared" (Free tier)

### Step 2: Configure Database

1. **Choose Region**: Select a region close to your backend server
2. **Cluster Name**: Name it `health-connect-cluster`
3. **Create Database User**:
   - Username: `healthconnect-admin`
   - Password: Generate a strong password (save it securely!)
4. **Network Access**:
   - Click "Network Access" in sidebar
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (`0.0.0.0/0`) for production
   - (For better security, add only your backend server's IP later)

### Step 3: Get Connection String

1. Click "Database" in sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/health-connect
   ```
5. Replace `<username>` and `<password>` with your credentials
6. Replace the database name (after the last `/`) with `health-connect`

---

## Backend Deployment Options

Choose ONE of the following platforms:

### Option 1: Render (Recommended - Free Tier Available)

#### Steps:

1. **Push Code to GitHub**:

   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Create Render Account**:

   - Go to [Render](https://render.com)
   - Sign up with GitHub

3. **Create New Web Service**:

   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `health-connect-backend`
     - **Region**: Choose closest to you
     - **Branch**: `main`
     - **Root Directory**: `backend`
     - **Runtime**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `node src/index.js`
     - **Plan**: Free (or Starter for better performance)

4. **Add Environment Variables**:

   - In "Environment" section, add all variables from your backend `.env`:
     ```
     PORT=5000
     NODE_ENV=production
     FRONTEND_URL=https://your-frontend-domain.com
     MONGODB_URI=mongodb+srv://...
     JWT_SECRET=your-secret
     CLOUDINARY_CLOUD_NAME=...
     CLOUDINARY_API_KEY=...
     CLOUDINARY_API_SECRET=...
     ```

5. **Deploy**:
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Copy your backend URL: `https://health-connect-backend.onrender.com`

**Note**: Free tier sleeps after 15 mins of inactivity. First request may take 30-60 seconds.

---

### Option 2: Railway (Easy, Free Tier)

1. **Sign up**: Go to [Railway](https://railway.app)
2. **New Project**: Click "New Project" → "Deploy from GitHub repo"
3. **Select Repository**: Choose your Health-Connect repo
4. **Configure**:
   - Set root directory: `backend`
   - Add environment variables (same as Render)
5. **Deploy**: Railway auto-deploys on push
6. **Get URL**: Copy the generated domain from Railway dashboard

---

### Option 3: Vercel (Serverless - Good for APIs)

**Note**: Vercel works best for stateless APIs. WebSocket (Socket.io) has limitations.

1. **Install Vercel CLI**:

   ```bash
   npm install -g vercel
   ```

2. **Deploy Backend**:

   ```bash
   cd backend
   vercel
   ```

3. **Add Environment Variables**:

   - Go to Vercel dashboard → Your project → Settings → Environment Variables
   - Add all backend env variables

4. **Important**: Update `vercel.json` (already created in root) for proper routing

---

## Frontend Deployment Options

### Option 1: Vercel (Recommended for React/Vite)

1. **Update `.env` in Frontend**:

   ```env
   VITE_BACKEND_URL=https://your-backend-domain.com
   ```

   (Use your deployed backend URL from above)

2. **Deploy**:

   ```bash
   cd frontend
   npm run build  # Test build locally first
   vercel --prod
   ```

3. **Configure in Vercel Dashboard**:

   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variable**:

   - Go to Settings → Environment Variables
   - Add: `VITE_BACKEND_URL` = `https://your-backend-domain.com`

5. **Get Domain**: Copy your frontend URL (e.g., `https://health-connect-frontend.vercel.app`)

---

### Option 2: Netlify

1. **Build the App**:

   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy**:

   - Go to [Netlify](https://netlify.com)
   - Drag and drop the `dist/` folder
   - OR connect GitHub for continuous deployment

3. **Environment Variables**:

   - Site Settings → Environment Variables
   - Add `VITE_BACKEND_URL`

4. **Create `_redirects` file** in `frontend/public/`:
   ```
   /*    /index.html   200
   ```
   (This ensures React Router works correctly)

---

### Option 3: Render (Static Site)

1. **New Static Site**:

   - Dashboard → New → Static Site
   - Connect GitHub repo
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Publish Directory: `dist`

2. **Environment Variables**:
   - Add `VITE_BACKEND_URL` in Environment section

---

## Post-Deployment Configuration

### Step 1: Update CORS Settings

After deploying frontend, update backend `.env`:

```env
FRONTEND_URL=https://your-actual-frontend-domain.vercel.app
```

**Important**: No trailing slash! Exact match required.

Redeploy backend after this change.

### Step 2: Update Frontend API URL

Verify `frontend/.env` has correct backend URL:

```env
VITE_BACKEND_URL=https://your-backend-domain.onrender.com
```

Rebuild and redeploy frontend if changed.

### Step 3: Configure Cloudinary

1. Sign up at [Cloudinary](https://cloudinary.com)
2. Dashboard shows your:
   - Cloud Name
   - API Key
   - API Secret
3. Add these to backend environment variables

---

## Testing Your Deployment

### 1. Test Backend Health

Visit: `https://your-backend-domain.com/`

Should see: `"Hello from the backend!"`

### 2. Test API Endpoints

```bash
curl https://your-backend-domain.com/api/doctors
```

Should return empty array or doctors list.

### 3. Test Frontend

1. Open your frontend URL
2. Try registering a new user
3. Test login
4. Check browser console for errors
5. Test real-time chat (WebSocket connection)
6. Test video call functionality

### 4. Check Logs

**Render**: Dashboard → Logs tab  
**Vercel**: Dashboard → Deployments → View Function Logs  
**Railway**: Dashboard → Deployments → View Logs

---

## Troubleshooting

### Issue: "CORS Error" in Browser Console

**Solution**:

- Verify `FRONTEND_URL` in backend `.env` exactly matches your deployed frontend URL
- No trailing slash
- Includes `https://` protocol
- Redeploy backend after changes

### Issue: "Failed to fetch" or API calls fail

**Solution**:

- Check `VITE_BACKEND_URL` in frontend is correct
- Test backend health endpoint directly
- Verify backend is running (check logs)
- Check browser network tab for actual error

### Issue: WebSocket (Socket.io) not connecting

**Solution**:

- Ensure backend supports WebSocket (Render/Railway work well)
- Vercel has limitations with WebSockets - use Render/Railway for backend
- Check browser console for connection errors
- Verify CORS settings include Socket.io origins

### Issue: Images not uploading (Cloudinary errors)

**Solution**:

- Verify Cloudinary credentials in backend `.env`
- Check Cloudinary dashboard for quota limits
- Ensure `CLOUDINARY_API_SECRET` has no spaces/special chars

### Issue: JWT/Auth errors

**Solution**:

- Verify `JWT_SECRET` is set and at least 32 characters
- Check cookies are enabled in browser
- Verify `secure: true` in cookie config matches HTTPS deployment
- Check `sameSite` cookie settings if frontend/backend on different domains

### Issue: MongoDB connection fails

**Solution**:

- Verify connection string format
- Check MongoDB Atlas IP whitelist (allow `0.0.0.0/0` for testing)
- Ensure database user has read/write permissions
- Test connection string locally first

### Issue: Build fails on deployment

**Solution**:

- Check Node.js version compatibility (18+)
- Clear build cache and retry
- Check for TypeScript errors: `npm run build` locally
- Ensure all dependencies are in `package.json` (not devDependencies for production code)

---

## Quick Deployment Checklist

- [ ] MongoDB Atlas database created and connection string obtained
- [ ] Cloudinary account created with credentials
- [ ] Backend `.env` configured with all variables
- [ ] Frontend `.env` configured with backend URL
- [ ] Backend deployed and health endpoint tested
- [ ] Frontend deployed and loads correctly
- [ ] CORS configured (backend `FRONTEND_URL` matches deployed frontend)
- [ ] Test user registration and login
- [ ] Test real-time chat functionality
- [ ] Test video call feature
- [ ] Check all images upload correctly
- [ ] Test on mobile devices
- [ ] Monitor error logs for first 24 hours

---

## Recommended Production Architecture

```
┌─────────────────┐         ┌──────────────────┐
│   Frontend      │────────▶│   Backend API    │
│   (Vercel)      │  HTTPS  │   (Render)       │
└─────────────────┘         └──────────────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    ▼                ▼                ▼
              ┌──────────┐    ┌──────────┐    ┌──────────┐
              │ MongoDB  │    │Cloudinary│    │Socket.io │
              │  Atlas   │    │          │    │(WebRTC)  │
              └──────────┘    └──────────┘    └──────────┘
```

---

## Cost Estimates (Free Tiers)

- **MongoDB Atlas**: Free M0 cluster (512MB storage)
- **Render**: Free tier (750 hours/month, sleeps after inactivity)
- **Vercel**: Free tier (100GB bandwidth/month)
- **Cloudinary**: Free tier (25 GB storage, 25 GB bandwidth/month)

**Total**: $0/month for starting out!

---

## Next Steps

1. Set up custom domain (optional)
2. Configure SSL certificates (automatic on most platforms)
3. Set up monitoring (e.g., UptimeRobot)
4. Configure error tracking (e.g., Sentry)
5. Set up CI/CD pipelines
6. Add environment-specific configs (staging vs production)

---

## Support

If you encounter issues:

1. Check deployment logs first
2. Verify all environment variables
3. Test each component individually
4. Check browser console and network tab

Good luck with your deployment! 🚀
