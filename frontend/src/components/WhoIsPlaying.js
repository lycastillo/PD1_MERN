import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./WhoIsPlaying.css"; 

const API_BASE_URL = "https://t36pd2.onrender.com/api";

const WhoIsPlaying = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Players from Database
  useEffect(() => {
    axios.get(`${API_BASE_URL}/players`)
      .then((res) => {
        setPlayers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching players:", err);
        setPlayers([]); // Ensure it doesn’t crash
        setLoading(false);
      });
  }, []);

  // ✅ Handle Player Selection & Update DB
  const handleSelectPlayer = async (playerName) => {
    try {
      console.log(`🔵 Selecting ${playerName}...`);

      // ✅ Update Player in MongoDB
      await axios.put(`${API_BASE_URL}/updatePlayer`, { playerName });

      console.log(`✅ Player switched to ${playerName}`);

      // ✅ Navigate to Level Selection
      navigate(`/select-level/${playerName}`);
    } catch (err) {
      console.error("❌ Error selecting player:", err);
    }
  };

  return (
    <div className="who-playing-screen">
      <h1 className="title">WHO'S PLAYING?</h1>
      <div className="who-playing-container">
        {loading ? (
          <p className="loading-text">Loading players...</p>
        ) : players.length > 0 ? (
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
