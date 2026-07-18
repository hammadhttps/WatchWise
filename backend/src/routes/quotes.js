import express from 'express';

const router = express.Router();

const QUOTE_API_BASE_URL = process.env.QUOTE_API_BASE_URL || 'https://movie-quote-api.herokuapp.com';

const slugify = (value) => {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const pickQuote = (payload) => {
  if (!payload || typeof payload !== 'object') return null;

  if (Array.isArray(payload)) {
    return payload[0] ? pickQuote(payload[0]) : null;
  }

  if (Array.isArray(payload.results)) {
    return pickQuote(payload.results[0]);
  }

  const candidate = payload.quote || payload.text || payload.content || payload.body || payload.message || payload.quote_text;
  if (typeof candidate === 'string' && candidate.trim()) {
    return {
      text: candidate.trim(),
      author: payload.author || payload.character || payload.actor || null,
      show: payload.show || payload.series || payload.movie || null,
      source: payload.source || null,
    };
  }

  if (payload.data && typeof payload.data === 'object') {
    return pickQuote(payload.data);
  }

  return null;
};

router.get('/', async (req, res) => {
  try {
    const title = typeof req.query.title === 'string' ? req.query.title : '';
    const censored = req.query.censored === 'true' || req.query.censored === '1';
    const slug = slugify(title);

    const endpoints = [];

    if (slug) {
      endpoints.push(`${QUOTE_API_BASE_URL}/v1/shows/${slug}`);
    }

    if (censored) {
      endpoints.push(`${QUOTE_API_BASE_URL}/v1/quote?censored`);
    } else {
      endpoints.push(`${QUOTE_API_BASE_URL}/v1/quote/`);
      endpoints.push(`${QUOTE_API_BASE_URL}/v1/quote`);
    }

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          headers: {
            Accept: 'application/json',
          },
          signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) continue;

        const payload = await response.json();
        const quote = pickQuote(payload);

        if (quote) {
          return res.json({ quote, source: endpoint });
        }
      } catch (error) {
        continue;
      }
    }

    return res.json({ quote: null, source: null, message: 'No quote available for this movie right now.' });
  } catch (error) {
    return res.status(500).json({ quote: null, message: 'Unable to fetch quote at the moment.' });
  }
});

export default router;
