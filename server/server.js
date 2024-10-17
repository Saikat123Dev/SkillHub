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

const onlineUsers = new Set();

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join", (username, callback) => {
    console.log("User joined:", username);
    socket.username = username;
    onlineUsers.add(username);
    io.emit("updateOnlineUsers", Array.from(onlineUsers)); // Emit online users to all clients
    callback();
  });
  

  socket.on("message", ({ user, message }) => {
    console.log('Received message:', { user, message, socketId: socket.id });
    const _date = new Date();
    io.emit("message", { user, message, date: _date });
    console.log('Sent message to all clients:', { user, message, date: _date });
  });

  socket.on("disconnect", (reason) => {
    console.log("A user disconnected:", socket.id, "Reason:", reason);
    if (socket.username) {
      onlineUsers.delete(socket.username);
      io.emit("updateOnlineUsers", Array.from(onlineUsers));
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});