// import cors from "cors";
// import express from "express";
// import http from "http";
// import { Server } from "socket.io";
//
// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: 'http://localhost:3000',
//     methods: ["GET", "POST"],
//     credentials: true
//   }
// });
//
// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true
// }));
//
//
// const rooms = {};
//
// io.on("connection", (socket) => {
//   console.log("A user connected:", socket.id);
//   socket.on("joinRoom", ({ username, room }, callback) => {
//     console.log(`User ${username} joined room: ${room}`);
//     socket.username = username;
//     onlineUsers.add(username);
//     io.emit("updateOnlineUsers", Array.from(onlineUsers));
//     callback();
//   });
//   socket.on('message', (messageData) => {
//     const timestampedMessage = { ...messageData, date: new Date().toISOString() };
//
//     socket.to(messageData.room).emit('message', timestampedMessage);
//   });
//   socket.on("message", ({ user, message }) => {
//     console.log('Received message in room:', socket.room, { user, message });
//     const _date = new Date();
//     io.to(socket.room).emit("message", { user, message, date: _date });
//     console.log('Sent message to room:', socket.room, { user, message, date: _date });
//   });
//   socket.on("disconnect", (reason) => {
//     console.log("A user disconnected:", socket.id, "Reason:", reason);
//     if (socket.username && socket.room) {
//       rooms[socket.room]?.delete(socket.username);
//       io.to(socket.room).emit("updateOnlineUsers", Array.from(rooms[socket.room]));
//       if (rooms[socket.room]?.size === 0) {
//         delete rooms[socket.room];
//       }
//     }
//   });
// });
// const PORT = process.env.PORT || 3001;
// server.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });

import http from "http";
// import SocketService from "./services/socket";
// import { startMessageConsumer } from "./services/kafka";
async function init() {
  // startMessageConsumer();
  // const socketService = new SocketService();

  const httpServer = http.createServer();
  const PORT = process.env.PORT ? process.env.PORT : 8001;
  // socketService.io.attach(httpServer);
  httpServer.listen(PORT, () =>
      console.log(`HTTP Server started at PORT:${PORT}`)
  );
  // socketService.initListeners();
}

init();
