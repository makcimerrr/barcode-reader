// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import BarcodeScanner from './BarcodeScanner';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scanner" element={<BarcodeScanner />} />
      </Routes>
    </Router>
  );
}

export default App;
