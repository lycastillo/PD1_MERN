import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProgressTracker.css"; 

const API_BASE_URL = "https://t36pd2.onrender.com/api";

const ProgressTracker = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerProgress, setPlayerProgress] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/players`)
      .then((res) => setPlayers(res.data))
      .catch((err) => console.error("❌ Error fetching players:", err));
  }, []);

  const fetchPlayerProgress = (playerName) => {
    setSelectedPlayer(playerName);
    axios.get(`${API_BASE_URL}/progress/${playerName}`)
      .then((res) => setPlayerProgress(res.data))
      .catch((err) => setPlayerProgress([]));
  };

  return (
    <div className="progress-tracker-screen">
      <h1 className="progress-tracker-title">PROGRESS TRACKER</h1>
      <div className="progress-tracker-container">
        {players.map((player) => (
          <button key={player._id} className="progress-tracker-box" onClick={() => fetchPlayerProgress(player.name)}>
            <div className="progress-tracker-initial">{player.name.charAt(0).toUpperCase()}</div>
            <div className="progress-tracker-name">{player.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;
