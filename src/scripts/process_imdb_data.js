import fs from 'fs';
import readline from 'readline';
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Chemins vers les fichiers d'entrée et de sortie
const ratingsFilePath = path.join(__dirname, '..', 'asset', 'IMDB_DATASET', 'title.ratings.tsv');
const basicsFilePath = path.join(__dirname, '..', 'asset', 'IMDB_DATASET', 'title.basics.tsv');
const outputJsonPath = path.join(__dirname, 'data', 'bad_movies_by_genre.json');

// Seuil de note
const RATING_THRESHOLD = 3.0;

async function processData() {
    console.log(`Début du traitement des fichiers IMDB...`);

    // Étape 1: Lire title.ratings.tsv et collecter les tconst des films mal notés
    const badMovieTconsts = new Set();
    console.log(`Lecture de ${ratingsFilePath} pour trouver les films mal notés...`);
    const ratingsFileStream = fs.createReadStream(ratingsFilePath);
    const ratingsRl = readline.createInterface({
        input: ratingsFileStream,
        crlfDelay: Infinity // Pour gérer correctement les fins de ligne
    });

    let isFirstLineRatings = true;
    let tconstIndexRatings = -1;
    let ratingIndexRatings = -1;

    for await (const line of ratingsRl) {
        if (isFirstLineRatings) {
            // En-tête
            const headers = line.split('\t');
            tconstIndexRatings = headers.indexOf('tconst');
            ratingIndexRatings = headers.indexOf('averageRating');
            if (tconstIndexRatings === -1 || ratingIndexRatings === -1) {
                console.error("Erreur: Colonnes 'tconst' ou 'averageRating' non trouvées dans title.ratings.tsv");
                return; // Arrêter si les colonnes ne sont pas trouvées
            }
            isFirstLineRatings = false;
        } else {
            // Ligne de données
            const columns = line.split('\t');
            try {
                const tconst = columns[tconstIndexRatings];
                const averageRating = parseFloat(columns[ratingIndexRatings]);

                if (!isNaN(averageRating) && averageRating < RATING_THRESHOLD) {
                    badMovieTconsts.add(tconst);
                }
            } catch (e) {
                // Ignorer les lignes avec des erreurs de parsing
                // console.error(`Erreur lors du traitement de la ligne: ${line}`, e);
            }
        }
    }
    console.log(`Trouvé ${badMovieTconsts.size} films avec une note inférieure à ${RATING_THRESHOLD}.`);

    // Étape 2 & 3: Lire title.basics.tsv et compter les genres pour les films mal notés
    const genreCounts = {};
    console.log(`Lecture de ${basicsFilePath} pour collecter les genres...`);
    const basicsFileStream = fs.createReadStream(basicsFilePath);
    const basicsRl = readline.createInterface({
        input: basicsFileStream,
        crlfDelay: Infinity // Pour gérer correctement les fins de ligne
    });

    let isFirstLineBasics = true;
    let tconstIndexBasics = -1;
    let genresIndexBasics = -1;

    for await (const line of basicsRl) {
        if (isFirstLineBasics) {
            // En-tête
            const headers = line.split('\t');
            tconstIndexBasics = headers.indexOf('tconst');
            genresIndexBasics = headers.indexOf('genres');
            if (tconstIndexBasics === -1 || genresIndexBasics === -1) {
                console.error("Erreur: Colonnes 'tconst' ou 'genres' non trouvées dans title.basics.tsv");
                return; // Arrêter si les colonnes ne sont pas trouvées
            }
            isFirstLineBasics = false;
        } else {
            // Ligne de données
            const columns = line.split('\t');
             try {
                const tconst = columns[tconstIndexBasics];

                // Vérifier si ce film est dans notre liste de films mal notés
                if (badMovieTconsts.has(tconst)) {
                    const genresStr = columns[genresIndexBasics];

                    // Séparer les genres s'ils existent et ne sont pas la valeur manquante '\\N'
                    if (genresStr && genresStr !== '\\N') {
                        const genres = genresStr.split(',');
                        for (const genre of genres) {
                            const cleanedGenre = genre.trim();
                            if (cleanedGenre) {
                                genreCounts[cleanedGenre] = (genreCounts[cleanedGenre] || 0) + 1;
                            }
                        }
                    }
                }
            } catch (e) {
                 // Ignorer les lignes avec des erreurs de parsing
                 // console.error(`Erreur lors du traitement de la ligne: ${line}`, e);
            }
        }
    }
    console.log(`Genres comptés pour les films mal notés.`);

    // Étape 4: Exporter en JSON
    // Convertir l'objet de comptage en liste d'objets pour une utilisation facile en D3
    const resultData = Object.keys(genreCounts).map(genre => ({
        platform: genre, // Utiliser "platform" pour correspondre à la structure actuelle de votre D3
        value: genreCounts[genre] // Le nombre de films, pas encore le pourcentage
    }));

    // Vous pouvez trier par nombre si vous le souhaitez
    resultData.sort((a, b) => b.value - a.value);

    // Assurez-vous que le répertoire 'src/data' existe
    const dataDir = path.join(__dirname, 'data');
     if (!fs.existsSync(dataDir)){
        fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(outputJsonPath, JSON.stringify(resultData, null, 4), 'utf8');

    console.log(`Données traitées et sauvegardées dans ${outputJsonPath}`);
}

// Exécuter le processus
processData().catch(console.error);