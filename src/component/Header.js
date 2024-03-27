import React, { useState } from 'react';
import MovieGenres from './MovieGenres';
import './css/Header.css'; // Ensure this path matches your project structure

const Header = ({ onGenresSelected }) => {
  const [showModal, setShowModal] = useState(true);

  return (
    <header className="App-header">
      <div className="header-content">
        <h1>Your App Name</h1>
        <button onClick={() => setShowModal(true)} className="genre-select-button">
          Select Genres
        </button>
      </div>
      <MovieGenres 
        showModal={showModal}
        setShowModal={setShowModal}
        onGenresSelected={onGenresSelected}
      />
    </header>
  );
};

export default Header;
