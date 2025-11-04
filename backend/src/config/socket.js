import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let io;

export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      socket.userRole = decoded.role;

      console.log(`✅ Socket authenticated: User ${socket.userId}`);
      next();
    } catch (error) {
      console.error('Socket authentication error:', error.message);
      next(new Error('Authentication error'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id} (User: ${socket.userId})`);

    // Join user-specific room for targeted notifications
    socket.join(`user:${socket.userId}`);

    // Join role-specific room (for admin broadcasts)
    if (socket.userRole === 'ADMIN') {
      socket.join('admins');
    } else {
      socket.join('buyers');
    }

    // Handle client events
    socket.on('mark_notification_read', async (notificationId) => {
      console.log(`📖 Marking notification ${notificationId} as read for user ${socket.userId}`);
      // This will be handled by the notification service
    });

    socket.on('disconnect', (reason) => {
      console.log(`❌ Client disconnected: ${socket.id} (Reason: ${reason})`);
    });

    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.id}:`, error);
    });
  });

  console.log('✅ Socket.io initialized successfully');
  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

// Helper function to emit notification to specific user
export const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
    console.log(`📤 Emitted "${event}" to user ${userId}`);
  }
};

// Helper function to emit to all admins
export const emitToAdmins = (event, data) => {
  if (io) {
    io.to('admins').emit(event, data);
    console.log(`📤 Emitted "${event}" to all admins`);
  }
};

// Helper function to emit to all buyers
export const emitToBuyers = (event, data) => {
  if (io) {
    io.to('buyers').emit(event, data);
    console.log(`📤 Emitted "${event}" to all buyers`);
  }
};

export default { initializeSocket, getIO, emitToUser, emitToAdmins, emitToBuyers };
