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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch Players on Page Load
  useEffect(() => {
    axios.get(`${API_BASE_URL}/players`)
      .then((res) => {
        console.log("✅ Players fetched successfully:", res.data);
        setPlayers(res.data);
      })
      .catch((err) => {
        console.error("❌ Error fetching players:", err);
        setError("Error loading players.");
      });
  }, []);

  // ✅ Fetch Player Progress History
  const fetchPlayerProgress = (playerName) => {
    setLoading(true);
    setSelectedPlayer(playerName);

    axios.get(`${API_BASE_URL}/progress/${playerName}`)
      .then((res) => {
        console.log(`✅ Progress history for ${playerName}:`, res.data);
        setPlayerProgress(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching progress:", err);
        setPlayerProgress([]); // Ensure empty state instead of breaking UI
        setLoading(false);
      });
  };

  return (
    <div className="progress-tracker-screen">
      <img src="/new2.png" alt="Logo" className="top-left-logo" />
      <button className="progress-tracker-back-button" onClick={() => navigate("/")}>Back</button>
      <h1 className="progress-tracker-title">PROGRESS TRACKER</h1>

      {error && <p className="error-message">{error}</p>}

      {/* Players List */}
      <div className="progress-tracker-container">
        {players.length > 0 ? players.map((player) => (
          <button 
            key={player._id} 
            className="progress-tracker-box"
            onClick={() => fetchPlayerProgress(player.name)}
          >
            <div className="progress-tracker-initial">
              {player.name.charAt(0).toUpperCase()}
            </div>
            <div className="progress-tracker-name">{player.name}</div>
          </button>
        )) : <p>No players found.</p>}
      </div>

      {/* ✅ Show Progress */}
      {selectedPlayer && (
        <div className="progress-display">
          <h2>Game History for {selectedPlayer}</h2>
          {loading ? (
            <p>Loading...</p> 
          ) : playerProgress.length > 0 ? (
            <ul>
              {playerProgress.map((game, index) => (
                <li key={index}>
                  <strong>Module:</strong> {game.Module},  
                  <strong> Level:</strong> {game.Level},  
                  <strong> Time:</strong> {new Date(game.timestamp).toLocaleString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>No progress history found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
