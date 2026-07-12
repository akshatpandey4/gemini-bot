const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY; 

    if (!apiKey) {
      return res.status(500).json({ error: "Backend API key is missing or undefined" });
    }

    // Direct REST request to the stable 2.5 flash model
    // CHANGE THIS LINE INSIDE YOUR server.js:
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Google API responded with error:", data);
      return res.status(response.status).json({ error: data.error?.message || 'Google API Error' });
    }

    const textResponse = data.candidates[0].content.parts[0].text;
    res.json({ text: textResponse });

  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
