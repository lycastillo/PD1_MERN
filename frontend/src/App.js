import React, { useState } from "react";
import WelcomeScreen from "./components/WelcomeScreen"; 
import ModuleSelection from "./components/ModuleSelection"; 
import WordFlash from "./components/WordFlash"; 
import SpellingPage from "./components/SpellingPage"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WhoIsPlaying from "./components/WhoIsPlaying"; 
import ProgressTracker from "./components/ProgressTracker"; 
import HowToPlay from "./components/HowToPlay"; 
import LevelSelection from "./components/LevelSelection"; 
import WaitingPage from "./components/WaitingPage";
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

  return ( 
    <Router> 
      <Routes>
      <Route path="/" element={<WelcomeScreen />} />
        <Route path="/who-is-playing" element={<WhoIsPlaying />} />
        <Route path="/select-level" element={<LevelSelection />} />
        <Route path="/progress-tracker" element={<ProgressTracker />} />
        <Route path="/how-to-play" element={<HowToPlay />} /> 
        <Route path="/waiting-page" element={<WaitingPage />} />

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
