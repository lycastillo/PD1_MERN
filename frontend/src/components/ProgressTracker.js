import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProgressTracker.css"; 

const API_BASE_URL = "https://t36pd2.onrender.com/api";

const ProgressTracker = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null); // ✅ Track selected player
  const [progressData, setProgressData] = useState(null); // ✅ Store progress data
  const [selectedDate, setSelectedDate] = useState("");

  // ✅ Fetch Players on Page Load
  useEffect(() => {
    axios.get(`${API_BASE_URL}/players`)
      .then((res) => {
        console.log("✅ Players fetched:", res.data);
        setPlayers(res.data);
      })
      .catch((err) => {
        console.error("❌ Error fetching players:", err);
      });
  }, []);

  // ✅ Fetch Player Progress
  const fetchProgress = (playerName) => {
    axios.get(`${API_BASE_URL}/progress/${playerName}`)
      .then((res) => {
        console.log(`✅ Progress for ${playerName}:`, res.data);
        setSelectedPlayer(playerName);
        setProgressData(res.data.progressData);
      })
      .catch((err) => {
        console.error("❌ Error fetching progress:", err);
        setSelectedPlayer(playerName);
        setProgressData(null);
      });
  };

  return (
    <div className="progress-tracker-screen">
      {/* Top-left Logo */}
      <img src="/new2.png" alt="Logo" className="top-left-logo" />

      {/* Back Button */}
      <button className="progress-tracker-back-button" onClick={() => navigate("/")}>Back</button>

      {/* Watermark Background */}
      <img src="/new1.png" alt="Watermark" className="background-watermark" /> 

      {/* Title */}
      <h1 className="progress-tracker-title">PROGRESS TRACKER</h1>

      {/* Date Picker */}
      <input 
        type="date" 
        className="progress-tracker-date-picker"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      {/* Players List */}
      <div className="progress-tracker-container">
        {players.map((player) => (
          <button 
            key={player._id} 
            className={`progress-tracker-box ${selectedPlayer === player.name ? "selected" : ""}`}
            onClick={() => fetchProgress(player.name)} // ✅ Click to load progress
          >
            <div className="progress-tracker-initial">
              {player.name.charAt(0).toUpperCase()}
            </div>
            <div className="progress-tracker-name">{player.name}</div>
          </button>
        ))}
      </div>

      {/* Display Selected Player's Progress */}
      {selectedPlayer && (
        <div className="progress-display">
          <h2>Progress for {selectedPlayer}</h2>
          {progressData ? (
            <ul>
              {Object.entries(progressData).map(([key, value]) => (
                <li key={key}><strong>{key}:</strong> {value}</li>
              ))}
            </ul>
          ) : (
            <p>No progress data found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
