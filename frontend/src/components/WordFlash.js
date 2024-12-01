// src/components/WordFlash.js

import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import './WordFlash.css';

const WordFlash = ({ mediaList }) => {
    const [mediaIndex, setMediaIndex] = useState(0);
    const [processedImage, setProcessedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [detectedWord, setDetectedWord] = useState('');
    const webcamRef = useRef(null);

    const handleCheckSpelling = async () => {
        try {
            const imageSrc = webcamRef.current.getScreenshot();
            if (!imageSrc) {
                alert('Unable to capture an image. Please try again.');
                return;
            }

            setIsLoading(true);

            const formData = new FormData();
            formData.append('image', dataURItoBlob(imageSrc));

            const response = await fetch('http://localhost:5001/detect', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to process image');
            }

            const detectionData = await response.json();
            setProcessedImage(`data:image/jpeg;base64,${detectionData.processed_image}`);
            setDetectedWord(detectionData.detected_word || 'No word detected');
        } catch (error) {
            console.error('Error during detection:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const dataURItoBlob = (dataURI) => {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    };

    const handleNextWord = () => {
        if (mediaIndex < mediaList.length - 1) {
            setMediaIndex(mediaIndex + 1);
            setProcessedImage(null);
            setDetectedWord('');
        } else {
            alert('You have completed all the words!');
        }
    };

    return (
        <div className="word-flash">
            <div className="layout-container">
                {/* Left: Camera Section */}
                <div className="camera-section">
                    <h3>Camera Feed</h3>
                    <div className="camera-wrapper">
                        <Webcam
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{ width: 300, height: 300 }}
                        />
                    </div>
                    <button onClick={handleCheckSpelling}>Check</button>
                </div>

                {/* Center: Word Image and Progress Bar */}
                <div className="center-section">
                    {mediaList.length > 0 && mediaIndex < mediaList.length && (
                        <>
                            <img
                                src={mediaList[mediaIndex].imagePath}
                                alt={mediaList[mediaIndex].word}
                                className="flash-image"
                            />
                            <audio src={mediaList[mediaIndex].audioPath} autoPlay />
                            <div className="progress-bar-container">
                                <div
                                    className="progress-bar"
                                    style={{ width: `${((mediaIndex + 1) / mediaList.length) * 100}%` }}
                                ></div>
                            </div>
                        </>
                    )}
                </div>

                {/* Right: Processed Image and Detected Word */}
                <div className="detection-section">
                    <h3>Detection Results</h3>
                    <div className="processed-wrapper">
                        {isLoading ? (
                            <div className="loading-spinner">Loading...</div>
                        ) : (
                            processedImage && (
                                <>
                                    <img src={processedImage} alt="Processed" className="processed-image" />
                                    <h4 className="detected-word">Detected Word: {detectedWord}</h4>
                                </>
                            )
                        )}
                    </div>
                    <button onClick={handleNextWord}>Next Word</button>
                </div>
            </div>
        </div>
    );
};

export default WordFlash;
