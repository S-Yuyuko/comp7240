import React, { useEffect, useReducer, useRef } from 'react';
import './css/MovieDetails.css';

// Define action types
const actionTypes = {
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  DISPLAY_MORE: 'DISPLAY_MORE',
};

// Define the reducer function
const movieReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.FETCH_SUCCESS:
      return {
        ...state,
        movies: action.payload,
        displayedMovies: action.payload.slice(0, state.displayCount),
      };
    case actionTypes.DISPLAY_MORE:
      const newDisplayCount = state.displayCount + 10;
      const newDisplayedMovies = state.movies.slice(0, newDisplayCount);
      return {
        ...state,
        displayCount: newDisplayCount,
        displayedMovies: newDisplayedMovies,
      };
    default:
      throw new Error();
  }
};

const MovieDetails = ({ setLoading, onLike }) => {
  const [state, dispatch] = useReducer(movieReducer, {
    movies: [],
    displayedMovies: [],
    displayCount: 10,
  });

  const loaderRef = useRef();

  useEffect(() => {
    setLoading(true); // Assume setLoading is used to control global loading state

    fetch('http://localhost:4000/get-movie-details')
      .then(response => response.json())
      .then(data => {
        dispatch({ type: actionTypes.FETCH_SUCCESS, payload: data });
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
        setLoading(false);
      });

  }, [setLoading]); // Dependency array

  useEffect(() => {
    const observerCallback = (entries) => {
      if (entries[0].isIntersecting) {
        dispatch({ type: actionTypes.DISPLAY_MORE });
      }
    };

    const observer = new IntersectionObserver(observerCallback, { threshold: 1.0 });
    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, []); // Empty dependency array for component mount and unmount logic

  return (
    <div className="movie-container">
      {state.displayedMovies.map((movie, index) => (
        <div key={index} className="movie-card">
          <img src={movie.Poster_Url} alt={movie.Title} className="movie-poster" />
          <div className="movie-info">
            <h3 className="movie-title">{movie.Title}</h3>
            <p><strong>Release Date:</strong> {movie.Release_Date}</p>
            <p><strong>Popularity:</strong> {movie.Popularity}</p>
            <p><strong>Vote Count:</strong> {movie.Vote_Count}</p>
            <p className="movie-overview">{movie.Overview}</p>
            <button onClick={() => onLike(movie)}>Like</button>
          </div>
        </div>
      ))}
      <div ref={loaderRef} className="loader"></div> {/* Always visible */}
    </div>
  );
};
export default MovieDetails;
