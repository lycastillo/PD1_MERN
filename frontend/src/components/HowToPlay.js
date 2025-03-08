import React from "react";
import { useNavigate } from "react-router-dom";
import "./HowToPlay.css";

const HowToPlay = () => {
  const navigate = useNavigate();

  return (
    <div className="how-to-play-screen">
      {/* Background Watermark */}
      <img src={`${process.env.PUBLIC_URL}/new1.png`} alt="Watermark" className="background-watermark" />

      {/* Top-left Logo */}
      <img src={`${process.env.PUBLIC_URL}/new3.png`} alt="Logo" className="top-left-logo" />

      {/* Back Button */}
      <button className="back-button" onClick={() => navigate("/")}>Back</button>

      {/* Title */}
      <h1 className="title">HOW TO PLAY</h1>

      {/* Steps */}
      <div className="steps-container">
        <div className="step-box">Step 1</div>
        <div className="step-box">Step 2</div>
        <div className="step-box">Step 3</div>
        <div className="step-box">Step 4</div>
      </div>

      {/* Play Button */}
      <button className="play-button" onClick={() => navigate("/who-is-playing")}>Play</button>
    </div>
  );
};

export default HowToPlay;
