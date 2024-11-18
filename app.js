const express = require("express");
const bodyParser = require("body-parser");
const db = require("./util/db");
const dotenv = require("dotenv");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const auth = require("./middleware/auth");
dotenv.config();
const port = process.env.PORT || 3000;

// routes
const userRoutes = require("./routes/userRoutes");
const loginRoutes = require("./routes/loginRoutes");
const chatRoutes = require("./routes/chatRoutes");
const groupChatRoutes = require("./routes/groupChatRoutes");
// models
const chatModel = require("./models/chatModel");
const groupMember = require("./models/groupMemberModel");

const corsOptions = {
  origin: ["http://localhost:3000", "http://127.0.0.1:5500"],
  credentials: true,
  method: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: corsOptions });
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use("/api", userRoutes);
app.use("/api", loginRoutes);
app.use("/api", chatRoutes);
app.use("/api", groupChatRoutes);

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

async function socketConnection() {
  io.use(auth.socketMiddleware);
  io.on("connection", (socket) => {
    console.log("A user connected", socket.user.name);
    socket.on("joinGroup", (groupId) => {
      socket.join(`group-${groupId}`);
      console.log(`User joined group-${groupId}`);
    });

    socket.on("messageSent", async (data) => {
      const { groupId, message } = data;
      const userId = socket.user.id;

      try {
        await chatModel.create({ groupId, userId, message });
        io.to(`group-${groupId}`).emit("messageReceived", {
          user: socket.user.name,
          message,
          groupId,
        });
      } catch (error) {
        console.error("Error saving message:", error.message);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
}

server.listen(port, () => {
  testConnection();
  socketConnection();
  console.log("Server started on port 3000");
});
