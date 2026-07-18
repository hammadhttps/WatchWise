import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { Server } from 'socket.io';
import authRoutes from './src/routes/auth.js';
import quoteRoutes from './src/routes/quotes.js';
import likeRoutes from './src/routes/likes.js';
import watchlistRoutes from './src/routes/watchlist.js';
import recommendationRoutes from './src/routes/recommendations.js';
import reviewRoutes from './src/routes/reviews.js';
import tasteRoutes from './src/routes/taste.js';
import partyRoutes from './src/routes/party.js';
import { initPartySockets } from './src/party.js';
import connectDB from './src/config/db.js';

dotenv.config();

const app = express();

const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.FRONTEND_URL].filter(Boolean)
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

const corsOrigins = allowedOrigins.includes('*') ? [] : allowedOrigins;

app.use(cors({
  origin: corsOrigins,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/taste', tasteRoutes);
app.use('/api/party', partyRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: corsOrigins,
    credentials: true
  }
});

initPartySockets(io);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
