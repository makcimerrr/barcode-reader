import React, {useState} from 'react';
import {Html5QrcodeScanner} from 'html5-qrcode';
import axios from 'axios';

const BarcodeScanner = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [scannerInitialized, setScannerInitialized] = useState(false);
    const [scanner, setScanner] = useState(null);

    const handleScanSuccess = (decodedText) => {
        setError(null);
        axios.get(`https://api-barcode-reader.vercel.app/api/hardware/${decodedText}`)
            .then(response => {
                const cleanedData = cleanKeys(response.data);
                setData(cleanedData);
                stopScanner();
            })
            .catch(err => {
                setError('PC non trouvé');
                setData(null);
            });
    };

    const handleScanError = (error) => {
        // Log only if it's not an expected or non-critical error
        if (!error.message.includes("No QR code found")) {
            console.error('Scan error:', error);
        }
    };

    const startScanner = () => {
        // Assurez-vous que l'accès à la caméra est demandé
        navigator.mediaDevices.getUserMedia({video: true})
            .then(() => {
                if (!scannerInitialized) {
                    const newScanner = new Html5QrcodeScanner("reader", {fps: 10, qrbox: 250});
                    newScanner.render(handleScanSuccess, handleScanError);
                    setScanner(newScanner);
                    setScannerInitialized(true);
                }
            })
            .catch((err) => {
                setError('Permission de la caméra refusée ou non disponible');
                console.error('Camera access error:', err);
            });
    };

    const stopScanner = () => {
        if (scanner) {
            scanner.clear().then(() => {
                // Assurez-vous que toutes les pistes vidéo sont arrêtées
                navigator.mediaDevices.enumerateDevices().then(devices => {
                    devices.forEach(device => {
                        if (device.kind === 'videoinput') {
                            navigator.mediaDevices.getUserMedia({video: {deviceId: device.deviceId}})
                                .then(stream => {
                                    stream.getTracks().forEach(track => track.stop());
                                });
                        }
                    });
                });

                // Optionnel : Détachez le lecteur du DOM si nécessaire
                const readerElement = document.getElementById("reader");
                if (readerElement) {
                    readerElement.innerHTML = '';
                }

                setScannerInitialized(false);
                setScanner(null);
            }).catch((err) => {
                console.error('Failed to clear scanner:', err);
            });
        }
    };

    const cleanKeys = (data) => {
        const cleanedData = {};
        Object.keys(data).forEach((key) => {
            // Nettoie les guillemets et les caractères invisibles
            const cleanedKey = key.replace(/["\u200B-\u200D\uFEFF]/g, "").trim();
            cleanedData[cleanedKey] = data[key];
        });
        return cleanedData;
    };

    return (
        <div>
            {scannerInitialized ? (
                <button onClick={stopScanner}>Close Scan</button>
            ) : (
                <button onClick={startScanner}>Start Scan</button>
            )}
            <div id="reader" style={{width: '100%'}}></div>
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
            {error && <p style={{color: 'red'}}>{error}</p>}
        </div>
    );
};

export default BarcodeScanner;
