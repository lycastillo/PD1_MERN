const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB connection error:", err));

const db = mongoose.connection;

// ✅ Select Player, Save Progress, and Update Level_Select
app.put("/api/updatePlayer", async (req, res) => {
    try {
        const { playerName } = req.body;

        // ✅ Save previous player's progress before switching
        const currentGameData = await db.collection("Level_Select").findOne({});
        if (currentGameData?.Player) {
            await db.collection("Progress").insertOne({
                Player: currentGameData.Player,
                Module: currentGameData.Module || 0,
                Level: currentGameData.Level || 0,
                Date: new Date().toLocaleDateString(),
                Time: new Date().toLocaleTimeString(),
                Score: 0
            });
        }

        // ✅ Update Level_Select with new player
        await db.collection("Level_Select").updateOne(
            {},
            { $set: { Player: playerName, Module: 0, Level: 0 } }
        );

        res.json({ message: `✅ Player switched to ${playerName}` });
    } catch (error) {
        console.error("❌ Error updating Player:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Update Selected Module
app.put("/api/updateModule", async (req, res) => {
    try {
        const { moduleNumber } = req.body;

        await db.collection("Level_Select").updateOne(
            {},
            { $set: { Module: moduleNumber } }
        );

        res.json({ message: `✅ Module updated to ${moduleNumber}` });
    } catch (error) {
        console.error("❌ Error updating Module:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Update Selected Level
app.put("/api/updateLevel", async (req, res) => {
    try {
        const { levelNumber } = req.body;

        await db.collection("Level_Select").updateOne(
            {},
            { $set: { Level: levelNumber } }
        );

        res.json({ message: `✅ Level updated to ${levelNumber}` });
    } catch (error) {
        console.error("❌ Error updating Level:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Start Server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
