# 🚀 YOUR PERSONALIZED DEPLOYMENT GUIDE - Health-Connect

**Your GitHub Repo**: https://github.com/Pa1kumar45/Health-Connect-MERN

This guide contains YOUR EXACT configuration values. Follow each step carefully.

---

## ✅ STEP 1: Deploy Backend to Render (15 minutes)

### 1.1 Sign Up / Login to Render

1. Go to: https://render.com
2. Click **"Get Started"** or **"Sign In"**
3. Choose **"Sign in with GitHub"** (recommended)
4. Authorize Render to access your GitHub repositories

### 1.2 Create New Web Service

1. Once logged in, click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Connect account"** if you haven't connected GitHub yet
4. Find and select: **"Pa1kumar45/Health-Connect-MERN"**
5. Click **"Connect"**

### 1.3 Configure Backend Service

Fill in these EXACT settings:

**Basic Settings:**
```
Name: health-connect-backend
Region: Oregon (US West) or closest to you
Branch: main
Root Directory: backend
Runtime: Node
```

**Build & Deploy:**
```
Build Command: npm install
Start Command: node src/index.js
```

**Instance Type:**
```
Free
```

### 1.4 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these EXACT variables (copy-paste these):

```env
PORT=5000

NODE_ENV=production

MONGODB_URI=mongodb+srv://new_user_2:pavan2005@pav2.kc1lw5c.mongodb.net/health-connect?retryWrites=true&w=majority&appName=pav2

JWT_SECRET=c2ab6104df0e5b289719499f605ecaf42288162b3ab706a84a0201cfdab73a30

CLOUDINARY_CLOUD_NAME=dfjrbwspn

CLOUDINARY_API_KEY=336267127851455

CLOUDINARY_API_SECRET=Y7DsEZXpCWW8kUo1CFmx1f4WoEY

FRONTEND_URL=https://placeholder-update-after-frontend-deploy.vercel.app
```

**⚠️ IMPORTANT**: We'll update `FRONTEND_URL` in Step 3 after deploying frontend!

### 1.5 Deploy!

1. Click **"Create Web Service"** (bottom of page)
2. Wait 5-10 minutes for deployment
3. Watch the logs - should see:
   ```
   Server is running on port 5000
   Connected to MongoDB
   ```

### 1.6 Copy Your Backend URL

Once deployed, you'll see a URL like:
```
https://health-connect-backend.onrender.com
```

**📋 WRITE IT DOWN HERE:**
```
Backend URL: ___________________________________
```

### 1.7 Test Backend

Visit your backend URL in browser. You should see:
```
Hello from the backend!
```

✅ **Backend deployed successfully!**

---

## ✅ STEP 2: Deploy Frontend to Vercel (10 minutes)

### 2.1 Install Vercel CLI

Open PowerShell in your project directory and run:

```powershell
npm install -g vercel
```

### 2.2 Navigate to Frontend Directory

```powershell
cd frontend
```

### 2.3 Update Frontend .env

Edit `frontend/.env` and replace with YOUR backend URL:

```env
VITE_BACKEND_URL=https://your-actual-backend-url.onrender.com
```

(Use the URL you wrote down in Step 1.6)

### 2.4 Deploy to Vercel

Run this command:

```powershell
vercel --prod
```

**You'll be asked several questions:**

```
? Set up and deploy "~/frontend"? [Y/n]
→ Press Y

? Which scope do you want to deploy to?
→ Select your personal account (Pa1kumar45)

? Link to existing project? [y/N]
→ Press N

? What's your project's name? (frontend)
→ Type: health-connect-frontend

? In which directory is your code located? ./
→ Press Enter

? Want to override the settings? [y/N]
→ Press N
```

Wait 2-3 minutes for deployment.

### 2.5 Add Environment Variable in Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Click on **"health-connect-frontend"** project
3. Go to **Settings** tab
4. Click **"Environment Variables"** (left sidebar)
5. Add new variable:
   ```
   Key: VITE_BACKEND_URL
   Value: https://your-backend-url.onrender.com
   ```
   (Use YOUR actual backend URL)
6. Select all environments: **Production**, **Preview**, **Development**
7. Click **"Save"**

### 2.6 Redeploy Frontend

1. Still in Vercel dashboard
2. Go to **"Deployments"** tab
3. Find the latest deployment
4. Click **"⋯"** (three dots) → **"Redeploy"**
5. Confirm redeploy

### 2.7 Copy Your Frontend URL

After redeployment, you'll see a URL like:
```
https://health-connect-frontend.vercel.app
```

**📋 WRITE IT DOWN HERE:**
```
Frontend URL: ___________________________________
```

✅ **Frontend deployed successfully!**

---

## ✅ STEP 3: Update CORS Configuration (5 minutes)

### 3.1 Update Backend Environment Variable

1. Go back to: https://dashboard.render.com
2. Click on **"health-connect-backend"** service
3. Go to **"Environment"** tab (left sidebar)
4. Find **"FRONTEND_URL"** variable
5. Click **"Edit"** (pencil icon)
6. Update value to YOUR frontend URL:
   ```
   https://health-connect-frontend.vercel.app
   ```
   (Use YOUR actual frontend URL - NO trailing slash!)
7. Click **"Save Changes"**

### 3.2 Wait for Auto-Redeploy

- Render will automatically redeploy your backend (2-3 minutes)
- Watch the **"Events"** tab to see progress
- Wait until status shows **"Live"**

✅ **CORS configured successfully!**

---

## ✅ STEP 4: Verify Everything Works (10 minutes)

### 4.1 Test Backend Health

Open in browser:
```
https://your-backend-url.onrender.com
```

✅ Should see: `"Hello from the backend!"`

### 4.2 Test Frontend Loads

Open in browser:
```
https://your-frontend-url.vercel.app
```

✅ Should see the Health-Connect homepage

### 4.3 Test User Registration

1. Click **"Sign Up"**
2. Register as a **Patient**:
   ```
   Name: Test Patient
   Email: patient@test.com
   Password: Test123!
   ```
3. Fill in required fields
4. Click **"Register"**

✅ Should redirect to dashboard without errors

### 4.4 Test Login

1. Log out
2. Log back in with:
   ```
   Email: patient@test.com
   Password: Test123!
   Role: Patient
   ```

✅ Should log in successfully

### 4.5 Test Image Upload

1. Go to **"Profile"**
2. Upload a profile picture
3. Click **"Update Profile"**

✅ Image should upload to Cloudinary and display

### 4.6 Test Doctor Registration & Appointments

1. Open in **Incognito/Private window**
2. Register as a **Doctor**:
   ```
   Name: Dr. Test
   Email: doctor@test.com
   Password: Test123!
   Specialization: Cardiology
   Experience: 5
   Qualification: MD
   ```

✅ Should register successfully

### 4.7 Test Chat (Real-time messaging)

1. **Browser 1** (Patient account):
   - Go to doctors list
   - Click on a doctor
   - Click **"Message"** or **"Chat"**

2. **Browser 2** (Doctor account - incognito):
   - Check messages/chat section
   - You should see patient's chat

3. **Send messages both ways**

✅ Messages should appear in real-time on both sides

### 4.8 Test Video Call

1. From chat interface
2. Click **"Video Call"** button
3. Accept permissions for camera/microphone
4. Other user should receive call notification

✅ Video call should connect

### 4.9 Check Browser Console

Press **F12** → **Console** tab

✅ Should see NO red errors (warnings are OK)

---

## 🎉 DEPLOYMENT COMPLETE!

### Your Live URLs:

**Frontend**: `https://health-connect-frontend.vercel.app`  
**Backend**: `https://health-connect-backend.onrender.com`

(Replace with YOUR actual URLs)

---

## 🐛 Troubleshooting

### Problem: "CORS Error" in browser console

**Solution:**
1. Go to Render dashboard → health-connect-backend → Environment
2. Verify `FRONTEND_URL` EXACTLY matches your Vercel URL
3. No trailing slash: ❌ `https://app.vercel.app/` ✅ `https://app.vercel.app`
4. Save and wait for redeploy

### Problem: "Failed to fetch" or API calls not working

**Solution:**
1. Go to Vercel dashboard → health-connect-frontend → Settings → Environment Variables
2. Verify `VITE_BACKEND_URL` is correct
3. Should be: `https://your-backend.onrender.com` (no trailing slash)
4. Redeploy frontend after changes

### Problem: Images not uploading

**Solution:**
- Cloudinary credentials are correct (already in your backend .env)
- Check Cloudinary dashboard for quota: https://cloudinary.com/console
- Free tier: 25GB storage, 25GB bandwidth/month

### Problem: Backend shows "Service Unavailable"

**Solution:**
- Free tier sleeps after 15 min inactivity
- First request takes 30-60 seconds to wake up
- This is normal for free tier
- Refresh the page and wait

### Problem: Chat messages not appearing

**Solution:**
1. Check both users are online
2. Refresh both browser windows
3. Check browser console for WebSocket errors
4. Verify backend is running (check Render logs)

### Problem: Video call not connecting

**Solution:**
1. Allow camera/microphone permissions
2. Check firewall/antivirus settings
3. Try different browser (Chrome works best)
4. Check if both users are on HTTPS (required for WebRTC)

---

## 📊 Monitor Your Deployment

### Render Dashboard (Backend)
- **Logs**: https://dashboard.render.com → Your service → Logs
- Check for errors or crashes
- Monitor MongoDB connection

### Vercel Dashboard (Frontend)
- **Analytics**: https://vercel.com/dashboard → Your project → Analytics
- **Deployments**: See build logs and errors

### MongoDB Atlas
- **Database**: https://cloud.mongodb.com
- Monitor: Metrics → Check connections and queries
- Storage: Collections → Browse data

---

## 📈 Performance Notes

**Free Tier Limitations:**

1. **Render Backend**:
   - Sleeps after 15 min inactivity
   - First request: 30-60 seconds (cold start)
   - 750 hours/month free

2. **Vercel Frontend**:
   - 100GB bandwidth/month
   - Unlimited deployments
   - Edge network (fast globally)

3. **MongoDB Atlas**:
   - 512MB storage
   - Shared cluster
   - Good for 1000+ users

**Upgrade When:**
- Users complain about slow load times
- Reaching bandwidth limits
- Need 24/7 uptime (no cold starts)

**Cost to upgrade**: ~$7-10/month (Render Starter plan)

---

## 🔒 Security Checklist

✅ JWT secret is strong (32 chars)  
✅ Passwords are hashed (bcrypt)  
✅ HTTPS enabled (automatic on Render/Vercel)  
✅ CORS properly configured  
✅ No .env files committed to Git  
✅ HTTP-only cookies for auth  

---

## 🚀 Next Steps

1. **Custom Domain** (Optional):
   - Vercel: Settings → Domains → Add custom domain
   - Render: Settings → Custom Domain

2. **Monitoring** (Recommended):
   - Set up: https://uptimerobot.com (free)
   - Get alerts when site goes down

3. **Analytics** (Optional):
   - Google Analytics
   - Vercel Analytics (built-in)

4. **Error Tracking** (Recommended for production):
   - Sentry: https://sentry.io (free tier)
   - Track frontend/backend errors

---

## 📞 Need Help?

**Deployment Issues:**
1. Check **Logs** first (Render/Vercel dashboard)
2. Review troubleshooting section above
3. Check browser console (F12)

**Repository:**
https://github.com/Pa1kumar45/Health-Connect-MERN

---

## ✅ Final Checklist

Mark when complete:

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] CORS updated with frontend URL
- [ ] User registration tested
- [ ] Login tested
- [ ] Image upload tested
- [ ] Chat messaging tested (both directions)
- [ ] Video call tested
- [ ] No console errors
- [ ] Shared URLs with team/stakeholders

---

**Deployed on**: _______________  
**Deployed by**: _______________  

**Live URLs**:
- Frontend: ___________________________________
- Backend: ___________________________________

---

🎉 **Congratulations! Your Health-Connect app is LIVE!** 🎉
