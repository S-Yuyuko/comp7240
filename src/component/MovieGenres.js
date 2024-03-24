import React, { useState, useEffect } from 'react';
import Modal from './Modal'; // Ensure you have this component
import './css/MovieGenres.css';

const MovieGenres = ({ showModal, setShowModal }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch('http://localhost:5000/get-genres')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        return response.json();
      })
      .then(data => {
        setGenres(data.genres);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching genres:', error);
        setError(error.toString());
        setIsLoading(false);
      });
  }, []);

  const handleToggleGenre = (genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleSubmit = () => {
    // Process the selected genres as needed
    console.log('Selected Genres:', selectedGenres);
    setShowModal(false);
  };

  if (isLoading) return <div>Loading genres...</div>;
  if (error) return <div>Error loading genres: {error}</div>;

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
      <div className="genre-display-container">
        <h2>Selected Genres:</h2>
        {!showModal && (
          <div className="selected-genres-container">
            {selectedGenres.map(genre => (
              <label 
                key={genre} 
                className="selected-genre-label"
                onClick={() => handleToggleGenre(genre)} // For removing a genre on click, you might adjust this logic
              >
                {genre}
                <span className="remove-icon">x</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </>
  );
};


export default MovieGenres;
