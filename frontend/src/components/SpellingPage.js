import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./SpellingPage.css";

const SpellingPage = ({ word, audioPath, imagePath }) => {
  const [detections, setDetections] = useState([]);
  const [detectedWord, setDetectedWord] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    // Connect to YOLO WebSocket server
    const socket = io("http://localhost:5001");

    socket.on("connect", () => {
      console.log("Connected to detection server");
    });

    socket.on("detection", (data) => {
      setDetections(data);
      console.log("Detections received:", data);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from detection server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const startCamera = async () => {
      const video = document.getElementById("camera-feed");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    startCamera();
  }, []);

  const handleCheck = () => {
    if (detections.length > 0) {
      const detectedWord = detections.map(det => det.text).join("").toLowerCase();
      setDetectedWord(detectedWord);

      if (detectedWord === word.toLowerCase()) {
        setIsCorrect(true);
      } else {
        setIsCorrect(false);
      }
    } else {
      setDetectedWord("");
      setIsCorrect(false);
    }
  };

  return (
    <div className="spelling-page">
      <div className="content">
        <img src={imagePath} alt={word} className="flash-image" />
        <audio src={audioPath} autoPlay />
        <div className="progress-bar-container">
          <div className="progress-bar"></div>
        </div>
        <button onClick={handleCheck} className="check-button">Check</button>
        <div className="result">
          <h3>Detected Word: {detectedWord || "None"}</h3>
          {isCorrect === null ? (
            <p>Press "Check" to verify.</p>
          ) : isCorrect ? (
            <p className="correct">Correct!</p>
          ) : (
            <p className="incorrect">Incorrect!</p>
          )}
        </div>
      </div>
      <div className="camera-feed">
        <h2>Live Feed</h2>
        <video id="camera-feed" autoPlay muted></video>
      </div>
    </div>
  );
};

export default SpellingPage;
