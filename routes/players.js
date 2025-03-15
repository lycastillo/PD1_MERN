const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// ✅ Define Player Schema
const playerSchema = new mongoose.Schema({
    name: String
});
const Player = mongoose.model("Player", playerSchema, "players");

// ✅ GET All Players
router.get("/", async (req, res) => {
    try {
        const players = await Player.find({});
        if (!players.length) {
            return res.status(404).json({ message: "❌ No players found." });
        }

        console.log("✅ Players fetched:", players);
        res.json(players);
    } catch (err) {
        console.error("❌ Error fetching players:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
