import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomeScreen.css";

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const [showWipe, setShowWipe] = useState(false);
  const [wipeTarget, setWipeTarget] = useState(""); 

  const handleNavigation = (path) => {
    setShowWipe(true); 
    setWipeTarget(path); 
    setTimeout(() => {
      navigate(path); 
    }, 400); 
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
      {showWipe && <div className={`wipe-transition ${wipeTarget === "/progress-tracker" ? "orange-wipe" : "yellow-wipe"}`}></div>}
      <div className="image-container">
        <img src="/new1.png" alt="Welcome Character" className="main-image" />
      </div>

      <div className="menu-container">
        <button className="menu-button play-now" onClick={() => handleNavigation("/who-is-playing")}>
          <img src="/new2.png" alt="Play Now" />
          <span>PLAY NOW</span>
        </button>

        <button className="menu-button how-to-play" onClick={() => handleNavigation("/how-to-play")}>
  <img src="/new3.png" alt="How to Play" />
  <span>HOW TO PLAY</span>
</button>

<button
    className="menu-button progress-tracker full-width"
    onClick={() => handleNavigation("/progress-tracker")}
  >
    <img src="/new5.png" alt="Progress Tracker" />
    <span>PROGRESS TRACKER</span>
  </button>
</div>
    </div>
  );
};

export default WelcomeScreen;
