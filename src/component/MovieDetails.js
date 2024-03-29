import React, { useState, useEffect, useRef } from 'react';
import './css/MovieDetails.css'; // Ensure the CSS file path is correct for your project structure

const MovieDetails = ({ setLoading }) => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);

  useEffect(() => {
    // Function to fetch movies
    const loadMovies = () => {
      if (!hasMore) return;
      setLoading(true);
      fetch(`http://localhost:4000/get-movie-details?page=${page}&limit=10`)
        .then(response => response.json())
        .then(newMovies => {
          setMovies(prevMovies => [...prevMovies, ...newMovies]);
          setPage(prevPage => prevPage + 1);
          setHasMore(newMovies.length > 0);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching movies:', error);
          setLoading(false); // Ensure loading is stopped in case of an error
        });
    };

    // IntersectionObserver to trigger loading more movies
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMovies();
      }
    }, { threshold: 1.0 });

    if (loader.current) {
      observer.observe(loader.current);
    }

    // Clean up observer
    return () => observer.disconnect();
  }, [page, hasMore, setLoading]);

  return (
    <div className="movie-container">
      {movies.map((movie, index) => (
        <div key={index} className="movie-card">
          <img src={movie.Poster_Url} alt={movie.Title} className="movie-poster" />
          <div className="movie-info">
            <h3 className="movie-title">{movie.Title}</h3>
            <p><strong>Release Date:</strong> {movie.Release_Date}</p>
            <p><strong>Popularity:</strong> {movie.Popularity}</p>
            <p><strong>Vote Count:</strong> {movie.Vote_Count}</p>
            <p className="movie-overview">{movie.Overview}</p>
          </div>
        </div>
      ))}
      <div ref={loader} className="loader"></div> {/* Sentinel element */}
    </div>
  );
};

export default MovieDetails;