const express = require('express');
const Word = require('../models/Word'); // Adjust the path based on your project structure
const router = express.Router();

router.get('/:module', async (req, res) => {
  console.log(`Request received for module: ${req.params.module}`); // Log the module being requested
  try {
    const words = await Word.find({ module: req.params.module });
    console.log(`Found words:`, words); // Log the words fetched from the database
    res.json(words);
  } catch (error) {
    console.error('Error fetching words:', error);
    res.status(500).json({ error: 'Failed to fetch words' });
  }
});

module.exports = router;
