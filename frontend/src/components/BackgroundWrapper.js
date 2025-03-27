// src/components/BackgroundWrapper.js
import React from "react";
import "./BackgroundWrapper.css";

const BackgroundWrapper = ({ children }) => {
  return (
    <div
      className="background-wrapper"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + "/game-UI.png"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
};

export default BackgroundWrapper;
