# 🚀 Quick Start Deployment Guide - Health-Connect

This is a **condensed** guide to get your app deployed in under 30 minutes. For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

---

## ⚡ Fastest Deployment Path (Recommended)

### 📋 Prerequisites Checklist

- [ ] GitHub account
- [ ] MongoDB Atlas account ([Sign up free](https://www.mongodb.com/cloud/atlas))
- [ ] Cloudinary account ([Sign up free](https://cloudinary.com))
- [ ] Render account ([Sign up free](https://render.com))

---

## Step 1: Database Setup (5 minutes)

### MongoDB Atlas

1. **Create free cluster** at [MongoDB Atlas](https://cloud.mongodb.com)
   - Choose M0 (Free tier)
   - Select region closest to you
2. **Create database user**:

   - Database Access → Add New User
   - Username: `healthadmin`
   - Password: Generate strong password (save it!)

3. **Allow network access**:

   - Network Access → Add IP Address
   - Allow access from anywhere: `0.0.0.0/0`

4. **Get connection string**:
   - Click "Connect" → "Connect your application"
   - Copy connection string (looks like):
     ```
     mongodb+srv://healthadmin:<password>@cluster0.xxxxx.mongodb.net/health-connect
     ```
   - **Replace** `<password>` with your actual password
   - **Replace** database name with `health-connect`

✅ **Save this connection string** - you'll need it for backend deployment!

---

## Step 2: Cloudinary Setup (2 minutes)

1. **Sign up** at [Cloudinary](https://cloudinary.com/users/register/free)
2. **Dashboard** shows three values you need:
   - Cloud Name
   - API Key
   - API Secret

✅ **Copy these three values** - you'll need them for backend!

---

## Step 3: Backend Deployment (10 minutes)

### Using Render (Free Tier)

1. **Push to GitHub** (if not already):

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Go to** [Render Dashboard](https://dashboard.render.com)

   - Sign up with GitHub
   - Click "New +" → "Web Service"

3. **Connect repository**:

   - Select your `Health-Connect` repo
   - Click "Connect"

4. **Configure service**:

   ```
   Name: health-connect-backend
   Region: (choose closest to you)
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: node src/index.js
   Instance Type: Free
   ```

5. **Add Environment Variables** (click "Advanced" → "Add Environment Variable"):

   ```
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://healthadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/health-connect
   JWT_SECRET=generate-random-32-char-string-here
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   FRONTEND_URL=https://health-connect-frontend.vercel.app
   ```

   **Generate JWT Secret**:

   - Open terminal and run:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
   - Copy the output

   **FRONTEND_URL**: We'll update this after deploying frontend (use placeholder for now)

6. **Click "Create Web Service"**

   - Wait 5-10 minutes for deployment
   - ✅ **Copy your backend URL**: `https://health-connect-backend.onrender.com`

7. **Test backend**:
   - Visit: `https://health-connect-backend.onrender.com`
   - Should see: "Hello from the backend!"

---

## Step 4: Frontend Deployment (8 minutes)

### Using Vercel (Free Tier)

1. **Install Vercel CLI**:

   ```bash
   npm install -g vercel
   ```

2. **Navigate to frontend**:

   ```bash
   cd frontend
   ```

3. **Create `.env` file** in `frontend/`:

   ```env
   VITE_BACKEND_URL=https://health-connect-backend.onrender.com
   ```

   (Use your actual backend URL from Step 3)

4. **Deploy to Vercel**:

   ```bash
   vercel --prod
   ```

   - Follow prompts:
     - "Set up and deploy?" → `Y`
     - "Which scope?" → Select your account
     - "Link to existing project?" → `N`
     - "Project name?" → `health-connect-frontend`
     - "Directory?" → `./` (press Enter)
     - "Override settings?" → `N`

5. **Add environment variable in Vercel**:

   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your project
   - Settings → Environment Variables
   - Add:
     - **Key**: `VITE_BACKEND_URL`
     - **Value**: `https://health-connect-backend.onrender.com`
   - Click "Save"
   - **Redeploy**: Go to Deployments → Latest → ⋯ → Redeploy

6. ✅ **Copy your frontend URL**: `https://health-connect-frontend.vercel.app`

---

## Step 5: Update CORS (5 minutes)

### Update Backend with Frontend URL

1. **Go back to Render dashboard**
2. **Select your backend service**
3. **Environment** tab
4. **Edit** `FRONTEND_URL` variable:
   ```
   FRONTEND_URL=https://health-connect-frontend.vercel.app
   ```
   (Use your ACTUAL frontend URL - no trailing slash!)
5. **Save Changes**
6. Backend will auto-redeploy (wait 2-3 minutes)

---

## Step 6: Test Everything! (5 minutes)

### ✅ Final Checklist

1. **Backend Health Check**:

   - Visit: `https://your-backend.onrender.com`
   - Should see: "Hello from the backend!"

2. **Frontend Loads**:

   - Visit: `https://your-frontend.vercel.app`
   - App should load without errors

3. **Test Registration**:

   - Click "Sign Up"
   - Register as a Patient or Doctor
   - Should redirect to dashboard

4. **Test Login**:

   - Log out
   - Log back in
   - Should work smoothly

5. **Test Chat**:

   - Register two users (different browsers/incognito)
   - Send messages between them
   - Messages should appear in real-time

6. **Test Image Upload**:

   - Update profile with avatar
   - Should upload to Cloudinary

7. **Check Browser Console**:
   - Open DevTools (F12)
   - No red errors should appear

---

## 🐛 Quick Troubleshooting

### CORS Error

- ✅ Verify `FRONTEND_URL` in Render matches your Vercel URL exactly
- ✅ No trailing slash
- ✅ Redeploy backend after changes

### API Calls Failing

- ✅ Check `VITE_BACKEND_URL` in Vercel environment variables
- ✅ Test backend endpoint directly
- ✅ Check Network tab in DevTools

### Images Not Uploading

- ✅ Verify Cloudinary credentials
- ✅ Check Cloudinary dashboard for errors

### MongoDB Connection Error

- ✅ Check connection string format
- ✅ Verify IP whitelist (0.0.0.0/0)
- ✅ Correct username/password

---

## 🎉 Success!

Your app is now live! Share your URLs:

- **Frontend**: `https://your-frontend.vercel.app`
- **Backend API**: `https://your-backend.onrender.com`

---

## 🔧 Optional: Docker Deployment

If you prefer Docker:

1. **Copy environment file**:

   ```bash
   cp .env.docker.example .env
   ```

2. **Edit `.env`** with your values

3. **Run with Docker Compose**:

   ```bash
   docker-compose up -d
   ```

4. **Access**:
   - Frontend: `http://localhost`
   - Backend: `http://localhost:5000`
   - MongoDB: `localhost:27017`

---

## 📚 Need More Help?

- **Detailed Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Mongoose Docs**: See [MONGOOSE_REFERENCE.md](./MONGOOSE_REFERENCE.md)
- **Interview Prep**: See [INTERVIEW_SCENARIOS.md](./INTERVIEW_SCENARIOS.md)

---

## 🚨 Important Notes

- **Free Tier Limitations**:

  - Render backend sleeps after 15 min inactivity (first request takes ~30s)
  - MongoDB Atlas M0: 512MB storage limit
  - Vercel: 100GB bandwidth/month

- **Security**:

  - Never commit `.env` files
  - Use strong JWT secrets (32+ characters)
  - Regularly update dependencies

- **Performance**:
  - First load may be slow (free tier cold starts)
  - Consider paid plans for production traffic
  - Enable caching for static assets

---

Good luck! 🚀
