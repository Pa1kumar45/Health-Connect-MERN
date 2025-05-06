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

const handleSocketConnection = (io) => {
    const onlineUsers = new Map();

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
        const userId = socket.handshake.query.userId;

        if (userId) {
            onlineUsers.set(userId, socket.id);
            console.log('Online users:', Array.from(onlineUsers.entries()));
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
            console.log('Answering call:');
            if (callerSocketId) {
                io.to(callerSocketId).emit('call-answered', {
                    answer: data.answer
                });
            }
        });

        socket.on('ice-candidate', (data) => {
            const receiverSocketId = onlineUsers.get(data.to);
            // if (receiverSocketId) {
            //     io.to(receiverSocketId).emit('ice-candidate', {
            //         candidate: data.candidate
            //     });
            // }
            console.log('ICE candidate:', data.candidate);
            console.log('Receiver socket ID [ICE candidate]:', receiverSocketId);
            socket.broadcast.to(receiverSocketId).emit('ice-candidate', {
                candidate: data.candidate
            });
        });

        socket.on('call-end', (data) => {
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
        });
    });
};

handleSocketConnection(io);

export {io, app, server};
