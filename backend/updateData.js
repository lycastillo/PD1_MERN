//FOR DB TESTING PURPOSES ONLY; IGNORE

const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://lycastillo:T36DBPD2@t36db.x1gsc.mongodb.net/wordApp"; 

async function updateModule(moduleNumber) {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db("wordApp"); 
        const collection = db.collection("Level_Select"); // 

        const result = await collection.updateOne(
            {}, 
            { $set: { Module: moduleNumber } }
        );

        if (result.matchedCount > 0) {
            console.log(`Module updated to: ${moduleNumber}`);
        } else {
            console.log("No document found to update.");
        }
    } catch (error) {
        console.error("Error updating Module:", error);
    } finally {
        await client.close();
    }
}

async function updateLevel(levelNumber) {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db("wordApp"); 
        const collection = db.collection("Level_Select"); 

        const result = await collection.updateOne(
            {},
            { $set: { Level: levelNumber } }
        );

        if (result.matchedCount > 0) {
            console.log(`Level updated to: ${levelNumber}`);
        } else {
            console.log("No document found to update.");
        }
    } catch (error) {
        console.error("Error updating Level:", error);
    } finally {
        await client.close();
    }
}

