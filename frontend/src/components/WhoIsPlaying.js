import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./WhoIsPlaying.css"; 

const API_BASE_URL = "https://t36pd2.onrender.com/api";

const WhoIsPlaying = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [deletePlayerName, setDeletePlayerName] = useState("");
  const [isManageMode, setIsManageMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch Players from the Database on Page Load
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

  // ✅ Function to Add a Player
  const handleEnter = () => {
    if (!newPlayerName.trim()) {
      setErrorMessage("Name cannot be empty.");
      return;
    }

    axios.post(`${API_BASE_URL}/players`, { name: newPlayerName })
      .then((res) => {
        setPlayers([...players, res.data]);  // Update UI with the new player
        setNewPlayerName("");
        setShowDialog(false);
        setErrorMessage("");
      })
      .catch((err) => {
        console.error("❌ Error adding player:", err);
        setErrorMessage("Something went wrong.");
      });
  };

  // ✅ Function to Delete a Player
  const handleConfirmDelete = () => {
    axios.delete(`${API_BASE_URL}/players/${deletePlayerName}`)
      .then(() => {
        setPlayers(players.filter((player) => player.name !== deletePlayerName));
        setShowDeleteDialog(false);
        setDeletePlayerName("");
      })
      .catch((err) => {
        console.error("❌ Error deleting player:", err);
      });
  };

  // ✅ Function to Select a Player and Update Database
  const handleSelectPlayer = (playerName) => {
    // 1️⃣ First, Save Progress for the Current Player
    axios.post(`${API_BASE_URL}/saveProgress`)
      .then((res) => {
        console.log(res.data.message);
  
        // 2️⃣ Then, Switch to the New Player
        axios.put(`${API_BASE_URL}/updatePlayer`, { playerName })
          .then((res) => {
            console.log(res.data.message);
            navigate(`/select-level/${playerName}`); // Redirect to Level Selection
          })
          .catch((err) => {
            console.error("❌ Error updating player:", err);
          });
  
      })
      .catch((err) => {
        console.error("❌ Error saving progress:", err);
      });
  };
  

  return (
    <div className={`who-playing-screen ${showDialog || showDeleteDialog ? "blur-background" : ""}`}>
      <img src="/new2.png" alt="Logo" className="top-left-logo" />
      <button className="who-playing-back-button" onClick={() => navigate("/")}>Back</button>
      <h1 className="who-playing-title">WHO'S PLAYING?</h1>

      {loading ? <p>Loading...</p> : null}
      {error && <p className="error-message">{error}</p>}

      {/* ✅ Players List */}
      <div className={`who-playing-container ${isManageMode ? "manage-mode" : ""}`}>
        {players.length > 0 ? players.map((player) => (
          <button 
            key={player._id} 
            className="who-playing-box"
            onClick={() => isManageMode ? setDeletePlayerName(player.name) || setShowDeleteDialog(true) : handleSelectPlayer(player.name)}
          >
            <div className="who-playing-initial">
              {player.name.charAt(0).toUpperCase()}
            </div>
            <div className="who-playing-name">{player.name}</div>

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
        )) : <p>No players found.</p>}

        {/* ✅ Add Player Button (Hidden in Manage Mode) */}
        {!isManageMode && (
          <button className="add-player-box" onClick={() => setShowDialog(true)}>
            <div className="add-icon">+</div>
            <p>Add Player</p>
          </button>
        )}
      </div>

      {/* ✅ Manage Players Button */}
      <button className="manage-players" onClick={() => setIsManageMode(!isManageMode)}>
        {isManageMode ? "Done" : "Manage Players"}
      </button>

      {/* ✅ Add Player Dialog */}
      {showDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <div className="inner-box">
              <h2>Enter your name</h2>
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

      {/* ✅ Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <div className="inner-box">
              <h2>Are you sure you want to delete {deletePlayerName}?</h2>
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
