import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // API requests
import "./WhoIsPlaying.css";

const WhoIsPlaying = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [deletePlayerName, setDeletePlayerName] = useState("");
  const [isManageMode, setIsManageMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch players from the database when the page loads
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/players")
      .then((res) => setPlayers(res.data))
      .catch((err) => console.error("Error fetching players:", err));
  }, []);

  // Add a new player
  const handleEnter = () => {
    if (!newPlayerName.trim()) {
      setErrorMessage("Name cannot be empty.");
      return;
    }

    axios
      .post("http://localhost:5000/api/players", { name: newPlayerName })
      .then((res) => {
        setPlayers([...players, res.data]); 
        setNewPlayerName(""); 
        setShowDialog(false); 
        setErrorMessage("");
      })
      .catch((err) => {
        if (err.response && err.response.data.message) {
          setErrorMessage(err.response.data.message);
        } else {
          setErrorMessage("Something went wrong.");
        }
      });
  };

  // Delete a player
  const handleConfirmDelete = () => {
    axios
      .delete(`http://localhost:5000/api/players/${deletePlayerName}`)
      .then(() => {
        setPlayers(players.filter((player) => player.name !== deletePlayerName));
        setShowDeleteDialog(false);
        setDeletePlayerName("");
      })
      .catch((err) => console.error("Error deleting player:", err));
  };

  return (
    <div className={`who-playing-screen ${showDialog || showDeleteDialog ? "blur-background" : ""}`}>
      {/* Background Image */}
      <img src="/background.png" alt="Watermark" className="background-watermark" />

      {/* Top-left Logo */}
      <img src="/new2.png" alt="Logo" className="top-left-logo" />

      {/* Back Button */}
      <button className="back-button" onClick={() => navigate("/")}>Back</button>

      {/* Title */}
      <h1 className="title">WHO'S PLAYING?</h1>

      {/* Players List */}
      <div className={`players-container ${isManageMode ? "manage-mode" : ""} ${players.length > 0 ? "has-players" : ""}`}>
        {players.map((player) => (
          <button
            key={player._id}
            className="player-box"
            onClick={() => navigate(`/select-level/${player._id}`)} // Navigates to level selection page
          >
            <div className="player-initial">{player.name.charAt(0).toUpperCase()}</div>
            <div className="player-name">{player.name}</div>

            {/* Delete Button (Only Visible in Manage Mode) */}
            {isManageMode && (
              <button className="delete-player" onClick={() => {
                setDeletePlayerName(player.name);
                setShowDeleteDialog(true);
              }}>
                X
              </button>
            )}
          </button>
        ))}

        {/* Add Player Button */}
        {!isManageMode && (
          <button className="add-player-box" onClick={() => setShowDialog(true)}>
            <div className="add-icon">+</div>
            <p>Add Player</p>
          </button>
        )}
      </div>

      {/* Manage Players Button */}
      <button className="manage-players" onClick={() => setIsManageMode(!isManageMode)}>
        {isManageMode ? "Done" : "Manage Players"}
      </button>

      {/* Add Player Dialog */}
      {showDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <div className="inner-box">
              <h2>What is your name?</h2>
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Enter name"
              />
              {errorMessage && <p style={{ color: "red", fontSize: "14px" }}>{errorMessage}</p>}
              <button className="enter-button" onClick={handleEnter}>Enter</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <div className="inner-box">
              <h2>Are you sure you want to delete player {deletePlayerName}?</h2>
              <button className="confirm-button" onClick={handleConfirmDelete}>Yes</button>
              <button className="cancel-button" onClick={() => setShowDeleteDialog(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhoIsPlaying;
