import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./LevelSelection.css";

const API_BASE_URL = "https://t36pd2.onrender.com/api";

const LevelSelection = () => {
  const navigate = useNavigate();
  const { playerId } = useParams(); // ✅ Get playerId from URL
  console.log("Player ID:", playerId); // ✅ Log playerId to debug

  // ✅ Update Module in MongoDB
  const updateModule = (moduleNumber) => {
    axios.put(`${API_BASE_URL}/updateModule`, { moduleNumber })
      .then((res) => {
        console.log(`✅ Module Updated to: ${moduleNumber}`);
      })
      .catch((err) => {
        console.error("❌ Error updating module:", err);
      });
  };

  // ✅ Update Level in MongoDB
  const updateLevel = (levelNumber) => {
    axios.put(`${API_BASE_URL}/updateLevel`, { levelNumber })
      .then((res) => {
        console.log(`✅ Level Updated to: ${levelNumber}`);
      })
      .catch((err) => {
        console.error("❌ Error updating level:", err);
      });
  };

  return (
    <div 
      className="level-selection-screen"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + "/game-UI.png"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100vw",
      }}
    >
      <h1 className="title">CHOOSE MODULE</h1>

      <div className="word-length-container">
        {[...Array(15)].map((_, index) => (
          <button 
            key={index} 
            className="word-button" 
            onClick={() => updateModule(index + 1)}
          >
            MODULE {index + 1}
          </button>
        ))}
      </div>

      <h1 className="title">CHOOSE DIFFICULTY</h1>

      <div className="difficulty-container">
        {["VERY EASY", "EASY", "NORMAL", "HARD"].map((difficulty, index) => (
          <button 
            key={index} 
            className="difficulty-button"
            onClick={() => updateLevel(index + 1)}
          >
            {difficulty}
          </button>
        ))}
      </div>

      <button className="back-button" onClick={() => navigate("/who-is-playing")}>
        Back
      </button>
    </div>
  );
};

export default LevelSelection;
