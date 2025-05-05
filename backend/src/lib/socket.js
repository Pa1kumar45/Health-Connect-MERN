import {Server} from 'socket.io';
import express from 'express'
import http from 'http'

const app = express();
const server = http.createServer(app);

// Track online users with their socket IDs
const onlineUsers = new Map();

export const getSocketId = (id) => {
    return onlineUsers.get(id);
}

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
        credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    const userId = socket.handshake.query.userId;
    
    if (userId) {
        onlineUsers.set(userId, socket.id);
        console.log("Current online users:", Array.from(onlineUsers.entries()));
    }

    // WebRTC signaling handlers
    socket.on('call-user', (data) => {
        const receiverSocketId = getSocketId(data.userId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('call-made', {
                offer: data.offer,
                userId: userId
            });
        }
    });

    socket.on('answer-call', (data) => {
        const receiverSocketId = getSocketId(data.userId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('call-answered', {
                answer: data.answer
            });
        }
    });

    socket.on('ice-candidate', (data) => {
        const receiverSocketId = getSocketId(data.userId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('ice-candidate', {
                candidate: data.candidate
            });
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        // Remove user from online users when they disconnect
        for (const [key, value] of onlineUsers.entries()) {
            if (value === socket.id) {
                onlineUsers.delete(key);
                console.log("Removed user from online users:", key);
                break;
            }
        }
    });

    socket.on("error", (error) => {
        console.error("Socket error:", error);
    });
});

export {io, app, server};
