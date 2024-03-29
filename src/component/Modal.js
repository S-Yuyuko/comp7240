import React from 'react';
import './css/Modal.css'; // Ensure you have styles for .selected

function Modal({ genres, selectedGenres, onToggleGenre, onSubmit, onGenreSubmission }) {
  const handleonGenreSubmission = () => {
    onSubmit(); // Your existing submission logic
    onGenreSubmission(); // The second function you want to run
  }
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Select Genres</h2>
        {genres.map((genre) => (
          <div key={genre} onClick={() => onToggleGenre(genre)} className={`genre-item ${selectedGenres.includes(genre) ? 'selected' : ''}`}>
            {genre}
          </div>
        ))}
        <button onClick={handleonGenreSubmission}>Submit</button>
      </div>
    </div>
  );
}

export default Modal;
