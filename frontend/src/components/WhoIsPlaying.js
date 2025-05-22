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
  const [addPlayerError, setAddPlayerError] = useState("");
  const [selectPlayerError, setSelectPlayerError] = useState("");
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchPlayers();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const fetchPlayers = () => {
    axios
      .get(`${API_BASE_URL}/players`)
      .then((res) => setPlayers(res.data))
      .catch((err) => console.error("Error fetching players:", err));
  };

  const handleEnter = () => {
    if (!newPlayerName.trim()) {
      setAddPlayerError("Name cannot be empty.");
      return;
    }

    axios
      .post(`${API_BASE_URL}/players`, { name: newPlayerName })
      .then((res) => {
        setPlayers([...players, res.data]);
        setNewPlayerName("");
        setShowDialog(false);
        setAddPlayerError("");
      })
      .catch((err) => {
        if (err.response?.status === 409) {
          setAddPlayerError("❌ Name already exists. Try another.");
        } else {
          setAddPlayerError("❌ Could not add player. Try again.");
        }
      });
  };

  const handleConfirmDelete = () => {
    if (!deletePlayerName) return;

    axios
      .delete(`${API_BASE_URL}/players/${deletePlayerName}`)
      .then(() => {
        setPlayers(players.filter((p) => p.name !== deletePlayerName));
        setShowDeleteDialog(false);
        setDeletePlayerName("");
      })
      .catch((err) => console.error("❌ Error deleting player:", err));
  };

  const handleSelectPlayer = async (playerName) => {
  if (isManageMode) {
    setDeletePlayerName(playerName);
    setShowDeleteDialog(true);
    return;
  }

  try {
    // Check if the selected player is currently in Level_Select
    const levelRes = await axios.get(`${API_BASE_URL}/level-select`);
    const { Player, Module } = levelRes.data || {};
    const isSamePlayer = typeof Player === "string" && Player === playerName;
    const hasModule = typeof Module === "number" && Module !== 0;

    if (isSamePlayer && hasModule) {
      navigate("/waiting", { state: { selectedPlayer: playerName } });
      return;
    }

    // Else, show progress (even if score is 0)
    const progressRes = await axios.get(`${API_BASE_URL}/progress/${playerName}`);
    const progressArray = Array.isArray(progressRes.data) ? progressRes.data : [progressRes.data];

    if (progressArray.length > 0) {
      navigate("/progress-tracker", { state: { playerName } });
      return;
    }

    setSelectPlayerError("Player has no score yet.");
    setTimeout(() => setSelectPlayerError(""), 3000);
  } catch (err) {
    console.error("❌ Error during player selection:", err);
    setSelectPlayerError("Error selecting player. Try again.");
    setTimeout(() => setSelectPlayerError(""), 3000);
  }
};


  return (
    <div
      className={`who-playing-screen ${showDialog || showDeleteDialog ? "blur-background" : ""}`}
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

      <div className={`players-container ${isManageMode ? "manage-mode" : ""} ${players.length > 0 ? "has-players" : ""}`}>
        {players.map((player) => (
          <div
            key={player._id}
            className="player-box"
            onClick={() => handleSelectPlayer(player.name)}
            style={{ position: "relative" }}
          >
            <div className="player-initial">{player.name.charAt(0).toUpperCase()}</div>
            <div className="player-name">{player.name}</div>
            {isManageMode && (
              <div
                className="delete-player"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeletePlayerName(player.name);
                  setShowDeleteDialog(true);
                }}
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  background: "#e74c3c",
                  color: "white",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                ×
              </div>
            )}
          </div>
        ))}

        {!isManageMode && (
          <button className="add-player-box" onClick={() => setShowDialog(true)}>
            <div className="add-icon">+</div>
            <p>Add Player</p>
          </button>
        )}
      </div>

      <button className="manage-players" onClick={() => setIsManageMode(!isManageMode)}>
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
              {addPlayerError && <p className="error-message">{addPlayerError}</p>}
              <button className="enter-button" onClick={handleEnter}>Enter</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <div className="inner-box">
              <button className="close-button" onClick={() => setShowDeleteDialog(false)}>✖</button>
              <h2>Are you sure you want to delete {deletePlayerName}?</h2>
              <button className="confirm-button" onClick={handleConfirmDelete}>Yes</button>
              <button className="cancel-button" onClick={() => setShowDeleteDialog(false)}>No</button>
            </div>
          </div>
        </div>
      )}

      {selectPlayerError && (
        <div
          className="floating-error"
          style={{
            position: "fixed",
            top: cursorPosition.y + 12,
            left: cursorPosition.x + 12,
            backgroundColor: "rgba(255, 0, 0, 0.9)",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "6px",
            zIndex: 9999,
            fontSize: "14px",
            maxWidth: "250px",
            pointerEvents: "none"
          }}
        >
          {selectPlayerError}
        </div>
      )}
    </div>
  );
};

export default WhoIsPlaying;
