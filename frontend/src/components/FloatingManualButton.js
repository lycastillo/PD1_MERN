import React from "react";
import "./FloatingManualButton.css";


const FloatingManualButton = ({ onClick }) => {
  return (
    <img
      src="/manual.png"
      alt="manual"
      className="floating-manual-btn"
      onClick={onClick}
    />
  );
};

export default FloatingManualButton;
