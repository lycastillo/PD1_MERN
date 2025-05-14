const express = require("express"); //import express 
const router = express.Router();                      
const Player = require("../models/Player"); //import player

//this will GET all player names from DB
router.get("/", async (req, res) => {
  try {
    const players = await Player.find(); 
    res.json(players);   
  } catch (err) {
    res.status(500).json({ message: "Error fetching players" });  //error handling
  }
});

//this will ADD new player
router.post("/", async (req, res) => {
  const { name } = req.body; 

  try {
    if (!name) { //check if name is provided sa name box
      return res.status(400).json({ message: "Name is required" });
    }

    const existingPlayer = await Player.findOne({ name: name.trim() });  //check if name is already on DB
    if (existingPlayer) {
      return res.status(400).json({ message: "This name already exists!" }); //no duplicates
    }

    const newPlayer = new Player({ name: name.trim() });  
    await newPlayer.save(); //save new player sa DB
    res.status(201).json(newPlayer);  
  } catch (err) {
    res.status(500).json({ message: "Error adding player" });  //error handling
  }
});

//this will DELETE player with their names, not ID num
router.delete("/:name", async (req, res) => {
  try {
    const deletedPlayer = await Player.findOneAndDelete({ name: req.params.name });  //find player name then delete
    if (!deletedPlayer) {
      return res.status(404).json({ message: "Player not found" });  //error handling if name is not on DB
    }
    res.json({ message: "Player deleted" });       
  } catch (err) {
    res.status(500).json({ message: "Error deleting player" });  //error handling
  }
});

module.exports = router;                           
