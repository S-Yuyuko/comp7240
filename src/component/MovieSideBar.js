import React, { useState, useEffect } from 'react';
import './css/MovieSideBar.css'; // Ensure the CSS file is correctly linked

const MovieSideBar = ({ likedMovies, onRemove, onScoreChange, onFetchRecommendations, onFetchRecommendations_A, onFetchRecommendations_B, toggleDialog }) => {
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
                  style={{
                    cursor: 'pointer', 
                    color: ratingValue <= (movie.Score || 0) ? '#ffc107' : '#e4e5e9', 
                    fontSize: '24px'
                  }}
                  aria-label={`Rate ${ratingValue} out of 10`}>
              {ratingValue <= (movie.Score || 0) ? '★' : '☆'}
            </span>
          );
        })}
      </div>
    );
  };
  
  const handleSubmit = () => {
      // Check if likedMovies is null or an empty array
    if (!likedMovies || likedMovies.length === 0) {
      console.log("No liked movies to submit."); // Optional: for debugging
      return; // Exit the function if no liked movies
    }
    setHistorySubmit({
      [submitCount]: likedMovies
    });
    // Increment the submission counter
    setSubmitCount(prevCount => prevCount + 1);

  };

  useEffect(() => {
    const fetchRecommendationsSequentially = async () => {
      if (likedMovies.length > 0) {
        try {
          await recommendedMoviesFromLikedMovies(likedMovies);
          await recommendedMoviesFromLikedMovies_A(likedMovies);
          await recommendedMoviesFromLikedMovies_B(likedMovies);
          toggleDialog(true);
        } catch (error) {
          console.error('Error during fetch sequence:', error);
        }
      }
    };

    fetchRecommendationsSequentially();
  }, [submitCount]);

  const fetchJson = async (url, body) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  };
  
  const recommendedMoviesFromLikedMovies = async (likedMovies) => {
    const data = await fetchJson('http://localhost:4000/recommendations-from-liked', { likedMovies, historySubmit });
    onFetchRecommendations(data); // Trigger action with fetched data
    return data; // Return data if needed elsewhere
  };
  
  const recommendedMoviesFromLikedMovies_A = async (likedMovies) => {
    const data = await fetchJson('http://localhost:4000/recommendations-from-liked_A', { likedMovies, historySubmit });
    onFetchRecommendations_A(data); // Trigger action with fetched data
    return data; // Return data if needed elsewhere
  };
  
  const recommendedMoviesFromLikedMovies_B = async (likedMovies) => {
    const data = await fetchJson('http://localhost:4000/recommendations-from-liked_B', { likedMovies, historySubmit });
    onFetchRecommendations_B(data); // Trigger action with fetched data
    return data; // Return data if needed elsewhere
  };
  // const recommendedMoviesFromLikedMovies = (likedMovies) => {
  //   fetch('http://localhost:4000/recommendations-from-liked', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ likedMovies: likedMovies,  historySubmit: historySubmit}),
  //   })
  //   .then(response => response.json())
  //   .then(data => {
  //     // Assuming 'data' is the list of recommended movies
  //     console.log(data);
  //     onFetchRecommendations(data);
  //   })
  //   .catch(error => {
  //     console.error('Error:', error);
  //   });
  // };
  // const recommendedMoviesFromLikedMovies_A = (likedMovies) => {
  //   fetch('http://localhost:4000/recommendations-from-liked_A', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ likedMovies: likedMovies,  historySubmit: historySubmit}),
  //   })
  //   .then(response => response.json())
  //   .then(data => {
  //     console.log(data);
  //     onFetchRecommendations_A(data);
  //   })
  //   .catch(error => {
  //     console.error('Error:_A', error);
  //   });
  // };
  // const recommendedMoviesFromLikedMovies_B = (likedMovies) => {
  //   fetch('http://localhost:4000/recommendations-from-liked_B', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ likedMovies: likedMovies,  historySubmit: historySubmit}),
  //   })
  //   .then(response => response.json())
  //   .then(data => {
  //     console.log(data);
  //     onFetchRecommendations_B(data);
  //   })
  //   .catch(error => {
  //     console.error('Error:_B', error);
  //   });
  // };  
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
