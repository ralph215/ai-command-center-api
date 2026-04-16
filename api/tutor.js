export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({
      content: [{ text: 'Method not allowed. Use POST for /api/tutor.' }]
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      content: [{ text: 'ANTHROPIC_API_KEY is not set in Vercel environment variables. Go to Vercel → Project Settings → Environment Variables → add ANTHROPIC_API_KEY.' }]
    });
  }

  try {
    const body = typeof req.body === 'object' && req.body !== null ? req.body : {};
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const system =
      typeof body.system === 'string' && body.system.trim()
        ? body.system
        : 'You are a helpful AI tutor.';

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system,
        messages
      })
    });

    const raw = await response.text();
    let data;

    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      return res.status(response.status || 502).json({
        content: [{ text: `Anthropic returned a non-JSON response: ${raw || 'empty response'}` }]
      });
    }

    if (!response.ok) {
      return res.status(response.status).json({
        content: [{ text: `Anthropic API error: ${data?.error?.message || raw || 'Unknown error'}` }]
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      content: [{ text: `Server error: ${err.message}` }]
    });
  }
}
