const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB connection error:", err));

const db = mongoose.connection;

// ✅ Save Each Game Session to `wordApp.Progress`
app.post("/api/saveProgress", async (req, res) => {
    try {
        const { playerName, moduleNumber, levelNumber } = req.body;

        const result = await db.collection("Progress").insertOne({
            Player: playerName,
            Module: moduleNumber,
            Level: levelNumber,
            Initialize: 0,
            timestamp: new Date() // ✅ Store when the game was played
        });

        res.json({ message: `✅ Game session saved for ${playerName}`, result });
    } catch (error) {
        console.error("❌ Error saving game session:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// Start Server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
