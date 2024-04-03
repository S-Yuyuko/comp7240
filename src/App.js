import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Header from './component/Header';
import MovieDetails from './component/MovieDetails';
import MovieSideBar from './component/MovieSideBar';
import MovieRecommended from './component/MovieRecommended';

function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [likedMovies, setLikedMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [recommendedUserMovies, setRecommendedUserMovies] = useState([]);

  // This method now solely updates the recommended movies state
  const updateRecommendedMovies = (movies) => {
    setRecommendedUserMovies(movies);
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
            <MovieSideBar likedMovies={likedMovies}
              onRemove={handleRemoveMovie} 
              onScoreChange={handleScoreChange}
              onFetchRecommendations={updateRecommendedMovies}
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
      />
    </div>
  );
}

export default App;
