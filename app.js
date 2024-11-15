const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./util/db");
const dotenv = require("dotenv");
dotenv.config();
const { createServer } = require("http");
const { Server } = require("socket.io");
const port = process.env.PORT || 3000;

// routes
const userRoutes = require("./routes/userRoutes");
const loginRoutes = require("./routes/loginRoutes");
const chatRoutes = require("./routes/chatRoutes");
// models

const corsOptions = {
  origin: ["http://localhost:3000", "http://127.0.0.1:5500"],
  credentials: true,
  method: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const app = express();
const server = createServer(app);
const io = new Server(server, {cors: corsOptions,});
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use("/api", userRoutes);
app.use("/api", loginRoutes);
app.use("/api", chatRoutes);

// test connection
async function testConnection() {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
    await db.sync();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
testConnection();

// socket connection
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

server.listen(port, () => {
  console.log("Server started on port 3000");
});
