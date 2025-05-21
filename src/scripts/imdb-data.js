// Script pour charger les données IMDB pré-traitées

// Fonction pour charger les données pré-traitées depuis un fichier JSON
async function loadDataFromJSON() {
    try {
        console.log("Tentative de chargement des données JSON...");
        const response = await fetch('../asset/IMDB_DATASET/bad_movies_by_country.json');
        
        if (!response.ok) {
            console.warn("Fichier JSON non trouvé, utilisation des données d'exemple à la place");
            return loadSampleData();
        }
        
        const data = await response.json();
        console.log("Données JSON chargées avec succès");
        return data;
    } catch (error) {
        console.error("Erreur lors du chargement des données JSON:", error);
        console.log("Utilisation des données d'exemple à la place");
        return loadSampleData();
    }
}

// Fonction pour charger des données d'exemple (à utiliser si les données réelles ne sont pas disponibles)
function loadSampleData() {
    console.log("Chargement des données d'exemple...");
    // Exemple de données pré-calculées pour le développement
    return {
        "US": 150,
        "GB": 45,
        "FR": 30,
        "DE": 25,
        "CA": 20,
        "AU": 15,
        "JP": 12,
        "IT": 10,
        "ES": 8,
        "CN": 7,
        "IN": 6,
        "BR": 5,
        "MX": 4,
        "RU": 3,
        "KR": 2,
        "ZA": 1
    };
}

// Création d'un fichier JSON de données d'exemple dans le dossier assets
async function createSampleDataJSON() {
    try {
        const sampleData = loadSampleData();
        
        // Si nous sommes dans un navigateur, nous ne pouvons pas écrire directement un fichier
        console.log("Pour créer un fichier d'exemple, exécutez le script de conversion TSV->JSON");
        
        return sampleData;
    } catch (error) {
        console.error("Erreur lors de la création du fichier d'exemple:", error);
        return loadSampleData();
    }
}

export { loadDataFromJSON, loadSampleData, createSampleDataJSON }; 