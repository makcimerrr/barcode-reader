// src/BarcodeScanner.jsx
import React, { useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode/minified/html5-qrcode.min';
import axios from 'axios';

const BarcodeScanner = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleScanSuccess = (decodedText) => {
    setError(null);
    axios.get(`https://api-barcode-reader.vercel.app/api/hardware/${decodedText}`)
      .then(response => {
        setData(response.data);
      })
      .catch(err => {
        setError('PC non trouvé');
        setData(null);
      });
  };

  const handleScanError = (error) => {
    console.error('Scan error:', error);
  };

  const startScanner = () => {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
    scanner.render(handleScanSuccess, handleScanError);
  };

  React.useEffect(() => {
    startScanner();
  }, []);

  return (
    <div>
      <div id="reader" style={{ width: '100%' }}></div>
      {data && (
        <div>
          <h2>Données du PC :</h2>
          <ul>
            <li><strong>SN :</strong> {data.SN}</li>
            <li><strong>Modèle :</strong> {data.Modèle}</li>
            <li><strong>N° Chargeur :</strong> {data['N° Chargeur']}</li>
            <li><strong>Propriétaire :</strong> {data.Propriétaire}</li>
            <li><strong>Statut :</strong> {data.Statut}</li>
            <li><strong>Garanti :</strong> {data.Garanti}</li>
            <li><strong>Contrat :</strong> {data.Contrat}</li>
            <li><strong>Commentaires :</strong> {data.Commentaires}</li>
            <li><strong>Date Garantie :</strong> {data['Date Garantie']}</li>
            <li><strong>Provenance :</strong> {data.Provenance}</li>
          </ul>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default BarcodeScanner;
