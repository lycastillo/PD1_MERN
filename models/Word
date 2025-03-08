// backend/models/Word.js
const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
  module: { type: String, required: true },
  word: { type: String, required: true },
  imagePath: { type: String, required: true },
  audioPath: { type: String, required: true },
});

const Word = mongoose.model('Word', wordSchema);

module.exports = Word;
