import React, { useState } from 'react';
import './App.css'; // Ensure this contains the necessary styles for sidebar
import Header from './component/Header';
import MovieDetails from './component/MovieDetails';
import Footer from './component/Footer'; // Assuming Footer is your sidebar component

function App() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // Controls sidebar visibility
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenreSubmission = () => {
    setIsSubmitted(true);
  };
  // Calculate button right position based on sidebar visibility
  const buttonRightPosition = isSidebarVisible ? '250px' : '0px';
  
  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="App">
      <Header onGenreSubmission={handleGenreSubmission} />
      {isSubmitted && (
        <>
          <main>
            <MovieDetails setLoading={setLoading} />
            {loading && <div className="loading-indicator">Loading...</div>}
          </main>
          <div className={`sidebar-container ${isSidebarVisible ? 'visible' : ''}`}>
            <Footer />
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
