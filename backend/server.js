const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Root route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Word routes (Existing)
const wordRoutes = require("./routes/words");
app.use("/api/words", wordRoutes);

// Player routes (NEW)
const playerRoutes = require("./routes/players"); // 👈 Add this
app.use("/api/players", playerRoutes); // 👈 Add this

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
