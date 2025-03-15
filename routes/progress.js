const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// ✅ Define Progress Schema
const progressSchema = new mongoose.Schema({
    Player: String,
    Module: Number,
    Level: Number,
    Initialize: Number,
    timestamp: { type: Date, default: Date.now } // ✅ Save time played
});
const Progress = mongoose.model("Progress", progressSchema, "Progress");

// ✅ GET ALL Instances of Player Progress
router.get("/:playerName", async (req, res) => {
    try {
        const playerName = req.params.playerName.trim();
        console.log(`🔍 Searching progress for: '${playerName}'`);

        // ✅ Find all instances where this player has progress
        const playerProgress = await Progress.find({ Player: { $regex: `^${playerName}$`, $options: "i" } })
            .sort({ timestamp: -1 }); // ✅ Sort by latest game first

        if (!playerProgress.length) {
            console.log(`❌ No progress found for ${playerName}`);
            return res.status(404).json({ message: `No progress found for ${playerName}` });
        }

        console.log(`✅ Progress found for ${playerName}:`, playerProgress);
        res.json(playerProgress);
    } catch (err) {
        console.error("❌ Error fetching player progress:", err);
        res.status(500).json({ message: "Error retrieving progress", error: err.message });
    }
});

module.exports = router;
