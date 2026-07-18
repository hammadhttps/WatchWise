import express from 'express';
import Review from '../models/Review.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/:movieId', async (req, res) => {
  try {
    const movieId = Number(req.params.movieId);
    if (!movieId) {
      return res.status(400).json({ message: 'Valid movie id is required' });
    }

    const reviews = await Review.find({ movieId }).sort({ createdAt: -1 }).limit(100);

    const count = reviews.length;
    const average = count
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / count) * 10) / 10
      : null;

    res.json({ reviews, stats: { average, count } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { movieId, movieTitle, rating, text } = req.body;

    if (!movieId || !movieTitle) {
      return res.status(400).json({ message: 'Movie id and title are required' });
    }

    const numericRating = Number(rating);
    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const review = await Review.findOneAndUpdate(
      { movieId: Number(movieId), user: req.user._id },
      {
        movieId: Number(movieId),
        movieTitle,
        user: req.user._id,
        userName: `${req.user.firstName} ${req.user.lastName}`,
        rating: numericRating,
        text: (text || '').slice(0, 2000)
      },
      { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
    );

    res.json({ review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:movieId', auth, async (req, res) => {
  try {
    const movieId = Number(req.params.movieId);
    await Review.deleteOne({ movieId, user: req.user._id });
    res.json({ message: 'Review deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
