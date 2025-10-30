# Health-Connect - Architecture Diagrams for Interviews

## 🎨 Visual Reference Guide

This document contains ASCII diagrams and visual explanations to use during technical interviews. Draw these on whiteboards or share your screen.

---

## 📊 Diagram 1: Overall System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        HEALTH-CONNECT PLATFORM                      │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐                    ┌──────────────────────┐
│   DOCTOR CLIENT      │                    │   PATIENT CLIENT     │
│  (React + TS)        │                    │   (React + TS)       │
│                      │                    │                      │
│  ┌────────────────┐  │                    │  ┌────────────────┐  │
│  │  Video Call UI │  │                    │  │  Video Call UI │  │
│  │  Chat UI       │  │                    │  │  Chat UI       │  │
│  │  Appointments  │  │                    │  │  Doctor List   │  │
│  └────────────────┘  │                    │  └────────────────┘  │
│                      │                    │                      │
│  ┌────────────────┐  │                    │  ┌────────────────┐  │
│  │Socket.IO Client│◄─┼────────┐  ┌────────┼─►│Socket.IO Client│  │
│  │WebRTC (P2P)    │  │        │  │        │  │WebRTC (P2P)    │  │
│  └────────────────┘  │        │  │        │  └────────────────┘  │
└──────────────────────┘        │  │        └──────────────────────┘
                                │  │
         ┌──────────────────────┘  └──────────────────────┐
         │                                                 │
         ▼                                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND SERVER (Node.js)                         │
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│  │  Express.js      │  │  Socket.IO       │  │  JWT Auth        │ │
│  │  REST API        │  │  WebSocket       │  │  Middleware      │ │
│  │  - /api/auth     │  │  - Signaling     │  │  - protect()     │ │
│  │  - /api/doctors  │  │  - Chat          │  │  - doctorOnly()  │ │
│  │  - /api/patients │  │  - User tracking │  │  - patientOnly() │ │
│  │  - /api/messages │  │                  │  │                  │ │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘ │
│                                                                     │
│  ┌──────────────────┐                         ┌──────────────────┐ │
│  │  Controllers     │                         │  Models          │ │
│  │  - Auth          │                         │  - Doctor        │ │
│  │  - Appointments  │                         │  - Patient       │ │
│  │  - Messages      │                         │  - Appointment   │ │
│  │  - Doctors       │                         │  - Message       │ │
│  └──────────────────┘                         └──────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
         │                                                 │
         ▼                                                 ▼
┌──────────────────────┐                    ┌──────────────────────┐
│   MongoDB            │                    │   Cloudinary         │
│   - doctors          │                    │   - Image Storage    │
│   - patients         │                    │   - CDN Delivery     │
│   - appointments     │                    │   - Transform API    │
│   - messages         │                    │                      │
└──────────────────────┘                    └──────────────────────┘

DIRECT P2P CONNECTION (Media Streams - No Server)
Doctor Client ◄══════════════════════════════════════════► Patient Client
              Video/Audio flows peer-to-peer via WebRTC
              (Server only used for initial signaling)
```

**Key Points to Explain:**

- Frontend: React + TypeScript SPAs with real-time context providers
- Backend: Express REST API + Socket.IO WebSocket server
- Database: MongoDB for persistence, Cloudinary for media
- P2P: Video/audio streams bypass server after connection established

---

## 📊 Diagram 2: WebRTC Call Flow (Step-by-Step)

```
INITIATOR (Doctor)                 SIGNALING SERVER           RECEIVER (Patient)
                                    (Socket.IO)
     │                                   │                          │
     │ 1. Click "Call"                   │                          │
     ├──────────────────────────────────►│                          │
     │                                   │                          │
     │ 2. Get Local Media                │                          │
     │    getUserMedia()                 │                          │
     │◄───────────────                   │                          │
     │                                   │                          │
     │ 3. Create RTCPeerConnection       │                          │
     │    Add local tracks               │                          │
     │◄───────────────                   │                          │
     │                                   │                          │
     │ 4. Create SDP Offer               │                          │
     │    setLocalDescription(offer)     │                          │
     │◄───────────────                   │                          │
     │                                   │                          │
     │ 5. Send Offer                     │                          │
     │─────────[call-user]──────────────►│                          │
     │                                   │ 6. Forward Offer         │
     │                                   │─────[call-made]─────────►│
     │                                   │                          │
     │                                   │          7. Show Incoming│
     │                                   │             Call UI      │
     │                                   │                   ◄──────│
     │                                   │                          │
     │                                   │          8. User Clicks  │
     │                                   │             "Answer"     │
     │                                   │                   ◄──────│
     │                                   │                          │
     │                                   │          9. Get Local    │
     │                                   │             Media        │
     │                                   │                   ◄──────│
     │                                   │                          │
     │                                   │         10. Create Peer  │
     │                                   │             Connection   │
     │                                   │                   ◄──────│
     │                                   │                          │
     │                                   │         11. Set Remote   │
     │                                   │             Description  │
     │                                   │             (offer)      │
     │                                   │                   ◄──────│
     │                                   │                          │
     │                                   │         12. Create SDP   │
     │                                   │             Answer       │
     │                                   │                   ◄──────│
     │                                   │                          │
     │                                   │         13. Send Answer  │
     │                                   │◄───[answer-call]─────────│
     │ 14. Receive Answer                │                          │
     │◄─────[call-answered]──────────────│                          │
     │                                   │                          │
     │ 15. Set Remote Description        │                          │
     │     (answer)                      │                          │
     │◄───────────────                   │                          │
     │                                   │                          │
     │                                   │                          │
     │◄──────[ICE Candidates Exchange]──────────────────────────────►│
     │         (via ice-candidate events)                           │
     │                                   │                          │
     │                                   │                          │
     │ 16. ICE Negotiation Complete      │                          │
     │═══════════════════════════════════════════════════════════════│
     │           DIRECT P2P CONNECTION ESTABLISHED                  │
     │              (Audio/Video Streams)                           │
     │═══════════════════════════════════════════════════════════════│
     │                                   │                          │
```

**Timing Breakdown:**

- Steps 1-5: ~50ms (offer creation)
- Steps 6-13: ~100-200ms (answer creation)
- Steps 14-15: ~50ms (remote description)
- Step 16 (ICE): ~500-2000ms (NAT traversal)
- **Total**: ~700-2300ms to connected state

**Critical Points:**

- **SDP Exchange**: Describes media capabilities (codecs, bandwidth)
- **ICE Candidates**: Network addresses for P2P connection
- **Signaling Role**: Server only forwards messages, never sees media
- **Buffering**: Candidates stored if remote description not ready

---

## 📊 Diagram 3: Socket.IO Event Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SOCKET.IO SERVER                             │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  onlineUsers = Map<userId, socketId>                       │   │
│  │  - doctor123 → socket_abc                                  │   │
│  │  - patient456 → socket_def                                 │   │
│  └────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘

EVENT: connection
┌──────────┐                                         ┌──────────┐
│  Client  │────[connect with userId]───────────────►│  Server  │
│          │                                         │          │
│          │                                         │  Store   │
│          │                                         │  mapping │
└──────────┘                                         └──────────┘

EVENT: call-user (WebRTC Signaling)
┌──────────┐                                         ┌──────────┐
│ Caller   │────[{to: patientId, offer: SDP}]──────►│  Server  │
│          │                                         │          │
│          │                                         │ Lookup   │
│          │                                         │ socketId │
│          │                                         └─────┬────┘
│          │                                               │
│          │                                               ▼
│          │                                         ┌──────────┐
│          │◄─────[call-made: {from, offer}]────────│ Receiver │
└──────────┘                                         └──────────┘

EVENT: newMessage (Chat)
┌──────────┐                                         ┌──────────┐
│  Sender  │────[{text, receiverId}]────────────────►│  Server  │
│          │                                         │          │
│          │                                         │ 1. Save  │
│          │                                         │    to DB │
│          │                                         │ 2. Lookup│
│          │                                         │    socket│
│          │                                         └─────┬────┘
│          │                                               │
│          │                                               ▼
│          │                                         ┌──────────┐
│          │◄─────[newMessage: message obj]─────────│ Receiver │
└──────────┘                                         └──────────┘

EVENT: ice-candidate (ICE Exchange)
┌──────────┐                                         ┌──────────┐
│  Peer A  │────[{to: userId, candidate}]───────────►│  Server  │
│          │                                         │          │
│          │                                         │ Forward  │
│          │                                         └─────┬────┘
│          │                                               │
│          │                                               ▼
│          │                                         ┌──────────┐
│          │◄─────[ice-candidate: {candidate}]──────│  Peer B  │
└──────────┘                                         └──────────┘

EVENT: disconnect
┌──────────┐                                         ┌──────────┐
│  Client  │────[connection lost]────────────────────►│  Server  │
│          │                                         │          │
│          │                                         │ Remove   │
│          │                                         │ from Map │
│          │                                         │          │
│          │◄─────[auto-reconnect attempt]──────────│          │
└──────────┘                                         └──────────┘
```

**Key Configuration:**

```javascript
{
  pingTimeout: 60000,      // 60s max silence before disconnect
  pingInterval: 25000,     // 25s heartbeat
  reconnection: true,      // Auto-reconnect
  reconnectionAttempts: 5, // Max retry
  reconnectionDelay: 1000  // 1s between retries
}
```

---

## 📊 Diagram 4: MongoDB Schema Relationships

```
┌──────────────────────────────────────────────────────────────────┐
│                     MONGODB COLLECTIONS                          │
└──────────────────────────────────────────────────────────────────┘

┌─────────────────────────┐         ┌─────────────────────────┐
│       DOCTORS           │         │       PATIENTS          │
│─────────────────────────│         │─────────────────────────│
│ _id: ObjectId           │         │ _id: ObjectId           │
│ name: String            │         │ name: String            │
│ email: String (indexed) │         │ email: String (indexed) │
│ specialization: String  │         │ dateOfBirth: String     │
│ qualification: String   │         │ gender: String          │
│ experience: Number      │         │ bloodGroup: String      │
│ schedule: [             │         │ allergies: String       │
│   {                     │         │ emergencyContact: [     │
│     day: String,        │         │   {                     │
│     slots: [            │         │     name: String,       │
│       {                 │         │     relationship: String│
│         slotNumber: #,  │         │     phone: String       │
│         startTime: "HH" │         │   }                     │
│         endTime: "HH",  │         │ ]                       │
│         isAvailable: ☑  │         │                         │
│       }                 │         │                         │
│     ]                   │         │                         │
│   }                     │         │                         │
│ ]                       │         │                         │
└─────────┬───────────────┘         └─────────┬───────────────┘
          │                                   │
          │         REFERENCED BY             │
          │              (1:N)                │
          │                                   │
          └──────────────┬────────────────────┘
                         │
                         ▼
          ┌──────────────────────────────────┐
          │        APPOINTMENTS              │
          │──────────────────────────────────│
          │ _id: ObjectId                    │
          │ doctorId: ObjectId ──────────────┼──► doctors._id
          │ patientId: ObjectId ─────────────┼──► patients._id
          │ date: String                     │
          │ startTime: String                │
          │ endTime: String                  │
          │ status: pending|scheduled|...    │
          │ mode: video|chat                 │
          │ reason: String (patient input)   │
          │ comment: String (doctor input)   │
          │ notes: String (medical record)   │
          │ rating: Number                   │
          │ review: String                   │
          └──────────────────────────────────┘
                         │
          INDEX: doctorId + date + startTime
          INDEX: patientId + date + startTime
          INDEX: status + date


          ┌──────────────────────────────────┐
          │          MESSAGES                │
          │──────────────────────────────────│
          │ _id: ObjectId                    │
          │ senderId: ObjectId ──────────────┼──► doctors._id OR patients._id
          │ receiverId: ObjectId ────────────┼──► doctors._id OR patients._id
          │ text: String                     │
          │ image: String (Cloudinary URL)   │
          │ type: text|image                 │
          │ read: Boolean                    │
          │ createdAt: Date                  │
          └──────────────────────────────────┘
                         │
          INDEX: senderId + receiverId + createdAt
          INDEX: receiverId + read


EMBEDDED vs REFERENCED STRATEGY:

✅ EMBEDDED (1:N with bounded N):
   - Doctor.schedule (max 7 days × 20 slots = 140)
   - Patient.emergencyContact (typically 1-3)
   - Always accessed together
   - Strong data locality

✅ REFERENCED (M:N or unbounded):
   - Appointments (many doctors × many patients)
   - Messages (unbounded growth)
   - Independent query patterns
   - Flexible relationships
```

---

## 📊 Diagram 5: ICE Candidate Race Condition & Solution

```
PROBLEM: Race Condition (15% failures)

Timeline without buffering:
────────────────────────────────────────────────────────────►
  t=0      t=50     t=100    t=150    t=200    t=250
  │        │        │        │        │        │
  Offer    ICE #1   ICE #2   Answer   ICE #3   ICE #4
  sent     arrives  arrives  arrives  arrives  arrives
           ❌        ❌        ✓        ✓        ✓
           FAILS    FAILS    Sets     OK       OK
           (no remote description yet)

Result: First 2 ICE candidates lost → Connection may fail


SOLUTION: Buffering Mechanism (2% failures)

┌─────────────────────────────────────────────────────────────┐
│              PEER CONNECTION STATE                          │
│─────────────────────────────────────────────────────────────│
│  remoteDescription: null                                    │
│  pendingCandidates: []                                      │
└─────────────────────────────────────────────────────────────┘

Timeline with buffering:
────────────────────────────────────────────────────────────►
  t=0      t=50     t=100    t=150    t=200    t=250
  │        │        │        │        │        │
  Offer    ICE #1   ICE #2   Answer   ICE #3   ICE #4
  sent     arrives  arrives  arrives  arrives  arrives

┌─────────────────────────────────────────────────────────────┐
│ t=50: ICE #1 arrives                                        │
│   if (remoteDescription) {                                  │
│     ❌ FALSE → Buffer it                                     │
│     pendingCandidates.push(ICE #1)                          │
│   }                                                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ t=100: ICE #2 arrives                                       │
│   if (remoteDescription) {                                  │
│     ❌ FALSE → Buffer it                                     │
│     pendingCandidates.push(ICE #2)                          │
│   }                                                         │
│   pendingCandidates = [ICE #1, ICE #2]                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ t=150: Answer arrives                                       │
│   setRemoteDescription(answer) ✓                            │
│   // Now apply buffered candidates                          │
│   pendingCandidates.forEach(candidate => {                  │
│     peerConnection.addIceCandidate(candidate) ✓             │
│   })                                                        │
│   pendingCandidates = []  // Clear buffer                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ t=200: ICE #3 arrives                                       │
│   if (remoteDescription) {                                  │
│     ✅ TRUE → Add directly                                   │
│     peerConnection.addIceCandidate(ICE #3) ✓                │
│   }                                                         │
└─────────────────────────────────────────────────────────────┘

Result: All ICE candidates applied → Connection succeeds

CODE:
const pendingCandidatesRef = useRef<RTCIceCandidate[]>([]);

socket.on('ice-candidate', (data) => {
    const candidate = new RTCIceCandidate(data.candidate);

    if (peerConnection.remoteDescription) {
        peerConnection.addIceCandidate(candidate);  // Direct add
    } else {
        pendingCandidatesRef.current.push(candidate);  // Buffer
    }
});

// After setting remote description:
pendingCandidatesRef.current.forEach(candidate => {
    peerConnection.addIceCandidate(candidate);
});
pendingCandidatesRef.current = [];  // Clear
```

---

## 📊 Diagram 6: Authentication & Authorization Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                          │
└─────────────────────────────────────────────────────────────────┘

1. REGISTRATION
   ┌────────┐                                          ┌────────┐
   │ Client │──[POST /api/auth/register]──────────────►│ Server │
   │        │  {name, email, password, role}          │        │
   │        │                                          │ Bcrypt │
   │        │                                          │ hash   │
   │        │                                          │ (14)   │
   │        │                                          │        │
   │        │◄─[Set-Cookie: token=JWT]────────────────│ MongoDB│
   │        │  {user data, role}                      │ Save   │
   └────────┘                                          └────────┘
   Stores JWT in     JWT = {id, role, exp: 7d}     HTTP-only cookie
   HTTP-only cookie  Signed with JWT_SECRET         sameSite=strict

2. LOGIN
   ┌────────┐                                          ┌────────┐
   │ Client │──[POST /api/auth/login]─────────────────►│ Server │
   │        │  {email, password, role}                │        │
   │        │                                          │ Find   │
   │        │                                          │ user   │
   │        │                                          │ Bcrypt │
   │        │                                          │ compare│
   │        │◄─[Set-Cookie: token=JWT]────────────────│        │
   │        │  {user data, role}                      │        │
   └────────┘                                          └────────┘

3. PROTECTED REQUEST
   ┌────────┐                                          ┌────────┐
   │ Client │──[GET /api/appointments]────────────────►│ Server │
   │        │  Cookie: token=JWT                      │        │
   │        │                                          │ ┌──────┴──────┐
   │        │                                          │ │ Middleware  │
   │        │                                          │ │ protect()   │
   │        │                                          │ │             │
   │        │                                          │ │ 1. Verify   │
   │        │                                          │ │    JWT      │
   │        │                                          │ │ 2. Decode   │
   │        │                                          │ │    {id,role}│
   │        │                                          │ │ 3. Fetch    │
   │        │                                          │ │    user     │
   │        │                                          │ │ 4. Attach   │
   │        │                                          │ │    req.user │
   │        │                                          │ └──────┬──────┘
   │        │                                          │        │
   │        │◄─[200 OK with data]─────────────────────│ Controller
   │        │                                          │ accesses
   │        │                                          │ req.user
   └────────┘                                          └────────┘

4. ROLE-BASED AUTHORIZATION
   ┌────────┐                                          ┌────────┐
   │ Doctor │──[POST /api/appointments/:id]───────────►│ Server │
   │ Client │  Cookie: token=JWT                      │        │
   │        │  {status: "scheduled"}                  │ ┌──────┴──────┐
   │        │                                          │ │ protect()   │
   │        │                                          │ │ ✓ JWT valid │
   │        │                                          │ └──────┬──────┘
   │        │                                          │        │
   │        │                                          │ ┌──────▼──────┐
   │        │                                          │ │doctorOnly() │
   │        │                                          │ │             │
   │        │                                          │ │if (role !=  │
   │        │                                          │ │  'doctor')  │
   │        │                                          │ │  403 Denied │
   │        │                                          │ │else proceed │
   │        │                                          │ └──────┬──────┘
   │        │                                          │        │
   │        │◄─[200 OK]───────────────────────────────│ Controller
   │        │                                          │        │
   └────────┘                                          └────────┘

   Patient tries same request → 403 Forbidden


SECURITY LAYERS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Password: Bcrypt hashed (12-14 rounds)
2. Token: JWT signed with secret
3. Storage: HTTP-only cookie (XSS protection)
4. Flags: secure=true, sameSite=strict
5. Expiry: 7 days
6. Verification: Every protected route
7. Authorization: Role-based middleware
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🎨 How to Use These Diagrams in Interviews

### **On Whiteboard:**

1. Start with Diagram 1 (Overall Architecture) to show big picture
2. Drill into Diagram 2 (WebRTC Flow) when discussing video calls
3. Use Diagram 5 (Race Condition) to show problem-solving depth

### **On Paper:**

- Draw simplified versions with boxes and arrows
- Use colors if available (green=success, red=error)
- Add annotations with numbers for sequence

### **Verbally:**

- "Let me sketch this out for you..."
- "There are three main components here..."
- "The flow goes like this: first... then... finally..."

### **Key Phrases:**

- "As you can see in this diagram..."
- "This is where the challenge was..."
- "Notice how X connects to Y here..."
- "The critical part is this bottleneck..."

---

## 💡 Practice Tips

1. **Draw from memory** without looking at references
2. **Explain while drawing** to practice multitasking
3. **Time yourself** - aim for 60 seconds per diagram
4. **Use consistent symbols** (circles for entities, arrows for flow)
5. **Add legends** to clarify icons and colors

---

**Master these visual explanations to demonstrate your deep understanding of the system architecture!** 🎨✨
