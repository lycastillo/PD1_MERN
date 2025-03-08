const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://lycastillo:T36DBPD2@t36db.x1gsc.mongodb.net/wordApp";

async function insertDefaultData() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB Atlas!");

        const db = client.db("Level_Selection"); // Make sure this matches your DB name
        const collection = db.collection("Module"); // Make sure this matches your collection name

        // Insert default data if no document exists
        const existingDoc = await collection.findOne({});
        if (!existingDoc) {
            await collection.insertOne({ Module: 1, Level: 1 });
            console.log("✅ Default data inserted!");
        } else {
            console.log("⚠️ Data already exists:", existingDoc);
        }
    } catch (err) {
        console.error("❌ Error inserting data:", err);
    } finally {
        await client.close();
    }
}

insertDefaultData();
