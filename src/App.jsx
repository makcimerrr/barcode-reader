// src/App.jsx
import React from 'react';
import BarcodeScanner from './BarcodeScanner.jsx';

function App() {
  return (
    <div className="App">
      <h1>Lecteur de Code-Barres</h1>
      <BarcodeScanner />
    </div>
  );
}

export default App;
