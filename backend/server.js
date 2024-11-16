const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("Error connecting to MongoDB:", err));

// Root route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Word routes
const wordRoutes = require('./routes/words');
app.use('/api/words', wordRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const Word = require('./models/Word'); // Adjust path if needed

mongoose.connection.once('open', async () => {
  try {
    const testQuery = await Word.findOne();
    console.log('Test query result:', testQuery);
  } catch (error) {
    console.error('Error in test query:', error);
  }
});
