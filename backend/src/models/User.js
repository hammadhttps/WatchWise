import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const securityQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  }
}, { _id: false });

const likedMovieSchema = new mongoose.Schema({
  tmdbId: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  posterPath: {
    type: String,
    default: null
  },
  genres: {
    type: [String],
    default: []
  },
  year: {
    type: Number,
    default: null
  },
  likedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const watchlistMovieSchema = new mongoose.Schema({
  tmdbId: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  posterPath: {
    type: String,
    default: null
  },
  genres: {
    type: [String],
    default: []
  },
  year: {
    type: Number,
    default: null
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const recommendationHistorySchema = new mongoose.Schema({
  preferences: {
    mood: { type: String, default: '' },
    company: { type: String, default: '' },
    era: { type: String, default: '' },
    genres: { type: [String], default: [] },
    note: { type: String, default: '' }
  },
  recommendations: [{
    _id: false,
    title: { type: String, required: true },
    year: { type: Number, default: null },
    matchScore: { type: Number, default: 0 },
    reason: { type: String, default: '' },
    genres: { type: [String], default: [] }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8
  },
  securityQuestions: {
    type: [securityQuestionSchema],
    default: [],
    validate: {
      validator: function(v) {
        return !v || v.length === 0 || v.length === 3;
      },
      message: 'Security questions are optional, but if provided there must be exactly 3'
    }
  },
  likedMovies: {
    type: [likedMovieSchema],
    default: []
  },
  watchlist: {
    type: [watchlistMovieSchema],
    default: []
  },
  recommendationHistory: {
    type: [recommendationHistorySchema],
    default: []
  },
  resetAttempts: {
    type: Number,
    default: 0
  },
  resetLockUntil: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.pre('save', async function() {
  if (!this.isModified('securityQuestions')) return;

  const salt = await bcrypt.genSalt(12);
  for (let i = 0; i < this.securityQuestions.length; i++) {
    if (this.securityQuestions[i].answer) {
      this.securityQuestions[i].answer = await bcrypt.hash(
        this.securityQuestions[i].answer.toLowerCase().trim(),
        salt
      );
    }
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.compareSecurityAnswer = async function(question, answer) {
  const sq = this.securityQuestions.find(
    sq => sq.question === question
  );
  if (!sq) return false;
  return await bcrypt.compare(answer.toLowerCase().trim(), sq.answer);
};

userSchema.methods.isResetLocked = function() {
  if (!this.resetLockUntil) return false;
  return new Date() < this.resetLockUntil;
};

userSchema.methods.getSecurityQuestionTexts = function() {
  return this.securityQuestions.map(sq => sq.question);
};

const User = mongoose.model('User', userSchema);

export default User;
