const express = require("express");
const app = express();
app.use(express.json());

app.post("/analyse", async (req, res) => {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: req.body ? JSON.stringify(req.body) : "{}",
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/", (req, res) => res.send("EatEasy API is running"));

app.listen(process.env.PORT || 3000, () => console.log("EatEasy API running"));
