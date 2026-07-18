import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    res.json({ likedMovies: req.user.likedMovies || [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { tmdbId, title, posterPath, genres, year } = req.body;

    if (!tmdbId || !title) {
      return res.status(400).json({ message: 'Movie id and title are required' });
    }

    await User.updateOne(
      { _id: req.user._id, 'likedMovies.tmdbId': { $ne: tmdbId } },
      {
        $push: {
          likedMovies: {
            tmdbId,
            title,
            posterPath: posterPath || null,
            genres: Array.isArray(genres) ? genres : [],
            year: Number(year) || null,
            likedAt: new Date()
          }
        }
      }
    );

    const user = await User.findById(req.user._id).select('likedMovies');
    res.json({ likedMovies: user.likedMovies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:tmdbId', auth, async (req, res) => {
  try {
    const tmdbId = Number(req.params.tmdbId);

    await User.updateOne(
      { _id: req.user._id },
      { $pull: { likedMovies: { tmdbId } } }
    );

    const user = await User.findById(req.user._id).select('likedMovies');
    res.json({ likedMovies: user.likedMovies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
