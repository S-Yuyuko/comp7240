import React, { useState } from 'react';
import './css/MovieSideBar.css'; // Ensure the CSS file is correctly linked

const MovieSideBar = ({ likedMovies, onRemove, onScoreChange, onFetchRecommendations, toggleDialog }) => {
  const [historySubmit, setHistorySubmit] = useState([]);
  const [submitCount, setSubmitCount] = useState(0);

  
  const StarRating = ({ movie }) => {
    // Handles clicking on a star
    const handleStarClick = (score) => {
      onScoreChange(movie.Title, score);
    };
  
    return (
      <div className="star-rating">
        {[...Array(10)].map((_, index) => {
          const ratingValue = index + 1; // Each star represents 1 point
          return (
            <span key={index}
                  className="star"
                  onClick={() => handleStarClick(ratingValue)}
                  style={{ cursor: 'pointer', color: ratingValue <= (movie.Score || 0) ? '#ffc107' : '#e4e5e9', fontSize: '24px' }}>
              ★
            </span>
          );
        })}
      </div>
    );
  };
  
  const handleSubmit = () => {
    recommendedMoviesFromLikedMovies(likedMovies);
    setHistorySubmit(prevHistory => ({
      ...prevHistory,
      [submitCount]: likedMovies
    }));
    
    // Increment the submission counter
    setSubmitCount(prevCount => prevCount + 1);
  };

  const recommendedMoviesFromLikedMovies = (likedMovies) => {
    fetch('http://localhost:4000/recommendations-from-liked', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ likedMovies: likedMovies,  historySubmit: historySubmit}),
    })
    .then(response => response.json())
    .then(data => {
      // Assuming 'data' is the list of recommended movies
      console.log(data);
      onFetchRecommendations(data);
      toggleDialog(true);
    })
    .catch(error => {
      console.error('Error:', error);
      toggleDialog(false); // Ensure dialog is closed on error
    });
  };
  
  return (
    <>
      <aside className="sidebar">
        <h2>Liked Movies</h2>
        <div className="liked-movies-list">
          {likedMovies.map((movie, index) => (
            <div key={index} className="liked-movie">
              <img src={movie.Poster_Url} alt={movie.Title} className="liked-movie-poster" />
              <div className="liked-movie-info">
                <p className="liked-movie-title">{movie.Title}</p>
                <StarRating movie={movie} />
                <button className="remove-movie" onClick={() => onRemove(movie)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      </aside>
      <button className="submit-button" onClick={handleSubmit} >Submit</button>
    </>
  );
};
export default MovieSideBar;
