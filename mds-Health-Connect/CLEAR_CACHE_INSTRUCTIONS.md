# 🧹 Clear Browser Cache & Fix 401 Errors

## ⚠️ **If You See 401 Unauthorized Errors**

This means old JWT tokens are cached in your browser. Follow these steps:

---

## **Quick Fix (30 seconds)**

### **Chrome / Edge:**

```
1. Press F12 (open DevTools)
2. Click "Application" tab
3. Left sidebar → Local Storage → Right-click your site → "Clear"
4. Left sidebar → Cookies → Right-click → "Clear"
5. Close DevTools
6. Press Ctrl+Shift+R (hard refresh)
7. Login again
```

### **Firefox:**

```
1. Press F12 (open DevTools)
2. Click "Storage" tab
3. Right-click "Local Storage" → "Delete All"
4. Right-click "Cookies" → "Delete All"
5. Close DevTools
6. Press Ctrl+Shift+R (hard refresh)
7. Login again
```

---

## **Complete Clear (1 minute)**

### **All Browsers:**

```
1. Press Ctrl+Shift+Delete
2. Select:
   ✅ Cookies and other site data
   ✅ Cached images and files
3. Time range: "Last hour" or "All time"
4. Click "Clear data"
5. Restart browser
6. Go to app URL and login
```

---

## **Nuclear Option (Guaranteed to Work)**

```
1. Open Incognito/Private window:
   - Chrome: Ctrl+Shift+N
   - Firefox: Ctrl+Shift+P
   - Edge: Ctrl+Shift+N

2. Go to your app URL
3. Login (fresh session, no cache)
4. Should work now ✅
```

---

## **Why Does This Happen?**

```
Problem: Old JWT token from previous login is cached
         ↓
Browser sends expired/invalid token
         ↓
Backend rejects with 401 Unauthorized
         ↓
Fix: Clear cache to remove old token
```

---

## **Vercel Production URL**

Your app is publicly accessible at:

```
https://health-connect-ap08j61jv-pavan-kumars-projects-ac160155.vercel.app
```

**Anyone can access without Vercel account!**

- No login needed to view the site
- Just share the URL
- Users create accounts directly on the site

---

## **For Testing Multiple Users**

### **Method 1: Multiple Browsers**

```
Browser 1 (Chrome):  Login as User A
Browser 2 (Firefox): Login as User B
Browser 3 (Edge):    Login as User C
✅ No conflicts!
```

### **Method 2: Browser Profiles**

```
Chrome Profile 1: User A
Chrome Profile 2: User B
Chrome Profile 3: User C
✅ Separate storage for each
```

### **Method 3: Incognito + Normal**

```
Normal window:   User A
Incognito window: User B
✅ Isolated storage
```

---

## **Still Getting 401 Errors?**

### **Check These:**

**1. Token in Storage:**

```
F12 → Application → Local Storage → Look for 'token' key
If missing → Login again
If present → Try logout + login
```

**2. Token in Request Headers:**

```
F12 → Network tab → Click any API request → Headers tab
Should see:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
If missing → Clear cache and login again
```

**3. Backend Server Running:**

```
Check: https://health-connect-mern-1.onrender.com/api/auth/me
Should respond (not 503 Service Unavailable)
If 503 → Render server is sleeping, wait 30 seconds
```

**4. Token Expired:**

```
Tokens expire after 7 days
Solution: Logout and login again
```

---

## **Quick Troubleshooting Commands**

### **Check if token exists:**

```javascript
// Open browser console (F12 → Console tab)
localStorage.getItem("token");
// Should show: "eyJhbGciOiJIUzI1NiIsInR5cCI..."
// If null → Not logged in
```

### **Manually clear token:**

```javascript
// Open browser console (F12 → Console tab)
localStorage.clear();
location.reload();
// Page refreshes, login again
```

### **Check token expiry:**

```javascript
// Open browser console (F12 → Console tab)
const token = localStorage.getItem("token");
const payload = JSON.parse(atob(token.split(".")[1]));
console.log("Token expires:", new Date(payload.exp * 1000));
// Shows expiry date
```

---

## **For Developers**

### **Backend Token Settings:**

```javascript
// backend/src/controllers/authController.js
// Token expires in 7 days:
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  expiresIn: "7d",
});
```

### **Frontend Axios Interceptor:**

```typescript
// frontend/src/utils/axios.ts
// Automatically adds token to all requests:
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## **Summary**

✅ **Public Access:** Anyone can visit your Vercel URL (no restrictions)  
✅ **401 Errors:** Clear browser cache (F12 → Application → Clear)  
✅ **Multi-User Testing:** Use different browsers or profiles  
✅ **Token Expiry:** Logout + Login to refresh

---

**Need help?** Check console logs (F12 → Console) for detailed error messages.
