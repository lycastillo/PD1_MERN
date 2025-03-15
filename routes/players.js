const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const db = mongoose.connection;

// ✅ Get All Players
router.get("/", async (req, res) => {
    try {
        const players = await db.collection("players").find().toArray();
        res.json(players);
    } catch (error) {
        console.error("❌ Error fetching players:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Add New Player
router.post("/", async (req, res) => {
    try {
        const { name } = req.body;
        const newPlayer = { name };

        await db.collection("players").insertOne(newPlayer);
        res.json(newPlayer);
    } catch (error) {
        console.error("❌ Error adding player:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Delete Player
router.delete("/:name", async (req, res) => {
    try {
        const playerName = req.params.name;

        await db.collection("players").deleteOne({ name: playerName });
        res.json({ message: `✅ Player ${playerName} deleted successfully.` });
    } catch (error) {
        console.error("❌ Error deleting player:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
