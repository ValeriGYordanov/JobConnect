const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/offerings', (req, res) => {
  res.json([]);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Test server listening on http://localhost:${PORT}`);
});
