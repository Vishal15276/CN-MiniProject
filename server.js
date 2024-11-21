const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

// Serve static files from the public directory
app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Listen for drawing events and propagate them to other clients
  socket.on("startDrawing", (data) => {
    socket.broadcast.emit("startDrawing", data); // Send to all clients except the sender
  });

  socket.on("drawing", (data) => {
    socket.broadcast.emit("drawing", data); // Send to all clients except the sender
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`Server  running on http://127.0.0.1:${PORT}`);
});
