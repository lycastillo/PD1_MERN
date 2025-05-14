//VVVVVVVV IMPORTANT WAG GALAWIN

const express = require("express");            
const mongoose = require("mongoose"); //import mongoose
const cors = require("cors");                       
require("dotenv").config(); 

const app = express(); //inititalize express
const PORT = process.env.PORT || 5000; //set port, same 'to sa .env file

app.use(cors()); //since different origin/port ni frontend with backend, cors is necessary for them to communicatte
app.use(express.json()); 

//connection with ATLAS
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,      
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))  //OK
.catch(err => console.error("❌ MongoDB connection error:", err)); //NOT OK

//ROUTES
app.get("/", (req, res) => {
  res.send("🚀 Server is running on Render!");            
});                  

const playerRoutes = require("./routes/players");         
app.use("/api/players", playerRoutes);                   

//server start
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);       
});
