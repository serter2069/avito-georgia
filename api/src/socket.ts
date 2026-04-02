import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function setupSocket(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: { origin: '*' },
    path: '/socket.io',
  });

  // Auth middleware — verify JWT on connection
  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    if (!token || typeof token !== 'string') {
      return next(new Error('Authentication required'));
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
        email: string;
        role: string;
        type: string;
      };
      if (payload.type !== 'access') {
        return next(new Error('Invalid token type'));
      }
      socket.data.userId = payload.userId;
      socket.data.email = payload.email;
      next();
    } catch {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.data.userId}`);

    // Join a thread room
    socket.on('join_thread', async (threadId: string) => {
      try {
        // Verify user is participant
        const participant = await prisma.threadParticipant.findUnique({
          where: { threadId_userId: { threadId, userId: socket.data.userId } },
        });
        if (!participant) {
          socket.emit('error', { message: 'Not a participant of this thread' });
          return;
        }
        socket.join(threadId);
        socket.emit('joined_thread', { threadId });
      } catch (err) {
        console.error('join_thread error:', err);
        socket.emit('error', { message: 'Failed to join thread' });
      }
    });

    // Send a message
    socket.on('send_message', async (data: { threadId: string; text: string }) => {
      try {
        const { threadId, text } = data;
        if (!threadId || !text || typeof text !== 'string' || text.trim().length === 0) {
          socket.emit('error', { message: 'threadId and text are required' });
          return;
        }

        // Verify user is participant
        const participant = await prisma.threadParticipant.findUnique({
          where: { threadId_userId: { threadId, userId: socket.data.userId } },
        });
        if (!participant) {
          socket.emit('error', { message: 'Not a participant of this thread' });
          return;
        }

        // Save message
        const message = await prisma.message.create({
          data: {
            text: text.trim(),
            threadId,
            senderId: socket.data.userId,
          },
          include: { sender: { select: { id: true, name: true, avatarUrl: true } } },
        });

        // Touch thread updatedAt
        await prisma.thread.update({ where: { id: threadId }, data: { updatedAt: new Date() } });

        // Emit to all participants in the room
        io.to(threadId).emit('message_received', message);

        // TODO: Check if other participant is offline and send email notification
      } catch (err) {
        console.error('send_message error:', err);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('typing', (data: { threadId: string }) => {
      if (data.threadId) {
        socket.to(data.threadId).emit('typing', {
          threadId: data.threadId,
          userId: socket.data.userId,
        });
      }
    });

    // Leave thread room
    socket.on('leave_thread', (threadId: string) => {
      if (threadId) {
        socket.leave(threadId);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.data.userId}`);
    });
  });

  return io;
}
