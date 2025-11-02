# Health-Connect - Architecture Diagrams (Concise)

Quick visual reference for technical interviews. Use these for whiteboard discussions.

---

## 1. System Architecture

```
CLIENTS (React + TypeScript)
├─ Doctor: Dashboard, Appointments, Video/Chat UI
└─ Patient: Doctor List, Booking, Video/Chat UI
        │
        ├─ REST API (Axios) ──────────┐
        └─ Socket.IO + WebRTC (P2P) ───┤
                                       ▼
BACKEND (Node.js + Express)
├─ REST API: /auth, /doctors, /patients, /appointments, /messages
├─ Socket.IO: Signaling (WebRTC) + Chat delivery
├─ Middleware: JWT (protect, doctorOnly, patientOnly)
└─ Controllers → Models → MongoDB
        │
        ▼
DATABASE (MongoDB)
├─ Doctor (schedule, specialization)
├─ Patient (basic info)
├─ Appointment (status, mode, notes)
└─ Message (text, image URLs)
        │
        ▼
EXTERNAL SERVICES
└─ Cloudinary (Image CDN)
```

**Key:** WebRTC media goes P2P (bypasses server), REST/Socket.IO for control plane

---

## 2. WebRTC Connection Flow

```
USER A                    SOCKET.IO SERVER          USER B
  │                              │                     │
  │ 1. Click "Call"              │                     │
  ├──► getUserMedia()            │                     │
  │    (Camera/Mic)              │                     │
  │                              │                     │
  │ 2. Create Offer (SDP)        │                     │
  ├─────────────────────────────►│                     │
  │    socket.emit('call-user')  │                     │
  │                              ├────────────────────►│
  │                              │  'call-made' event  │
  │                              │                     │
  │                              │  3. User B Answers  │
  │                              │◄────────────────────┤
  │                              │  socket.emit()      │
  │◄─────────────────────────────┤                     │
  │    'call-answered' event     │                     │
  │                              │                     │
  │ 4. ICE Candidates Exchange   │                     │
  │◄────────────────────────────►│◄───────────────────►│
  │    (Buffered until RD set)   │                     │
  │                              │                     │
  │ 5. Direct P2P Connection Established              │
  │◄═════════════════════════════════════════════════►│
        (Video/Audio streams, bypasses server)
```

**Race Condition Fix:** Buffer ICE in ref until `setRemoteDescription()` completes

---

## 3. Socket.IO Event Flow

```javascript
// Backend: onlineUsers Map
userId1 → socketId1
userId2 → socketId2

// Chat Message
Client A: sendMessage() → POST /api/message/send/:receiverId
                         → MongoDB.save()
                         → io.to(socketId2).emit('newMessage')
Client B: socket.on('newMessage') → Update UI

// WebRTC Signaling
Client A: startCall() → socket.emit('call-user', {to, offer})
                      → Server forwards to socketId2
Client B: socket.on('call-made') → Show incoming call
          answerCall() → socket.emit('answer-call', {to, answer})
                       → Server forwards to socketId1
Client A: socket.on('call-answered') → setRemoteDescription()
```

---

## 4. MongoDB Schema Relationships

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   DOCTOR    │         │ APPOINTMENT  │         │   PATIENT   │
├─────────────┤         ├──────────────┤         ├─────────────┤
│ _id         │◄────────┤ doctorId     │         │ _id         │
│ name        │         │ patientId    ├────────►│ name        │
│ email       │         │ date         │         │ email       │
│ password    │         │ startTime    │         │ password    │
│ specializ.  │         │ endTime      │         │ avatar      │
│ experience  │         │ status       │         └─────────────┘
│ schedule [] │         │ mode         │
│ avatar      │         │ reason       │         ┌─────────────┐
└─────────────┘         │ notes        │         │   MESSAGE   │
                        │ rating       │         ├─────────────┤
                        │ review       │         │ senderId    │
                        └──────────────┘         │ receiverId  │
                                                 │ text        │
Embedded: schedule[]                             │ image       │
Referenced: appointments                         │ createdAt   │
                                                 └─────────────┘
```

**Design:**

- **Embed**: Schedule (tight coupling, small size)
- **Reference**: Appointments (many-to-many), Messages (high volume)
- **Indexes**: email (unique), doctorId, patientId, (senderId + receiverId)

---

## 5. Race Condition Resolution

**Problem:** ICE candidates arrive before remote description set

```
BEFORE FIX (Error)                  AFTER FIX (Buffer)
─────────────────                   ──────────────────
Offer sent                          Offer sent
  │                                   │
  ├─ ICE1 arrives                     ├─ ICE1 → buffer.push()
  ├─ ICE2 arrives                     ├─ ICE2 → buffer.push()
  │  addIceCandidate() ❌ Error       │  (no error, just buffer)
  │                                   │
Answer arrives                      Answer arrives
  │                                   │
setRemoteDescription()              setRemoteDescription()
  │                                   ├─ Apply buffered ICE1 ✅
ICE3 arrives                          ├─ Apply buffered ICE2 ✅
  │                                   │
addIceCandidate() ✅ Works          ICE3 arrives
                                      │
                                    addIceCandidate() ✅ Works
```

**Code:** `pendingCandidatesRef.current.push(candidate)` until remote desc ready

---

## 6. Authentication Flow

```
CLIENT                  BACKEND                    DATABASE
  │                       │                           │
  │ POST /api/auth/signup │                           │
  ├──────────────────────►│                           │
  │  {name, email, pass}  │                           │
  │                       ├─ Bcrypt.hash(password)    │
  │                       ├──────────────────────────►│
  │                       │  Doctor/Patient.create()  │
  │                       │◄──────────────────────────┤
  │                       │  New user doc             │
  │                       ├─ generateToken(id, role)  │
  │                       │  → JWT signed             │
  │◄──────────────────────┤  → Set HTTP-only cookie   │
  │  200 OK + Set-Cookie  │                           │
  │                       │                           │
  │ GET /api/auth/me      │                           │
  ├──────────────────────►│                           │
  │  (Cookie auto-sent)   │                           │
  │                       ├─ protect() middleware     │
  │                       │  → Verify JWT             │
  │                       │  → Decode {id, role}      │
  │                       ├──────────────────────────►│
  │                       │  findById(id)             │
  │                       │◄──────────────────────────┤
  │                       │  User doc                 │
  │                       │  → req.user = user        │
  │◄──────────────────────┤  → req.userRole = role    │
  │  200 OK + user data   │                           │
```

**Security:** HTTP-only (XSS proof), Secure (HTTPS only), SameSite (CSRF proof)

---

## 7. Appointment Booking Flow

```
PATIENT                 FRONTEND              BACKEND               DATABASE
  │                        │                     │                     │
  │ Browse /doctors        │                     │                     │
  ├───────────────────────►│ GET /api/doctors    │                     │
  │                        ├────────────────────►│                     │
  │                        │                     ├────────────────────►│
  │                        │                     │ Doctor.find()       │
  │                        │◄────────────────────┤◄────────────────────┤
  │◄───────────────────────┤ [doctors]           │                     │
  │                        │                     │                     │
  │ Click doctor           │                     │                     │
  ├───────────────────────►│ GET /doctors/:id    │                     │
  │                        ├────────────────────►│                     │
  │                        │                     ├────────────────────►│
  │                        │◄────────────────────┤◄────────────────────┤
  │◄───────────────────────┤ {doctor + schedule} │                     │
  │                        │                     │                     │
  │ Select slot + submit   │                     │                     │
  ├───────────────────────►│ POST /appointments  │                     │
  │  {date, time, mode}    ├────────────────────►│ protect() ✓         │
  │                        │  (Cookie sent)      │ patientOnly() ✓     │
  │                        │                     ├────────────────────►│
  │                        │                     │ Appointment.create()│
  │                        │◄────────────────────┤◄────────────────────┤
  │◄───────────────────────┤ {appointment}       │                     │
  │  Confirmation          │                     │                     │
```

**Middleware Chain:** `protect` (JWT verify) → `patientOnly` (role check) → Controller

---

## 8. State Management Hierarchy

```
┌────────────────────────────────────────────────┐
│              main.tsx (Root)                   │
│  <AppProvider>           ← Global: user, socket│
│    <VideoCallProvider>   ← Feature: WebRTC     │
│      <MessageProvider>   ← Feature: Chat       │
│        <App />                                 │
│          ├─ Navbar (useApp: currentUser)       │
│          ├─ DoctorList (useState: filters)     │
│          ├─ Chat (useMessage + socket)         │
│          └─ VideoCall (useVideoCall)           │
│      </MessageProvider>                        │
│    </VideoCallProvider>                        │
│  </AppProvider>                                │
└────────────────────────────────────────────────┘

Context API Pattern:
- AppContext: Authentication + Socket.IO instance
- VideoCallContext: localStream, remoteStream, peerConnection (ref)
- MessageContext: messages[], selectedUser
- Component State: Forms, UI toggles, local data
```

**Design:** Prevents prop drilling, organized by scope, refs for non-reactive objects

---

## Quick Reference

| Diagram          | Use Case                | Key Concept                   |
| ---------------- | ----------------------- | ----------------------------- |
| System Arch      | Overall design          | Client-Server-DB-CDN          |
| WebRTC Flow      | Video call explanation  | Signaling vs Media paths      |
| Socket.IO Events | Real-time features      | Event-driven communication    |
| MongoDB Schema   | Data model              | Embed vs Reference trade-offs |
| Race Condition   | Debugging story         | Async WebRTC negotiation      |
| Auth Flow        | Security implementation | JWT + HTTP-only cookies       |
| Appointment Flow | Business logic          | Multi-phase workflow          |
| State Management | React architecture      | Context API hierarchy         |

**Interview Tip:** Draw these on whiteboard while explaining, shows visual thinking!

---

**Condensed from 500+ lines to 200 lines (~60% reduction) while keeping all diagrams!** 🎨
