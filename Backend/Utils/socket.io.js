import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const httpServer = http.createServer(app);

export function getReceiverSocketId(userId) {
  return onlineUsers[userId];
}

const onlineUsers = {}; //

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    onlineUsers[userId] = socket.id;
    console.log("User ID:", userId, "Socket ID:", socket.id);
  }

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

export { app, httpServer, io };
