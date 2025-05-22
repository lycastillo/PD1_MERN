const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const db = mongoose.connection.useDb("wordApp"); // ✅ make sure it points to "wordApp"

// ✅ Get Players
router.get("/", async (req, res) => {
  try {
    const players = await db.collection("players").find().toArray();
    res.json(players);
  } catch (err) {
    console.error("❌ Error fetching players:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Add Player (No Duplicates)
router.post("/", async (req, res) => {
  const { name } = req.body;
  try {
    const existing = await db.collection("players").findOne({ name });
    if (existing) {
      return res.status(409).json({ message: "Player already exists" });
    }
    const result = await db.collection("players").insertOne({ name });
    res.status(201).json(result.ops ? result.ops[0] : { name });
  } catch (err) {
    console.error("❌ Error adding player:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete Player by Name
router.delete("/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const result = await db.collection("players").deleteOne({ name });
    if (result.deletedCount > 0) {
      res.json({ message: `✅ Deleted ${name}` });
    } else {
      res.status(404).json({ message: "Player not found" });
    }
  } catch (err) {
    console.error("❌ Error deleting player:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get Progress for a player by name
router.get("/progress/:playerName", async (req, res) => {
  try {
    const { playerName } = req.params;

    const progress = await db.collection("Progress").findOne({ playerName });

    if (!progress) {
      return res.status(404).json({ message: "No progress found for this player" });
    }

    res.json(progress);
  } catch (err) {
    console.error("❌ Error fetching progress:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
