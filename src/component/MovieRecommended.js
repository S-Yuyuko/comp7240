// MoviesRecommended.js
import React, { useState } from 'react';
import './css/MovieRecommended.css'; // Assuming you have a CSS file for styling

const MovieRecommended = ({ open, onClose, recommendations }) => {
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
            </div>
        </div>
    );
};

export default MovieRecommended;
