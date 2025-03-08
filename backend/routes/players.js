const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Define MongoDB Schema
const playerSchema = new mongoose.Schema({ name: String });
const Player = mongoose.model("Player", playerSchema, "players");

// ✅ GET all players
router.get("/", async (req, res) => {
    try {
        const players = await Player.find();
        res.json(players);
    } catch (err) {
        console.error("❌ Error fetching players:", err);
        res.status(500).json({ message: "Error fetching players", error: err.message });
    }
});

// ✅ POST: Add a new player
router.post("/", async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(400).json({ message: "Player name is required" });
        }

        // Prevent duplicate names
        const existingPlayer = await Player.findOne({ name: req.body.name });
        if (existingPlayer) {
            return res.status(400).json({ message: "This name already exists!" });
        }

        const newPlayer = new Player({ name: req.body.name });
        await newPlayer.save();
        res.json(newPlayer);
    } catch (err) {
        console.error("❌ Error adding player:", err);
        res.status(500).json({ message: "Error adding player", error: err.message });
    }
});

// ✅ DELETE: Remove a player
router.delete("/:id", async (req, res) => {
    try {
        const deletedPlayer = await Player.findByIdAndDelete(req.params.id);
        if (!deletedPlayer) {
            return res.status(404).json({ message: "Player not found" });
        }
        res.json({ message: "Player deleted successfully" });
    } catch (err) {
        console.error("❌ Error deleting player:", err);
        res.status(500).json({ message: "Error deleting player", error: err.message });
    }
});

module.exports = router;
