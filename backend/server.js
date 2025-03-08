const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const uri = process.env.MONGO_URI || "mongodb+srv://lycastillo:T36DBPD2@t36db.x1gsc.mongodb.net/wordApp";

// Middleware
app.use(cors());
app.use(express.json());

// Function to update Module in MongoDB Atlas
async function updateModuleInDB(moduleNumber) {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db("Level_Selection"); // Use Level_Selection DB
        const collection = db.collection("Module"); // Use Module collection

        // Update the first document
        const result = await collection.updateOne(
            {}, // Finds the first document
            { $set: { Module: moduleNumber } }
        );

        return result.matchedCount > 0 ? "✅ Module updated successfully!" : "❌ No document found to update.";
    } catch (err) {
        return `❌ Error: ${err.message}`;
    } finally {
        await client.close();
    }
}

// Function to update Level in MongoDB Atlas
async function updateLevelInDB(levelNumber) {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db("Level_Selection"); // Use Level_Selection DB
        const collection = db.collection("Module"); // Use Module collection

        // Update the first document
        const result = await collection.updateOne(
            {}, // Finds the first document
            { $set: { Level: levelNumber } }
        );

        return result.matchedCount > 0 ? "✅ Level updated successfully!" : "❌ No document found to update.";
    } catch (err) {
        return `❌ Error: ${err.message}`;
    } finally {
        await client.close();
    }
}

// API Endpoint to Update Module
app.put("/api/updateModule", async (req, res) => {
    const message = await updateModuleInDB(req.body.moduleNumber);
    res.json({ message });
});

// API Endpoint to Update Level
app.put("/api/updateLevel", async (req, res) => {
    const message = await updateLevelInDB(req.body.levelNumber);
    res.json({ message });
});

// Start Server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
