# Health-Connect - Project Documentation (Concise)

## 🏥 Overview

Full-stack telemedicine platform: MERN + WebRTC + Socket.IO. Real-time video calls, chat, appointment booking with role-based access (doctors/patients).

---

## 🎯 Core Features

1. **Authentication**: JWT + HTTP-only cookies, bcrypt hashing, role-based access
2. **Appointments**: Book/manage with video or chat mode, status tracking, ratings
3. **Real-Time Chat**: Socket.IO messaging, text + images, online tracking
4. **Video Calls**: WebRTC P2P, STUN NAT traversal, call controls
5. **Doctor**: Specialization, schedule slots, dashboard
6. **Patient**: Browse doctors, book appointments, medical profile

---

## 🏗️ Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose, Socket.IO, JWT, Cloudinary  
**Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Socket.IO Client, Axios  
**Real-Time:** Socket.IO (signaling + chat), WebRTC (P2P video)

---

## 📁 Structure

### Backend (`backend/src/`)

```
controllers/  → Business logic (auth, appointments, doctors, patients, messages)
models/       → Mongoose schemas (Doctor, Patient, Appointment, Message)
routes/       → API endpoints (/api/auth, /doctors, /patients, /appointments, /message)
middleware/   → auth.js (protect, doctorOnly, patientOnly)
lib/          → socket.js (WebRTC signaling), cloudinary.js, db.js, utils.js (JWT)
index.js      → Entry point
```

### Frontend (`frontend/src/`)

```
components/   → Navbar, VideoCall, MessageInput, LoadingSpinner
pages/        → Login, SignUp, DoctorList, DoctorPage, Chat, Dashboards, Profiles
context/      → AppContext (auth, socket), VideoCallContext (WebRTC), MessageContext
services/     → API layer (auth, doctor, appointment services)
types/        → TypeScript interfaces
utils/        → axios config, auth helpers
```

---

## 📊 Database Models

**Doctor**: name, email, password, specialization[], experience, schedule[], avatar  
**Patient**: name, email, password, bloodGroup, allergies, emergencyContact, avatar  
**Appointment**: doctorId, patientId, date, startTime, endTime, status, mode, reason, notes, rating, review  
**Message**: senderId, receiverId, text, image, createdAt

**Indexes**: email (unique), doctorId, patientId, (senderId + receiverId)

---

## 🔌 API Endpoints

| Route                           | Method | Purpose              | Auth                  |
| ------------------------------- | ------ | -------------------- | --------------------- |
| `/api/auth/register`            | POST   | Register user        | -                     |
| `/api/auth/login`               | POST   | Login                | -                     |
| `/api/auth/me`                  | GET    | Get current user     | protect               |
| `/api/auth/logout`              | POST   | Logout               | protect               |
| `/api/doctors`                  | GET    | List doctors         | -                     |
| `/api/doctors/:id`              | GET    | Get doctor           | -                     |
| `/api/doctors/profile`          | PUT    | Update profile       | protect + doctorOnly  |
| `/api/appointments`             | POST   | Create appointment   | protect + patientOnly |
| `/api/appointments/doctor`      | GET    | Doctor appointments  | protect + doctorOnly  |
| `/api/appointments/patient`     | GET    | Patient appointments | protect + patientOnly |
| `/api/appointments/:id`         | PUT    | Update appointment   | protect               |
| `/api/message/:receiverId`      | GET    | Message history      | protect               |
| `/api/message/send/:receiverId` | POST   | Send message         | protect               |

---

## 🔐 Security

1. **Auth**: JWT (7-day expiry) in HTTP-only cookies (`httpOnly`, `secure`, `sameSite: strict`)
2. **Passwords**: Bcrypt 12-14 rounds
3. **Authorization**: Middleware chain: `protect` → verify JWT → `doctorOnly`/`patientOnly`
4. **CORS**: Credentials enabled, specific origin
5. **Data**: `.select('-password')` in queries
6. **WebRTC**: DTLS-SRTP encryption, P2P (media bypasses server)

---

## ⚡ Real-Time Architecture

**Socket.IO** (`backend/src/lib/socket.js`):

- **Chat**: `newMessage` event, Map for O(1) user lookup
- **Signaling**: `call-user`, `call-made`, `answer-call`, `ice-candidate`, `call-end`

**WebRTC** (`frontend/src/context/VideoCallContext.tsx`):

1. `getUserMedia()` → Local stream
2. Create `RTCPeerConnection` with STUN servers
3. Generate SDP offer/answer → Exchange via Socket.IO
4. ICE candidates → Buffered until remote description set
5. P2P connection → Direct media streaming

**Race Condition Fix**: Buffer ICE in ref until `setRemoteDescription()` completes

---

## 🎨 State Management (React Context API)

1. **AppContext**: `currentUser`, `socket`, auth functions, theme
2. **VideoCallContext**: `localStream`, `remoteStream`, `callStatus`, `peerConnectionRef` (ref)
3. **MessageContext**: `messages[]`, `selectedUser`
4. **Component State**: Forms, UI toggles, local data

**Pattern**: Global → Feature → Component levels, refs for non-reactive objects

---

## 🔄 Key Flows

### Authentication

Login → JWT generated → HTTP-only cookie → `getCurrentUser()` → Connect Socket.IO

### Appointment

Browse doctors → Select slot → `POST /appointments` → Doctor confirms → Status: scheduled

### Chat

Send → `POST /message/send/:id` → MongoDB save → `socket.emit('newMessage')` → Receiver updates UI

### Video Call

Call → SDP offer → Socket.IO → Receiver answers → SDP answer → ICE exchange → P2P connection

---

## 🚀 Setup

**Backend**:

```bash
cd backend
npm install
# .env: MONGODB_URI, JWT_SECRET, FRONTEND_URL, CLOUDINARY_*
npm run dev  # Port 5000
```

**Frontend**:

```bash
cd frontend
npm install
# .env: VITE_BACKEND_URL
npm run dev  # Port 5173
```

---

## 📦 Key Dependencies

**Backend**: express, mongoose, socket.io, jsonwebtoken, bcryptjs, cloudinary, cors  
**Frontend**: react, react-router-dom, socket.io-client, axios, tailwindcss, typescript, vite

---

## 🎯 Technical Highlights

- **Hybrid Real-Time**: Socket.IO (control) + WebRTC (media)
- **Security**: HTTP-only cookies, role-based middleware, bcrypt
- **Scalability**: P2P offloads video, Map O(1) lookups, indexed queries
- **Type Safety**: TypeScript frontend, Mongoose schemas
- **Cloud Storage**: Cloudinary CDN for images
- **Responsive**: Tailwind CSS, dark mode, mobile-first

---

## 🔮 Future Enhancements

Group video calls, medical records upload, prescriptions, payments, notifications, admin dashboard, calendar sync, multi-language

---

**MERN + WebRTC + Socket.IO | Full-Stack Telemedicine Platform**

**Condensed from 375 lines to 150 lines (~60% reduction)**
