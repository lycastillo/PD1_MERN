import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./WhoIsPlaying.css";

const API_BASE_URL = "https://t36pd2.onrender.com/api";

const WhoIsPlaying = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch players when the page loads
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/players`)
      .then((res) => {
        console.log("✅ Players fetched:", res.data);
        setPlayers(res.data);
      })
      .catch((err) => console.error("❌ Error fetching players:", err));
  }, []);

  // Add a new player
  const handleEnter = () => {
    if (!newPlayerName.trim()) {
      setErrorMessage("Name cannot be empty.");
      return;
    }

    axios
      .post(`${API_BASE_URL}/players`, { name: newPlayerName })
      .then((res) => {
        setPlayers([...players, res.data]); // Add new player to list
        setNewPlayerName(""); 
        setShowDialog(false); 
        setErrorMessage("");
      })
      .catch((err) => {
        console.error("❌ Error adding player:", err);
        setErrorMessage("Something went wrong.");
      });
  };

  return (
    <div className="who-playing-screen">
      <h1 className="title">WHO'S PLAYING?</h1>

      {/* Players List */}
      <div className="players-container">
        {players.length > 0 ? (
          players.map((player) => (
            <button
              key={player._id}
              className="player-box"
              onClick={() => navigate(`/select-level/${player._id}`)}
            >
              <div className="player-initial">{player.name.charAt(0).toUpperCase()}</div>
              <div className="player-name">{player.name}</div>
            </button>
          ))
        ) : (
          <p>No players found. Add one below!</p>
        )}
      </div>

      {/* Add Player Button */}
      <button className="add-player-box" onClick={() => setShowDialog(true)}>
        <div className="add-icon">+</div>
        <p>Add Player</p>
      </button>

      {/* Add Player Dialog */}
      {showDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <h2>Enter your name</h2>
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Enter name"
            />
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <button onClick={handleEnter}>Enter</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhoIsPlaying;
