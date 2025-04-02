import {Server} from 'socket.io';
import express from 'express'
import http from 'http'

const app = express();
const server = http.createServer(app);

//user._id = socket.id
const onlineUsers={};
export const getSocketId=(id)=>{
return onlineUsers[id];
}

const io = new Server(server,{
    cors:{
        origin:["http://localhost:5173"],
        credentials:true
    }
});


io.on("connection",(socket)=>{
console.log("user connected",socket.id);
const userId=socket.handshake.query.userId;
onlineUsers[userId]=socket.id;
console.log("current online users",onlineUsers);

socket.on("disconnect",()=>{
    console.log("a user disconnected",socket.id);
})

})

export {io,app,server};
