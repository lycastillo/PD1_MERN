const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Define Schema for Level_Select Database
const selectionSchema = new mongoose.Schema({
  Module: Number,
  Level: Number,
});

const Selection = mongoose.model("Selection", selectionSchema, "Module"); // Using "Module" collection

// API Route to Update Module in Level_Select Database
app.put("/api/updateModule", async (req, res) => {
  try {
    const { moduleNumber } = req.body;
    const result = await Selection.findOneAndUpdate({}, { Module: moduleNumber }, { new: true });

    if (result) {
      res.json({ message: "✅ Module updated successfully!", data: result });
    } else {
      res.status(404).json({ message: "❌ No document found to update." });
    }
  } catch (err) {
    res.status(500).json({ message: "❌ Error updating Module.", error: err });
  }
});

// API Route to Update Difficulty Level in Level_Select Database
app.put("/api/updateLevel", async (req, res) => {
  try {
    const { levelNumber } = req.body;
    const result = await Selection.findOneAndUpdate({}, { Level: levelNumber }, { new: true });

    if (result) {
      res.json({ message: "✅ Level updated successfully!", data: result });
    } else {
      res.status(404).json({ message: "❌ No document found to update." });
    }
  } catch (err) {
    res.status(500).json({ message: "❌ Error updating Level.", error: err });
  }
});

// Start Server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
