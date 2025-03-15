import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./WhoIsPlaying.css"; 

const API_BASE_URL = "https://t36pd2.onrender.com/api";

const WhoIsPlaying = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);

  // ✅ Fetch Players from the Database on Page Load
  useEffect(() => {
    axios.get(`${API_BASE_URL}/players`)
      .then((res) => setPlayers(res.data))
      .catch((err) => console.error("❌ Error fetching players:", err));
  }, []);

  // ✅ Save Progress THEN Update Player THEN Navigate
  const handleSelectPlayer = async (playerName) => {
    try {
      console.log(`🔵 Saving progress before switching to ${playerName}...`);
      
      // ✅ Step 1: Save Current Progress First
      await axios.post(`${API_BASE_URL}/saveProgress`);
      console.log("✅ Progress saved!");

      // ✅ Step 2: Update Player
      await axios.put(`${API_BASE_URL}/updatePlayer`, { playerName });
      console.log(`✅ Player updated to ${playerName}`);

      // ✅ Step 3: Navigate to Level Selection AFTER saving progress
      navigate(`/select-level/${playerName}`);
    } catch (err) {
      console.error("❌ Error handling player selection:", err);
    }
  };

  return (
    <div className="who-playing-screen">
      <h1 className="title">WHO'S PLAYING?</h1>
      <div className="who-playing-container">
        {players.length > 0 ? (
          players.map((player) => (
            <button 
              key={player._id} 
              className="who-playing-box"
              onClick={() => handleSelectPlayer(player.name)} // ✅ Click works now
            >
              <div className="who-playing-initial">{player.name.charAt(0).toUpperCase()}</div>
              <div className="who-playing-name">{player.name}</div>
            </button>
          ))
        ) : (
          <p className="no-players">No players found. Add a new player!</p>
        )}
      </div>
    </div>
  );
};

export default WhoIsPlaying;
