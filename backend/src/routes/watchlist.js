import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    res.json({ watchlist: req.user.watchlist || [] });
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
      { _id: req.user._id, 'watchlist.tmdbId': { $ne: tmdbId } },
      {
        $push: {
          watchlist: {
            tmdbId,
            title,
            posterPath: posterPath || null,
            genres: Array.isArray(genres) ? genres : [],
            year: Number(year) || null,
            addedAt: new Date()
          }
        }
      }
    );

    const user = await User.findById(req.user._id).select('watchlist');
    res.json({ watchlist: user.watchlist });
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
      { $pull: { watchlist: { tmdbId } } }
    );

    const user = await User.findById(req.user._id).select('watchlist');
    res.json({ watchlist: user.watchlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
