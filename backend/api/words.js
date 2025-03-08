const express = require('express');
const Word = require('../models/Word'); // Adjust the path based on your project structure
const router = express.Router();

// Fetch all words
router.get('/all', async (req, res) => {
  try {
    const words = await Word.find(); // Fetch all words from the database
    console.log('Fetched all words:', words); // Log the fetched words
    res.json(words);
  } catch (error) {
    console.error('Error fetching all words:', error);
    res.status(500).json({ error: 'Failed to fetch words' });
  }
});

// Fetch words by module
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

  router.get('/all', async (req, res) => {
    try {
        console.log("Fetching all words...");
        const words = await Word.find(); // Fetch all words from the database
        console.log("Fetched words:", words); // Log the fetched words
        res.json(words);
    } catch (error) {
        console.error("Error fetching all words:", error);
        res.status(500).json({ error: 'Failed to fetch words' });
    }
});

});

module.exports = router;
