# 📋 Pre-Deployment Checklist - Health-Connect

Use this checklist to ensure everything is ready before deploying to production.

---

## 🔍 Code Review

### Backend

- [ ] All console.log statements removed or replaced with proper logging
- [ ] Error handling implemented in all routes
- [ ] Input validation on all endpoints
- [ ] No hardcoded credentials or secrets in code
- [ ] CORS properly configured
- [ ] Rate limiting considered (optional but recommended)

### Frontend

- [ ] No console.log statements in production code
- [ ] Error boundaries implemented
- [ ] Loading states for all async operations
- [ ] Proper TypeScript types throughout
- [ ] Responsive design tested on multiple devices
- [ ] Accessibility (a11y) considerations addressed

---

## 🔐 Security

- [ ] `.env` files not committed to Git (.gitignore configured)
- [ ] Strong JWT secret generated (32+ characters)
- [ ] Password hashing implemented (bcrypt)
- [ ] HTTP-only cookies for authentication
- [ ] CORS whitelist configured (not using '\*')
- [ ] Input sanitization to prevent MongoDB injection
- [ ] File upload size limits set
- [ ] HTTPS enforced in production (secure cookies)

---

## 🗄️ Database

- [ ] MongoDB Atlas account created
- [ ] Free tier (M0) cluster provisioned
- [ ] Database user created with strong password
- [ ] IP whitelist configured (0.0.0.0/0 for testing)
- [ ] Connection string obtained and tested
- [ ] Database name matches in connection string
- [ ] Indexes defined for frequently queried fields

---

## ☁️ Cloud Services

### MongoDB Atlas

- [ ] Account created
- [ ] Cluster running
- [ ] Connection string saved securely

### Cloudinary

- [ ] Account created
- [ ] Cloud name obtained
- [ ] API key obtained
- [ ] API secret obtained
- [ ] Upload presets configured (optional)

### Deployment Platform (Render/Vercel/etc.)

- [ ] Account created
- [ ] GitHub repository connected
- [ ] Payment method added (if using paid tier)

---

## 📦 Environment Variables

### Backend Variables

- [ ] `PORT` set (default: 5000)
- [ ] `NODE_ENV` set to 'production'
- [ ] `MONGODB_URI` configured with MongoDB Atlas string
- [ ] `JWT_SECRET` generated and set (min 32 chars)
- [ ] `FRONTEND_URL` set to deployed frontend URL (no trailing slash)
- [ ] `CLOUDINARY_CLOUD_NAME` set
- [ ] `CLOUDINARY_API_KEY` set
- [ ] `CLOUDINARY_API_SECRET` set

### Frontend Variables

- [ ] `VITE_BACKEND_URL` set to deployed backend URL

---

## 🏗️ Build & Test

### Local Testing

- [ ] Backend builds without errors: `npm install` in backend/
- [ ] Backend starts without errors: `npm start` in backend/
- [ ] Frontend builds without errors: `npm run build` in frontend/
- [ ] No TypeScript errors in frontend build
- [ ] All tests pass (if tests exist)

### Production Build Test

- [ ] Backend tested with `NODE_ENV=production`
- [ ] Frontend build tested: `npm run build && npm run preview`
- [ ] No hardcoded localhost URLs in production build
- [ ] Build artifacts are under size limits

---

## 🧪 Functionality Testing

### Authentication

- [ ] User registration works (doctor & patient)
- [ ] User login works
- [ ] Token persistence (refresh page stays logged in)
- [ ] Logout works
- [ ] Protected routes redirect to login
- [ ] Profile updates work

### Core Features

- [ ] Doctor list displays correctly
- [ ] Doctor profiles load
- [ ] Appointment creation works
- [ ] Appointment updates work
- [ ] Appointment deletion works
- [ ] Real-time chat works (messages appear for both users)
- [ ] Video call connects successfully
- [ ] Image uploads work (profile pictures, chat images)

### Edge Cases

- [ ] Invalid login credentials show error
- [ ] Network errors handled gracefully
- [ ] Empty states display properly
- [ ] Long text doesn't break UI
- [ ] Large images handled correctly

---

## 🌐 Deployment Readiness

### Git Repository

- [ ] All changes committed
- [ ] Repository pushed to GitHub
- [ ] `.gitignore` configured correctly
- [ ] No `.env` files in repository
- [ ] README.md updated
- [ ] Clean commit history (optional)

### Backend Deployment

- [ ] Platform selected (Render/Railway/Vercel)
- [ ] Repository connected
- [ ] Build command set: `npm install`
- [ ] Start command set: `node src/index.js`
- [ ] Root directory set to `backend`
- [ ] All environment variables added
- [ ] Health check endpoint works: `GET /`

### Frontend Deployment

- [ ] Platform selected (Vercel/Netlify/Render)
- [ ] Repository connected
- [ ] Build command set: `npm run build`
- [ ] Output directory set to `dist`
- [ ] Root directory set to `frontend`
- [ ] Environment variable added: `VITE_BACKEND_URL`
- [ ] SPA routing configured (redirects to index.html)

---

## 🔗 Post-Deployment

### URL Configuration

- [ ] Backend URL copied from deployment platform
- [ ] Frontend URL copied from deployment platform
- [ ] Backend `FRONTEND_URL` updated with actual frontend URL
- [ ] Frontend `VITE_BACKEND_URL` updated with actual backend URL
- [ ] Both services redeployed after URL updates

### CORS Verification

- [ ] Frontend can make API calls to backend
- [ ] No CORS errors in browser console
- [ ] Credentials (cookies) sent correctly

### WebSocket Testing

- [ ] Socket.io connects successfully
- [ ] Real-time chat works
- [ ] Video call signaling works
- [ ] Check browser console for socket errors

---

## 🎯 Performance & Monitoring

### Performance

- [ ] Lighthouse score run on frontend (aim for 80+ on Performance)
- [ ] Images optimized (use WebP format if possible)
- [ ] Bundle size reasonable (<500KB for main.js)
- [ ] API response times acceptable (<2 seconds)

### Monitoring (Optional but Recommended)

- [ ] Error tracking setup (e.g., Sentry)
- [ ] Uptime monitoring (e.g., UptimeRobot)
- [ ] Analytics setup (e.g., Google Analytics)
- [ ] Backend logging configured
- [ ] Database monitoring enabled (MongoDB Atlas charts)

---

## 🧪 Production Smoke Tests

After deployment, run these tests on your live app:

### Basic Functionality

1. [ ] Homepage loads without errors
2. [ ] Register a new patient account
3. [ ] Login with new account
4. [ ] Update patient profile with avatar
5. [ ] View doctor list
6. [ ] Book an appointment
7. [ ] Register a new doctor account
8. [ ] Doctor can view appointments
9. [ ] Send chat message between doctor and patient
10. [ ] Initiate video call (test in two browsers)

### Cross-Browser Testing

- [ ] Chrome (desktop & mobile)
- [ ] Firefox (desktop)
- [ ] Safari (desktop & mobile)
- [ ] Edge (desktop)

### Device Testing

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

---

## 📱 Mobile Responsiveness

- [ ] Navigation menu works on mobile
- [ ] Forms are usable on small screens
- [ ] Chat interface readable on mobile
- [ ] Video call UI adapts to mobile
- [ ] Images scale properly
- [ ] No horizontal scrolling
- [ ] Touch targets are large enough (min 44x44px)

---

## 🔒 Security Verification

- [ ] HTTPS enabled (check for padlock icon)
- [ ] Cookies have `Secure` flag in production
- [ ] No sensitive data in browser console
- [ ] No API keys visible in frontend bundle
- [ ] CSP headers configured (optional but recommended)
- [ ] XSS protection headers set

---

## 📊 Final Checks

- [ ] All environment variables verified in deployment dashboard
- [ ] Database connection successful (check backend logs)
- [ ] Cloudinary uploads working
- [ ] Email notifications working (if implemented)
- [ ] No 404 errors on page refresh (SPA routing)
- [ ] Favicon displays correctly
- [ ] Page titles set correctly
- [ ] Meta tags for SEO (optional)

---

## 🚨 Rollback Plan

In case something goes wrong:

- [ ] Previous working version tagged in Git
- [ ] Database backup taken (MongoDB Atlas auto-backup enabled)
- [ ] Documented steps to revert deployment
- [ ] Emergency contact list ready

---

## 📞 Support & Documentation

- [ ] `DEPLOYMENT.md` guide reviewed
- [ ] `QUICK_START.md` tested by following steps
- [ ] `README.md` updated with deployment URLs
- [ ] Known issues documented
- [ ] FAQ prepared for common questions

---

## ✅ Deployment Complete!

Once all items are checked:

1. **Announce**: Share your live URLs with stakeholders
2. **Monitor**: Watch logs for first 24 hours
3. **Document**: Note any issues and resolutions
4. **Iterate**: Plan for future improvements

---

## 🎉 Congratulations!

Your Health-Connect app is now live! 🚀

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
