import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./LevelSelection.css";

const API_BASE_URL = "/api/proxy";


const LevelSelection = () => {
  const navigate = useNavigate();
  const { playerId } = useParams();

  // ✅ Select Module and Update DB
  const handleSelectModule = (moduleNumber) => {
    axios.put(`${API_BASE_URL}/updateModule`, { moduleNumber })
      .then(() => console.log(`✅ Module ${moduleNumber} selected`))
      .catch((err) => console.error("❌ Error updating module:", err));
  };

  // ✅ Select Level and Update DB
  const handleSelectLevel = (levelNumber) => {
    axios.put(`${API_BASE_URL}/updateLevel`, { levelNumber })
      .then(() => console.log(`✅ Level ${levelNumber} selected`))
      .catch((err) => console.error("❌ Error updating level:", err));
  };

  return (
    <div className="level-selection-screen">
      <h1 className="title">CHOOSE MODULE</h1>
      <div className="word-length-container">
        {[...Array(15)].map((_, index) => (
          <button 
            key={index} 
            className="word-button" 
            onClick={() => handleSelectModule(index + 1)}
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
            onClick={() => handleSelectLevel(index + 1)}
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
