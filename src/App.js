import React, { useState } from 'react';
import './App.css';
import Header from './component/Header';
import MovieDetails from './component/MovieDetails';
import Footer from './component/Footer'; // Assume you create this

function App() {
  // State to manage selected genres
  const [selectedGenres, setSelectedGenres] = useState([]);
  // State to manage selected movie for the footer
  const [selectedMovie, setSelectedMovie] = useState(null);

  return (
    <div className="App">
      {/* Header now contains the genre selection functionality */}
      <Header onGenresSelected={setSelectedGenres} />
      {/* Main content area, possibly displaying movies based on selected genres */}
      <main>
        <MovieDetails selectedGenres={selectedGenres} setSelectedMovie={setSelectedMovie} />
      </main>
      {/* Footer displays details about the selected movie */}
      <Footer selectedMovie={selectedMovie} />
    </div>
  );
}

export default App;
