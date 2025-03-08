const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb+srv://lycastillo:T36DBPD2@t36db.x1gsc.mongodb.net/wordApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

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
