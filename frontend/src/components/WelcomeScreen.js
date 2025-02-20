import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomeScreen.css";

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const [showWipe, setShowWipe] = useState(false);

  const handlePlayNow = () => {
    setShowWipe(true); // Start transition
    setTimeout(() => {
      navigate("/who-is-playing"); // Navigate after animation
    }, 400); // Match animation duration (0.4s)
  };

  return (
    <div
      className="welcome-screen"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + "/game-UI.png"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100vw",
      }}
    >
      {/* Wipe Transition */}
      {showWipe && <div className="wipe-transition"></div>}

      {/* Main Content */}
      <div className="image-container">
        <img src="/new1.png" alt="Welcome Character" className="main-image" />
      </div>

      <div className="menu-container">
        <button className="menu-button play-now" onClick={handlePlayNow}>
          <img src="/new2.png" alt="Play Now" />
          <span>PLAY NOW</span>
        </button>

        <button className="menu-button how-to-play">
          <img src="/new3.png" alt="How to Play" />
          <span>HOW TO PLAY</span>
        </button>

        <button className="menu-button settings">
          <img src="/new4.png" alt="Settings" />
          <span>SETTINGS</span>
        </button>

        <button className="menu-button progress-tracker">
          <img src="/new5.png" alt="Progress Tracker" />
          <span>PROGRESS TRACKER</span>
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
