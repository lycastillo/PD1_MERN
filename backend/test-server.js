const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect("mongodb+srv://lycastillo:T36DBPD2@t36db.x1gsc.mongodb.net/wordApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "❌ MongoDB connection error:"));
db.once("open", () => {
  console.log("✅ Connected to MongoDB");
});

// ✅ Minimal test route
app.get("/api/level-select", async (req, res) => {
  try {
    const data = await db.collection("Level_Select").findOne({});
    console.log("📦 Level_Select data:", data);
    res.json(data || {});
  } catch (err) {
    console.error("❌ Failed to fetch Level_Select:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Start minimal server
app.listen(PORT, () => console.log(`✅ Test Server running on port ${PORT}`));
