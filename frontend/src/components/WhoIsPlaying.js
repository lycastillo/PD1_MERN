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

  // ✅ Save Progress Before Switching Players, THEN Navigate
  const handleSelectPlayer = (playerName) => {
    axios.post(`${API_BASE_URL}/saveProgress`)
      .then(() => {
        axios.put(`${API_BASE_URL}/updatePlayer`, { playerName })
          .then(() => {
            console.log(`✅ Player switched to ${playerName}`);
            navigate(`/select-level/${playerName}`); // ✅ Navigate only AFTER saving progress
          })
          .catch((err) => console.error("❌ Error updating player:", err));
      })
      .catch((err) => console.error("❌ Error saving progress:", err));
  };

  return (
    <div className="who-playing-screen">
      <h1 className="title">WHO'S PLAYING?</h1>
      <div className="who-playing-container">
        {players.map((player) => (
          <button 
            key={player._id} 
            className="who-playing-box"
            onClick={() => handleSelectPlayer(player.name)}
          >
            <div className="who-playing-initial">{player.name.charAt(0).toUpperCase()}</div>
            <div className="who-playing-name">{player.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WhoIsPlaying;
