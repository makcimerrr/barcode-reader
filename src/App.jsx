// src/App.jsx
import React from 'react';
import BarcodeScanner from './BarcodeScanner';
import SearchBar from "./SearchBar";

function App() {
  return (
    <div className="App">
      <h1>Scanner de Code-Barres</h1>
      <BarcodeScanner />
      <SearchBar />
    </div>
  );
}

export default App;
