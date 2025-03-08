const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Define Player Schema
const playerSchema = new mongoose.Schema({ name: String });
const Player = mongoose.model("Player", playerSchema, "players");

// ✅ GET All Players
router.get("/", async (req, res) => {
    try {
        const players = await Player.find();
        res.json(players);
    } catch (err) {
        console.error("❌ Error fetching players:", err);
        res.status(500).json({ message: "Error fetching players", error: err.message });
    }
});

// ✅ POST: Add New Player
router.post("/", async (req, res) => {
    try {
        if (!req.body.name || req.body.name.trim() === "") {
            return res.status(400).json({ message: "Player name is required" });
        }

        // Prevent Duplicate Names
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

// ✅ DELETE Player
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
