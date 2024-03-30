import React, { useEffect, useReducer } from 'react';
import './css/MovieDetails.css';

// Define action types
const actionTypes = {
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  // Removed DISPLAY_MORE action type since we're not using loaderRef for infinite scrolling
};

// Define the reducer function
const movieReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.FETCH_SUCCESS:
      return {
        ...state,
        movies: action.payload,
        // Automatically display the first set of movies, no need for DISPLAY_MORE action
        displayedMovies: action.payload.slice(0, state.displayCount),
      };
    // Removed DISPLAY_MORE case
    default:
      throw new Error();
  }
};

const MovieDetails = ({ setLoading }) => {
  const [state, dispatch] = useReducer(movieReducer, {
    movies: [],
    displayedMovies: [],
    displayCount: 10, // You can adjust this initial count as needed
  });

  useEffect(() => {
    setLoading(true); // Assume setLoading is used to control global loading state
    fetch('http://localhost:4000/get-movie-details') // Make sure the URL matches your API endpoint
      .then(response => response.json())
      .then(data => {
        dispatch({ type: actionTypes.FETCH_SUCCESS, payload: data });
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
        setLoading(false);
      });
  }, [setLoading]); // setLoading is assumed to be a prop for controlling loading state globally

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
          </div>
        </div>
      ))}
      {/* Removed the loader div */}
    </div>
  );
};

export default MovieDetails;
