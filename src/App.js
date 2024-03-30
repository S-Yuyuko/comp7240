import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './component/Header';
import MovieDetails from './component/MovieDetails';
import SideBar from './component/SideBar';

function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [likedMovies, setLikedMovies] = useState([]);
  
  const handleLikeMovie = (movie) => {
    setLikedMovies(prevLikedMovies => {
      const isAlreadyLiked = prevLikedMovies.some(likedMovie => likedMovie.Title === movie.Title);
      if (!isAlreadyLiked) {
        // Set initial score to null
        const updatedLikedMovies = [...prevLikedMovies, { ...movie, Score: null }];
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
      <Header onGenreSubmission={handleGenreSubmission} />
      {isSubmitted && (
        <>
          <main>
            <MovieDetails setLoading={setLoading} onLike={handleLikeMovie} />
            {loading && <div className="loading-indicator">Loading...</div>}
          </main>
          <div className={`sidebar-container ${isSidebarVisible ? 'visible' : ''}`}>
            <SideBar likedMovies={likedMovies} onRemove={handleRemoveMovie} onScoreChange={handleScoreChange} />
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
    </div>
  );
}

export default App;
