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

// ✅ Import Routes
const playerRoutes = require("./routes/players"); 
app.use("/api/players", playerRoutes); 

// ✅ Update Selected Module
app.put("/api/updateModule", async (req, res) => {
    try {
        const { moduleNumber } = req.body;

        const result = await db.collection("Level_Select").updateOne(
            {},  
            { $set: { Module: moduleNumber } }
        );

        if (result.matchedCount > 0) {
            res.json({ message: `✅ Module updated to ${moduleNumber}` });
        } else {
            res.status(404).json({ message: "❌ No document found to update." });
        }
    } catch (error) {
        console.error("❌ Error updating Module:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Update Selected Level
app.put("/api/updateLevel", async (req, res) => {
    try {
        const { levelNumber } = req.body;

        const result = await db.collection("Level_Select").updateOne(
            {},  
            { $set: { Level: levelNumber } }
        );

        if (result.matchedCount > 0) {
            res.json({ message: `✅ Level updated to ${levelNumber}` });
        } else {
            res.status(404).json({ message: "❌ No document found to update." });
        }
    } catch (error) {
        console.error("❌ Error updating Level:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Save Progress AFTER Ensuring Module & Level Are Updated
app.post("/api/saveProgress", async (req, res) => {
    try {
        // Fetch the latest game data from Level_Select
        const gameData = await db.collection("Level_Select").findOne({});

        if (!gameData || !gameData.Player) {
            return res.status(404).json({ message: "❌ No active game session found." });
        }

        // ✅ Save the UPDATED module and level
        const progressData = {
            Player: gameData.Player,
            Module: gameData.Module, 
            Level: gameData.Level,
            Date: new Date().toLocaleDateString(),
            Time: new Date().toLocaleTimeString(),
            Score: 0  // Set default score, can be updated later
        };

        // ✅ Insert the correct progress into wordApp.Progress
        await db.collection("Progress").insertOne(progressData);

        console.log(`✅ Progress saved: ${gameData.Player} (Module: ${gameData.Module}, Level: ${gameData.Level})`);
        res.json({ message: `✅ Game progress saved successfully!` });
    } catch (error) {
        console.error("❌ Error saving progress:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Start Server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
