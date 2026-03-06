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
    res.json(JSON.parse(text));
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: String(err) });
  }
});

app.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 5000, keyword = 'restaurant' } = req.query;
    if (!lat || !lng) return res.status(400).json({ error: 'lat and lng required' });
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=restaurant&keyword=${encodeURIComponent(keyword)}&key=${process.env.GOOGLE_PLACES_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    const places = (data.results || []).slice(0, 10).map(p => ({
      name: p.name, address: p.vicinity, rating: p.rating,
    }));
    res.json({ places });
  } catch (err) {
    res.status(500).json({ error: 'Places error', message: String(err) });
  }
});

app.get('/', (req, res) => res.send('EatEasy API is running'));
app.listen(process.env.PORT || 3000, () => console.log('EatEasy API running'));
