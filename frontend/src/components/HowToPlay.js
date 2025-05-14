import React from "react";
import { useNavigate } from "react-router-dom";
import "./HowToPlay.css";

const HowToPlay = () => {
  const navigate = useNavigate();

  return (
    <div className="how-to-play-screen">
      <img src={`${process.env.PUBLIC_URL}/new1.png`} alt="Watermark" className="background-watermark" />
      <img src={`${process.env.PUBLIC_URL}/new3.png`} alt="Logo" className="top-left-logo" />
      <button className="back-button" onClick={() => navigate("/")}>Back</button>
      <h1 className="title">HOW TO PLAY</h1>
      <div className="steps-container">
        <div className="step-box">Pick your name, module, and level, then press Start</div>
        <div className="step-box">Listen and watch the word carefully — you can press the repeat button if you didn’t catch it.
        </div>
        <div className="step-box">Place the alphabet blocks to spell the word.
        </div>
        <div className="step-box">You’ll get 3 tries per word, and after 10 words, your score will show up on the screen!</div>
      </div>
      <button className="play-button" onClick={() => navigate("/who-is-playing")}>Play</button>
    </div>
  );
};

export default HowToPlay;
