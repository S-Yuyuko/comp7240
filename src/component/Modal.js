import React from 'react';
import './css/Modal.css'; // Ensure you have styles for .selected

function Modal({ genres, selectedGenres, onToggleGenre, onSubmit }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Select Genres</h2>
        {genres.map((genre) => (
          <div key={genre} onClick={() => onToggleGenre(genre)} className={`genre-item ${selectedGenres.includes(genre) ? 'selected' : ''}`}>
            {genre}
          </div>
        ))}
        <button onClick={onSubmit}>Submit</button>
      </div>
    </div>
  );
}

export default Modal;
