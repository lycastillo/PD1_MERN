//IMPORTANT WAG GALAWIN

const { MongoClient } = require("mongodb");   

//specific atlas URI
const uri = "mongodb+srv://lycastillo:T36DBPD2@t36db.x1gsc.mongodb.net/wordApp";

//this part will update the module number sa atlas
async function updateModule(moduleNumber) {
    const client = new MongoClient(uri); 

    try {
        await client.connect(); //connect sa atlas
        const db = client.db("wordApp"); //go to wordApp db inside the collection
        const collection = db.collection("Level_Select"); //go to Level_Select db inside wordApp

        const result = await collection.updateOne(        
            {},                                      
            { $set: { Module: moduleNumber } } //upon clicking the module number, it will update the number in ATLAS
        );

        if (result.matchedCount > 0) {
            console.log(`✅ Module updated to: ${moduleNumber}`); //success msg
        } else {
            console.log("❌ No document found to update.");       //unsuccessful
        }
    } catch (error) {
        console.error("❌ Error updating Module:", error);        //error handling
    } finally {
        await client.close();                                
    }
}

//this part will update the level number in atlas; functions same as above
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
            console.log(`✅ Level updated to: ${levelNumber}`);   
        } else {
            console.log("❌ No document found to update.");       
        }
    } catch (error) {
        console.error("❌ Error updating Level:", error);      
    } finally {
        await client.close();                           
    }
}

module.exports = { updateModule, updateLevel };   
