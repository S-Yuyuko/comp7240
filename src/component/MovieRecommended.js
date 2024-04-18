import React, { useState } from 'react';
import './css/MovieRecommended.css'; // Assuming you have a CSS file for styling

const MovieRecommended = ({ open, onClose, recommendations, onUpdateRecommendations }) => {
    const [likes, setLikes] = useState({});
    const [feedbackHistory, setFeedbackHistory] = useState([]); // New state for keeping feedback history
    const [activeTab, setActiveTab] = useState('hybrid'); // Default to hybrid
    
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
        const feedbackMovies = recommendations.reduce((acc, movie) => {
            const state = likes[movie.Title];
            if (state !== null) {
                acc.push({
                    Title: movie.Title,
                    State: state,
                    Genre: movie.Genre // Assuming each movie object has a Genre property
                });
            }
            return acc;
        }, []);

        // Update the feedback history with the latest feedback
        setFeedbackHistory(prevHistory => [...prevHistory, ...feedbackMovies]);

        console.log("Feedback History:", feedbackHistory);
        console.log("Latest Feedback:", feedbackMovies);

        recommendedMoviesFromFeedbackMovies(feedbackHistory + feedbackMovies);
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
          console.log(data);
          onUpdateRecommendations(data); // Updating recommendations based on feedback history
        })
        .catch(error => {
          console.error('Error:', error);
        });
    };
    const HybridRecommendations = () => (
        recommendations.map((movie, index) => (
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
        ))
    );
    // Internal component for Non-Hybrid A Recommendations
    const NonHybridARecommendations = () => (
        recommendations.map((movie, index) => (
            <div key={index} className="recommended-movie-card">
                {/* Similar structure to HybridRecommendations */}
            </div>
        ))
    );

    // Internal component for Non-Hybrid B Recommendations
    const NonHybridBRecommendations = () => (
        recommendations.map((movie, index) => (
            <div key={index} className="recommended-movie-card">
                {/* Similar structure to HybridRecommendations */}
            </div>
        ))
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
                <div className="dialog-body">
                    {activeTab === 'hybrid' && <HybridRecommendations />}
                    {activeTab === 'nonHybridA' && <NonHybridARecommendations />}
                    {activeTab === 'nonHybridB' && <NonHybridBRecommendations />}
                </div>
            </div>
        </div>
    );
};

export default MovieRecommended;
