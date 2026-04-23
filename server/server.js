import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";
import cloudinary from "./lib/cloudinary.js";

// CREATE EXPRESS APP
const app = express();
const server = http.createServer(app);

// INITIALIZE SOCKET.IO
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// STORE ONLINE USERS
export const userSocketMap = {};

// SOCKET.IO CONNECTION
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected:", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User Disconnected:", userId);

    if (userId) {
      delete userSocketMap[userId];
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// MIDDLEWARE
app.use(express.json({ limit: "4mb" }));
app.use(cors({ origin: "*" }));

// ROOT ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// TEST CLOUDINARY ROUTE
app.get("/test-upload", async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(
      "https://res.cloudinary.com/demo/image/upload/sample.jpg"
    );
    res.json(result);
  } catch (error) {
    console.log("TEST ERROR:", error);
    res.json(error);
  }
});

// ROUTES
app.get("/api/status", (req, res) => {
  res.send("Server is live");
});

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// PORT
const PORT = process.env.PORT || 5000;

// START SERVER FUNCTION
const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB Connected ✅");

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });
  } catch (error) {
    console.error("DB Connection Failed ❌:", error);
  }
};

startServer();

export default server;
