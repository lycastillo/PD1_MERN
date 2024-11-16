import React, { useEffect, useState } from 'react';
import './WordFlash.css';

const WordFlash = ({ module, onBackToHome }) => {
  const [mediaList, setMediaList] = useState([]); // State to hold the fetched data
  const [mediaIndex, setMediaIndex] = useState(0); // State to track the current word index
  const [progress, setProgress] = useState(0); // State for the progress bar
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    // Fetch words from the backend
    const fetchWords = async () => {
      try {
        console.log(`Fetching words for module: ${module}`);
        const response = await fetch(`http://localhost:5000/api/words/${module}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Fetched data:', data);

        if (data.length === 0) {
          setError('No words found for this module.');
        } else {
          setMediaList(data);
        }
      } catch (error) {
        console.error('Error fetching words:', error);
        setError('Failed to load words. Please try again.');
      }
    };

    fetchWords();
  }, [module]);

  useEffect(() => {
    // Display the next word every 5 seconds
    if (mediaList.length > 0 && mediaIndex < mediaList.length) {
      const currentMedia = mediaList[mediaIndex];
      const audio = new Audio(currentMedia.audioPath);
      audio.play();

      const interval = setInterval(() => {
        setMediaIndex((prevIndex) => prevIndex + 1);
        setProgress(((mediaIndex + 1) / mediaList.length) * 100);
      }, 5000);

      return () => {
        clearInterval(interval);
        audio.pause();
      };
    }
  }, [mediaIndex, mediaList]);

  return (
    <div
      className="word-flash"
      style={{
        backgroundImage: `url('/spelling.png')`, // Change this path if needed
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {error ? (
        <h2 style={{ color: 'red' }}>{error}</h2> // Display error message
      ) : mediaList.length > 0 && mediaIndex < mediaList.length ? (
        <>
          <img
            src={mediaList[mediaIndex].imagePath}
            alt={mediaList[mediaIndex].word}
            className="flash-image"
            style={{
              maxWidth: '60%',
              maxHeight: '60%',
              marginBottom: '20px',
            }}
          />
          <div className="progress-bar-container" style={{ width: '80%', height: '10px', backgroundColor: '#ddd' }}>
            <div
              className="progress-bar"
              style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: '#76c7c0',
              }}
            ></div>
          </div>
        </>
      ) : (
        <h2>Loading words...</h2> // Loading state
      )}
      <button
        onClick={onBackToHome}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#76c7c0',
          border: 'none',
          borderRadius: '5px',
          color: 'white',
          cursor: 'pointer',
        }}
      >
        Back to Home
      </button>
    </div>
  );
};

export default WordFlash;
