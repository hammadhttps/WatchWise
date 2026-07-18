import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import { callGemini } from '../services/gemini.js';

const router = express.Router();

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    recommendations: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          year: { type: 'integer' },
          matchScore: { type: 'integer' },
          reason: { type: 'string' },
          genres: { type: 'array', items: { type: 'string' } }
        },
        required: ['title', 'year', 'matchScore', 'reason', 'genres']
      }
    }
  },
  required: ['recommendations']
};

const buildPrompt = (user, { mood, company, era, genres, note }) => {
  const likedList = (user.likedMovies || [])
    .map(m => `- ${m.title}${m.genres?.length ? ` (${m.genres.join(', ')})` : ''}`)
    .join('\n');

  const watchlistTitles = (user.watchlist || []).map(m => m.title).join(', ');

  return `You are WatchWise's movie matchmaker — an expert film curator with deep knowledge of cinema across all eras and countries.

Recommend exactly 6 movies for ${user.firstName}.

## What they've liked on WatchWise
${likedList || '(No liked movies yet — rely on the preferences below.)'}

## Already on their watchlist (do NOT recommend these either)
${watchlistTitles || '(empty)'}

## Tonight's context
- Mood: ${mood || 'any'}
- Watching: ${company || 'not specified'}
- Era preference: ${era || 'any era'}
- Genres they want right now: ${genres?.length ? genres.join(', ') : 'open to anything'}
- In their own words: ${note?.trim() || '(nothing extra)'}

## Rules
- Recommend only real, released movies (no TV series).
- Do NOT recommend any movie from their liked list — they've seen those.
- Blend their taste history with tonight's context; tonight's context wins on conflicts.
- Aim for a mix: a couple of safe bets and a couple of less obvious gems.
- "reason" must be 1–2 sentences, personal and specific — reference their liked movies or tonight's mood, never generic filler.
- "matchScore" is your honest 70–99 estimate of how well it fits this exact request.
- Use the movie's original release year.`;
};

router.post('/', auth, async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ message: 'AI recommendations are not configured' });
    }

    const { mood, company, era, genres, note } = req.body || {};

    const prompt = buildPrompt(req.user, { mood, company, era, genres, note });
    const result = await callGemini(prompt, { json: true, schema: RESPONSE_SCHEMA });

    const recommendations = (result.recommendations || [])
      .filter(r => r && r.title)
      .slice(0, 6)
      .map(r => ({
        title: String(r.title),
        year: Number(r.year) || null,
        matchScore: Math.min(99, Math.max(50, Number(r.matchScore) || 80)),
        reason: String(r.reason || ''),
        genres: Array.isArray(r.genres) ? r.genres.slice(0, 4).map(String) : []
      }));

    if (recommendations.length === 0) {
      return res.status(502).json({ message: 'The AI could not generate recommendations. Please try again' });
    }

    await User.updateOne(
      { _id: req.user._id },
      {
        $push: {
          recommendationHistory: {
            $each: [{
              preferences: {
                mood: mood || '',
                company: company || '',
                era: era || '',
                genres: Array.isArray(genres) ? genres : [],
                note: (note || '').slice(0, 280)
              },
              recommendations,
              createdAt: new Date()
            }],
            $position: 0,
            $slice: 20
          }
        }
      }
    );

    res.json({ recommendations });
  } catch (error) {
    console.error('Recommendation error:', error.message);
    res.status(502).json({ message: 'AI recommendations are unavailable right now. Please try again' });
  }
});

router.get('/history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('recommendationHistory');
    res.json({ history: user.recommendationHistory || [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
