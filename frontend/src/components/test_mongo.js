const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://lycastillo:T36DBPD2@t36db.x1gsc.mongodb.net/wordApp";

async function testConnection() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB Atlas!");
        const db = client.db("Level_Selection");
        const collection = db.collection("Module");

        const data = await collection.findOne({});
        console.log("📌 Data from MongoDB:", data);
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err);
    } finally {
        await client.close();
    }
}

testConnection();
