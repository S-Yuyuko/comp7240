import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Header from './component/Header';
import MovieDetails from './component/MovieDetails';
import MovieSideBar from './component/MovieSideBar';
import MovieRecommended from './component/MovieRecommended';

function Questionnaire({ isOpen, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [feedbackHistory, setFeedbackHistory] = useState([]);

  const submitFeedback = () => {
    if (rating > 0 && feedback.trim() !== '') {
      onSubmit({ rating, feedback });
      setRating(0);
      setFeedback('');
      onClose();
    } else {
      setSubmitAttempted(true); // Indicates a submit attempt was made
    }
  };

  const fetchFeedbackHistory = () => {
    fetch('http://localhost:4000/get-history-feedback', { method: 'GET' })
      .then(response => response.json())
      .then(data => {
        setFeedbackHistory(data); // Assuming the response has a key 'analytics'
      })
      .catch(error => {
        console.error('Failed to run evaluation:', error);
        alert('Failed to fetch data. See console for details.');
      });
  };

  if (!isOpen) return null;

  return (
    <div className="questionnaire-dialog-backdrop">
      <div className="questionnaire-dialog">
        <h2>Your Feedback</h2>
        <div className="star-rating">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <span key={index}
                    className={`star ${rating >= ratingValue ? 'selected' : ''}`}
                    onClick={() => setRating(ratingValue)}
                    style={{ cursor: 'pointer', fontSize: '24px' }}>
                ★
              </span>
            );
          })}
        </div>
        {submitAttempted && rating === 0 && <p className="error-message">Please select a rating.</p>}
        <textarea
          className={`textarea-feedback ${submitAttempted && !feedback.trim() ? 'error' : ''}`}
          placeholder="Enter your feedback here..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          required
        ></textarea>
        {submitAttempted && !feedback.trim() && <p className="error-message">Feedback cannot be empty.</p>}
        <button onClick={submitFeedback} style={{ margin: '5px' }}>Submit Feedback</button>
        <button onClick={fetchFeedbackHistory} style={{ margin: '5px' }}>Load Feedback History</button>
        <button onClick={onClose} style={{ margin: '5px' }}>Close</button>            
            <div className="feedback-history" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Rating</th>
                            <th>Feedback</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbackHistory.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.rating}</td>
                                <td>{item.feedback}</td>
                                <td>{item.timestamp}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
}


function EvaluationDialog({ isOpen, onClose, analytics }) {
  if (!isOpen) return null;

  return (
    <div className="eva-dialog-backdrop">
      <div className="eva-dialog">
        <h2>Evaluation Results</h2>
        <table className="analytics-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Liked Movies</th>
              <th>Disliked Movies</th>
              <th>Total Movies</th>
              <th>Precision</th>
            </tr>
          </thead>
          <tbody>
            {analytics && Object.entries(analytics).map(([method, data]) => (
              <tr key={method}>
                <td>{method.replace('_', ' ')}</td>
                <td>{data.liked_movies}</td>
                <td>{data.disliked_movies}</td>
                <td>{data.total_movies}</td>
                <td>{data.precision.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [likedMovies, setLikedMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [recommendedUserMovies, setRecommendedUserMovies] = useState([]);
  const [recommendedUserMovies_A, setRecommendedUserMovies_A] = useState([]);
  const [recommendedUserMovies_B, setRecommendedUserMovies_B] = useState([]);

  const [isEvaluationDialogOpen, setIsEvaluationDialogOpen] = useState(false);
  const [analytics, setAnalytics] = useState({});

  const [isQuestionnaireDialogOpen, setIsQuestionnaireDialogOpen] = useState(false);

  const handleOpenQuestionnaire = () => {
    setIsQuestionnaireDialogOpen(true);
  };

  const handleCloseQuestionnaire = () => {
    setIsQuestionnaireDialogOpen(false);
  };

  const handleFeedbackSubmission = (feedbackData) => {
    console.log("Feedback Data:", feedbackData);
    // Use fetch to send a POST request
    fetch('http://localhost:4000/submit-user-feedback', {
      method: 'POST', // Specify the method
      headers: {
        'Content-Type': 'application/json',  // Specify the body format as JSON
      },
      body: JSON.stringify(feedbackData), // Convert JavaScript object to JSON string
    })
    .then(response => {
      if (!response.ok) {
        // If the response status code is not in the 200-299 range,
        // throw an error to skip to the catch block
        throw new Error('Network response was not ok');
      }
      return response.json(); // Parse JSON body of the response
    })
    .then(data => {
      console.log('Success:', data); // Process the data from the server
      alert('Feedback submitted successfully!'); // Alert the user on success
    })
    .catch(error => {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback. Check the console for more information.'); // Alert the user on error
    });
  };

  const handleRunEvaluation = () => {
    setIsEvaluationDialogOpen(true); // Open dialog immediately for loading state indication (if needed)
    fetch('http://localhost:4000/evaluation', { method: 'GET' })
      .then(response => response.json())
      .then(data => {
        setAnalytics(data.analytics); // Assuming the response has a key 'analytics'
      })
      .catch(error => {
        console.error('Failed to run evaluation:', error);
        alert('Failed to fetch evaluation data. See console for details.');
      });
  };

    // Function to update recommendations
  const handleUpdateRecommendations = (newRecommendations) => {
    setRecommendedUserMovies(newRecommendations);
  };
  const handleUpdateRecommendations_A = (newRecommendations) => {
    setRecommendedUserMovies_A(newRecommendations);
  };
  const handleUpdateRecommendations_B = (newRecommendations) => {
    setRecommendedUserMovies_B(newRecommendations);
  };
  // This method now solely updates the recommended movies state
  const updateRecommendedMovies = (movies) => {
    setRecommendedUserMovies(movies);
  };
  const updateRecommendedMovies_A = (movies) => {
    setRecommendedUserMovies_A(movies);
  };
  const updateRecommendedMovies_B = (movies) => {
    setRecommendedUserMovies_B(movies);
  };
  // New method to control dialog visibility
  const toggleDialogOpen = (openState = true) => {
    setDialogOpen(openState);
  };
  
  // Method to update the recommended movies
  const handleRecommendedMovies = useCallback((movies) => {
    setRecommendedMovies(movies);
  }, []);
  

  const handleLikeMovie = (movie) => {
    setLikedMovies(prevLikedMovies => {
      const isAlreadyLiked = prevLikedMovies.some(likedMovie => likedMovie.Title === movie.Title);
      if (!isAlreadyLiked) {
        // Set initial score to 0
        const updatedLikedMovies = [...prevLikedMovies, { ...movie, Score: 0 }];
        return updatedLikedMovies;
      }
      return prevLikedMovies;
    });
  };

  const handleRemoveMovie = (movieToRemove) => {
    setLikedMovies(likedMovies.filter(movie => movie.Title !== movieToRemove.Title));
  };

  const handleScoreChange = (movieTitle, newScore) => {
    console.log(`Score updated for "${movieTitle}" to: ${newScore}`);
    setLikedMovies(prevLikedMovies =>
      prevLikedMovies.map(movie =>
        movie.Title === movieTitle ? { ...movie, Score: newScore } : movie
      )
    );
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleGenreSubmission = () => {
    setIsSubmitted(true);
  };

  useEffect(() => {
    console.log('Liked movies state after update:', likedMovies);
  }, [likedMovies]);

  useEffect(() => {
    const setAppMinWidth = () => {
      const minWidth = window.screen.width * 0.5 + 'px'; // 50% of the screen width
      document.querySelector('.App').style.minWidth = minWidth;
    };

    // Set the min width when the component mounts
    setAppMinWidth();

    // Add event listener for window resizing
    window.addEventListener('resize', setAppMinWidth);

    // Clean up event listener
    return () => window.removeEventListener('resize', setAppMinWidth);
  }, []);

  const buttonRightPosition = isSidebarVisible ? '25%' : '0px';

  return (
    <div className="App">
      <Header onGenreSubmission={handleGenreSubmission} onRecommendedMovies={handleRecommendedMovies} />
      {isSubmitted && (
        <>
          <main>
            <MovieDetails setLoading={setLoading} onLike={handleLikeMovie} recommendedMovies={recommendedMovies} />
            {loading && <div className="loading-indicator">Loading...</div>}
          </main>
          <div className={`sidebar-container ${isSidebarVisible ? 'visible' : ''}`}>
            <MovieSideBar 
              likedMovies={likedMovies}
              onRemove={handleRemoveMovie} 
              onScoreChange={handleScoreChange}
              onFetchRecommendations={updateRecommendedMovies}
              onFetchRecommendations_A={updateRecommendedMovies_A}
              onFetchRecommendations_B={updateRecommendedMovies_B}
              toggleDialog={toggleDialogOpen} />
            <button
              onClick={toggleSidebar}
              className="toggle-button"
              style={{ right: buttonRightPosition }}
            >
              {isSidebarVisible ? '>' : '<'}
            </button>
          </div>
          {isSidebarVisible && <div className="backdrop" onClick={toggleSidebar}></div>}
        </>
      )}
      <MovieRecommended
        open={dialogOpen}
        onClose={() => toggleDialogOpen(false)}
        recommendations={recommendedUserMovies}
        recommendations_A={recommendedUserMovies_A}
        recommendations_B={recommendedUserMovies_B}
        onUpdateRecommendations_feedback={handleUpdateRecommendations}
        onUpdateRecommendations_feedback_A={handleUpdateRecommendations_A}
        onUpdateRecommendations_feedback_B={handleUpdateRecommendations_B}
      />
      <button className="questionnaire-button" onClick={handleOpenQuestionnaire}>
        Open Questionnaire
      </button>
      <button className="evaluation-button" onClick={handleRunEvaluation}>
        Evaluate
      </button>
      <Questionnaire 
        isOpen={isQuestionnaireDialogOpen}
        onClose={handleCloseQuestionnaire}
        onSubmit={handleFeedbackSubmission}
      />
      <EvaluationDialog
        isOpen={isEvaluationDialogOpen}
        onClose={() => setIsEvaluationDialogOpen(false)}
        analytics={analytics}
      />
    </div>
  );
}

export default App;
