import React, { useState, useEffect, useRef } from 'react';
import './css/MovieDetails.css';

const MovieDetails = ({ recommendedMovies, setLoading, onLike }) => {
  const [displayedMovies, setDisplayedMovies] = useState([]);
  const [displayCount, setDisplayCount] = useState(10); // Assuming you want to start by displaying 10 movies
  const loaderRef = useRef();

  useEffect(() => {
    setLoading(true);
    // Handle both object with a movies array and direct array
    const moviesToDisplay = Array.isArray(recommendedMovies) ? recommendedMovies : recommendedMovies.movies || [];
    setDisplayedMovies(moviesToDisplay.slice(0, displayCount));
    setLoading(false);
  }, [recommendedMovies, setLoading, displayCount]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setDisplayCount(prevDisplayCount => prevDisplayCount + 10); // Load more movies as you scroll
      }
    }, { threshold: 1.0 });

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer && observer.disconnect();
  }, []);

  return (
    <div className="movie-container">
      {displayedMovies.map((movie, index) => (
        <div key={index} className="movie-card">
          <img src={movie.Poster_Url} alt={movie.Title} className="movie-poster" />
          <div className="movie-info">
            <h3 className="movie-title">{movie.Title}</h3>
            <p><strong>Release Date:</strong> {movie.Release_Date}</p>
            <p><strong>Popularity:</strong> {movie.Popularity}</p>
            <p><strong>Vote Count:</strong> {movie.Vote_Count}</p>
            <button onClick={() => onLike(movie)} className="like-button">Like</button>
          </div>
        </div>
      ))}
      <div ref={loaderRef} className="loader" style={{ height: '20px', width: '100%' }}></div> {/* Adjusted for visibility */}
    </div>
  );
};

export default MovieDetails;
