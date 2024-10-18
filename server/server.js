import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Update with your client origin
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: 'http://localhost:3000', // Update with your client origin
  credentials: true
}));

// Store online users for each room
const rooms = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // When a user joins a room
  socket.on("joinRoom", ({ username, room }, callback) => {
    console.log(`User ${username} joined room: ${room}`);
    
    // Store the room and username in the socket object
    socket.username = username;
    onlineUsers.add(username);
    io.emit("updateOnlineUsers", Array.from(onlineUsers)); 
    callback();
  });
  socket.on('message', (messageData) => {
    const timestampedMessage = { ...messageData, date: new Date().toISOString() };
    // Broadcast the message to everyone in the room
    socket.to(messageData.room).emit('message', timestampedMessage);
  });
  
  // When a user sends a message
  socket.on("message", ({ user, message }) => {
    console.log('Received message in room:', socket.room, { user, message });
    
    const _date = new Date();
    
    // Emit the message only to users in the same room
    io.to(socket.room).emit("message", { user, message, date: _date });
    console.log('Sent message to room:', socket.room, { user, message, date: _date });
  });

  // When a user disconnects
  socket.on("disconnect", (reason) => {
    console.log("A user disconnected:", socket.id, "Reason:", reason);

    if (socket.username && socket.room) {
      // Remove the user from the room's online users list
      rooms[socket.room]?.delete(socket.username);

      // Notify everyone in the room about the updated online users
      io.to(socket.room).emit("updateOnlineUsers", Array.from(rooms[socket.room]));

      // Clean up the room if no users are left
      if (rooms[socket.room]?.size === 0) {
        delete rooms[socket.room];
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
