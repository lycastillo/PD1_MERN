import React, { useEffect, useState } from 'react';
import WordFlash from './WordFlash';
import './ModuleSelection.css';

const ModuleSelection = () => {
    const [loading, setLoading] = useState(true); 
    const [mediaList, setMediaList] = useState([]); 
    const [error, setError] = useState(null); 

    useEffect(() => {
        const fetchAllWords = async () => {
            try {
                console.log("Fetching words...");
                const response = await fetch('http://localhost:5000/api/words/all');
                if (!response.ok) {
                    throw new Error(`Failed to fetch words: ${response.statusText}`);
                }
                const data = await response.json();
                console.log("Fetched words:", data); 
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

                
                setTimeout(() => {
                    setLoading(false); 
                }, 2000); 
            } catch (err) {
                console.error("Error fetching words:", err);
                setError(err.message);
                setLoading(false); 
            }
        };

        fetchAllWords();
    }, []);

    if (loading) {
        
        return (
            <div className="module-selection">
                <h1>Loading Words...</h1>
                <div className="loading-bar"></div>
            </div>
        );
    }

    if (error) {
        
        return (
            <div className="module-selection">
                <h1>Error Loading Words</h1>
                <p>{error}</p>
            </div>
        );
    }

    
    return <WordFlash mediaList={mediaList} />;
};

export default ModuleSelection;
