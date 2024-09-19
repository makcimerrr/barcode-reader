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
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default BarcodeScanner;
