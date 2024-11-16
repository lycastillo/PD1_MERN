
import React, { useState } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import ModuleSelection from "./components/ModuleSelection";
import WordFlash from "./components/WordFlash";
import './App.css';

function App() {
  const [name, setName] = useState("");
  const [showModuleSelection, setShowModuleSelection] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  const handleContinue = (enteredName) => {
    setName(enteredName);
    setShowModuleSelection(true);
  };

  const handleModuleSelect = (module) => {
    setSelectedModule(module);
  };

  const handleBackToHome = () => {
    setSelectedModule(null);
    setShowModuleSelection(true);
  };

  return (
    <div className="App">
      {selectedModule ? (
        <WordFlash module={selectedModule} onBackToHome={handleBackToHome} />
      ) : showModuleSelection ? (
        <ModuleSelection name={name} onSelectModule={handleModuleSelect} />
      ) : (
        <WelcomeScreen onContinue={handleContinue} />
      )}
    </div>
  );
}

export default App;
