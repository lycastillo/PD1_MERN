const express = require("express");
const router = express.Router();
const Player = require("../models/Player");

// 🔹 Fetch all players from DB
router.get("/", async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: "Error fetching players" });
  }
});

// 🔹 Add a new player (Prevent Duplicates)
router.post("/", async (req, res) => {
  const { name } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // Check for duplicates
    const existingPlayer = await Player.findOne({ name: name.trim() });
    if (existingPlayer) {
      return res.status(400).json({ message: "This name already exists!" });
    }

    // Save new player
    const newPlayer = new Player({ name: name.trim() });
    await newPlayer.save();
    res.status(201).json(newPlayer);
  } catch (err) {
    res.status(500).json({ message: "Error adding player" });
  }
});

// 🔹 Delete a player
router.delete("/:name", async (req, res) => {
  try {
    const deletedPlayer = await Player.findOneAndDelete({ name: req.params.name });
    if (!deletedPlayer) {
      return res.status(404).json({ message: "Player not found" });
    }
    res.json({ message: "Player deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting player" });
  }
});

module.exports = router;
