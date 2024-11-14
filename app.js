const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./util/db");
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 3000;

// routes
const userRoutes = require("./routes/userRoutes");

// models


const corsOptions = {
  origin: ["http://localhost:3000", "http://127.0.0.1:5500"],
  credentials: true,
  method: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/', userRoutes)

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

app.listen(port, () => {
  console.log("Server started on port 3000");
});