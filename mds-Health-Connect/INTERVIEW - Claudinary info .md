"We use Cloudinary as our image hosting service. When a user uploads an avatar or sends an image in chat, the frontend converts it to a Base64 string and sends it to our backend. Our controller then uses the Cloudinary SDK to upload the image to their CDN, which returns a secure HTTPS URL. We store only this URL in MongoDB—not the actual image file—which keeps our database lightweight. Cloudinary automatically optimizes images for web delivery and provides a global CDN for fast loading. This architecture separates media storage from our application server, improving scalability. We organize uploads into folders like health-connect/doctors, health-connect/patients, and health-connect/messages for better management."

User selects image in MessageInput.tsx
           ↓
Convert to Base64 (FileReader)
           ↓
Send to Chat.tsx sendMessage()
           ↓
POST /api/message/send/:receiverId
Body: { text: "", image: "data:image/jpeg;base64,/9j/4AAQ..." }
           ↓
Backend messageController.js
           ↓
cloudinary.uploader.upload(base64String)
           ↓
Cloudinary returns: { secure_url: "https://..." }
           ↓
Save to MongoDB: { image: "https://res.cloudinary.com/..." }
           ↓
Socket.IO emits to both users
           ↓
Image appears in chat instantly