const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// ✅ Define Player Schema
const playerSchema = new mongoose.Schema({
    name: String
});
const Player = mongoose.model("Player", playerSchema, "players");

// ✅ GET All Players from wordApp.players
router.get("/", async (req, res) => {
    try {
        const players = await Player.find({});
        if (!players.length) {
            return res.status(404).json({ message: "❌ No players found in database." });
        }

        console.log("✅ Players fetched successfully:", players);
        res.json(players);
    } catch (err) {
        console.error("❌ Error fetching players:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ✅ ADD New Player
router.post("/", async (req, res) => {
    try {
        const { name } = req.body;
        if (!name.trim()) {
            return res.status(400).json({ message: "❌ Player name cannot be empty." });
        }

        const newPlayer = new Player({ name });
        await newPlayer.save();

        console.log(`✅ Player '${name}' added.`);
        res.json(newPlayer);
    } catch (err) {
        console.error("❌ Error adding player:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ✅ DELETE Player
router.delete("/:playerName", async (req, res) => {
    try {
        const playerName = req.params.playerName;
        const result = await Player.deleteOne({ name: playerName });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "❌ Player not found." });
        }

        console.log(`✅ Player '${playerName}' deleted.`);
        res.json({ message: `✅ Player '${playerName}' removed.` });
    } catch (err) {
        console.error("❌ Error deleting player:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
