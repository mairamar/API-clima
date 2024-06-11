const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const MONGODB_URI = 'mongodb://localhost:27017/api-clima';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

const searchSchema = new mongoose.Schema({
  city: { type: String, required: true }
});

const Search = mongoose.model('Search', searchSchema);

app.post('/search', async (req, res) => {
  const { city } = req.body;
  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  const newSearch = new Search({ city });
  try {
    await newSearch.save();
    res.status(201).json(newSearch);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save search', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});