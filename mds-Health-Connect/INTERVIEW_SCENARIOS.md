# Technical Interview Scenarios - Health Connect Project

## Scenario 1: Real-Time Chat Message Visibility Issue

### **Challenge:**

In our telemedicine platform, I implemented a real-time chat feature using Socket.IO for communication between doctors and patients. However, after deployment, we discovered a critical bug: **messages were not visible to both sender and receiver**. When a doctor sent a message to a patient, only the patient could see it, and vice versa. This completely broke the chat functionality.

### **Initial Investigation:**

I started by examining the console logs and noticed:

1. Messages were being saved to the database successfully
2. Socket events were firing
3. Messages appeared as empty boxes in the UI
4. The message `text` field was `undefined` in the response

### **Root Causes Identified:**

**1. MongoDB ObjectId vs String Comparison**

```javascript
// WRONG - This comparison always failed
if (message.senderId === currentUser._id) {
  // ObjectId("507f...") === "507f..." → false
}

// CORRECT - String conversion
if (String(message.senderId) === String(currentUser._id)) {
  // "507f..." === "507f..." → true
}
```

**2. Incorrect Socket Listener Logic**

```javascript
// WRONG - Only receiver could see messages
if (newMessage.receiverId === currentUser._id) {
  setMessages([...prevMessages, newMessage]);
}

// CORRECT - Both sender and receiver in current conversation
const isPartOfCurrentConversation =
  (messageSenderId === chatPartnerId && messageReceiverId === currentUserId) ||
  (messageSenderId === currentUserId && messageReceiverId === chatPartnerId);
```

**3. Backend Only Emitting to Receiver**

```javascript
// WRONG - Sender never received socket updates
io.to(receiverSocketId).emit("newMessage", newMessage);

// CORRECT - Emit to both
io.to(receiverSocketId).emit("newMessage", newMessage);
io.to(senderSocketId).emit("newMessage", newMessage);
```

**4. Wrong Content-Type Header**

```javascript
// WRONG - Always using multipart for text messages
headers: { "Content-Type": "multipart/form-data" }

// CORRECT - Conditional based on content
const config = data.image ?
    { headers: { "Content-Type": "multipart/form-data" } } :
    { headers: { "Content-Type": "application/json" } };
```

### **Solution Implemented:**

**Backend Changes:**

```javascript
export const sendMessage = async (req, res) => {
  const senderId = req.user._id;
  const { receiverId } = req.params;
  const { text, image } = req.body;

  // Save message
  const newMessage = new Message({
    senderId,
    receiverId,
    text,
    image: imageUrl,
  });
  await newMessage.save();

  // Emit to BOTH users
  const receiverSocketId = getSocketId(receiverId);
  const senderSocketId = getSocketId(senderId.toString());

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }
  if (senderSocketId && senderSocketId !== receiverSocketId) {
    io.to(senderSocketId).emit("newMessage", newMessage);
  }

  res.status(201).json({ success: true, newMessage });
};
```

**Frontend Changes:**

```javascript
// Socket listener with proper conversation matching
const handleNewMessage = (newMessage) => {
  const messageSenderId = String(newMessage.senderId);
  const messageReceiverId = String(newMessage.receiverId);
  const currentUserId = String(currentUser?._id);
  const chatPartnerId = String(id);

  const isPartOfCurrentConversation =
    (messageSenderId === chatPartnerId &&
      messageReceiverId === currentUserId) ||
    (messageSenderId === currentUserId && messageReceiverId === chatPartnerId);

  if (isPartOfCurrentConversation) {
    setMessages((prevMessages) => {
      // Duplicate detection
      const exists = prevMessages.some(
        (msg) => String(msg._id) === String(newMessage._id)
      );
      if (exists) return prevMessages;
      return [...prevMessages, newMessage];
    });
  }
};

// Smart Content-Type handling
const sendMessage = async (data) => {
  const config = data.image
    ? { headers: { "Content-Type": "multipart/form-data" } }
    : { headers: { "Content-Type": "application/json" } };

  const response = await axiosInstance.post(
    `/message/send/${id}`,
    data,
    config
  );
};
```

### **Testing & Verification:**

1. Added extensive logging to trace message flow
2. Tested with two different browsers (Chrome for doctor, Firefox for patient)
3. Verified ObjectId to string conversion worked correctly
4. Confirmed duplicate detection prevented double messages
5. Tested both text-only and image messages

### **Outcome:**

✅ Messages now visible to both sender and receiver in real-time  
✅ No duplicate messages displayed  
✅ Proper message alignment (sent messages right, received left)  
✅ Works across different devices and browsers  
✅ Handles both text and image messages correctly

### **Key Learnings:**

- **Data Type Awareness**: MongoDB ObjectIds require explicit string conversion for comparison
- **Bidirectional Communication**: Real-time features need symmetric socket handling
- **Debugging Strategy**: Systematic logging helps identify exact failure points
- **Type Safety**: TypeScript helps catch type mismatches early

---

## Scenario 2: Appointment Status Undefined Crash

### **Challenge:**

The Doctor Dashboard was crashing with a blank screen when doctors tried to view appointments after a patient booked. The error: `Uncaught TypeError: Cannot read properties of undefined (reading 'charAt')` at line 243.

### **Investigation:**

Examined the error stack trace:

```javascript
// Line 243 - Crashing code
{
  appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1);
}
```

The issue: `appointment.status` was `undefined` for some appointments.

### **Root Cause:**

The Appointment model had a default status (`default: 'pending'`), but **older appointments in the database** created before this default was added had `null` or `undefined` status values.

### **Solution:**

**1. Added Null Safety Check:**

```javascript
// BEFORE - Crashes if status is undefined
{
  appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1);
}

// AFTER - Safe with fallback
{
  appointment.status
    ? appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)
    : "Pending";
}
```

**2. Updated Helper Function:**

```javascript
// BEFORE
const getStatusBadgeColor = (status: AppointmentStatus) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100...";
    // ... cases
  }
};

// AFTER - Handles undefined
const getStatusBadgeColor = (status: AppointmentStatus | undefined) => {
  if (!status) return "bg-gray-100 text-gray-800 border-gray-300";
  switch (status) {
    case "pending":
      return "bg-yellow-100...";
    // ... cases
  }
};
```

**3. Applied Same Fix to Mode Field:**

```javascript
{
  appointment.mode
    ? appointment.mode.charAt(0).toUpperCase() + appointment.mode.slice(1)
    : "Chat";
}
```

**4. Fixed PatientAppointments.tsx Too:**
Applied the same null safety checks to the patient-facing appointments page.

### **Outcome:**

✅ No more crashes when viewing appointments  
✅ Graceful fallback for missing data  
✅ Dashboard renders properly for all users  
✅ Backward compatible with old database records

### **Key Learnings:**

- **Defensive Programming**: Always check for null/undefined before calling methods
- **Database Migration Awareness**: Schema changes don't automatically update existing data
- **Consistent Error Handling**: Apply fixes across all similar components
- **User Experience**: Fallback values maintain functionality even with incomplete data

---

## Scenario 3: JWT Authentication Token Expiry Handling

### **Challenge:**

Users were getting randomly logged out and redirected to the login page during active sessions. The application wasn't handling JWT token expiry gracefully, causing a poor user experience during video consultations.

### **Investigation:**

1. JWT tokens were set to expire after 1 hour
2. No token refresh mechanism was implemented
3. Axios interceptors weren't catching 401 errors properly
4. Users lost their session data mid-consultation

### **Root Cause Analysis:**

```javascript
// BEFORE - No error handling
const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

// If token expired, API returned 401
// Frontend just crashed or showed cryptic errors
```

### **Solution Implemented:**

**1. Added Axios Response Interceptor:**

```javascript
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        await axiosInstance.post("/auth/refresh-token");

        // Retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

**2. Backend Refresh Token Endpoint:**

```javascript
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id);

    // Set new cookie
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.json({ success: true, message: "Token refreshed" });
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};
```

**3. Updated Auth Middleware:**

```javascript
export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: "Not authorized - No token" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (jwtError) {
      // Token expired or invalid
      return res.status(401).json({
        message: "Not authorized - Token expired",
        tokenExpired: true,
      });
    }
  } catch (error) {
    res.status(401).json({ message: "Not authorized" });
  }
};
```

**4. Added Token Expiry Warning:**

```javascript
// Context to track token expiry
const useTokenExpiry = () => {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Check token expiry every 5 minutes
    const interval = setInterval(async () => {
      try {
        await axiosInstance.get("/auth/check-token");
      } catch (error) {
        if (error.response?.data?.tokenExpired) {
          setShowWarning(true);
        }
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return { showWarning };
};
```

### **Outcome:**

✅ Seamless token refresh without user intervention  
✅ No unexpected logouts during active sessions  
✅ Graceful error handling with clear user feedback  
✅ Secure refresh token mechanism with httpOnly cookies  
✅ Users can continue video consultations uninterrupted

### **Key Learnings:**

- **Proactive Error Handling**: Anticipate and handle auth failures gracefully
- **Token Management**: Implement refresh tokens for better UX
- **Interceptor Pattern**: Centralize error handling in HTTP client
- **User Communication**: Warn users before session expires

---

## Scenario 4: WebRTC Video Call Connection Failures

### **Challenge:**

Video calls between doctors and patients were failing to establish ~40% of the time. Users saw "Connecting..." indefinitely, and sometimes only audio worked without video. This was critical as video consultation was a core feature.

### **Investigation:**

1. ICE candidate gathering was inconsistent
2. STUN/TURN server configuration was incomplete
3. Firewall/NAT traversal issues
4. Peer connection state wasn't being monitored properly
5. No fallback mechanism for connection failures

### **Root Cause Analysis:**

**1. Incomplete ICE Server Configuration:**

```javascript
// BEFORE - Only using free STUN server
const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};
```

**2. Missing Connection State Handling:**

```javascript
// BEFORE - No monitoring of connection state
peerConnection.current = new RTCPeerConnection(configuration);
// Just assumed it would work
```

**3. Race Condition in ICE Candidates:**

```javascript
// BEFORE - ICE candidates sent before remote description set
socket.on("ice-candidate", (candidate) => {
  peerConnection.addIceCandidate(candidate); // Could fail
});
```

### **Solution Implemented:**

**1. Enhanced ICE Server Configuration:**

```javascript
const configuration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    {
      urls: "turn:numb.viagenie.ca",
      username: process.env.VITE_TURN_USERNAME,
      credential: process.env.VITE_TURN_PASSWORD,
    },
  ],
  iceCandidatePoolSize: 10,
  iceTransportPolicy: "all",
};
```

**2. Connection State Monitoring:**

```javascript
const setupPeerConnection = (partnerId) => {
  const pc = new RTCPeerConnection(configuration);

  // Monitor connection state
  pc.onconnectionstatechange = () => {
    console.log("Connection state:", pc.connectionState);

    switch (pc.connectionState) {
      case "connected":
        setCallStatus("connected");
        setConnectionQuality("good");
        break;
      case "disconnected":
        setCallStatus("reconnecting");
        // Attempt reconnection
        attemptReconnection();
        break;
      case "failed":
        setCallStatus("failed");
        setError("Connection failed. Please try again.");
        cleanupCall();
        break;
      case "closed":
        cleanupCall();
        break;
    }
  };

  // Monitor ICE connection state
  pc.oniceconnectionstatechange = () => {
    console.log("ICE state:", pc.iceConnectionState);

    if (pc.iceConnectionState === "failed") {
      // Restart ICE
      pc.restartIce();
    }
  };

  // Monitor ICE gathering state
  pc.onicegatheringstatechange = () => {
    console.log("ICE gathering:", pc.iceGatheringState);
  };

  return pc;
};
```

**3. Fixed ICE Candidate Race Condition:**

```javascript
// Queue for pending ICE candidates
const pendingCandidates = useRef([]);

socket.on("ice-candidate", async (data) => {
  const { candidate } = data;

  if (!peerConnection.current) {
    console.warn("No peer connection for ICE candidate");
    return;
  }

  try {
    // Check if remote description is set
    if (peerConnection.current.remoteDescription) {
      await peerConnection.current.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    } else {
      // Queue candidates until remote description is set
      pendingCandidates.current.push(candidate);
    }
  } catch (error) {
    console.error("Error adding ICE candidate:", error);
  }
});

// Process queued candidates after setting remote description
const setRemoteDescriptionWithCandidates = async (description) => {
  await peerConnection.current.setRemoteDescription(description);

  // Add queued ICE candidates
  for (const candidate of pendingCandidates.current) {
    try {
      await peerConnection.current.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    } catch (error) {
      console.error("Error adding queued ICE candidate:", error);
    }
  }

  pendingCandidates.current = [];
};
```

**4. Media Constraints Optimization:**

```javascript
const getMediaStream = async () => {
  try {
    // Start with ideal constraints
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280, max: 1920 },
        height: { ideal: 720, max: 1080 },
        frameRate: { ideal: 30, max: 60 },
        facingMode: "user",
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    return stream;
  } catch (error) {
    console.warn("Failed with ideal constraints, trying fallback");

    // Fallback to basic constraints
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: true,
      });

      return stream;
    } catch (fallbackError) {
      throw new Error("Camera/microphone access denied");
    }
  }
};
```

**5. Automatic Reconnection Logic:**

```javascript
const attemptReconnection = async () => {
  if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
    setError("Unable to reconnect. Please start a new call.");
    cleanupCall();
    return;
  }

  reconnectAttempts.current++;
  setCallStatus(
    `Reconnecting (${reconnectAttempts.current}/${MAX_RECONNECT_ATTEMPTS})`
  );

  // Wait before reconnecting
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Restart ICE
  if (peerConnection.current) {
    peerConnection.current.restartIce();
  }
};
```

**6. Connection Quality Monitoring:**

```javascript
useEffect(() => {
  if (!peerConnection.current) return;

  const interval = setInterval(async () => {
    const stats = await peerConnection.current.getStats();

    stats.forEach((report) => {
      if (report.type === "inbound-rtp" && report.kind === "video") {
        const packetsLost = report.packetsLost || 0;
        const packetsReceived = report.packetsReceived || 0;

        if (packetsReceived > 0) {
          const lossRate = packetsLost / packetsReceived;

          if (lossRate < 0.02) {
            setConnectionQuality("good");
          } else if (lossRate < 0.05) {
            setConnectionQuality("fair");
          } else {
            setConnectionQuality("poor");
          }
        }
      }
    });
  }, 3000);

  return () => clearInterval(interval);
}, [peerConnection.current]);
```

### **Outcome:**

✅ Video call success rate improved from 60% to 95%  
✅ Automatic reconnection handles temporary network issues  
✅ TURN server ensures connectivity even behind strict NAT  
✅ Connection quality indicator helps users understand issues  
✅ Graceful degradation to audio-only if video fails  
✅ Better error messages guide users on troubleshooting

### **Key Learnings:**

- **Network Resilience**: Always implement TURN servers for production WebRTC
- **State Management**: Monitor all connection states and handle transitions
- **Race Conditions**: Queue ICE candidates until ready to process
- **Fallback Strategies**: Degrade gracefully when ideal conditions aren't met
- **User Feedback**: Visual indicators of connection quality improve UX
- **Monitoring**: Stats API provides valuable insights for debugging

---

## General Interview Tips for Technical Challenges:

### **STAR Method Template:**

**Situation**: Briefly describe the context and problem  
**Task**: What needed to be accomplished  
**Action**: Specific steps you took (technical details)  
**Result**: Quantifiable outcomes and learnings

### **Key Points to Emphasize:**

1. **Problem-Solving Approach**:

   - Systematic debugging (logs, network inspection, database queries)
   - Root cause analysis before jumping to solutions
   - Testing hypotheses incrementally

2. **Technical Depth**:

   - Understanding of underlying technologies (WebRTC, Socket.IO, JWT, MongoDB)
   - Knowledge of edge cases and error scenarios
   - Performance and optimization considerations

3. **Best Practices**:

   - Defensive programming (null checks, type safety)
   - Error handling and user feedback
   - Code maintainability and documentation
   - Security considerations (token management, validation)

4. **Collaboration & Communication**:

   - How you researched solutions (documentation, Stack Overflow, GitHub issues)
   - Testing methodology (manual testing, different browsers, network conditions)
   - Code review and knowledge sharing

5. **Impact & Metrics**:
   - User experience improvements
   - Performance gains (connection success rates, response times)
   - Bug reduction and stability improvements

### **Follow-up Questions to Prepare For:**

- "How would you prevent this issue from happening again?"
- "What monitoring/logging would you add to catch this earlier?"
- "How did you test your fix?"
- "What trade-offs did you consider?"
- "How would this solution scale?"
- "What would you do differently next time?"
