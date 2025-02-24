const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true, // 👈 Ensures no duplicate names
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model("Player", PlayerSchema);
