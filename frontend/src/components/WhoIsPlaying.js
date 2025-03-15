import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./WhoIsPlaying.css"; 

const API_BASE_URL = "https://t36pd2.onrender.com/api";

const WhoIsPlaying = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Players from the Database on Page Load
  useEffect(() => {
    axios.get(`${API_BASE_URL}/players`)
      .then((res) => setPlayers(res.data))
      .catch((err) => console.error("❌ Error fetching players:", err));
  }, []);

  // ✅ Handle Player Selection, Save Progress, and Navigate
  const handleSelectPlayer = async (playerName) => {
    if (loading) return; // Prevent multiple clicks
    setLoading(true);

    try {
      console.log(`🔵 Selecting ${playerName}...`);
      
      // ✅ Step 1: Update the player in DB
      await axios.put(`${API_BASE_URL}/updatePlayer`, { playerName });

      console.log(`✅ Player switched to ${playerName}`);

      // ✅ Step 2: Navigate to Level Selection
      navigate(`/select-level/${playerName}`);
    } catch (err) {
      console.error("❌ Error selecting player:", err);
    } finally {
      setLoading(false);
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
              onClick={() => handleSelectPlayer(player.name)}
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
