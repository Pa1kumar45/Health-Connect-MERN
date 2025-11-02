# Chat Message Visibility Fix
DAte: 24//10/25
## Issue

Messages sent in chat were not visible to both sender and receiver. Users could only see messages they received, not the ones they sent.

## Root Cause Analysis

### Frontend Issue (Chat.tsx)

The socket listener had a flawed condition:

```tsx
// BEFORE - Only showed messages where current user is the receiver
if (newMessage.receiverId === currentUser?._id) {
  setMessages([...prevMessages, newMessage]);
}
```

**Problem**: This meant:

- Sender never saw their sent messages via socket updates
- Messages were only visible to the receiver
- No real-time sync between sender and receiver

### Backend Issue (messageController.js)

The socket emission only sent to the receiver:

```javascript
// BEFORE - Only emitted to receiver
const reciverSocketId = getSocketId(receiverId);
if (reciverSocketId) io.to(reciverSocketId).emit("newMessage", newMessage);
```

**Problem**:

- Sender's socket never received the "newMessage" event
- No multi-device support for sender

## Solution Implemented

### 1. Frontend Fix (Chat.tsx)

#### Updated Socket Listener (Lines 65-86)

```tsx
// AFTER - Shows messages for current conversation
const handleNewMessage = (newMessage: Message) => {
  console.log("New message received:", newMessage);
  // Add message if current user is either the sender or receiver
  // and the message is part of the current conversation
  const isPartOfCurrentConversation =
    (newMessage.senderId === id &&
      newMessage.receiverId === currentUser?._id) ||
    (newMessage.senderId === currentUser?._id && newMessage.receiverId === id);

  if (isPartOfCurrentConversation) {
    setMessages((prevMessages: Message[]) => {
      if (!prevMessages) return [newMessage];
      // Avoid duplicate messages
      const messageExists = prevMessages.some(
        (msg) => msg._id === newMessage._id
      );
      if (messageExists) return prevMessages;
      return [...prevMessages, newMessage];
    });
  }
};
```

**Improvements**:

- ✅ Checks if message belongs to current conversation (sender OR receiver)
- ✅ Added duplicate message detection
- ✅ Works for both participants in the chat

#### Updated Send Message Function (Lines 88-104)

```tsx
// AFTER - Added duplicate check
const sendMessage = async (data: { text?: string; image?: string }) => {
  try {
    const response = await axiosInstance.post(`/message/send/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Message sent:", response.data.newMessage);
    // Add message immediately for better UX
    // The socket will also emit it, but we have duplicate check in socket handler
    setMessages((prevMessages: Message[]) => {
      if (!prevMessages) return [response.data.newMessage];
      // Check if message already exists (might have been added by socket)
      const messageExists = prevMessages.some(
        (msg) => msg._id === response.data.newMessage._id
      );
      if (messageExists) return prevMessages;
      return [...prevMessages, response.data.newMessage];
    });
  } catch (error) {
    console.error("Error sending message:", error);
  }
};
```

**Improvements**:

- ✅ Immediate local update for better UX
- ✅ Duplicate detection prevents double-display
- ✅ Works with socket emission

### 2. Backend Fix (messageController.js)

#### Updated sendMessage Function

```javascript
// AFTER - Emits to both sender and receiver
const newMessage = new Message({
  senderId: senderId,
  receiverId: receiverId,
  text,
  image: imageUrl,
});
await newMessage.save();

// Emit to receiver
const receiverSocketId = getSocketId(receiverId);
if (receiverSocketId) {
  io.to(receiverSocketId).emit("newMessage", newMessage);
}

// Also emit to sender (for multi-device support or if sender is in chat)
const senderSocketId = getSocketId(senderId.toString());
if (senderSocketId && senderSocketId !== receiverSocketId) {
  io.to(senderSocketId).emit("newMessage", newMessage);
}

res.status(201).json({ success: true, newMessage });
```

**Improvements**:

- ✅ Emits to receiver's socket
- ✅ Emits to sender's socket (different socket check)
- ✅ Supports multi-device scenarios
- ✅ Real-time sync for both participants

## Message Flow Now

### When User A sends a message to User B:

1. **User A (Sender)**:

   - Calls `sendMessage()` API
   - Message saved to database
   - Immediately adds message locally (optimistic update)
   - Receives socket event "newMessage"
   - Duplicate check prevents double display
   - ✅ **Sees message instantly**

2. **User B (Receiver)**:
   - Receives socket event "newMessage"
   - Checks if message belongs to current conversation
   - Adds message to chat
   - ✅ **Sees message in real-time**

## Benefits

✅ **Both users see all messages** - sender and receiver  
✅ **Real-time synchronization** - instant message delivery  
✅ **No duplicate messages** - proper deduplication logic  
✅ **Better UX** - optimistic updates + socket sync  
✅ **Multi-device support** - sender gets socket events too  
✅ **Conversation isolation** - only shows messages for current chat

## Testing Checklist

- [ ] User A sends message to User B - both see it
- [ ] User B sends message to User A - both see it
- [ ] Messages appear in correct order
- [ ] No duplicate messages displayed
- [ ] Images display correctly for both users
- [ ] Multiple rapid messages work correctly
- [ ] Switching between conversations shows correct messages
- [ ] Refreshing page loads all messages correctly

## Files Modified

1. `frontend/src/pages/Chat.tsx`

   - Fixed socket listener logic (lines 65-86)
   - Added duplicate check in sendMessage (lines 88-104)

2. `backend/src/controllers/messageController.js`
   - Updated sendMessage to emit to both sender and receiver
   - Added sender socket emission with duplicate check
