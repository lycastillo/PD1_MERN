import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./WhoIsPlaying.css";
import bgImage from "./game-UI.png";

const API_BASE_URL = "http://localhost:5000/api";

const WhoIsPlaying = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [deletePlayerName, setDeletePlayerName] = useState("");
  const [isManageMode, setIsManageMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = () => {
    axios
      .get(`${API_BASE_URL}/players`)
      .then((res) => setPlayers(res.data))
      .catch((err) => console.error("Error fetching players:", err));
  };

  const handleEnter = () => {
    if (!newPlayerName.trim()) {
      setErrorMessage("Name cannot be empty.");
      return;
    }

    axios
      .post(`${API_BASE_URL}/players`, { name: newPlayerName })
      .then((res) => {
        setPlayers([...players, res.data]);
        setNewPlayerName("");
        setShowDialog(false);
        setErrorMessage("");
      })
      .catch((err) => {
        if (err.response?.status === 409) {
          setErrorMessage("❌ Name already exists. Try another.");
        } else {
          setErrorMessage("❌ Could not add player. Try again.");
        }
      });
  };

  const handleConfirmDelete = () => {
    axios
      .delete(`${API_BASE_URL}/players/${deletePlayerName}`)
      .then(() => {
        setPlayers(players.filter((p) => p.name !== deletePlayerName));
        setShowDeleteDialog(false);
        setDeletePlayerName("");
      })
      .catch((err) => {
        console.error("❌ Error deleting player:", err);
      });
  };

  const handleSelectPlayer = (playerName) => {
    if (isManageMode) {
      setDeletePlayerName(playerName);
      setShowDeleteDialog(true);
    } else {
      axios
        .put(`${API_BASE_URL}/updatePlayer`, { playerName })
        .then(() => navigate("/select-level"))
        .catch((err) => console.error("❌ Error selecting player:", err));
    }
  };

  return (
    <div
      className={`who-playing-screen ${
        showDialog || showDeleteDialog ? "blur-background" : ""
      }`}
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start"
      }}
    >
      <img src="/new2.png" alt="Logo" className="top-left-logo" />
      <button className="back-button" onClick={() => navigate("/")}>Back</button>

      <h1 className="title" style={{ marginTop: "60px" }}>WHO'S PLAYING?</h1>

      <div
        className={`players-container ${
          isManageMode ? "manage-mode" : ""
        } ${players.length > 0 ? "has-players" : ""}`}
      >
        {players.map((player) => (
          <button
            key={player._id}
            className="player-box"
            onClick={() => handleSelectPlayer(player.name)}
          >
            <div className="player-initial">
              {player.name.charAt(0).toUpperCase()}
            </div>
            <div className="player-name">{player.name}</div>
            {isManageMode && (
              <button
                className="delete-player"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeletePlayerName(player.name);
                  setShowDeleteDialog(true);
                }}
              >
                X
              </button>
            )}
          </button>
        ))}

        {!isManageMode && (
          <button className="add-player-box" onClick={() => setShowDialog(true)}>
            <div className="add-icon">+</div>
            <p>Add Player</p>
          </button>
        )}
      </div>

      <button
        className="manage-players"
        onClick={() => setIsManageMode(!isManageMode)}
      >
        {isManageMode ? "Done" : "Manage Players"}
      </button>

      {showDialog && (
  <div className="dialog-overlay">
    <div className="dialog-box">
      <div className="inner-box">
        <button className="close-button" onClick={() => setShowDialog(false)}>✖</button>
        <h2>What is your name?</h2>
        <input
          type="text"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          placeholder="Enter name"
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button className="enter-button" onClick={handleEnter}>Enter</button>
      </div>
    </div>
  </div>
)}


      {showDeleteDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <div className="inner-box">
              <button className="close-button" onClick={() => setShowDeleteDialog(false)}>
                ✖
              </button>
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
