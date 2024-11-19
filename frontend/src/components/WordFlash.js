import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import "./WordFlash.css";

const WordFlash = ({ module, onBackToHome }) => {
  const [mediaList, setMediaList] = useState([]);
  const [mediaIndex, setMediaIndex] = useState(0);
  const [processedImage, setProcessedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [detectedWord, setDetectedWord] = useState("");
  const webcamRef = useRef(null);

  useEffect(() => {
    const fetchWords = async () => {
      const response = await fetch(`http://localhost:5000/api/words/${module}`);
      const data = await response.json();
      setMediaList(data);
    };

    fetchWords();
  }, [module]);

  const handleCheckSpelling = async () => {
    try {
      const imageSrc = webcamRef.current.getScreenshot();
      setIsLoading(true);

      const formData = new FormData();
      formData.append("image", dataURItoBlob(imageSrc));

      const response = await fetch("http://localhost:5001/detect", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process image");
      }

      const detectionData = await response.json();
      setProcessedImage(`data:image/jpeg;base64,${detectionData.processed_image}`);
      setDetectedWord(detectionData.detected_word || "");
    } catch (error) {
      console.error("Error during detection:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div className="word-flash">
      <div className="layout-container">
        <div className="camera-section">
          <h3>Camera Feed</h3>
          <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
          <button onClick={handleCheckSpelling}>Check</button>
        </div>

        <div className="center-section">
          {mediaList.length > 0 && mediaIndex < mediaList.length && (
            <img
              src={mediaList[mediaIndex].imagePath}
              alt={mediaList[mediaIndex].word}
              className="center-image"
            />
          )}
        </div>

        <div className="detection-section">
          <h3>Detection Results</h3>
          {isLoading ? (
            <div className="loading-spinner">Loading...</div>
          ) : (
            <>
              <img
                src={processedImage}
                alt="Processed"
                className="processed-image"
              />
              <h4>Detected Word: {detectedWord}</h4>
            </>
          )}
        </div>
      </div>
      <button onClick={onBackToHome}>Back to Home</button>
    </div>
  );
};

export default WordFlash;
