import React from 'react';
import './css/SideBarofMoviesLiked.css'; // Ensure the CSS file is correctly linked

const SideBarofMoviesLiked = ({ likedMovies, onRemove }) => {
  return (
    <aside className="sidebar">
      <h2>Liked Movies</h2>
      <div className="liked-movies-list">
        {likedMovies.map((movie, index) => (
          <div key={index} className="liked-movie">
            <div className="liked-movie-info">
              <p className="liked-movie-title">{movie.Title}</p>
              <button className="remove-movie" onClick={() => onRemove(movie)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SideBarofMoviesLiked;


