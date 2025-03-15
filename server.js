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

// ✅ Update Selected Player in Level_Select
app.put("/api/updatePlayer", async (req, res) => {
    try {
        const { playerName } = req.body;

        const result = await db.collection("Level_Select").updateOne(
            {},  // Update the first found document
            { $set: { Player: playerName } }
        );

        if (result.matchedCount > 0) {
            res.json({ message: `✅ Player updated to ${playerName} in Level_Select.` });
        } else {
            res.status(404).json({ message: "❌ No document found to update." });
        }
    } catch (error) {
        console.error("❌ Error updating Player:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ Test Route (To confirm backend is working)
app.get("/", (req, res) => {
    res.send("✅ Server is running!");
});

// ✅ Start Server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
