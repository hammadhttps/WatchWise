import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  movieId: {
    type: Number,
    required: true,
    index: true
  },
  movieTitle: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  text: {
    type: String,
    default: '',
    maxlength: 2000,
    trim: true
  }
}, {
  timestamps: true
});

// One review per user per movie
reviewSchema.index({ movieId: 1, user: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
