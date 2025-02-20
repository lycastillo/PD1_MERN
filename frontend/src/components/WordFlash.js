import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import './WordFlash.css';

const WordFlash = ({ mediaList }) => {
    const [mediaIndex, setMediaIndex] = useState(0);
    const [processedImage, setProcessedImage] = useState(null);
    const [detectedWord, setDetectedWord] = useState('');
    const [feedback, setFeedback] = useState('');
    const [selectedWords, setSelectedWords] = useState([]);
    const [score, setScore] = useState(0);
    const [incorrectWords, setIncorrectWords] = useState([]);
    const [isRoundOver, setIsRoundOver] = useState(false); // Track if round is over
    const webcamRef = useRef(null);

    // Randomly select 5 words
    useEffect(() => {
        const shuffled = [...mediaList].sort(() => 0.5 - Math.random());
        setSelectedWords(shuffled.slice(0, 5));
    }, [mediaList]);

    const handleCheckSpelling = async () => {
        const currentWord = selectedWords[mediaIndex]?.word.toLowerCase();
        const imageSrc = webcamRef.current.getScreenshot();

        if (!imageSrc) {
            alert('Unable to capture an image. Please try again.');
            return;
        }

        try {
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
            const detected = detectionData.detected_word || 'No word detected';
            setDetectedWord(detected);

            if (detected.toLowerCase() === currentWord) {
                setScore((prev) => prev + 1);
                setFeedback('Correct!');
            } else {
                setFeedback(`Wrong. Detected: "${detected}". Correct spelling is: "${currentWord}".`);
                setIncorrectWords((prev) => [...prev, selectedWords[mediaIndex]]);
            }
        } catch (error) {
            console.error('Error during detection:', error);
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
        if (mediaIndex < selectedWords.length - 1) {
            // Move to the next word
            setMediaIndex(mediaIndex + 1);
            setProcessedImage(null);
            setDetectedWord('');
            setFeedback('');
        } else {
            // End the round
            setIsRoundOver(true);
        }
    };

    return (
        <div className="word-flash">
            {/* Camera Section */}
            {!isRoundOver && (
                <div className="camera-section">
                    <Webcam
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ width: 300, height: 300 }}
                    />
                    <button onClick={handleCheckSpelling} className="check-button">
                        Check
                    </button>
                </div>
            )}

            {/* Flashing Word Section */}
            {!isRoundOver && (
                <div className="word-section">
                    <img
                        src={selectedWords[mediaIndex]?.imagePath}
                        alt={selectedWords[mediaIndex]?.word}
                        className="word-image"
                    />
                    <audio src={selectedWords[mediaIndex]?.audioPath} autoPlay />
                    <div className="progress-bar-container">
                        <div
                            className="progress-bar"
                            style={{
                                width: `${((mediaIndex + 1) / selectedWords.length) * 100}%`,
                            }}
                        ></div>
                    </div>
                    <button onClick={handleNextWord} className="next-button">
                        {mediaIndex < selectedWords.length - 1 ? 'Next Word' : 'End Round'}
                    </button>
                    <h2 className="feedback-text">{feedback || 'Detected Word: ' + detectedWord}</h2>
                </div>
            )}

            {/* Score Section */}
            {isRoundOver && (
                <div className="score-section">
                    <h2>Round Complete!</h2>
                    <p>Your Score: {score}/{selectedWords.length}</p>
                    {incorrectWords.length > 0 ? (
                        <button onClick={() => window.location.reload()}>Retry Mistakes</button>
                    ) : (
                        <button onClick={() => window.location.reload()}>Restart</button>
                    )}
                </div>
            )}

            {/* Processed Image Section */}
            {!isRoundOver && processedImage && (
                <div className="processed-section">
                    <h3>Processed Image</h3>
                    <img src={processedImage} alt="Processed" className="processed-image" />
                </div>
            )}
        </div>
    );
};

export default WordFlash;
