const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Message = require('../models/Message');

const userSocketMap = {}; // userId -> socketId

const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*', // dynamically handled, or wildcard for websocket compatibility
      methods: ['GET', 'POST']
    }
  });

  // JWT Middleware for Socket.io
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkeyforreuseme');
      socket.userId = decoded.id.toString();
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    if (userId) {
      userSocketMap[userId] = socket.id;
      console.log(`Socket connected: User ${userId} (Socket: ${socket.id})`);
      
      // Broadcast online users
      io.emit('get-online-users', Object.keys(userSocketMap));
    }

    // Join conversation room
    socket.on('join-chat', (conversationId) => {
      socket.join(conversationId);
      console.log(`Socket ${socket.id} joined room: ${conversationId}`);
    });

    // Send message real-time handler
    socket.on('send-message', ({ message, receiverId }) => {
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        // Send to receiver directly
        io.to(receiverSocketId).emit('receive-message', message);
      }
      
      // Send to other socket connections of the same sender (for multi-device sync)
      socket.to(message.conversation).emit('receive-message', message);
    });

    // Typing indicators
    socket.on('typing', ({ conversationId, receiverId }) => {
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('typing', { conversationId });
      }
    });

    socket.on('stop-typing', ({ conversationId, receiverId }) => {
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('stop-typing', { conversationId });
      }
    });

    // Message Seen checkmark handler
    socket.on('message-seen', async ({ conversationId, senderId }) => {
      try {
        // Mark all messages from sender in this conversation as seen
        await Message.updateMany(
          { conversation: conversationId, sender: senderId, seen: false },
          { $set: { seen: true } }
        );

        // Notify the sender that messages were marked seen
        const senderSocketId = getReceiverSocketId(senderId);
        if (senderSocketId) {
          io.to(senderSocketId).emit('messages-marked-seen', { conversationId });
        }
      } catch (err) {
        console.error('Failed to mark messages seen:', err);
      }
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      if (userId && userSocketMap[userId] === socket.id) {
        delete userSocketMap[userId];
        console.log(`Socket disconnected: User ${userId}`);
        
        // Broadcast updated online users list
        io.emit('get-online-users', Object.keys(userSocketMap));
      }
    });
  });

  return io;
};

module.exports = {
  initSocket,
  getReceiverSocketId
};
