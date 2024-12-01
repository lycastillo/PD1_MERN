import React, { useEffect, useState } from 'react';
import WordFlash from './WordFlash';
import './ModuleSelection.css';

const ModuleSelection = () => {
    const [loading, setLoading] = useState(true);
    const [modulesLoaded, setModulesLoaded] = useState(false);
    const [mediaList, setMediaList] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllWords = async () => {
            try {
                console.log("Fetching all words...");
                const response = await fetch('http://localhost:5000/api/words/all'); // Update endpoint
                if (!response.ok) {
                    throw new Error(`Failed to fetch words: ${response.statusText}`);
                }
                const data = await response.json();
                console.log("Fetched words:", data); // Log response
                if (!data || data.length === 0) {
                    throw new Error("No words found in the database.");
                }
                setMediaList(
                    data.map(word => ({
                        word: word.word,
                        imagePath: word.imagePath,
                        audioPath: word.audioPath
                    }))
                );
                setModulesLoaded(true);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching words:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchAllWords();
    }, []);

    if (error) {
        return (
            <div className="module-selection">
                <h1>Error Loading Words</h1>
                <p>{error}</p>
            </div>
        );
    }

    if (modulesLoaded) {
        return <WordFlash mediaList={mediaList} />;
    }

    return (
        <div className="module-selection">
            {loading ? (
                <div>
                    <h1>Loading Words...</h1>
                    <div className="loading-bar"></div>
                </div>
            ) : (
                <div>
                    <h1>All Words Loaded!</h1>
                </div>
            )}
        </div>
    );
};

export default ModuleSelection;
