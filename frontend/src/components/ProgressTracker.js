import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProgressTracker.css"; 

const API_BASE_URL = "https://t36pd2.onrender.com/api";

const ProgressTracker = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerHistory, setPlayerHistory] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch Players on Page Load
  useEffect(() => {
    axios.get(`${API_BASE_URL}/players`)
      .then((res) => {
        console.log("✅ Players fetched:", res.data);
        setPlayers(res.data);
      })
      .catch((err) => {
        console.error("❌ Error fetching players:", err);
        setError("Error loading players.");
      });
  }, []);

  // ✅ Fetch Player Progress & Store Data
  const fetchPlayerProgress = (playerName) => {
    setLoading(true);
    setSelectedPlayer(playerName);

    axios.get(`${API_BASE_URL}/progress/${playerName}`)
      .then((res) => {
        console.log(`✅ Progress for ${playerName}:`, res.data);

        // ✅ Store progress data for each player separately
        setPlayerHistory((prevHistory) => ({
          ...prevHistory,
          [playerName]: res.data
        }));

        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching progress:", err);
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
        {players.map((player) => (
          <button 
            key={player._id} 
            className={`progress-tracker-box ${selectedPlayer === player.name ? "selected" : ""}`}
            onClick={() => fetchPlayerProgress(player.name)}
          >
            <div className="progress-tracker-initial">
              {player.name.charAt(0).toUpperCase()}
            </div>
            <div className="progress-tracker-name">{player.name}</div>
          </button>
        ))}
      </div>

      {/* ✅ Show Player Progress */}
      {Object.keys(playerHistory).map((playerName) => (
        <div className="progress-display" key={playerName}>
          <h2>Game History for {playerName}</h2>
          {loading ? (
            <p>Loading...</p> 
          ) : playerHistory[playerName] && playerHistory[playerName].length > 0 ? (
            <ul>
              {playerHistory[playerName].map((game, index) => (
                <li key={index}>
                  <strong>Module:</strong> {game.Module},  
                  <strong> Level:</strong> {game.Level},  
                  <strong> Time:</strong> {new Date(game.timestamp).toLocaleString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>No progress found.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressTracker;
