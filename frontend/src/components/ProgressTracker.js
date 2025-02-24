import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProgressTracker.css"; 

const ProgressTracker = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/players")
      .then((response) => response.json())
      .then((data) => setPlayers(data))
      .catch((error) => console.error("Error fetching players:", error));
  }, []);

  return (
    <div className="progress-tracker-screen">
      {/* Top-left Logo */}
      <img src="/new2.png" alt="Logo" className="top-left-logo" />

      {/* Back Button */}
      <button className="progress-tracker-back-button" onClick={() => navigate("/")}>Back</button>

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
        {players.map((player, index) => (
          <div key={index} className="progress-tracker-box">
            <div className="progress-tracker-initial">
              {player.name.charAt(0).toUpperCase()}
            </div>
            <div className="progress-tracker-name">{player.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;
