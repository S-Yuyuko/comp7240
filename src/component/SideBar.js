import React from 'react';
import './css/SideBar.css'; // Ensure the CSS file is correctly linked

const SideBar = ({ likedMovies, onRemove, onScoreChange }) => {
  const StarRating = ({ movie, onRating }) => {
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

  return (
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
  );
};
export default SideBar;
