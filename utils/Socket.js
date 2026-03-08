const { Server } = require("socket.io");
const Message = require("../Model/message");
const message = require("../Model/message");

const InitializingSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ["https://devinsta-frontend.vercel.app", "http://localhost:5173"],
    },

  });

  io.on("connection", (socket) => {
    console.log("New WebSocket connection established!");

    // Handling Room Join
    socket.on("joinchat", ({ fromUserId, toUserId }) => {
      if (!fromUserId || !toUserId) {
        console.log("Missing user data for joining chat.");
        return;
      }
      const room = [fromUserId, toUserId].sort().join("_");
      console.log("Joining room:", room);
      socket.join(room);
    });

    // Handling Messages
    socket.on("sendmessage", async ({ fromUserId, toUserId, message }) => {
      if (!fromUserId || !toUserId || !message) {
        console.log("Incomplete message data received.");
        return;
      }

      const room = [fromUserId, toUserId].sort().join("_");
      io.to(room).emit("messagerecieve", {
        fromUserId: fromUserId,
        toUserId: toUserId,
        message:message,
      });

      try {
        // Save message to MongoDB
        const newMessage = new Message({
          fromUserId: fromUserId,
          toUserId: toUserId,
          message: message,
        });
        await newMessage.save();
        console.log("Message saved to database:", newMessage);
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    // Handling Disconnection
    socket.on("disconnect", () => {
      console.log("A user disconnected.");
    });
  });
};

module.exports = InitializingSocket;
