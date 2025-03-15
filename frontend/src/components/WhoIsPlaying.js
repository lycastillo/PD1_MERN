import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./WhoIsPlaying.css"; 

const API_BASE_URL = "https://t36pd2.onrender.com/api";

const WhoIsPlaying = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch Players on Page Load
  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE_URL}/players`)
      .then((res) => {
        console.log("✅ Players fetched successfully:", res.data);
        setPlayers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching players:", err);
        setError("Error loading players.");
        setLoading(false);
      });
  }, []);

  // ✅ Function to Update Selected Player in Atlas
  const handleSelectPlayer = (playerName) => {
    axios.put(`${API_BASE_URL}/updatePlayer`, { playerName })
      .then((res) => {
        console.log(res.data.message);
        navigate(`/select-level/${playerName}`); // Redirect to Level Selection
      })
      .catch((err) => {
        console.error("❌ Error updating player:", err);
      });
  };

  return (
    <div className="who-playing-screen">
      <img src="/new2.png" alt="Logo" className="top-left-logo" />
      <button className="who-playing-back-button" onClick={() => navigate("/")}>Back</button>
      <h1 className="who-playing-title">WHO'S PLAYING?</h1>

      {loading ? <p>Loading...</p> : null}
      {error && <p className="error-message">{error}</p>}

      {/* ✅ Players List */}
      <div className="who-playing-container">
        {players.length > 0 ? players.map((player) => (
          <button 
            key={player._id} 
            className="who-playing-box"
            onClick={() => handleSelectPlayer(player.name)}
          >
            <div className="who-playing-initial">
              {player.name.charAt(0).toUpperCase()}
            </div>
            <div className="who-playing-name">{player.name}</div>
          </button>
        )) : <p>No players found.</p>}
      </div>
    </div>
  );
};

export default WhoIsPlaying;
