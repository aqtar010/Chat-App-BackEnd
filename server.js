const app = require("./app");
const PORT = process.env.PORT || 5050;
const { createServer } = require("http");
const { Server } = require("socket.io");

const cors = require("cors");
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],
  },
});

const users = [];

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.onAny((eventName, ...args) => {
    console.log(eventName, args);
  });
  if (users.length > 0) {
    emitConnectedClients("one");
  }

  socket.on("setUsername", (username) => {
    socket.username = username.FirstName;
    console.log(
      `Username ${socket.username} is associated with socket ${socket.id}`
    );

    const existingUser = users.find(
      (user) => user.username === socket.username
    );
    if (existingUser) {
      if (existingUser.socketId !== socket.id) {
        existingUser.socketId = socket.id;
        console.log("existing user:", users);
      }
    } else {
      users.push({ socketId: socket.id, username: socket.username });
      console.log("New User:", users);
    }
    emitConnectedClients("setusr");
  });
  socket.on("file", (data) => {
    // Broadcast the file data to all clients except the sender
    const recipientUser = users.find(
      (user) => user.socketId == data.recipientId
    );
    const senderUser = users.find((user) => user.socketId === data.senderId);
    if (recipientUser && senderUser) {
      const roomName = `privateRoom_${socket.id}_${data.recipientId}`;
      socket.join(roomName);
      io.sockets.sockets.get(data.recipientId).join(roomName);
      console.log("room members:", io.sockets.adapter.rooms.get(roomName));
      io.to(roomName).emit("fileReceived", data);

      socket.leave(roomName);
      io.sockets.sockets.get(data.recipientId).leave(roomName);
      console.log("room members:", io.sockets.adapter.rooms.get(roomName));
    }
  });
  socket.on("privateMessage", (data) => {
    console.log("I ran");
    let temp = JSON.parse(data);
    const recipientUser = users.find(
      (user) => user.socketId == temp.recipientId
    );
    let senderUser = users.find((user) => user.socketId === temp.senderId);
    if (recipientUser && senderUser) {
      const roomName = `privateRoom_${socket.id}_${temp.recipientId}`;
      socket.join(roomName);
      io.sockets.sockets.get(temp.recipientId).join(roomName);
      console.log("room members:", io.sockets.adapter.rooms.get(roomName));
      io.to(roomName).emit("privateMessage", data);

      socket.leave(roomName);
      io.sockets.sockets.get(temp.recipientId).leave(roomName);
      console.log("room members:", io.sockets.adapter.rooms.get(roomName));
    }
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);

    const index = users.findIndex((user) => user.socketId === socket.id);
    if (index !== -1) {
      const disconnectedUser = users.splice(index, 1)[0];
      emitConnectedClients("dis");
      io.emit("userDisconnected", disconnectedUser.username);
    }
  });
});
function emitConnectedClients(str = "def") {
  io.emit(
    "connectedClients",
    users.map((user) => [user.socketId, user.username, "sent from server", str])
  );
}

httpServer.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
module.exports = httpServer;
