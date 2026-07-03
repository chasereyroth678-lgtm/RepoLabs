import express from 'express';

const router = express.Router();

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const SYSTEM_PROMPT = `You are the RepoLab Assistant, a friendly helper embedded in a website that teaches IT students how to install developer tools (Git/GitHub, Python, VS Code, Node.js).

Keep answers short and practical — a few sentences, not essays, unless the person asks for more detail. Use plain language, not corporate or overly formal tone. If a question is about something outside software setup/installation/basic coding help, you can still help, but gently note you're best at setup-related questions.

If someone reports an error message, ask what OS they're on if it's not already clear, since fixes often differ between Windows/macOS/Linux.`;

// Toggle this to true for verbose server-side logging while debugging the integration
const DEBUG = false;

router.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required.' });
    }
    if (message.length > 2000) {
      return res.status(400).json({ error: 'Message is too long (max 2000 characters).' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set in environment variables.');
      return res.status(500).json({ error: 'Chat is not configured on the server yet.' });
    }

    // Build conversation history in Gemini's expected shape.
    // history is an array of { role: 'user' | 'model', text: string } from the client.
    const contents = [];
    if (Array.isArray(history)) {
      for (const turn of history.slice(-10)) { // cap history sent to keep requests small
        if (!turn || typeof turn.text !== 'string') continue;
        const role = turn.role === 'model' ? 'model' : 'user';
        contents.push({ role, parts: [{ text: turn.text }] });
      }
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    const requestBody = {
      contents,
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7
      }
    };

    if (DEBUG) console.log('Gemini request:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);

      if (response.status === 429) {
        return res.status(429).json({ error: 'The chat is getting a lot of use right now (free tier rate limit). Try again in a moment.' });
      }
      return res.status(502).json({ error: 'The AI service had a problem responding. Try again.' });
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      console.error('Unexpected Gemini response shape:', JSON.stringify(data));
      return res.status(502).json({ error: 'Got an empty response from the AI service.' });
    }

    res.json({ reply });
  } catch (err) {
    console.error('Chat route error:', err);
    res.status(500).json({ error: 'Something went wrong on the server.' });
  }
});

export default router;
