# Health-Connect Application Architecture

## 🏗️ System Overview

Health-Connect is a full-stack telemedicine platform with **React TypeScript frontend on Vercel**, **Express.js backend on Render**, connected to **MongoDB Atlas**, **Cloudinary CDN**, and **WebRTC** for video calls.

```
Client (Vercel) ←→ HTTPS/WSS ←→ Server (Render) ←→ MongoDB + Cloudinary
                    Socket.IO                         WebRTC P2P
```

## 📦 Technology Stack

### Frontend (Vercel)

- React 19.0 + TypeScript, Vite 6.2, TailwindCSS 4.0
- React Router 7.3, Axios 1.8, Socket.IO Client 4.8, SimplePeer 9.11
- Context API for state management

### Backend (Render)

- Node.js + Express 4.21, Mongoose 8.12, Socket.IO 4.8
- JWT (jsonwebtoken 9.0) + bcryptjs 3.0, Cloudinary 2.6, Express-validator 7.2

## 🏛️ Architecture Layers

**Frontend:** `src/pages/` (UI components), `src/services/` (API calls), `src/context/` (state management)  
**Backend:** `src/routes/` (API endpoints), `src/controllers/` (business logic), `src/models/` (data schemas), `src/middleware/` (auth), `src/lib/` (external services)

## 🌐 Core API Endpoints

**Auth:** `POST /api/auth/signup|login|logout`, `GET /api/auth/me`  
**Doctors:** `GET /api/doctors`, `GET /api/doctors/:id`, `PUT /api/doctors/profile`  
**Patients:** `GET|PUT /api/patients/profile`  
**Appointments:** `GET|POST /api/appointments`, `PUT|DELETE /api/appointments/:id`  
**Messages:** `GET /api/messages/:userId`, `POST /api/messages/send`

## 💬 Real-time Communication (Socket.IO)

**Client → Server Events:** `user-online`, `send-message`, `video-call-request|accept|reject`, `video-signal`  
**Server → Client Events:** `user-online|offline`, `new-message`, `incoming-call`, `call-accepted`, `video-signal`

## 🎥 Video Call Flow (WebRTC + Socket.IO)

1. Patient sends call request via Socket.IO → 2. Doctor accepts → 3. Exchange SDP offers/answers via signaling → 4. Exchange ICE candidates → 5. Direct P2P connection established for audio/video streaming

## 🗄️ MongoDB Collections

**Patients:** `{_id, name, email, password(hashed), role:"patient", phone, dateOfBirth, gender, profilePicture, medicalHistory[]}`  
**Doctors:** `{_id, name, email, password(hashed), role:"doctor", specialization, qualification, experience, phone, profilePicture, rating, availableSlots[], consultationFee}`  
**Appointments:** `{_id, patientId, doctorId, appointmentDate, status(pending|confirmed|completed|cancelled), reason, notes}`  
**Messages:** `{_id, senderId, receiverId, message, timestamp, read, attachments[]}`

## 🔐 Authentication Flow

1. User submits credentials → 2. Backend validates with bcrypt → 3. Server generates JWT, sets HTTP-only cookie → 4. Subsequent requests auto-attach cookie → 5. Middleware verifies JWT → 6. Access granted/denied based on role

## 📤 Cloudinary Upload Flow

Client uploads image → Server receives FormData → Forwards to Cloudinary → Returns CDN URL → Saves URL to MongoDB profilePicture field

## 🚀 Deployment & Environment

**Vercel (Frontend):** Build: `npm run build`, Output: `dist/`, Env: `VITE_BACKEND_URL`  
**Render (Backend):** Start: `npm start`, Env: `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`, `CLOUDINARY_*`, `PORT:5000`  
**CORS:** `origin: process.env.FRONTEND_URL, credentials: true, methods: ["GET","POST","PUT","DELETE","PATCH","OPTIONS"]`

## 🎯 Key Features

**Authentication:** JWT in HTTP-only cookies, bcryptjs password hashing, role-based access (patient/doctor)  
**Real-time Chat:** Socket.IO instant messaging, online/offline status, MongoDB persistence  
**Video Calling:** WebRTC P2P video, SimplePeer wrapper, Socket.IO signaling  
**Appointments:** Doctor availability scheduling, booking system, status tracking  
**Profile Management:** Cloudinary image uploads, personal info updates, medical history

## 🔒 Security & Performance

**Security:** HTTP-only cookies (XSS prevention), JWT expiration, bcrypt hashing, express-validator sanitization, CORS whitelist, HTTPS/WSS  
**Performance:** React.lazy code splitting, Vite fast builds, TailwindCSS purging, MongoDB indexing, Cloudinary CDN, WebSocket persistent connections

## 📱 User Roles

**Patients:** Browse/search doctors, book appointments, chat, video consultations, manage profile/medical history  
**Doctors:** Manage availability, view appointments, chat with patients, conduct video consultations, update profile

## 🛠️ Development vs Production

**Dev:** Frontend `npm run dev` (localhost:5173), Backend `npm run dev` (localhost:5000), Local/Atlas MongoDB  
**Prod:** Frontend on Vercel CDN, Backend on Render with auto-scaling, MongoDB Atlas replica sets

---

**Version 1.0.0** | Last Updated: January 9, 2026
