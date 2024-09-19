import React, { useState } from 'react';
import BarcodeReader from 'react-barcode-reader';

function BarcodeScanner() {
  const [result, setResult] = useState('');
  const [deviceData, setDeviceData] = useState(null);

  const handleScan = (data) => {
    if (data) {
      setResult(data);
      // Envoyer une requête GET au serveur Flask pour obtenir les données
      fetch(`http://127.0.0.1:5000/api/hardware/${data}`)
        .then((response) => response.json())
        .then((data) => setDeviceData(data)) // Mettre à jour l'état avec les données récupérées
        .catch((error) => console.error('Error fetching data:', error));
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div>
      <h1>Scanner de Code-Barres</h1>
      <BarcodeReader onScan={handleScan} onError={handleError} />
      {result && <div>Numéro de Série : {result}</div>}
      {deviceData && (
        <div>
          <h2>Données du PC</h2>
          <pre>{JSON.stringify(deviceData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default BarcodeScanner;
