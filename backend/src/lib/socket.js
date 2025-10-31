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

// Allow multiple origins for CORS (production + local development)
const allowedOrigins = [
    process.env.FRONTEND_URL, // Production Vercel URL
    'http://localhost:5173',   // Local development
    'http://localhost:5174',   // Backup local port
].filter(Boolean);

const io = new Server(server, {
    cors: {
        origin: function (origin, callback) {
            // Allow requests with no origin (mobile apps, curl, etc.)
            if (!origin) return callback(null, true);
            
            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ["*"],
        transports: ['websocket', 'polling']
    },
    allowEIO3: true,
    pingTimeout: 60000,
    pingInterval: 25000,
    cookie:{    // for https - allow cross-domain cookies for vercel.app to onrender.com
        httpOnly:true,
        secure:true,
        sameSite:'none'  // Changed from 'strict' to 'none' for cross-domain support
    }
});

const handleSocketConnection = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
        // list of connected users
    
        console.log('Online users:', Array.from(onlineUsers.entries()));
        const userId = socket.handshake.query.userId;

        if (userId) {
            onlineUsers.set(userId, socket.id);
        }

       

        socket.on('call-user', (data) => {
            const receiverSocketId = onlineUsers.get(data.to);
            console.log('Receiver socket ID [offer]:', receiverSocketId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('call-made', {
                    offer: data.offer,
                    from: userId
                });
            }
        });

        socket.on('answer-call', (data) => {
            const callerSocketId = onlineUsers.get(data.to);
            console.log('Caller socket ID [answer]:', callerSocketId);
            if (callerSocketId) {
                console.log('Answering call with SDP answer');
                io.to(callerSocketId).emit('call-answered', {
                    answer: data.answer
                });
            }
        });

        socket.on('ice-candidate', (data) => {
            const receiverSocketId = onlineUsers.get(data.to);
            console.log('ICE candidate received');
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('ice-candidate', {
                    candidate: data.candidate,
                    from: userId
                });
            }
        });

        socket.on('call-rejected', (data) => {
            const callerSocketId = onlineUsers.get(data.to);
            if (callerSocketId) {
                io.to(callerSocketId).emit('call-rejected');
            }
        });

        socket.on('call-end', (data) => {
            console.log('Call ended by user:', userId);
            const receiverSocketId = onlineUsers.get(data.to);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('call-end');
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            for (const [key, value] of onlineUsers.entries()) {
                if (value === socket.id) {
                    onlineUsers.delete(key);
                    break;
                }
            }
            console.log('Updated online users:', Array.from(onlineUsers.entries()));
        });
    });
};

handleSocketConnection(io);

export {io, app, server};
