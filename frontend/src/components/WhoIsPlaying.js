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

  // ✅ Fetch existing players from the backend
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/players`)
      .then((res) => {
        setPlayers(res.data); // Populate player list
      })
      .catch((err) => {
        console.error("❌ Error fetching players:", err);
      });
  }, []);

  // ✅ Function to select a player and update in DB
  const selectPlayer = (playerId, playerName) => {
    // Update the selected player in Level_Select DB
    axios.put(`${API_BASE_URL}/updatePlayer`, { playerName })
      .then((res) => {
        console.log(`✅ Player Updated to: ${playerName}`);
        // Redirect to LevelSelection, passing playerId
        navigate(`/select-level/${playerId}`);
      })
      .catch((err) => {
        console.error("❌ Error updating player:", err);
      });
  };

  // ✅ Function to add a new player
  const handleEnter = () => {
    if (!newPlayerName.trim()) {
      setErrorMessage("Name cannot be empty.");
      return;
    }

    axios
      .post(`${API_BASE_URL}/players`, { name: newPlayerName })
      .then((res) => {
        setPlayers([...players, res.data]); // Add new player to the list
        setNewPlayerName(""); 
        setShowDialog(false); 
        setErrorMessage("");
      })
      .catch((err) => {
        console.error("❌ Error adding player:", err);
        if (err.response && err.response.data.message) {
          setErrorMessage(err.response.data.message);
        } else {
          setErrorMessage("Something went wrong.");
        }
      });
  };

  return (
    <div className="who-playing-screen">
      <h1 className="title">WHO'S PLAYING?</h1>

      {/* ✅ Players List */}
      <div className="players-container">
        {players.length > 0 ? (
          players.map((player) => (
            <button
              key={player._id}
              className="player-box"
              onClick={() => selectPlayer(player._id, player.name)} // Select player and redirect
            >
              <div className="player-initial">{player.name.charAt(0).toUpperCase()}</div>
              <div className="player-name">{player.name}</div>
            </button>
          ))
        ) : (
          <p>No players found. Add one below!</p>
        )}
      </div>

      {/* ✅ Add Player Button */}
      <button className="add-player-box" onClick={() => setShowDialog(true)}>
        <div className="add-icon">+</div>
        <p>Add Player</p>
      </button>

      {/* ✅ Add Player Dialog */}
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
