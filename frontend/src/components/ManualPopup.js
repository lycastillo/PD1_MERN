import React, { useState } from "react";
import manualIcon from './manual.png';
import "./ManualPopup.css";

const ManualPopup = ({ onMinimize, className }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    require("./man1 (1).png"),
    require("./man2 (1).png"),
    require("./man3 (1).png"),
    require("./man4 (1).png"),
    require("./man5 (1).png"),
    require("./man6 (1).png"),
    require("./man7 (1).png"),
    require("./man8 (1).png"),
    require("./man9 (1).png"),
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className={`manual-overlay ${className}`}>
      <button className="manual-exit" onClick={onMinimize}>✕</button>
      <button className="manual-minimize" onClick={onMinimize}>⎯</button>
      <div className="manual-image-container">
        <button className="manual-nav left" onClick={prevSlide}>&lt;</button>
        <img src={slides[currentSlide]} alt={`Slide ${currentSlide + 1}`} />
        <button className="manual-nav right" onClick={nextSlide}>&gt;</button>
      </div>
    </div>
  );
};

export default ManualPopup;
