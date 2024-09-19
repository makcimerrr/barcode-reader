// src/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const goToScanner = () => {
    navigate('/scanner'); // Redirige vers la page du scanner
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Bienvenue sur l'Application de Suivi de Matériel</h1>
      <button onClick={goToScanner} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
        Scanner un Code-Barres
      </button>
    </div>
  );
}

export default Home;
