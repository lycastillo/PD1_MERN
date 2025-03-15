const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//Progress Schema
const progressSchema = new mongoose.Schema({
    playerName: String,
    progressData: Object 
});
const Progress = mongoose.model("Progress", progressSchema, "Progress");

// GET Progress by Name
router.get("/:playerName", async (req, res) => {
    try {
        const { playerName } = req.params;
        const playerProgress = await Progress.findOne({ playerName });

        if (!playerProgress) {
            return res.status(404).json({ message: "No progress found for this player" });
        }

        res.json(playerProgress);
    } catch (err) {
        console.error("Error fetching player progress:", err);
        res.status(500).json({ message: "Error retrieving progress", error: err.message });
    }
});

module.exports = router;
