import React, {useState} from 'react';
import axios from 'axios';

const SearchComponent = () => {
    const [query, setQuery] = useState(''); // État pour la requête de recherche
    const [results, setResults] = useState([]); // État pour stocker les résultats de la recherche
    const [error, setError] = useState(''); // État pour gérer les erreurs

    // Fonction pour gérer le changement dans la barre de recherche
    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    // Fonction pour nettoyer les clés des objets
    const cleanKeys = (data) => {
        return data.map((item) => {
            const cleanedItem = {};
            Object.keys(item).forEach((key) => {
                // Nettoie les guillemets et les caractères invisibles
                const cleanedKey = key.replace(/["\u200B-\u200D\uFEFF]/g, "").trim();
                cleanedItem[cleanedKey] = item[key];
            });
            return cleanedItem;
        });
    };


    // Fonction pour effectuer la recherche lorsqu'on soumet le formulaire
    const handleSearch = async (e) => {
        e.preventDefault();
        setError(''); // Réinitialise l'erreur avant chaque nouvelle recherche

        try {
            // Requête à l'API avec la query
            const response = await axios.get(
                `https://api-barcode-reader.vercel.app/api/search?query=${encodeURIComponent(query)}`
            );

            // Nettoie les clés des résultats avant de les utiliser
            const cleanedResults = cleanKeys(response.data);
            console.log(cleanedResults); // Affiche les résultats nettoyés pour vérification
            setResults(cleanedResults);
        } catch (err) {
            // Gère les erreurs de requête
            if (err.response && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Erreur lors de la recherche.');
            }
        }
    };


    return (
        <div className="search-container">
            <h2>Recherche de PC</h2>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Entrez un texte pour rechercher"
                    className="search-input"
                />
                <button type="submit" className="search-button">
                    Rechercher
                </button>
            </form>

            {/* Affichage des erreurs si présentes */}
            {error && <p className="error-message">{error}</p>}

            {/* Affichage des résultats */}
            <div className="results-container">
                {results.length > 0 ? (
                    results.map((item, index) => (
                        <div key={index} className="result-item">
                            <h3>Modèle: {item.Modèle}</h3>
                            <p>SN: {item.SN}</p>
                            <p>N° Chargeur: {item['N° Chargeur']}</p>
                            <p>Propriétaire: {item.Propriétaire}</p>
                            <p>Statut: {item.Statut}</p>
                            <p>Garanti: {item.Garanti}</p>
                            <p>Contrat: {item.Contrat}</p>
                            <p>Commentaires: {item.Commentaires}</p>
                            <p>Date Garantie: {item['Date Garantie']}</p>
                            <p>Provenance: {item.Provenance}</p>
                        </div>
                    ))
                ) : (
                    <p>Aucun résultat trouvé.</p>
                )}
            </div>
        </div>
    );
};

export default SearchComponent;
