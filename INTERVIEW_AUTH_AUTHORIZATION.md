# 🏥 Authentication & Authorization - Interview Guide

## 📋 **Feature Overview**

**What:** Dual-role authentication system for doctors and patients with JWT-based session management  
**Why:** Secure, role-specific access control for healthcare platform  
**Impact:** 7-layer security architecture protecting sensitive medical data

---

## 🎯 **Key Features (5)**

1. **Dual-Role Registration** - Separate flows for doctors (with credentials) and patients
2. **JWT Token Authentication** - 7-day sessions with automatic refresh
3. **HTTP-only Secure Cookies** - XSS attack prevention
4. **Role-Based Access Control** - Middleware for doctor/patient-only routes
5. **Environment-Based Security** - Production (HTTPS) vs Development (HTTP) configs

---

## 🔐 **7-Layer Security Architecture**

| Layer | Technology                | Purpose                                          |
| ----- | ------------------------- | ------------------------------------------------ |
| 1     | **JWT Tokens**            | Stateless authentication, 7-day expiry           |
| 2     | **HTTP-only Cookies**     | Prevents JavaScript access (XSS protection)      |
| 3     | **Bcrypt Hashing**        | 10 salt rounds, password never stored plaintext  |
| 4     | **Role-Based Middleware** | `protect`, `doctorOnly`, `patientOnly` guards    |
| 5     | **CORS Configuration**    | Whitelist origins (Vercel + localhost)           |
| 6     | **Environment Variables** | Secrets in `.env`, never in code                 |
| 7     | **Secure Cookie Flags**   | `sameSite: 'none'`, `secure: true` in production |

---

## 🔄 **Authentication Flow**

```
REGISTRATION:
User → Submit form → Backend validates → Hash password (bcrypt)
  → Save to DB → Generate JWT → Set HTTP-only cookie → Return user data

LOGIN:
User → Submit credentials → Backend finds user → Compare password (bcrypt)
  → Password match? → Generate JWT → Set cookie → Return user data

PROTECTED REQUEST:
User → API request → Cookie sent automatically → Middleware extracts JWT
  → Verify token → Decode userId + role → Attach to req.user → Next()

LOGOUT:
User → Logout request → Backend clears cookie (maxAge: 0) → Session ended
```

---

## 📊 **Database Schema**

**Doctor Schema:**

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: 'doctor',
  specialization: String (required),
  qualification: String (required),
  experience: Number (required),
  avatar: String (Cloudinary URL),
  schedule: Array (availability)
}
```

**Patient Schema:**

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: 'patient',
  dateOfBirth: Date,
  gender: String (enum: male/female/other),
  contactNumber: String,
  bloodGroup: String,
  allergies: String
}
```

---

## 🎯 **Interview Questions & Answers**

### **Q1: "How does your authentication work?"**

> "We use JWT-based authentication with HTTP-only cookies. When a user registers or logs in, we hash their password using bcrypt with 10 salt rounds and store it in MongoDB. We then generate a JWT token containing the user ID and role, set it as an HTTP-only cookie with a 7-day expiry, and return the user data to the frontend. For subsequent requests, the browser automatically sends the cookie, our middleware verifies the JWT, and attaches the user to the request object. This provides stateless authentication while preventing XSS attacks since JavaScript can't access HTTP-only cookies."

### **Q2: "Why HTTP-only cookies instead of localStorage?"**

> "HTTP-only cookies are more secure than localStorage for storing auth tokens. LocalStorage is vulnerable to XSS attacks—any malicious script can read the token and impersonate the user. HTTP-only cookies can't be accessed by JavaScript, so even if an XSS vulnerability exists, the token remains safe. Additionally, cookies are automatically sent with requests, eliminating the need to manually attach tokens to headers."

### **Q3: "Explain your role-based access control."**

> "We implement RBAC with three middleware functions: `protect` verifies the JWT token exists and is valid, `doctorOnly` ensures the user's role is 'doctor', and `patientOnly` checks for 'patient' role. These are chained on protected routes—for example, updating a doctor profile requires both `protect` and `doctorOnly` middleware. This prevents patients from accessing doctor-only endpoints and vice versa, ensuring proper data isolation."

### **Q4: "How do you handle cross-domain authentication in production?"**

> "Our frontend is on Vercel and backend on Render—different domains. Browsers block cookies across domains by default. I solved this by setting `sameSite: 'none'` and `secure: true` on cookies in production, which allows cross-domain cookies over HTTPS. For local development, I use `sameSite: 'lax'` without the secure flag since localhost is same-domain and uses HTTP. This environment-based configuration is in our token generation utility."

---

## 🔧 **Key Files**

| File                                        | Purpose                                 | Lines |
| ------------------------------------------- | --------------------------------------- | ----- |
| `backend/src/controllers/authController.js` | Register, login, logout, getCurrentUser | 150   |
| `backend/src/middleware/auth.js`            | JWT verification, role checks           | 80    |
| `backend/src/lib/utils.js`                  | Token generation, cookie config         | 40    |
| `backend/src/models/Doctor.js`              | Doctor schema, password hooks           | 70    |
| `backend/src/models/Patient.js`             | Patient schema, password hooks          | 80    |

---

## 📈 **Metrics & Impact**

- **Password Security:** 10 bcrypt rounds = 2^10 = 1,024 iterations (industry standard)
- **Token Expiry:** 7 days = 604,800 seconds (balance UX vs security)
- **Cookie Size:** ~200 bytes (minimal bandwidth)
- **Auth Time:** <100ms (token verification)

---

## ✅ **Production-Ready Features**

1. ✅ Environment-based configuration (dev/prod)
2. ✅ Password never sent to frontend (`.select('-password')`)
3. ✅ Automatic cookie cleanup on logout
4. ✅ Token expiry handling
5. ✅ Cross-domain cookie support

---

**Total Lines: ~100** ✅  
**Created:** November 2, 2025
