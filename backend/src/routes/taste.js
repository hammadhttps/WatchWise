import express from 'express';
import auth from '../middleware/auth.js';
import { callGemini } from '../services/gemini.js';

const router = express.Router();

router.post('/roast', auth, async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ message: 'AI features are not configured' });
    }

    const liked = req.user.likedMovies || [];
    if (liked.length < 3) {
      return res.status(400).json({ message: 'Like at least 3 movies first — there has to be something to roast' });
    }

    const likedList = liked
      .map(m => `- ${m.title}${m.year ? ` (${m.year})` : ''}${m.genres?.length ? ` [${m.genres.join(', ')}]` : ''}`)
      .join('\n');
    const watchlistTitles = (req.user.watchlist || []).map(m => m.title).join(', ');

    const prompt = `You are WatchWise's resident film critic with a sharp wit. ${req.user.firstName} has asked you to analyze their movie taste.

## Movies they've liked
${likedList}

## On their watchlist (things they claim they'll watch)
${watchlistTitles || '(empty)'}

Write ONE paragraph (80-120 words) roasting and analyzing their taste. Rules:
- Playful and specific — reference actual movies from their list, spot patterns (genres, eras, guilty pleasures, contradictions between likes and watchlist).
- Sharp but affectionate, never mean-spirited.
- End with one genuinely insightful observation about what kind of viewer they are.
- Plain text only, no headings or bullet points, no markdown.`;

    const roast = await callGemini(prompt, { temperature: 1.0 });

    res.json({ roast: String(roast).trim() });
  } catch (error) {
    console.error('Roast error:', error.message);
    res.status(502).json({ message: 'The critic is speechless right now. Try again' });
  }
});

export default router;
