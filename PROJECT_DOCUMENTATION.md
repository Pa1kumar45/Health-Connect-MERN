# Health-Connect - Telemedicine Platform

## 🏥 Project Overview

Health-Connect is a full-stack telemedicine application that enables seamless communication between patients and doctors through real-time video calls and chat messaging. Built with the MERN stack (MongoDB, Express, React, Node.js) and integrated with WebRTC for video calling capabilities.

---

## 🎯 Key Features

### 1. **User Management**

- Dual role system: Patients and Doctors
- Secure authentication using JWT tokens with HTTP-only cookies
- Role-based access control and authorization
- Profile management with avatars (Cloudinary integration)
- Password hashing using bcrypt

### 2. **Appointment System**

- Patients can book appointments with doctors
- Multiple appointment modes: Video or Chat
- Appointment status tracking: pending, scheduled, completed, cancelled, rescheduled
- Time slot management for doctors
- Appointment history and management
- Rating and review system for completed appointments

### 3. **Real-Time Chat**

- One-on-one messaging between patients and doctors
- Text and image sharing capabilities
- Real-time message delivery using Socket.IO
- Message history persistence
- Online user tracking

### 4. **Video Calling**

- Peer-to-peer video calls using WebRTC
- Real-time audio/video streaming
- Call controls: mute/unmute, video on/off
- Call status management: calling, ringing, connected
- ICE candidate exchange for NAT traversal
- Call rejection and ending functionality

### 5. **Doctor Features**

- Specialization and qualification management
- Weekly schedule configuration with time slots
- Appointment dashboard
- Patient interaction history
- Profile customization with experience and about sections

### 6. **Patient Features**

- Doctor search and discovery
- Medical profile: blood group, allergies, emergency contacts
- Appointment booking and tracking
- Chat with doctors
- Video consultation access

---

## 🏗️ Technical Architecture

### **Backend (Node.js + Express)**

#### **Core Technologies**

- **Express.js**: RESTful API server
- **MongoDB + Mongoose**: NoSQL database with ODM
- **Socket.IO**: Real-time bidirectional communication
- **JWT**: Secure authentication
- **Cloudinary**: Image storage and management
- **Bcrypt**: Password encryption

#### **Project Structure**

```
backend/
├── src/
│   ├── controllers/     # Business logic
│   │   ├── authController.js       # Authentication operations
│   │   ├── appointmentController.js # Appointment management
│   │   ├── doctorController.js     # Doctor operations
│   │   ├── patientController.js    # Patient operations
│   │   └── messageController.js    # Chat messaging
│   ├── models/          # Database schemas
│   │   ├── Doctor.js               # Doctor schema with schedule
│   │   ├── Patient.js              # Patient schema with medical info
│   │   ├── Appointment.js          # Appointment schema
│   │   └── Message.js              # Message schema
│   ├── routes/          # API endpoints
│   │   ├── auth.js                 # /api/auth/*
│   │   ├── doctors.js              # /api/doctors/*
│   │   ├── patients.js             # /api/patients/*
│   │   ├── appointments.js         # /api/appointments/*
│   │   └── message.js              # /api/message/*
│   ├── middleware/
│   │   └── auth.js                 # JWT verification & role checks
│   ├── lib/
│   │   ├── socket.js               # Socket.IO setup & WebRTC signaling
│   │   ├── cloudinary.js           # Cloudinary configuration
│   │   ├── db.js                   # MongoDB connection
│   │   └── utils.js                # JWT token generation
│   └── index.js         # Entry point
```

#### **Database Models**

**Doctor Schema**

- Personal: name, email, password, avatar, contactNumber
- Professional: specialization, qualification, experience, about
- Schedule: Weekly slots with availability status
- Timestamps: createdAt, updatedAt

**Patient Schema**

- Personal: name, email, password, avatar, dateOfBirth, gender
- Medical: bloodGroup, allergies, emergencyContact
- Contact: contactNumber
- Timestamps: createdAt, updatedAt

**Appointment Schema**

- References: doctorId, patientId
- Scheduling: date, startTime, endTime
- Status: pending/scheduled/completed/cancelled/rescheduled
- Mode: video/chat
- Details: reason, comment, notes
- Feedback: rating, review

**Message Schema**

- References: senderId, receiverId
- Content: text, image
- Metadata: read status, type (text/image)
- Timestamps: createdAt

#### **API Endpoints**

**Authentication** (`/api/auth`)

- POST `/register` - User registration (doctor/patient)
- POST `/login` - User login
- GET `/me` - Get current user
- POST `/logout` - User logout

**Doctors** (`/api/doctors`)

- GET `/` - List all doctors
- GET `/:id` - Get specific doctor
- PUT `/profile` - Update doctor profile
- GET `/schedule` - Get doctor schedule

**Patients** (`/api/patients`)

- GET `/:id` - Get patient details
- PUT `/profile` - Update patient profile

**Appointments** (`/api/appointments`)

- POST `/` - Create appointment
- GET `/` - Get all appointments
- GET `/doctor` - Get doctor appointments
- GET `/patient` - Get patient appointments
- PUT `/:id` - Update appointment
- DELETE `/:id` - Delete appointment

**Messages** (`/api/message`)

- GET `/user/:id` - Get user details
- GET `/:receiverId` - Fetch message history
- POST `/send/:receiverId` - Send message

#### **Socket.IO Events**

**Video Call Signaling**

- `call-user`: Initiate call with SDP offer
- `call-made`: Receive incoming call
- `answer-call`: Send SDP answer
- `call-answered`: Receive call answer
- `ice-candidate`: Exchange ICE candidates
- `call-rejected`: Handle call rejection
- `call-end`: End active call

**Real-Time Messaging**

- `newMessage`: Broadcast new messages
- Online user tracking via Map data structure

---

### **Frontend (React + TypeScript + Vite)**

#### **Core Technologies**

- **React 19**: UI framework
- **TypeScript**: Type safety
- **React Router DOM**: Client-side routing
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **Socket.IO Client**: Real-time communication
- **Axios**: HTTP client
- **Lucide React**: Icon library

#### **Project Structure**

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Navbar.tsx              # Navigation bar
│   │   ├── VideoCall.tsx           # Video call interface
│   │   ├── MessageInput.tsx        # Chat input component
│   │   └── LoadingSpinner.tsx      # Loading indicator
│   ├── pages/           # Route pages
│   │   ├── Login.tsx               # Login page
│   │   ├── SignUp.tsx              # Registration page
│   │   ├── DoctorList.tsx          # Browse doctors
│   │   ├── DoctorPage.tsx          # Individual doctor profile
│   │   ├── DoctorDashboard.tsx     # Doctor appointment view
│   │   ├── DoctorProfile.tsx       # Doctor profile management
│   │   ├── PatientProfile.tsx      # Patient profile management
│   │   ├── PatientAppointments.tsx # Patient appointment view
│   │   └── Chat.tsx                # Chat interface
│   ├── context/         # React Context providers
│   │   ├── AppContext.tsx          # Global app state & auth
│   │   ├── VideoCallContext.tsx    # WebRTC video call management
│   │   └── MessageContext.tsx      # Chat state management
│   ├── services/        # API service layer
│   │   ├── api.service.ts          # Generic API calls
│   │   ├── auth.service.ts         # Authentication services
│   │   ├── doctor.service.ts       # Doctor-related APIs
│   │   └── appointment.service.ts  # Appointment APIs
│   ├── types/           # TypeScript type definitions
│   │   ├── index.ts                # Main types export
│   │   └── types.ts                # Interface definitions
│   ├── utils/           # Utility functions
│   │   ├── axios.ts                # Axios configuration
│   │   └── auth.ts                 # Auth utilities
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
```

#### **State Management**

**AppContext**: Global application state

- User authentication state
- Socket.IO connection management
- Theme management (dark/light mode)
- Login/logout/signup functions

**VideoCallContext**: WebRTC call management

- RTCPeerConnection handling
- Local/remote media streams
- Call status: idle/calling/ringing/connected
- ICE candidate buffering
- Call controls: start, answer, reject, end

**MessageContext**: Chat functionality

- Message state management
- Fetch and send messages
- Selected user tracking
- Real-time message updates

#### **WebRTC Implementation**

**Call Flow**

1. **Initiator**:
   - Get local media stream
   - Create RTCPeerConnection
   - Create SDP offer
   - Send offer via Socket.IO
2. **Receiver**:
   - Receive offer
   - Create RTCPeerConnection
   - Set remote description (offer)
   - Create SDP answer
   - Send answer via Socket.IO
3. **Connection**:
   - Exchange ICE candidates
   - Establish peer-to-peer connection
   - Stream audio/video

**Configuration**

- STUN servers: Google STUN servers for NAT traversal
- ICE candidate buffering for race conditions
- Graceful cleanup on disconnect

---

## 🔐 Security Features

1. **Authentication**

   - JWT tokens stored in HTTP-only cookies
   - 7-day token expiration
   - Secure cookie flags (httpOnly, sameSite: strict, secure)
   - Password hashing with bcrypt (salt rounds: 12-14)

2. **Authorization**

   - Role-based middleware: `protect`, `doctorOnly`, `patientOnly`
   - Route-level access control
   - User verification on every protected request

3. **CORS Configuration**

   - Credentials enabled
   - Specific origin whitelisting
   - Allowed methods and headers defined

4. **Input Validation**
   - Express-validator for request validation
   - Schema validation via Mongoose
   - Type safety with TypeScript on frontend

---

## 🌐 Real-Time Communication

### **Socket.IO Architecture**

- Server and client maintain persistent WebSocket connections
- User tracking via `userId` in handshake query
- Online users stored in Map for O(1) lookup
- Event-driven architecture for scalability

### **WebRTC Architecture**

- Peer-to-peer architecture reduces server load
- STUN servers for NAT traversal
- Signal exchange via Socket.IO
- Automatic reconnection handling
- Support for audio/video controls

---

## 📱 User Interface

### **Design System**

- Dark mode as default
- Responsive design with Tailwind CSS
- Mobile-first approach
- Accessible components with ARIA labels
- Loading states and error handling

### **Key Pages**

1. **Doctor List**: Browse and filter doctors by specialization
2. **Appointment Booking**: Schedule with date/time selection
3. **Chat Interface**: Real-time messaging with media sharing
4. **Video Call**: Full-screen video interface with controls
5. **Profile Management**: Edit personal and professional details
6. **Dashboard**: View and manage appointments

---

## 🚀 Getting Started

### **Prerequisites**

- Node.js (v14+)
- MongoDB (local or Atlas)
- Cloudinary account for image uploads

### **Backend Setup**

```bash
cd backend
npm install
# Create .env file with:
# - MONGODB_URI
# - JWT_SECRET
# - FRONTEND_URL
# - CLOUDINARY credentials
npm run dev  # Development server on port 5000
```

### **Frontend Setup**

```bash
cd frontend
npm install
# Create .env file with:
# - VITE_BACKEND_URL
npm run dev  # Development server on port 5173
```

---

## 📦 Dependencies

### **Backend**

- `express`: Web framework
- `mongoose`: MongoDB ODM
- `socket.io`: Real-time communication
- `jsonwebtoken`: JWT authentication
- `bcryptjs`: Password hashing
- `cloudinary`: Image management
- `cors`: Cross-origin resource sharing
- `cookie-parser`: Cookie handling
- `dotenv`: Environment variables
- `express-validator`: Request validation

### **Frontend**

- `react` & `react-dom`: UI library
- `react-router-dom`: Routing
- `socket.io-client`: WebSocket client
- `axios`: HTTP client
- `tailwindcss`: CSS framework
- `lucide-react`: Icons
- `typescript`: Type safety
- `vite`: Build tool

---

## 🔄 Data Flow

### **Authentication Flow**

1. User submits credentials → Backend validates
2. JWT token generated → Stored in HTTP-only cookie
3. Frontend stores user data in context
4. Socket connection established with userId
5. Protected routes verify token on each request

### **Appointment Flow**

1. Patient browses doctors
2. Selects time slot → Creates appointment (pending)
3. Doctor receives notification → Confirms appointment
4. Status updated → Both parties notified
5. At scheduled time → Video/chat session initiated

### **Chat Flow**

1. User sends message → API stores in database
2. Socket.IO emits to receiver's socket
3. Receiver gets real-time update
4. Message history persisted for future sessions

### **Video Call Flow**

1. Caller initiates → Creates WebRTC offer
2. Offer sent via Socket.IO → Receiver gets notification
3. Receiver accepts → Creates answer
4. ICE candidates exchanged → P2P connection established
5. Audio/video streams directly between peers

---

## 🎨 Notable Technical Decisions

1. **Separation of Auth Models**: Separate Doctor and Patient models for schema flexibility
2. **Socket.IO for Signaling**: Centralized signaling for WebRTC despite P2P architecture
3. **Cookie-based Auth**: HTTP-only cookies prevent XSS attacks
4. **Context API**: Lightweight state management suitable for app size
5. **TypeScript Frontend**: Type safety reduces runtime errors
6. **Cloudinary Integration**: Offload image storage and optimization
7. **Schedule Slots System**: Flexible time slot management for doctors

---

## 🔮 Future Enhancements

- [ ] Group video calls for consultations
- [ ] File upload for medical records
- [ ] Prescription management system
- [ ] Payment integration
- [ ] Email/SMS notifications
- [ ] Admin dashboard
- [ ] Advanced search and filtering
- [ ] Calendar integration
- [ ] Medical history tracking
- [ ] Multi-language support

---

## 📄 License & Credits

This project demonstrates a modern full-stack telemedicine platform with real-time capabilities, showcasing best practices in web development, security, and user experience design.

**Tech Stack**: MERN + WebRTC + Socket.IO + TypeScript + Tailwind CSS

---

**Built with ❤️ for connecting patients and doctors virtually**
