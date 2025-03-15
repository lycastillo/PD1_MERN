const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// ✅ Define Level_Select Schema
const levelSelectSchema = new mongoose.Schema({
    Player: String,
    Module: Number,
    Level: Number,
    Initialize: Number,
    timestamp: { type: Date, default: Date.now } // ✅ Adds timestamp for sorting
});
const LevelSelect = mongoose.model("LevelSelect", levelSelectSchema, "Level_Select");

// ✅ GET ALL Instances of Player from Level_Select
router.get("/:playerName", async (req, res) => {
    try {
        const playerName = req.params.playerName.trim();
        console.log(`🔍 Searching game history for: '${playerName}'`);

        // ✅ Find all instances where this player played
        const playerHistory = await LevelSelect.find({ Player: { $regex: `^${playerName}$`, $options: "i" } })
            .sort({ timestamp: -1 }); // ✅ Sort by latest game first

        if (!playerHistory.length) {
            console.log(`❌ No game history found for ${playerName}`);
            return res.status(404).json({ message: `No game history found for ${playerName}` });
        }

        console.log(`✅ Game history found for ${playerName}:`, playerHistory);
        res.json(playerHistory);
    } catch (err) {
        console.error("❌ Error fetching player history:", err);
        res.status(500).json({ message: "Error retrieving game history", error: err.message });
    }
});

module.exports = router;
