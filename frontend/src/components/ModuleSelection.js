import React, { useEffect, useState } from 'react';
import WordFlash from './WordFlash';
import './ModuleSelection.css';

const ModuleSelection = () => {
    const [loading, setLoading] = useState(true); // Controls the loading screen
    const [mediaList, setMediaList] = useState([]); // Stores the list of words
    const [error, setError] = useState(null); // Error handling state

    useEffect(() => {
        const fetchAllWords = async () => {
            try {
                console.log("Fetching all words...");
                const response = await fetch('http://localhost:5000/api/words/all');
                if (!response.ok) {
                    throw new Error(`Failed to fetch words: ${response.statusText}`);
                }
                const data = await response.json();
                console.log("Fetched words:", data); // Log the fetched data
                if (!data || data.length === 0) {
                    throw new Error("No words found in the database.");
                }

                // Map the data for frontend use
                setMediaList(
                    data.map(word => ({
                        word: word.word,
                        imagePath: word.imagePath,
                        audioPath: word.audioPath
                    }))
                );

                // Ensure loading page is shown for at least 2 seconds
                setTimeout(() => {
                    setLoading(false); // Transition away from loading state
                }, 2000); // 2-second delay
            } catch (err) {
                console.error("Error fetching words:", err);
                setError(err.message);
                setLoading(false); // Allow error to display
            }
        };

        fetchAllWords();
    }, []);

    if (loading) {
        // Display loading bar while fetching words
        return (
            <div className="module-selection">
                <h1>Loading Words...</h1>
                <div className="loading-bar"></div>
            </div>
        );
    }

    if (error) {
        // Display error message if something goes wrong
        return (
            <div className="module-selection">
                <h1>Error Loading Words</h1>
                <p>{error}</p>
            </div>
        );
    }

    // Render the WordFlash component after loading
    return <WordFlash mediaList={mediaList} />;
};

export default ModuleSelection;
