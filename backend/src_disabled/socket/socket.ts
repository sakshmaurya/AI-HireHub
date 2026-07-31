import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../../models/user.js';

export const setupSocket = (io: SocketIOServer) => {
  // Authentication middleware
  io.use(async (socket: any, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.data.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: any) => {
    const user = socket.data.user;
    const userId = user._id.toString();

    console.log(`User connected: ${user.fullName} (${userId})`);

    // Join user's personal room
    socket.join(userId);

    // Send notification helper
    io.sendNotification = (userId: string, notification: any) => {
      io.to(userId).emit('notification', notification);
    };

    // Send message helper
    io.sendMessage = (conversationId: string, message: any) => {
      io.to(conversationId).emit('message', message);
    };

    // Join conversation room
    socket.on('join-conversation', (conversationId: string) => {
      socket.join(conversationId);
    });

    // Leave conversation room
    socket.on('leave-conversation', (conversationId: string) => {
      socket.leave(conversationId);
    });

    // Send message
    socket.on('send-message', (data: { conversationId: string; message: any }) => {
      socket.to(data.conversationId).emit('message', data.message);
    });

    // Typing indicator
    socket.on('typing', (data: { conversationId: string; isTyping: boolean }) => {
      socket.to(data.conversationId).emit('user-typing', {
        userId,
        isTyping: data.isTyping,
      });
    });

    // Disconnect
      });
    });

    // Handle notifications
    socket.on('mark_notification_read', (notificationId: string) => {
      // Update in database via API
      socket.emit('notification_read', { notificationId });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.fullName}`);
    });

    // Error handling
    socket.on('error', (error: Error) => {
      console.error('Socket error:', error);
    });
  });

  // Helper function to send notification to specific user
  io.sendNotification = (userId: string, notification: any) => {
    io.to(`user_${userId}`).emit('new_notification', notification);
  };

  // Helper function to send message to conversation
  io.sendMessage = (conversationId: string, message: any) => {
    io.to(`conversation_${conversationId}`).emit('new_message', message);
  };

  return io;
};

export default setupSocket;
