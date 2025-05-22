import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./LevelSelection.css";

const API_BASE_URL = "http://localhost:5000/api";

const LevelSelection = () => {
  const navigate = useNavigate();
  const { playerId } = useParams();

  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [modulesDisabled, setModulesDisabled] = useState(false);
  const [levelsDisabled, setLevelsDisabled] = useState(false);

  const handleSelectModule = (moduleNumber) => {
    if (modulesDisabled) return;
    setSelectedModule(moduleNumber);
    setModulesDisabled(true);
    axios
      .put(`${API_BASE_URL}/updateModule`, { moduleNumber })
      .then(() => console.log(`✅ Module ${moduleNumber} selected`))
      .catch((err) => console.error("❌ Error updating module:", err));
  };

  const handleSelectLevel = (levelNumber) => {
    if (levelsDisabled) return;
    setSelectedLevel(levelNumber);
    setLevelsDisabled(true);
    axios
      .put(`${API_BASE_URL}/updateLevel`, { levelNumber })
      .then(() => {
        console.log(`✅ Level ${levelNumber} selected`);
        setTimeout(() => {
          navigate("/waiting-page");
        }, 500);
      })
      .catch((err) => console.error("❌ Error updating level:", err));
  };

  return (
    <div
      className="level-selection-screen"
      style={{
        backgroundImage: `url(${require("./game-UI.png")})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <h1 className="title">CHOOSE MODULE</h1>
      <div className="word-length-container">
        {[
          "2 Letter Words",
          "CVC Words",
          "VCV Words",
          "VCC Words",
          "3 Letter Words",
          "CVVC Words",
          "CVCC Words",
          "4 Letter Words",
          "5 Letter Words",
          "Colors",
          "Numbers",
          "Animals",
          "Food",
          "Body Parts",
        ].map((label, index) => {
          const number = index + 1;
          const isSelected = selectedModule === number;

          return (
            <button
              key={index}
              className={`word-button ${isSelected ? "selected" : ""}`}
              onClick={() => handleSelectModule(number)}
              disabled={modulesDisabled}
            >
              {label}
            </button>
          );
        })}
      </div>

      <h1 className="title">CHOOSE DIFFICULTY</h1>
      <div className="difficulty-container">
        {["VERY EASY", "EASY", "NORMAL", "HARD"].map((difficulty, index) => {
          const number = index + 1;
          const isSelected = selectedLevel === number;

          return (
            <button
              key={index}
              className={`difficulty-button ${isSelected ? "selected" : ""}`}
              onClick={() => handleSelectLevel(number)}
              disabled={levelsDisabled}
            >
              {difficulty}
            </button>
          );
        })}
      </div>

      <button className="back-button" onClick={() => navigate("/who-is-playing")} disabled={modulesDisabled || levelsDisabled}>
        Back
      </button>
    </div>
  );
};

export default LevelSelection;
