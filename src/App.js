import React, { useState } from 'react';
import './App.css';
import Header from './component/Header';
import MovieDetails from './component/MovieDetails';
import Footer from './component/Footer'; // Assume you create this

function App() {
  // State to manage selected movie for the footer
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleGenreSubmission = () => {
    setIsSubmitted(true);
  };
  return (
    <div className="App">
      {/* Header now contains the genre selection functionality */}
      <Header onGenreSubmission={handleGenreSubmission}/>
      {/* Main content area, possibly displaying movies based on selected genres */}
      {isSubmitted && (
        <>
          <main>
            <MovieDetails setLoading={setLoading}/>
            {loading && <div className="loading-indicator">Loading...</div>}
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
