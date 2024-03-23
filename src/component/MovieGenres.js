import React, { useState } from 'react';
import Modal from './Modal'; // Ensure you have this component
import './MovieGenres.css';

const MovieGenres = ({ showModal, setShowModal }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);

  const handleSubmit = () => {
    setShowModal(false); // Hide modal on submit
  };

  const handleToggleGenre = (genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleRemoveGenre = (genreToRemove) => {
    setSelectedGenres(prevGenres => prevGenres.filter(genre => genre !== genreToRemove));
  };

  // Placeholder genres list
  const genres = ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Sci-Fi', 'Thriller', 'Documentary'];

  return (
    <>
      {showModal && (
        <Modal
          genres={genres}
          selectedGenres={selectedGenres}
          onToggleGenre={handleToggleGenre}
          onSubmit={handleSubmit}
        />
      )}
      {!showModal && (
        <div>
          <h2>Selected Genres:</h2>
          <div className="selected-genres-container">
            {selectedGenres.map(genre => (
              <label 
                key={genre} 
                className="selected-genre-label"
                onClick={() => handleRemoveGenre(genre)}
              >
                {genre}
                <span className="remove-icon">x</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MovieGenres;
