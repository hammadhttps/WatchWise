import express from 'express';
import auth from '../middleware/auth.js';
import { createRoom, getRoom, publicRoom } from '../party.js';

const router = express.Router();

router.post('/', auth, (req, res) => {
  const { movieId, movieTitle, posterPath, backdropPath } = req.body;

  if (!movieId || !movieTitle) {
    return res.status(400).json({ message: 'Movie id and title are required' });
  }

  const room = createRoom({
    movieId: Number(movieId),
    movieTitle,
    posterPath,
    backdropPath,
    hostName: req.user.firstName
  });

  res.status(201).json({ party: publicRoom(room) });
});

router.get('/:id', (req, res) => {
  const room = getRoom(req.params.id);
  if (!room) {
    return res.status(404).json({ message: 'This party no longer exists' });
  }
  res.json({ party: publicRoom(room) });
});

export default router;
