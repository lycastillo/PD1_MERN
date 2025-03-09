const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB Atlas"))
.catch(err => console.error("MongoDB connection error:", err));

const db = mongoose.connection;

const playerRoutes = require("./routes/players");
app.use("/api/players", playerRoutes);

app.put("/api/updatePlayer", async (req, res) => {
    try {
        const { playerName } = req.body;
        const result = await db.collection("Level_Select").updateOne(
            {},  
            { $set: { Player: playerName } }
        );

        if (result.matchedCount > 0) {
            res.json({ message: `Player updated to ${playerName}` });
        } else {
            res.status(404).json({ message: "No document found to update." });
        }
    } catch (error) {
        console.error("Error updating Player:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

app.put("/api/updateModule", async (req, res) => {
    try {
        const { moduleNumber } = req.body;
        const result = await db.collection("Level_Select").updateOne(
            {},  
            { $set: { Module: moduleNumber } }
        );

        if (result.matchedCount > 0) {
            res.json({ message: `Module updated to ${moduleNumber}` });
        } else {
            res.status(404).json({ message: "No document found to update." });
        }
    } catch (error) {
        console.error("Error updating Module:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

app.put("/api/updateLevel", async (req, res) => {
    try {
        const { levelNumber } = req.body;
        const result = await db.collection("Level_Select").updateOne(
            {},  
            { $set: { Level: levelNumber } }
        );

        if (result.matchedCount > 0) {
            res.json({ message: `Level updated to ${levelNumber}` });
        } else {
            res.status(404).json({ message: "No document found to update." });
        }
    } catch (error) {
        console.error("Error updating Level:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
