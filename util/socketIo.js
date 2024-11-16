const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const corsOptions = {
  origin: ["http://localhost:3000", "http://127.0.0.1:5500"],
  credentials: true,
  method: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: corsOptions });

async function socketConnection() {
  io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("messageSent", (data) => {
      console.log(data, socket.id);
      io.emit("messageReceived", data);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
}

module.exports = { socketConnection, server};