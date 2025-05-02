const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

function generateNotification() {
  const now = new Date();
  return {
    title: "📢 New Update!",
    subtitle: "This is a sample notification from server.",
    timestamp: now.toLocaleString()
  };
}

// Emit notification every 5 seconds
setInterval(() => {
  const notification = generateNotification();
  io.emit("notification", notification);
  console.log("Sent:", notification);
}, 5000);

io.on("connection", (socket) => {
  console.log("✅ A user connected");

  socket.on("message", (msg) => {
    console.log("Received message:", msg);
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected");
  });
});

app.get("/", (req, res) => {
  res.send("✅ Socket.IO Server with Notifications is Running 🚀");
});

server.listen(process.env.PORT || 3000, () => {
  console.log("🚀 Server listening on *:3000");
});
