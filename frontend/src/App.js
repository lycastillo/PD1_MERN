import React, { useState } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import ModuleSelection from "./components/ModuleSelection";
import WordFlash from "./components/WordFlash";
import SpellingPage from "./components/SpellingPage"; // Import the SpellingPage component
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
    setIsWordFlashCompleted(false); // Reset WordFlash completion status
  };

  const handleBackToHome = () => {
    setSelectedModule(null);
    setShowModuleSelection(true);
    setIsWordFlashCompleted(false);
  };

  const handleWordFlashComplete = (wordDetails) => {
    setIsWordFlashCompleted(true);
    setSelectedWord(wordDetails); // Store the word details (word, audioPath, imagePath)
  };

  return (
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
          onComplete={handleWordFlashComplete} // Pass a callback to handle completion
        />
      ) : showModuleSelection ? (
        <ModuleSelection name={name} onSelectModule={handleModuleSelect} />
      ) : (
        <WelcomeScreen onContinue={handleContinue} />
      )}
    </div>
  );
}

export default App;
