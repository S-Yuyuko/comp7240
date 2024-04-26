import React, { useState } from 'react';
import './css/MovieRecommended.css'; // Assuming you have a CSS file for styling

const MovieRecommended = ({ open, onClose, recommendations, recommendations_A, recommendations_B, onUpdateRecommendations_feedback, onUpdateRecommendations_feedback_A, onUpdateRecommendations_feedback_B }) => {
    const [likes, setLikes] = useState({});
    const [likes_A, setLikes_A] = useState({});
    const [likes_B, setLikes_B] = useState({});
    const [activeTab, setActiveTab] = useState('hybrid')

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
    const toggleLike_A = (title) => {
        setLikes_A(prevLikes => ({
          ...prevLikes,
          [title]: prevLikes[title] === 'liked' ? null : 'liked'
        }));
    };
    
    const toggleDislike_A = (title) => {
        setLikes_A(prevLikes => ({
            ...prevLikes,
            [title]: prevLikes[title] === 'disliked' ? null : 'disliked'
        }));
    };
    const toggleLike_B = (title) => {
        setLikes_B(prevLikes => ({
          ...prevLikes,
          [title]: prevLikes[title] === 'liked' ? null : 'liked'
        }));
    };
    
    const toggleDislike_B = (title) => {
        setLikes_B(prevLikes => ({
            ...prevLikes,
            [title]: prevLikes[title] === 'disliked' ? null : 'disliked'
        }));
    };

    const handleRefresh = () => {
        const feedbackMovies = recommendations.reduce((acc, movie) => {
            const state = likes[movie.Title];
            if (state !== null) {
                acc.push({
                    Title: movie.Title,
                    State: state,
                    Genre: movie.Genre,
                    User_ID: movie.User_ID // Assuming each movie object has a Genre property
                });
            }
            return acc;
        }, []);

        recommendedMoviesFromFeedbackMovies(feedbackMovies);
    };

    const recommendedMoviesFromFeedbackMovies = (feedbackMovies) => {
        fetch('http://localhost:4000/recommendations-from-feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // Include the entire feedback history in the request
          body: JSON.stringify({ feedbackMovies: feedbackMovies }), 
        })
        .then(response => response.json())
        .then(data => {
          onUpdateRecommendations_feedback(data); // Updating recommendations based on feedback history
        })
        .catch(error => {
          console.error('Error:', error);
        });
    };
    // Internal component for Hybrid Recommendations
    const HybridRecommendations = () => (
        <>
            <div className="dialog-body">
                {recommendations.map((movie, index) => (
                    <div key={index} className="recommended-movie-card">
                        <img src={movie.Poster_Url} alt={movie.Title} className="recommended-movie-poster" />
                        <div className="recommended-movie-info">
                            <h3>{movie.Title}</h3>
                            <p>Recommended Reason: {movie.Reason}</p>
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
        </>
    );
    const handleRefresh_A = () => {
        const feedbackMovies = recommendations_A.reduce((acc, movie) => {
            const state = likes_A[movie.Title];
            if (state !== null) {
                acc.push({
                    Title: movie.Title,
                    State: state,
                    Genre: movie.Genre,
                    User_ID: movie.User_ID // Assuming each movie object has a Genre property
                });
            }
            return acc;
        }, []);

        recommendedMoviesFromFeedbackMovies_A(feedbackMovies);
    };

    const recommendedMoviesFromFeedbackMovies_A = (feedbackMovies) => {
        fetch('http://localhost:4000/recommendations-from-feedback_A', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // Include the entire feedback history in the request
          body: JSON.stringify({ feedbackMovies: feedbackMovies }), 
        })
        .then(response => response.json())
        .then(data => {
          onUpdateRecommendations_feedback_A(data); // Updating recommendations based on feedback history
        })
        .catch(error => {
          console.error('Error:', error);
        });
    };

    // Internal component for Non-Hybrid A Recommendations
    const NonHybridARecommendations = () => (
        <>
            <div className="dialog-body">
                {recommendations_A.map((movie, index) => (
                    <div key={index} className="recommended-movie-card">
                        <img src={movie.Poster_Url} alt={movie.Title} className="recommended-movie-poster" />
                        <div className="recommended-movie-info">
                            <h3>{movie.Title}</h3>
                            <p>Recommended Reason: {movie.Reason}</p>
                            <div className="recommended-movie-actions">
                                <button 
                                    onClick={() => toggleLike_A(movie.Title)} 
                                    className={`action-button ${likes_A[movie.Title] === 'liked' ? 'active liked' : ''}`}>
                                    Like
                                </button>
                                <button 
                                    onClick={() => toggleDislike_A(movie.Title)} 
                                    className={`action-button ${likes_A[movie.Title] === 'disliked' ? 'active disliked' : ''}`}>
                                    Dislike
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={handleRefresh_A} className="refresh-button">Refresh</button>
        </>

    );
    const handleRefresh_B = () => {
        const feedbackMovies = recommendations_B.reduce((acc, movie) => {
            const state = likes_B[movie.Title];
            if (state !== null) {
                acc.push({
                    Title: movie.Title,
                    State: state,
                    Genre: movie.Genre,
                    User_ID: movie.User_ID // Assuming each movie object has a Genre property
                });
            }
            return acc;
        }, []);

        recommendedMoviesFromFeedbackMovies_B(feedbackMovies);
    };

    const recommendedMoviesFromFeedbackMovies_B = (feedbackMovies) => {
        fetch('http://localhost:4000/recommendations-from-feedback_B', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // Include the entire feedback history in the request
          body: JSON.stringify({ feedbackMovies: feedbackMovies }), 
        })
        .then(response => response.json())
        .then(data => {
          onUpdateRecommendations_feedback_B(data); // Updating recommendations based on feedback history
        })
        .catch(error => {
          console.error('Error:', error);
        });
    };

    // Internal component for Non-Hybrid B Recommendations
    const NonHybridBRecommendations = () => (
        <>
            <div className="dialog-body">
                {recommendations_B.map((movie, index) => (
                    <div key={index} className="recommended-movie-card">
                        <img src={movie.Poster_Url} alt={movie.Title} className="recommended-movie-poster" />
                        <div className="recommended-movie-info">
                            <h3>{movie.Title}</h3>
                            <p>Recommended Reason: {movie.Reason}</p>
                            <div className="recommended-movie-actions">
                                <button 
                                    onClick={() => toggleLike_B(movie.Title)} 
                                    className={`action-button ${likes_B[movie.Title] === 'liked' ? 'active liked' : ''}`}>
                                    Like
                                </button>
                                <button 
                                    onClick={() => toggleDislike_B(movie.Title)} 
                                    className={`action-button ${likes_B[movie.Title] === 'disliked' ? 'active disliked' : ''}`}>
                                    Dislike
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={handleRefresh_B} className="refresh-button">Refresh</button>
        </>
    );

    return (
        <div className="dialog-backdrop" onClick={onClose}>
            <div className="dialog-content" onClick={e => e.stopPropagation()}>
                <div className="dialog-header">
                    <h2>Recommended Movies</h2>
                    <button onClick={onClose} className="close-button">X</button>
                </div>
                <div className="tabs">
                    <button onClick={() => setActiveTab('hybrid')} className={activeTab === 'hybrid' ? 'active' : ''}>Hybrid Algorithm</button>
                    <button onClick={() => setActiveTab('nonHybridA')} className={activeTab === 'nonHybridA' ? 'active' : ''}>Non-Hybrid A</button>
                    <button onClick={() => setActiveTab('nonHybridB')} className={activeTab === 'nonHybridB' ? 'active' : ''}>Non-Hybrid B</button>
                </div>
                <>
                    {activeTab === 'hybrid' && <HybridRecommendations />}
                    {activeTab === 'nonHybridA' && <NonHybridARecommendations />}
                    {activeTab === 'nonHybridB' && <NonHybridBRecommendations />}
                </>
            </div>
        </div>
    );
};

export default MovieRecommended;
