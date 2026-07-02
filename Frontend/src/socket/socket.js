let socket = null;
let onlineUsers = [];
const listeners = new Set();

const notifyListeners = () => {
  listeners.forEach(fn => fn());
};

const getBaseUrl = (apiUrl) => {
  return apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;
};

export const socketClient = {
  get onlineUsers() {
    return onlineUsers;
  },

  isOnline(userId) {
    return onlineUsers.includes(userId.toString());
  },

  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  connectSocket(token, apiUrl) {
    if (socket?.connected) return;

    const backendUrl = getBaseUrl(apiUrl);
    
    // Connect using global io loaded from CDN in index.html
    if (typeof io === 'undefined') {
      console.warn("Socket.io client library not loaded yet.");
      return;
    }

    socket = io(backendUrl, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      console.log('Socket connected successfully:', socket.id);
    });

    socket.on('get-online-users', (users) => {
      onlineUsers = users;
      notifyListeners();
    });

    socket.on('receive-message', () => {
      notifyListeners();
    });

    socket.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message);
    });
  },

  disconnectSocket() {
    if (socket) {
      socket.disconnect();
      socket = null;
      onlineUsers = [];
      notifyListeners();
      console.log('Socket disconnected.');
    }
  },

  getSocket() {
    return socket;
  },

  // Emit Actions
  joinChat(conversationId) {
    if (socket?.connected) {
      socket.emit('join-chat', conversationId);
    }
  },

  sendMessage(message, receiverId) {
    if (socket?.connected) {
      socket.emit('send-message', { message, receiverId });
    }
  },

  emitTyping(conversationId, receiverId) {
    if (socket?.connected) {
      socket.emit('typing', { conversationId, receiverId });
    }
  },

  emitStopTyping(conversationId, receiverId) {
    if (socket?.connected) {
      socket.emit('stop-typing', { conversationId, receiverId });
    }
  },

  emitMessageSeen(conversationId, senderId) {
    if (socket?.connected) {
      socket.emit('message-seen', { conversationId, senderId });
    }
  },

  // Event Subscriptions
  onReceiveMessage(callback) {
    if (!socket) return () => {};
    socket.on('receive-message', callback);
    return () => socket.off('receive-message', callback);
  },

  onTyping(callback) {
    if (!socket) return () => {};
    socket.on('typing', callback);
    return () => socket.off('typing', callback);
  },

  onStopTyping(callback) {
    if (!socket) return () => {};
    socket.on('stop-typing', callback);
    return () => socket.off('stop-typing', callback);
  },

  onMessagesMarkedSeen(callback) {
    if (!socket) return () => {};
    socket.on('messages-marked-seen', callback);
    return () => socket.off('messages-marked-seen', callback);
  }
};
