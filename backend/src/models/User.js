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
    required: [true, 'Security questions are required'],
    validate: {
      validator: function(v) {
        return v && v.length === 3;
      },
      message: 'Exactly 3 security questions are required'
    }
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

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('securityQuestions')) return next();
  
  const salt = await bcrypt.genSalt(12);
  for (let i = 0; i < this.securityQuestions.length; i++) {
    if (this.securityQuestions[i].answer) {
      this.securityQuestions[i].answer = await bcrypt.hash(
        this.securityQuestions[i].answer.toLowerCase().trim(),
        salt
      );
    }
  }
  next();
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
