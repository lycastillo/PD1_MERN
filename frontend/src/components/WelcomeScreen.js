
import React, { useState } from 'react';
import './WelcomeScreen.css';

const WelcomeScreen = ({ onContinue }) => {
  const [name, setName] = useState('');

  const handleChange = (event) => {
    setName(event.target.value);
  };

  const handleContinue = () => {
    onContinue(name); 
  };

  return (
    <div
      className="welcome-screen"
      style={{
        backgroundImage: `url('/bg.jpg')`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
      }}
    >
      <h1>Welcome Learner!</h1>
      <div className="name-input-container">
        <label htmlFor="name">What is your name?</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={handleChange}
          placeholder="Enter your name"
        />
      </div>
      <button onClick={handleContinue}>Continue</button>
    </div>
  );
};

export default WelcomeScreen;
