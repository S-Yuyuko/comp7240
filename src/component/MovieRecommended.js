// MoviesRecommended.js
import React, { useState } from 'react';
import './css/MovieRecommended.css'; // Assuming you have a CSS file for styling

const MovieRecommended = ({ open, onClose, recommendations, onUpdateRecommendations }) => {
    const [likes, setLikes] = useState({});

    if (!open || !Array.isArray(recommendations)) return null; // Do not render the dialog if it's not open
    
    const toggleLike = (title) => {
        setLikes(prevLikes => ({
          ...prevLikes,
          [title]: prevLikes[title] === 'liked' ? null : 'liked'
        }));
    };
    
    const toggleDislike = (title) => {
        setLikes(prevLikes => ({
            ...prevLikes,
            [title]: prevLikes[title] === 'disliked' ? null : 'disliked'
        }));
    };

    const handleRefresh = () => {
        // Filter the likes object for movies that have a state of 'liked' or 'disliked'
        const feedbackMovies = Object.entries(likes).reduce((acc, [title, state]) => {
            if (state !== null) acc.push({ title, state });
            return acc;
        }, []);
        console.log("Refreshed Movies:", feedbackMovies);
        recommendedMoviesFromFeedbakcMovies(feedbackMovies)
    };

    const recommendedMoviesFromFeedbakcMovies = (feedbackMovies) => {
        fetch('http://localhost:4000/recommendations-from-feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ feedbackMovies: feedbackMovies }),
        })
        .then(response => response.json())
        .then(data => {
          // Assuming 'data' is the list of recommended movies
          console.log(data);
          onUpdateRecommendations(data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
      };

    return (
        <div className="dialog-backdrop" onClick={onClose}>
            <div className="dialog-content" onClick={e => e.stopPropagation()}>
                <div className="dialog-header">
                    <h2>Recommended Movies</h2>
                    <button onClick={onClose} className="close-button">X</button>
                </div>
                <div className="dialog-body">
                    {recommendations.map((movie, index) => (
                        <div key={index} className="recommended-movie-card">
                            <img src={movie.Poster_Url} alt={movie.Title} className="recommended-movie-poster" />
                            <div className="recommended-movie-info">
                                <h3>{movie.Title}</h3>
                                <p>Final Score: {movie.Final_Score}</p>
                                <div className="recommended-movie-actions">
                                    <button 
                                        onClick={() => toggleLike(movie.Title)} 
                                        className={`action-button ${likes[movie.Title] === 'liked' ? 'active liked' : ''}`}>
                                        Like
                                    </button>
                                    <button 
                                        onClick={() => toggleDislike(movie.Title)} 
                                        className={`action-button ${likes[movie.Title] === 'disliked' ? 'active disliked' : ''}`}>
                                        Dislike
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={handleRefresh} className="refresh-button">Refresh</button>
            </div>
        </div>
    );
};

export default MovieRecommended;
