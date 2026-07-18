import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from './models/User.js';

// In-memory party rooms — parties are ephemeral and reset on server restart
const rooms = new Map();

const ROOM_TTL_MS = 12 * 60 * 60 * 1000;

const pruneRooms = () => {
  const now = Date.now();
  for (const [id, room] of rooms) {
    if (room.members.size === 0 && now - room.createdAt > ROOM_TTL_MS) {
      rooms.delete(id);
    }
  }
};

export const createRoom = ({ movieId, movieTitle, posterPath, backdropPath, hostName }) => {
  pruneRooms();
  const id = crypto.randomBytes(4).toString('hex');
  const room = {
    id,
    movieId,
    movieTitle,
    posterPath: posterPath || null,
    backdropPath: backdropPath || null,
    hostName,
    createdAt: Date.now(),
    members: new Map(),
    messages: []
  };
  rooms.set(id, room);
  return room;
};

export const getRoom = (id) => rooms.get(id) || null;

const publicRoom = (room) => ({
  id: room.id,
  movieId: room.movieId,
  movieTitle: room.movieTitle,
  posterPath: room.posterPath,
  backdropPath: room.backdropPath,
  hostName: room.hostName,
  members: [...new Set(room.members.values())]
});

const pushMessage = (room, message) => {
  room.messages.push(message);
  if (room.messages.length > 100) room.messages.shift();
};

export const initPartySockets = (io) => {
  io.use(async (socket, next) => {
    try {
      const cookies = Object.fromEntries(
        (socket.handshake.headers.cookie || '')
          .split(';')
          .map(c => c.trim().split('=').map(decodeURIComponent))
          .filter(pair => pair.length === 2)
      );
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('firstName lastName');
      if (!user) return next(new Error('Authentication required'));
      socket.data.userName = user.firstName;
      next();
    } catch {
      next(new Error('Authentication required'));
    }
  });

  io.on('connection', (socket) => {
    socket.on('party:join', ({ roomId }) => {
      const room = getRoom(roomId);
      if (!room) {
        socket.emit('party:error', { message: 'This party no longer exists' });
        return;
      }

      socket.data.roomId = roomId;
      socket.join(roomId);
      room.members.set(socket.id, socket.data.userName);

      const joinMessage = {
        id: crypto.randomUUID(),
        system: true,
        text: `${socket.data.userName} joined the party`,
        at: Date.now()
      };
      pushMessage(room, joinMessage);

      socket.emit('party:history', { messages: room.messages });
      io.to(roomId).emit('party:state', publicRoom(room));
      socket.to(roomId).emit('party:message', joinMessage);
    });

    socket.on('party:message', ({ text }) => {
      const room = getRoom(socket.data.roomId);
      const clean = String(text || '').trim().slice(0, 500);
      if (!room || !clean) return;

      const message = {
        id: crypto.randomUUID(),
        name: socket.data.userName,
        text: clean,
        at: Date.now()
      };
      pushMessage(room, message);
      io.to(room.id).emit('party:message', message);
    });

    socket.on('disconnect', () => {
      const room = getRoom(socket.data.roomId);
      if (!room || !room.members.has(socket.id)) return;

      const name = room.members.get(socket.id);
      room.members.delete(socket.id);

      const leaveMessage = {
        id: crypto.randomUUID(),
        system: true,
        text: `${name} left the party`,
        at: Date.now()
      };
      pushMessage(room, leaveMessage);
      io.to(room.id).emit('party:state', publicRoom(room));
      io.to(room.id).emit('party:message', leaveMessage);
    });
  });
};

export { publicRoom };
