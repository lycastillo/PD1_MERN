const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const { updateModule, updateLevel } = require("./api/updateData"); // ✅ Make sure this path is correct

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const db = mongoose.connection;

// ✅ Update Player
app.put("/api/updatePlayer", async (req, res) => {
  try {
    const { playerName } = req.body;
    const currentData = await db.collection("Level_Select").findOne({});

    // ✅ Save current data to Progress
    if (currentData?.Player) {
      await db.collection("Progress").insertOne({
        Player: currentData.Player,
        Module: currentData.Module || 0,
        Level: currentData.Level || 0,
        Date: new Date().toLocaleDateString(),
        Time: new Date().toLocaleTimeString(),
        Score: 0,
      });
    }

    // ✅ Set new player in Level_Select
    await db.collection("Level_Select").updateOne(
      {},
      { $set: { Player: playerName, Module: 0, Level: 0 } },
      { upsert: true }
    );

    res.json({ message: `✅ Player updated to ${playerName}` });
  } catch (err) {
    console.error("❌ Error updating Player:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// ✅ Update Module using updateData.js
app.put("/api/updateModule", async (req, res) => {
  try {
    const { moduleNumber } = req.body;
    await updateModule(moduleNumber); // ✅ Calls helper
    res.json({ message: `✅ Module updated to ${moduleNumber}` });
  } catch (err) {
    console.error("❌ Error updating Module:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// ✅ Update Level using updateData.js
app.put("/api/updateLevel", async (req, res) => {
  try {
    const { levelNumber } = req.body;
    await updateLevel(levelNumber); // ✅ Calls helper
    res.json({ message: `✅ Level updated to ${levelNumber}` });
  } catch (err) {
    console.error("❌ Error updating Level:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// ✅ Get All Players
app.get("/api/players", async (req, res) => {
  try {
    const players = await db.collection("players").find().toArray();
    res.json(players);
  } catch (err) {
    console.error("❌ Error fetching players:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// ✅ Add New Player
app.post("/api/players", async (req, res) => {
  try {
    const { name } = req.body;

    const exists = await db.collection("players").findOne({ name });
    if (exists) {
      return res.status(409).json({ message: "❌ Name already exists" });
    }

    const newPlayer = { name };
    await db.collection("players").insertOne(newPlayer);
    res.json(newPlayer);
  } catch (err) {
    console.error("❌ Error adding player:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// In server.js or /routes/progress.js if modular
app.get("/api/progress/:playerName", async (req, res) => {
    try {
      const { playerName } = req.params;
      const progress = await db.collection("Progress").find({ Player: playerName }).toArray();
      res.json(progress);
    } catch (err) {
      console.error("❌ Error fetching progress:", err);
      res.status(500).json({ message: "Server error", error: err });
    }
  });

  app.get("/api/getScore", async (req, res) => {
    try {
      const current = await db.collection("Level_Select").findOne({});
      res.json({ Score: current?.Score ?? null }); 
    } catch (err) {
      console.error("❌ Error getting score:", err);
      res.status(500).json({ message: "Server error", error: err });
    }
  });
  
  
  

// ✅ Delete Player
app.delete("/api/players/:name", async (req, res) => {
  try {
    const { name } = req.params;
    await db.collection("players").deleteOne({ name });
    res.json({ message: `✅ Player ${name} deleted.` });
  } catch (err) {
    console.error("❌ Error deleting player:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// ✅ Start Server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
