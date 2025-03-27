import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./WaitingPage.css";

const API_BASE_URL = "http://localhost:5000/api";

const WaitingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedPlayer, selectedModule, selectedLevel } = location.state || {};

  const [score, setScore] = useState(null);
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    let initialScore = null;
    axios.get(`${API_BASE_URL}/getScore`)
      .then((res) => {
        initialScore = res.data.Score;
      })
      .catch((err) => {
        console.error("Initial score fetch error:", err);
      });

    const pollScore = setInterval(() => {
      axios
        .get(`${API_BASE_URL}/getScore`)
        .then((res) => {
          const { Score } = res.data;
          if (
            Score !== null &&
            Score !== undefined &&
            Score !== initialScore
          ) {
            clearInterval(pollScore);
            setScore(Score);
            setShowScore(true);

            setTimeout(() => {
              navigate("/progress-tracker", {
                state: {
                  autoSelectPlayer: selectedPlayer,
                },
              });
            }, 4000);
          }
        })
        .catch((err) => {
          console.error("Polling error:", err);
        });
    }, 1000);

    return () => clearInterval(pollScore);
  }, [navigate, selectedPlayer]);

  return (
    <div
      className="waiting-screen"
      style={{
        backgroundImage: `url(${require("./game-UI.png")})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {[...Array(10)].map((_, index) => (
        <img
          key={index}
          src={require("./balloon.png")}
          alt="balloon"
          className="floating-balloon"
          style={{
            left: `${Math.random() * 90}%`,
            animationDuration: `${5 + Math.random() * 4}s`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}

      {showScore && (
        <div className="score-balloon-container">
          <img
            src={require("./special.png")}
            alt="score-balloon"
            className="score-balloon"
          />
          <div className="score-text">{score}</div>
        </div>
      )}
    </div>
  );
};

export default WaitingPage;
