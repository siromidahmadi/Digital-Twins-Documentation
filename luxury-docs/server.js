// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { saveProject } from './saveProject.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/save-project', async (req, res) => {
  try {
    const id = await saveProject(req.body);
    res.json({ message: 'Project saved successfully!', id });
  } catch (err) {
    res.status(500).json({ message: 'Error saving project', error: err?.message || String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
