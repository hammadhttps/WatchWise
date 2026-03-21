import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

const generateToken = (userId, remember = false) => {
  const expiresIn = remember ? '7d' : '24h';
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn });
};

const setCookie = (res, token, remember = false) => {
  const maxAge = remember 
    ? 7 * 24 * 60 * 60 * 1000 
    : 24 * 60 * 60 * 1000;

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge
  });
};

const clearCookie = (res) => {
  res.cookie('token', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0
  });
};

router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password, securityQuestions } = req.body;

    if (!firstName || !lastName || !email || !password || !securityQuestions) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (securityQuestions.length !== 3) {
      return res.status(400).json({ message: 'Exactly 3 security questions are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      securityQuestions
    });

    await user.save();

    const token = generateToken(user._id);
    setCookie(res, token);

    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    };

    res.status(201).json({ user: userResponse });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, remember } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, remember);
    setCookie(res, token, remember);

    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    };

    res.json({ user: userResponse });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/logout', (req, res) => {
  clearCookie(res);
  res.json({ message: 'Logged out successfully' });
});

router.get('/me', auth, async (req, res) => {
  res.json({ user: req.user });
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.json({ 
        message: 'If an account exists, security questions will be sent',
        questions: null
      });
    }

    if (user.isResetLocked()) {
      const remaining = Math.ceil((user.resetLockUntil - new Date()) / 60000);
      return res.status(429).json({ 
        message: `Account locked. Try again in ${remaining} minutes`,
        locked: true,
        remainingMinutes: remaining
      });
    }

    const questions = user.getSecurityQuestionTexts();
    res.json({ 
      message: 'Security questions retrieved',
      questions,
      email
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/verify-questions', async (req, res) => {
  try {
    const { email, answers } = req.body;

    if (!email || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Email and answers are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isResetLocked()) {
      const remaining = Math.ceil((user.resetLockUntil - new Date()) / 60000);
      return res.status(429).json({ 
        message: `Account locked. Try again in ${remaining} minutes`,
        locked: true,
        remainingMinutes: remaining
      });
    }

    let correctCount = 0;
    const verifiedQuestions = [];

    for (const answer of answers) {
      const isCorrect = await user.compareSecurityAnswer(answer.question, answer.answer);
      if (isCorrect) {
        correctCount++;
        verifiedQuestions.push(answer.question);
      }
    }

    if (correctCount >= 2) {
      await User.findByIdAndUpdate(user._id, {
        resetAttempts: 0,
        resetLockUntil: null
      });
      return res.json({ 
        verified: true, 
        message: 'Verification successful',
        email
      });
    }

    const newAttempts = user.resetAttempts + 1;
    
    if (newAttempts >= 3) {
      await User.findByIdAndUpdate(user._id, {
        resetAttempts: 0,
        resetLockUntil: new Date(Date.now() + 15 * 60 * 1000)
      });
      return res.status(429).json({ 
        message: 'Too many attempts. Try again in 15 minutes',
        locked: true,
        remainingMinutes: 15
      });
    }

    await User.findByIdAndUpdate(user._id, {
      resetAttempts: newAttempts
    });

    res.json({ 
      verified: false, 
      remaining: 3 - newAttempts,
      message: `${3 - newAttempts} attempt(s) remaining`,
      email
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndUpdate(user._id, {
      password: newPassword,
      resetAttempts: 0,
      resetLockUntil: null
    });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/security-questions', auth, async (req, res) => {
  try {
    const { currentPassword, securityQuestions } = req.body;

    if (!currentPassword || !securityQuestions) {
      return res.status(400).json({ message: 'Current password and security questions are required' });
    }

    if (securityQuestions.length !== 3) {
      return res.status(400).json({ message: 'Exactly 3 security questions are required' });
    }

    const isMatch = await req.user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    await User.findByIdAndUpdate(req.user._id, { securityQuestions });

    res.json({ message: 'Security questions updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
