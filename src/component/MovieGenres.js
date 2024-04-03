import React, { useState, useEffect, useCallback } from 'react';
import Modal from './Modal'; // Ensure you have this component
import './css/MovieGenres.css';

const MovieGenres = ({ showModal, setShowModal, onGenreSubmission, onRecommendedMovies }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch('http://localhost:4000/get-genres')
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch');
        return response.json();
      })
      .then(data => {
        setGenres(Array.isArray(data) ? data : data.genres || []);
        setIsLoading(false);
      })
      .catch(error => {
        setError(error.toString());
        setIsLoading(false);
      });
  }, []);

  // Debounce fetchRecommendedMovies
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (selectedGenres.length >= 0) {
        fetch('http://localhost:4000/get-recommended-movies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ genres: selectedGenres }),
        })
        .then(response => response.json())
        .then(data => onRecommendedMovies(data))
        .catch(error => console.error('Error fetching recommended movies:', error));
      }
    }, 1000);

    return () => clearTimeout(timerId); // Cleanup on effect re-run or component unmount
  }, [selectedGenres, onRecommendedMovies]);

  const handleToggleGenre = useCallback((genre) => {
    setSelectedGenres(prev => prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]);
  }, []);

  const handleSubmit = () => {
    // Process the selected genres as needed
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
          onGenreSubmission={onGenreSubmission}
        />
      )}
      <div className="genre-display-container">
        <h2>Selected Genres:</h2>
        {!showModal && (
          <div className="selected-genres-container">
            {selectedGenres.map(genre => (
              <div 
                key={genre} 
                className="selected-genre-label"
                onClick={() => handleToggleGenre(genre)}
              >
                {genre}
                <span className="remove-icon">x</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MovieGenres;
