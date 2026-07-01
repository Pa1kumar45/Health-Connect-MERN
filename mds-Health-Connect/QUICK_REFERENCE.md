# Health-Connect - Quick Reference Guide

## 📋 Project Summary

A telemedicine platform enabling patients and doctors to connect through real-time video calls and chat messaging. Built with MERN stack + WebRTC.

---

## 🎯 Core Features

- **Authentication**: JWT-based with role-based access (Doctor/Patient)
- **Appointments**: Book, manage, and track medical consultations
- **Real-Time Chat**: Text and image messaging with Socket.IO
- **Video Calling**: WebRTC peer-to-peer video consultations
- **Profile Management**: Medical history, schedules, and personal info

---

## 🏗️ Architecture

### Backend (Port 5000)

```
Express.js + MongoDB + Socket.IO
├── Authentication: JWT tokens in HTTP-only cookies
├── Real-time: Socket.IO for chat & WebRTC signaling
├── Storage: Cloudinary for images
└── Database: MongoDB with Mongoose ODM
```

### Frontend (Port 5173)

```
React + TypeScript + Vite + Tailwind CSS
├── Routing: React Router DOM
├── State: React Context API
├── Real-time: Socket.IO Client + WebRTC
└── Styling: Tailwind CSS with dark mode
```

---

## 📊 Database Models

### Doctor

```javascript
{
  name, email, password, avatar, contactNumber,
  specialization, qualification, experience, about,
  schedule: [{
    day: String,
    slots: [{slotNumber, startTime, endTime, isAvailable}]
  }]
}
```

### Patient

```javascript
{
  name, email, password, avatar, dateOfBirth, gender,
  contactNumber, bloodGroup, allergies,
  emergencyContact: [{name, relationship, phone}]
}
```

### Appointment

```javascript
{
  doctorId, patientId,
  date, startTime, endTime,
  status: 'pending'|'scheduled'|'completed'|'cancelled',
  mode: 'video'|'chat',
  reason, comment, notes, rating, review
}
```

### Message

```javascript
{
  senderId, receiverId,
  text, image,
  type: 'text'|'image',
  read: Boolean
}
```

---

## 🔌 API Endpoints

### Auth (`/api/auth`)

- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user
- `POST /logout` - Logout user

### Doctors (`/api/doctors`)

- `GET /` - Get all doctors
- `GET /:id` - Get doctor by ID
- `PUT /profile` - Update doctor profile (protected)

### Patients (`/api/patients`)

- `GET /:id` - Get patient by ID
- `PUT /profile` - Update patient profile (protected)

### Appointments (`/api/appointments`)

- `POST /` - Create appointment (patient only)
- `GET /doctor` - Get doctor's appointments (doctor only)
- `GET /patient` - Get patient's appointments (patient only)
- `PUT /:id` - Update appointment
- `DELETE /:id` - Delete appointment

### Messages (`/api/message`)

- `GET /user/:id` - Get user details
- `GET /:receiverId` - Get messages with user
- `POST /send/:receiverId` - Send message

---

## 🔄 Socket.IO Events

### Chat

- `newMessage` - Broadcast new message to recipient

### Video Call (WebRTC Signaling)

- `call-user` - Initiate call (send offer)
- `call-made` - Incoming call notification
- `answer-call` - Accept call (send answer)
- `call-answered` - Call accepted
- `ice-candidate` - Exchange ICE candidates
- `call-rejected` - Call rejected
- `call-end` - End call

---

## 🔐 Authentication Flow

```
1. User Login/Register → JWT token created
2. Token stored in HTTP-only cookie (7-day expiry)
3. Socket connection established with userId
4. Protected routes verify JWT on each request
5. Middleware checks role-based permissions
```

---

## 📞 Video Call Flow

```
1. Caller clicks video call button
2. Get local media (camera/mic) → Create RTCPeerConnection
3. Create SDP offer → Send via Socket.IO
4. Receiver gets notification → Answer or Reject
5. If answered: Create SDP answer → Send via Socket.IO
6. Exchange ICE candidates for NAT traversal
7. P2P connection established → Video streams
8. Call controls: mute, video off, end call
```

---

## 💬 Chat Flow

```
1. User types message + optional image
2. Send to backend via POST /api/message/send/:receiverId
3. Backend saves to MongoDB
4. Socket.IO emits 'newMessage' to receiver
5. Receiver gets real-time update
6. Message appears in chat UI
```

---

## 🎨 Frontend Routes

```typescript
/ → DoctorList (Public)
/signup → SignUp (Public)
/login → Login (Public)
/appointments → PatientAppointments | DoctorDashboard (Protected)
/profile → PatientProfile | DoctorProfile (Protected)
/chat/:id → Chat (Protected)
/doctor/:id → DoctorPage (Public)
```

---

## 🗂️ Context Providers

### AppContext

- User authentication state
- Socket.IO connection
- Login/logout/signup functions
- Dark mode toggle

### VideoCallContext

- WebRTC connection management
- Local & remote media streams
- Call status & controls
- Start/answer/reject/end call functions

### MessageContext

- Message state management
- Send/fetch messages
- Selected user tracking

---

## 🛠️ Key Technologies

### Backend

- **Express**: Web framework
- **MongoDB + Mongoose**: Database
- **Socket.IO**: Real-time communication
- **JWT**: Authentication
- **Bcrypt**: Password hashing
- **Cloudinary**: Image storage

### Frontend

- **React 19**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **Socket.IO Client**: WebSocket client
- **Axios**: HTTP requests
- **React Router**: Navigation

---

## 🔒 Security Features

1. **HTTP-only cookies** - Prevent XSS attacks
2. **JWT expiration** - 7-day token lifetime
3. **Password hashing** - Bcrypt with salt
4. **Role-based access** - Middleware protection
5. **CORS configuration** - Restricted origins
6. **Secure cookies** - sameSite & secure flags

---

## 🚀 Quick Start

### Backend

```bash
cd backend
npm install
# Setup .env: MONGODB_URI, JWT_SECRET, FRONTEND_URL, Cloudinary keys
npm run dev
```

### Frontend

```bash
cd frontend
npm install
# Setup .env: VITE_BACKEND_URL
npm run dev
```

---

## 📝 Environment Variables

### Backend (.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/health_connect
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (.env)

```
VITE_BACKEND_URL=http://localhost:5000
```

---

## 🎯 User Roles & Permissions

### Patient

✅ Browse doctors
✅ Book appointments
✅ Chat with doctors
✅ Video call with doctors
✅ View appointment history
✅ Update profile

### Doctor

✅ View appointment requests
✅ Accept/reject appointments
✅ Manage schedule
✅ Chat with patients
✅ Video call with patients
✅ Add notes after consultations
✅ Update profile

---

## 📌 Important Notes

1. **WebRTC**: Uses Google STUN servers - works on most networks
2. **Socket.IO**: Auto-reconnection enabled
3. **Media Permissions**: Browser prompts for camera/mic access
4. **Dark Mode**: Default theme, stored in localStorage
5. **Image Upload**: Handled by Cloudinary (base64 → URL)
6. **Time Zones**: Handled on frontend (local display)

---

## 🐛 Common Issues & Solutions

**Socket not connecting?**

- Check BACKEND_URL environment variable
- Verify CORS configuration
- Ensure userId passed in query

**Video call not working?**

- Allow camera/mic permissions
- Check browser WebRTC support
- Verify STUN server accessibility

**Images not uploading?**

- Check Cloudinary credentials
- Verify file size limits
- Check network connectivity

---

## 📊 Project Statistics

- **Backend**: 5 models, 20+ endpoints, 5 controllers
- **Frontend**: 12+ pages, 8+ components, 3 contexts
- **Real-time**: 8 Socket.IO events
- **Database**: 4 collections
- **Authentication**: JWT + Role-based

---

## 🔗 Key Dependencies

```json
Backend: express, mongoose, socket.io, jsonwebtoken, bcryptjs, cloudinary
Frontend: react, typescript, socket.io-client, axios, tailwindcss, vite
```

---

**This project demonstrates modern full-stack development with real-time features and peer-to-peer communication!** 🚀
