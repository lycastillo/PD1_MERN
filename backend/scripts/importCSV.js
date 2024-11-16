// backend/scripts/importCSV.js
const fs = require('fs');
const Papa = require('papaparse');
const mongoose = require('mongoose');
const Word = require('../models/Word'); // Adjust the path to your model if needed

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/wordApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("Error connecting to MongoDB:", err));

const csvFilePath = './wordDataUpdated.csv'; // Updated CSV file name

const importCSV = () => {
  const file = fs.createReadStream(csvFilePath);
  
  Papa.parse(file, {
    header: true,
    complete: async (results) => {
      console.log("Parsing completed, importing data...");

      for (const row of results.data) {
        try {
          // Save each row to the database
          const word = new Word({
            module: row.module,
            word: row.word,
            imagePath: row.imagePath.trim(), // Ensure no trailing spaces
            audioPath: row.audioPath.trim(), // Ensure no trailing spaces
          });
          
          await word.save();
          console.log(`Saved word: ${row.word}`);
        } catch (error) {
          console.error(`Failed to save word ${row.word}:`, error);
        }
      }

      console.log('CSV data imported successfully');
      mongoose.connection.close();
    },
    error: (error) => {
      console.error("Error parsing CSV file:", error);
    }
  });
};

importCSV();
