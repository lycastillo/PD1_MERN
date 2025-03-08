import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./LevelSelection.css";

const LevelSelection = () => {
  const navigate = useNavigate();
  const { playerId } = useParams();

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
      <h1 className="title">CHOOSE WORD LENGTH</h1>

      <div className="word-length-container">
        <button className="word-button">3 LETTERS</button>
        <button className="word-button">4 LETTERS</button>
        <button className="word-button">5 LETTERS</button>
      </div>

      <h1 className="title">CHOOSE DIFFICULTY</h1>

      <div className="difficulty-container">
        <button className="difficulty-button very-easy">VERY EASY</button>
        <button className="difficulty-button easy">EASY</button>
        <button className="difficulty-button normal">NORMAL</button>
        <button className="difficulty-button hard">HARD</button>
      </div>

      <button className="back-button" onClick={() => navigate("/who-is-playing")}>Back</button>
    </div>
  );
};

export default LevelSelection;
