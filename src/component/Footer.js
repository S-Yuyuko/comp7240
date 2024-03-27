// Footer.js
import React from 'react';

const Footer = ({ selectedMovie }) => {
  return (
    <footer className="App-footer">
      {selectedMovie ? (
        <div>
          <h3>{selectedMovie.title}</h3>
          {/* Display other movie details as needed */}
        </div>
      ) : (
        <p>No movie selected.</p>
      )}
    </footer>
  );
};

export default Footer;
