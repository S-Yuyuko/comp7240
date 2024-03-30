import React, { useState } from 'react';
import './App.css'; // Ensure this contains the necessary styles for sidebar
import Header from './component/Header';
import MovieDetails from './component/MovieDetails';
import SideBarofMoviesLiked from './component/SideBarofMoviesLiked'; // Assuming Footer is your sidebar component

function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // Controls sidebar visibility
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [likedMovies, setLikedMovies] = useState([]);

  const handleLikeMovie = (movie) => {
    setLikedMovies(prevLikedMovies => {
      const isAlreadyLiked = prevLikedMovies.some(likedMovie => likedMovie.Title === movie.Title);
      if (!isAlreadyLiked) {
        const updatedLikedMovies = [...prevLikedMovies, movie];
        console.log(updatedLikedMovies); // This reflects the updated state
        return updatedLikedMovies;
      }
      return prevLikedMovies; // Return previous state if the condition is not met
    });
  };
  const handleGenreSubmission = () => {
    setIsSubmitted(true);
  };
  // Calculate button right position based on sidebar visibility
  const buttonRightPosition = isSidebarVisible ? '250px' : '0px';

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleRemoveMovie = (movieToRemove) => {
    setLikedMovies(likedMovies.filter(movie => movie.Title !== movieToRemove.Title));
  };
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
            <SideBarofMoviesLiked likedMovies={likedMovies} onRemove={handleRemoveMovie} />
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
