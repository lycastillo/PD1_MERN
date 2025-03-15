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

// ✅ Save Progress Before Switching Players
app.post("/api/saveProgress", async (req, res) => {
    try {
        // Fetch the current game session data from Level_Select
        const gameData = await db.collection("Level_Select").findOne({});

        if (!gameData || !gameData.Player) {
            return res.status(404).json({ message: "❌ No active game session found." });
        }

        // Prepare data to store in Progress collection
        const progressData = {
            Player: gameData.Player,
            Module: gameData.Module,
            Level: gameData.Level,
            timestamp: new Date()
        };

        // Insert the progress data into wordApp.Progress
        await db.collection("Progress").insertOne(progressData);

        console.log(`✅ Progress saved for ${gameData.Player}`);
        res.json({ message: "✅ Game progress saved successfully!" });
    } catch (error) {
        console.error("❌ Error saving progress:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Select New Player and Update Level_Select
app.put("/api/updatePlayer", async (req, res) => {
    try {
        const { playerName } = req.body;

        // First, Save the Current Player's Progress
        await db.collection("Progress").insertOne({
            Player: playerName,
            Module: 0, // Reset for new session
            Level: 0, // Reset for new session
            timestamp: new Date()
        });

        // Then, Update the Current Player in Level_Select
        const result = await db.collection("Level_Select").updateOne(
            {},  
            { $set: { Player: playerName, Module: 0, Level: 0 } }
        );

        if (result.matchedCount > 0) {
            res.json({ message: `✅ Player switched to ${playerName}, progress saved.` });
        } else {
            res.status(404).json({ message: "❌ No document found to update." });
        }
    } catch (error) {
        console.error("❌ Error updating Player:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Fetch Progress History for Selected Player
app.get("/api/progress/:playerName", async (req, res) => {
    try {
        const playerName = req.params.playerName;

        // Fetch all records where Player matches the clicked player
        const progressData = await db.collection("Progress").find({ Player: playerName }).toArray();

        if (!progressData.length) {
            return res.status(404).json({ message: `❌ No progress data found for ${playerName}.` });
        }

        console.log(`✅ Progress data found for ${playerName}:`, progressData);
        res.json(progressData);
    } catch (error) {
        console.error("❌ Error fetching progress:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Start Server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
