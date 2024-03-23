import React, { useState } from 'react';
import './App.css';
import MovieGenres from './MovieGenres';

function App() {
  const [showModal, setShowModal] = useState(true);

  return (
    <div className="App">
      <div className="menu">
        <button onClick={() => setShowModal(true)}>Select Genres</button>
      </div>
      <header className="App-content">
        <h1>Welcome to CineMatch</h1>
        <p>Select your preferred movie genre to get started.</p>
      </header>
      <MovieGenres showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
}

export default App;
