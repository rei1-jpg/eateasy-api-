const express = require('express');
const app = express();
app.use(express.json());

app.post('/analyse', async (req, res) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });
    const text = await response.text();
    console.log('Response length:', text.length);
    console.log('Response end:', text.slice(-500));
    res.json(JSON.parse(text));
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

app.get('/', (req, res) => res.send('EatEasy API is running'));

app.listen(process.env.PORT || 3000, () => console.log('EatEasy API running'));


