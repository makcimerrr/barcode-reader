// src/BarcodeScanner.jsx
import React, { useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode'; // Bibliothèque pour scanner le QR code

const BarcodeScanner = () => {
  const [sn, setSN] = useState('');
  const [data, setData] = useState(null);

  const handleScan = () => {
    const scanner = new Html5Qrcode("reader");
    scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        setSN(decodedText);
        fetchData(decodedText);
        scanner.stop();
      },
      (errorMessage) => {
        console.log("Erreur de scan: ", errorMessage);
      }
    );
  };

  const fetchData = async (serialNumber) => {
    try {
      const response = await fetch(`/api/hardware/${serialNumber}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Erreur de récupération des données : ", error);
    }
  };

  return (
    <div>
      <button onClick={handleScan}>Activer la caméra et scanner le code-barres</button>
      <div id="reader"></div>
      {sn && <p>SN Scanné : {sn}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default BarcodeScanner;
