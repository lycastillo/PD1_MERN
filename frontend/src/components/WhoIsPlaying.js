import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WhoIsPlaying.css";

const WhoIsPlaying = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]); // Stores added players
  const [animationClass, setAnimationClass] = useState("hidden-screen"); // Controls transition effect

  // Apply transition on component mount
  useEffect(() => {
    setTimeout(() => {
      setAnimationClass("show-screen");
    }, 50); // Small delay to trigger the transition
  }, []);

  const handleAddPlayer = () => {
    const playerName = prompt("Enter player name:");
    if (playerName) {
      setPlayers([...players, playerName]);
    }
  };

  return (
    <div className={`who-playing-screen ${animationClass}`}>
      {/* Background Watermark */}
      <img src="/new1.png" alt="Background Watermark" className="background-watermark" />

      {/* Logo (Top Left) */}
      <img src="/new2.png" alt="Logo" className="top-left-logo" />

      {/* Back Button */}
      <button className="back-button" onClick={() => navigate("/")}>Back</button>

      {/* Who's Playing Title */}
      <h1 className="title">WHO'S PLAYING?</h1>

      {/* Players Section */}
      <div className="players-container">
        {players.map((player, index) => (
          <div key={index} className="player-box">
            <span className="player-initial">{player.charAt(0).toUpperCase()}</span>
            <span className="player-name">{player}</span>
          </div>
        ))}

        {/* Add Player Button */}
        <div className="add-player-box" onClick={handleAddPlayer}>
          <div className="add-icon">+</div>
          <p>Add Player</p>
        </div>
      </div>

      {/* Manage Players Button */}
      <button className="manage-players">Manage Players</button>
    </div>
  );
};

export default WhoIsPlaying;
