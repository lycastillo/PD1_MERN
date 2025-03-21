const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

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

// ✅ Add New Player (with duplicate check)
router.post("/", async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || name.trim() === "") {
            return res.status(400).json({ message: "Name cannot be empty." });
        }

        const existingPlayer = await db.collection("players").findOne({ name });

        if (existingPlayer) {
            return res.status(400).json({ message: "Player name already exists." });
        }

        const newPlayer = { name };
        const result = await db.collection("players").insertOne(newPlayer);

        res.status(201).json({ _id: result.insertedId, name });
    } catch (error) {
        console.error("❌ Error adding player:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Delete Player by ID
router.delete("/:id", async (req, res) => {
    try {
        const playerId = req.params.id;

        const result = await db.collection("players").deleteOne({ _id: new ObjectId(playerId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "❌ Player not found." });
        }

        res.json({ message: `✅ Player deleted successfully.` });
    } catch (error) {
        console.error("❌ Error deleting player:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
