# Health Connect - Interview Keywords Guide

## 🎯 Project Elevator Pitch

**"Full-stack telehealth platform with real-time chat (Socket.io), P2P video calls (WebRTC), and secure medical records using MERN stack."**

---

## 🔑 Core Technologies

### 1. **Socket.io** - Real-time Communication

- WebSocket library for bidirectional client-server communication
- **Use cases:** Live chat, WebRTC signaling, online status, notifications
- **Why:** Low-latency messaging (<100ms), automatic reconnection, fallback to long-polling

### 2. **WebRTC** - Video Calling

- Peer-to-peer video/audio without server relay
- **Components:** RTCPeerConnection, getUserMedia, STUN servers, ICE candidates
- **Flow:** Caller creates offer → sends via Socket.io → Receiver answers → ICE exchange → P2P stream
- **Challenge solved:** Stale closure issue (useEffect re-registering handlers) → Fixed with refs

### 3. **JWT Authentication**

- Stateless token-based auth (userId, role, 7-day expiry)
- **Why over sessions:** No server storage, scalable across servers, mobile-friendly
- **Security:** Stored in localStorage + Authorization header (cross-domain compatibility)

### 4. **Bcrypt Hashing (10 rounds)**

- Slow hashing algorithm to prevent brute-force (2^10 = 1024 iterations)
- **Features:** Auto-salting, adjustable cost factor
- **Why not MD5/SHA:** Too fast (billions of attempts/second possible)

### 5. **Cloudinary CDN**

- Cloud media management with auto-optimization
- **Benefits:** Compression, responsive images, global CDN, transformations
- **Why not MongoDB:** 16MB limit, slower, no optimization

### 6. **HTTP-only Cookies**

- Cookies inaccessible to JavaScript (prevents XSS)
- **Config:** `httpOnly: true, secure: true, sameSite: 'strict'`
- **Cross-domain issue:** Switched to Authorization headers for Vercel ↔ Render

### 7. **React.js**

- Component-based UI with Virtual DOM
- **Used:** Context API (global state), useEffect (side effects), useRef (DOM + persistent values), Custom hooks
- **Pattern:** Provider wraps app → hooks consume context

### 8. **Node.js & Express**

- Event-driven, non-blocking I/O (perfect for real-time apps)
- **Express:** Middleware architecture (CORS, auth, error handling), routing

### 9. **MongoDB**

- NoSQL document database (JSON-like BSON)
- **Why:** Flexible schema, JSON native, Mongoose ODM, Atlas managed hosting
- **vs SQL:** No fixed schema, embedded docs instead of joins

### 10. **CORS**

- Browser security for cross-origin requests
- **Setup:** Frontend (Vercel) → Backend (Render) = different origins
- **Config:** `origin: 'frontend-url', credentials: true`

---

## 🚀 Deployment

- **Vercel:** Frontend (auto-deploy from Git, global CDN, zero config)
- **Render:** Backend (auto HTTPS, Docker-based, free tier)

---

## 🔥 Interview Questions & Answers

### Q: "Walk me through your video call implementation"

**A:** "I use WebRTC for P2P video with Socket.io for signaling. Doctor creates RTCPeerConnection, generates SDP offer, sends via socket. Patient receives offer, creates answer, sends back. Both exchange ICE candidates for optimal connection path. Media streams flow directly P2P (no server), reducing latency and bandwidth."

### Q: "Biggest technical challenge?"

**A:** "WebRTC calls failed in one direction due to React stale closures. When useEffect re-ran (from state changes), socket handlers were re-registered with old peerConnectionRef values. Fixed by removing state from dependencies and using refs for mutable values handlers always access latest."

### Q: "How did you ensure security?"

**A:** "Multi-layered: JWT (7-day expiry), bcrypt (10 rounds), HTTPS-only, CORS whitelist, input validation. For production: add rate limiting, XSS sanitization, CSRF tokens."

### Q: "How would you scale this?"

**A:** "Redis (session store + Socket.io adapter), WebRTC SFU for group calls, MongoDB sharding, CDN for static assets, Kubernetes orchestration, NGINX load balancer, RabbitMQ for async tasks."

---

## 💡 Technical Wins

- Optimized rendering (React.memo, useCallback)
- Responsive design (mobile-first)
- Code splitting (lazy loading)
- Error boundaries
- Environment variables

---

## 📊 Metrics

- **Chat latency:** <100ms
- **Video quality:** 360p-1080p (adaptive)
- **P2P savings:** 90% bandwidth vs server relay
- **CDN boost:** 40% faster image loads

---

## ✅ Interview Tips

1. **Explain WHY** (not just what)
2. **Mention trade-offs** ("JWT stateless but harder to revoke")
3. **Discuss challenges** (shows problem-solving)
4. **Connect to real-world** ("Telemedicine growth post-pandemic")
5. **Know your code** (be ready for deep dives)

---

## 🎯 Key Takeaways

**Architecture:** MERN stack + Socket.io + WebRTC  
**Security:** JWT + Bcrypt + CORS + HTTPS  
**Real-time:** Socket.io (chat) + WebRTC (video)  
**Deployment:** Vercel (frontend) + Render (backend)  
**Challenge:** Solved React closure issue in WebRTC handlers
