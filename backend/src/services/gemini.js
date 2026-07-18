const GEMINI_MODELS = ['gemini-3.5-flash', 'gemini-flash-latest', 'gemini-2.5-flash'];

export const callGemini = async (prompt, { json = false, schema = null, temperature = 0.9 } = {}) => {
  let lastError = null;

  for (const model of GEMINI_MODELS) {
    try {
      const generationConfig = { temperature };
      if (json) {
        generationConfig.responseMimeType = 'application/json';
        if (schema) generationConfig.responseSchema = schema;
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig
          }),
          signal: AbortSignal.timeout(30000)
        }
      );

      if (!response.ok) {
        lastError = new Error(`Gemini ${model} returned ${response.status}`);
        continue;
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        lastError = new Error(`Gemini ${model} returned no content`);
        continue;
      }

      return json ? JSON.parse(text) : text;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('All Gemini models failed');
};
