const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 Server is running on Render!");
});

// API Routes
const wordRoutes = require("./routes/words");
app.use("/api/words", wordRoutes);

const playerRoutes = require("./routes/players");
app.use("/api/players", playerRoutes);

// ✅ Add `app.listen()` (Required for Render)
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
