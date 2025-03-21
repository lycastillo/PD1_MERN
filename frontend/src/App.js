import React, { useState } from "react";
import WelcomeScreen from "./components/WelcomeScreen"; //WelcomeScreen.js
import ModuleSelection from "./components/ModuleSelection"; //ModuleSelection.js
import WordFlash from "./components/WordFlash"; //WordFlash.js
import SpellingPage from "./components/SpellingPage"; //SpellingPage.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WhoIsPlaying from "./components/WhoIsPlaying"; //WhoIsPlaying.js
import ProgressTracker from "./components/ProgressTracker"; //ProgressTracker.js
import HowToPlay from "./components/HowToPlay"; //HowToPlay.js
import LevelSelection from "./components/LevelSelection"; //LevelSelection.js
import './App.css';

function App() {
  const [name, setName] = useState("");
  const [showModuleSelection, setShowModuleSelection] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [isWordFlashCompleted, setIsWordFlashCompleted] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);

  const handleContinue = (enteredName) => {
    setName(enteredName);
    setShowModuleSelection(true);
  };

  const handleModuleSelect = (module) => {
    setSelectedModule(module);
    setIsWordFlashCompleted(false);
  };

  const handleBackToHome = () => {
    setSelectedModule(null);
    setShowModuleSelection(true);
    setIsWordFlashCompleted(false);
  };

  const handleWordFlashComplete = (wordDetails) => {
    setIsWordFlashCompleted(true);
    setSelectedWord(wordDetails);
  };

  return ( //Button redirection
    <Router> 
      <Routes>
      <Route path="/" element={<WelcomeScreen />} />
        <Route path="/who-is-playing" element={<WhoIsPlaying />} />
        <Route path="/select-level" element={<LevelSelection />} />
        <Route path="/progress-tracker" element={<ProgressTracker />} />
        <Route path="/how-to-play" element={<HowToPlay />} /> 
      </Routes>

      <div className="App">
        {isWordFlashCompleted ? (
          <SpellingPage
            word={selectedWord.word}
            audioPath={selectedWord.audioPath}
            imagePath={selectedWord.imagePath}
          />
        ) : selectedModule ? (
          <WordFlash
            module={selectedModule}
            onBackToHome={handleBackToHome}
            onComplete={handleWordFlashComplete}
          />
        ) : showModuleSelection ? (
          <ModuleSelection name={name} onSelectModule={handleModuleSelect} />
        ) : null}
      </div>
    </Router>
  );
}

export default App;
