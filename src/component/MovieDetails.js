import React, { useEffect, useReducer, useRef } from 'react';
import './css/MovieDetails.css';

const actionTypes = {
  SET_MOVIES: 'SET_MOVIES', // Renamed for clarity
  DISPLAY_MORE: 'DISPLAY_MORE',
};

const movieReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_MOVIES:
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

const MovieDetails = ({ recommendedMovies, setLoading, onLike }) => {
  const [state, dispatch] = useReducer(movieReducer, {
    movies: [],
    displayedMovies: [],
    displayCount: 10,
  });

  const loaderRef = useRef();

  useEffect(() => {
    // Assume setLoading might still be needed for other purposes
    setLoading(true);
    dispatch({ type: actionTypes.SET_MOVIES, payload: recommendedMovies });
  }, [recommendedMovies, setLoading]);

  useEffect(() => {
    const observerCallback = (entries) => {
      if (entries[0].isIntersecting) {
        dispatch({ type: actionTypes.DISPLAY_MORE });
      }
    };

    const observer = new IntersectionObserver(observerCallback, { threshold: 1.0 });
    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, []); // Dependency array remains empty for setup and cleanup logic

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
            <button onClick={() => onLike(movie)} className="like-button">Like</button>
          </div>
        </div>
      ))}
      <div ref={loaderRef} className="loader"></div> {/* Always visible */}
    </div>
  );
};
export default MovieDetails;
