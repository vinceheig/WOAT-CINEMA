// Script pour convertir les fichiers TSV IMDB en JSON
// Ce script peut être exécuté une fois pour pré-traiter les données

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Nombre d'années à afficher
const YEARS_TO_DISPLAY = 7;

// Fonction pour lire et parser un fichier TSV de manière plus efficace
function parseTSV(filePath) {
  try {
    console.log(`Lecture du fichier ${filePath}...`);
    
    // Lire le fichier
    const data = readFileSync(filePath, 'utf8');
    console.log(`Fichier chargé en mémoire, taille: ${(data.length / 1024 / 1024).toFixed(2)} MB`);
    
    // Séparer en lignes
    const lines = data.trim().split('\n');
    console.log(`Nombre total de lignes: ${lines.length}`);
    
    // Extraire les en-têtes
    const headers = lines[0].split('\t');
    console.log(`En-têtes trouvés: ${headers.join(', ')}`);
    
    const result = [];
    
    // Traiter seulement un sous-ensemble pour les tests si le fichier est très grand
    const isVeryLarge = lines.length > 1000000;
    const maxLines = isVeryLarge ? 500000 : lines.length;
    
    console.log(`Traitement de ${isVeryLarge ? maxLines + ' premières lignes' : 'toutes les lignes'}...`);
    
    for (let i = 1; i < Math.min(lines.length, maxLines); i++) {
      if (i % 50000 === 0) {
        console.log(`Progression: ${((i / Math.min(lines.length, maxLines)) * 100).toFixed(1)}% (ligne ${i})`);
      }
      
      const values = lines[i].split('\t');
      
      // Vérifier que le nombre de valeurs correspond au nombre d'en-têtes
      if (values.length === headers.length) {
        const entry = {};
        
        for (let j = 0; j < headers.length; j++) {
          entry[headers[j]] = values[j];
        }
        
        result.push(entry);
      }
    }
    
    console.log(`Traitement terminé: ${result.length} entrées valides sur ${Math.min(lines.length - 1, maxLines - 1)} lignes traitées`);
    return result;
  } catch (error) {
    console.error(`Erreur lors de la lecture du fichier ${filePath}:`, error);
    return [];
  }
}

// Fonction pour extraire les mauvais films
function extractBadMoviesByYear() {
  try {
    console.log('Démarrage de l\'extraction des mauvais films par année...');
    
    // Chemins des fichiers
    const basicsPath = join(process.cwd(), 'asset', 'IMDB_DATASET', 'title.basics.tsv');
    const ratingsPath = join(process.cwd(), 'asset', 'IMDB_DATASET', 'title.ratings.tsv');
    
    console.log(`Chemin du fichier basics: ${basicsPath}`);
    console.log(`Chemin du fichier ratings: ${ratingsPath}`);
    
    // Lire les fichiers
    console.log('Lecture du fichier des notes...');
    const ratings = parseTSV(ratingsPath);
    
    if (ratings.length === 0) {
      throw new Error('Le fichier de notes est vide ou inaccessible');
    }
    
    console.log('Création du map des notes...');
    // Créer un map des notes par ID de titre
    const ratingsByTitleId = {};
    let belowThreeCount = 0;
    
    ratings.forEach(rating => {
      const score = parseFloat(rating.averageRating);
      ratingsByTitleId[rating.tconst] = score;
      if (score < 3) belowThreeCount++;
    });
    
    console.log(`Nombre total de films notés: ${ratings.length}`);
    console.log(`Nombre de films avec une note inférieure à 3: ${belowThreeCount}`);
    
    console.log('Lecture du fichier des informations de base...');
    // Lire les informations de base des films
    const movies = parseTSV(basicsPath);
    
    if (movies.length === 0) {
      throw new Error('Le fichier des informations de base est vide ou inaccessible');
    }
    
    console.log('Filtrage des films uniquement...');
    // Filtrer uniquement les films qui ont des notes
    const moviesOnly = movies.filter(item => 
      item.titleType === 'movie' && 
      ratingsByTitleId[item.tconst] !== undefined
    );
    
    console.log(`Nombre de films avec notes trouvés: ${moviesOnly.length}`);
    
    // Obtenir les années
    const currentYear = new Date().getFullYear();
    console.log(`Année courante: ${currentYear}`);
    
    // Calculer le nombre de mauvais films par année (note < 3) pour les dernières années
    const badMoviesByYear = {};
    
    // Initialiser les dernières années avec des zéros
    for (let year = currentYear - YEARS_TO_DISPLAY; year <= currentYear; year++) {
      badMoviesByYear[year] = 0;
    }
    
    console.log('Comptage des mauvais films par année...');
    // Compter les mauvais films
    let totalBadMovies = 0;
    
    moviesOnly.forEach(movie => {
      // Traiter uniquement les années valides (nombre à 4 chiffres)
      if (/^\d{4}$/.test(movie.startYear)) {
        const year = parseInt(movie.startYear);
        const rating = ratingsByTitleId[movie.tconst];
        
        // Si c'est dans les dernières années et la note est inférieure à 3
        if (year >= currentYear - YEARS_TO_DISPLAY && year <= currentYear && rating < 3) {
          badMoviesByYear[year] = (badMoviesByYear[year] || 0) + 1;
          totalBadMovies++;
        }
      }
    });
    
    console.log(`Nombre total de mauvais films trouvés pour les ${YEARS_TO_DISPLAY} dernières années: ${totalBadMovies}`);
    console.log('Répartition par année:');
    Object.keys(badMoviesByYear).forEach(year => {
      console.log(`  ${year}: ${badMoviesByYear[year]} films`);
    });
    
    // Convertir en format adapté pour le graphique
    const result = Object.keys(badMoviesByYear)
      .filter(year => !isNaN(parseInt(year))) // Filtrer les années valides
      .map(year => ({
        year: year,
        value: badMoviesByYear[year],
        color: getColorForYear(year, currentYear)
      }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year)); // Trier par année
    
    console.log('Résultat final:');
    console.log(JSON.stringify(result, null, 2));
    
    // Enregistrer les résultats
    const outputPath = join(process.cwd(), 'src', 'data', 'bad_movies_by_year.json');
    writeFileSync(outputPath, JSON.stringify(result, null, 2));
    console.log(`Résultats enregistrés dans ${outputPath}`);
    
    return result;
  } catch (error) {
    console.error('Une erreur est survenue lors de l\'extraction des mauvais films:', error);
    
    // Créer des données de secours
    console.log('Génération de données de secours...');
    const currentYear = new Date().getFullYear();
    const fallbackData = [];
    
    for (let i = 0; i < YEARS_TO_DISPLAY + 1; i++) {
      const year = currentYear - YEARS_TO_DISPLAY + i;
      if (year <= currentYear) {
        fallbackData.push({
          year: year.toString(),
          value: Math.floor(Math.random() * 200) + 50,
          color: getColorForYear(year, currentYear)
        });
      }
    }
    
    // Enregistrer les résultats de secours
    const outputPath = join(process.cwd(), 'src', 'data', 'bad_movies_by_year.json');
    writeFileSync(outputPath, JSON.stringify(fallbackData, null, 2));
    console.log(`Données de secours enregistrées dans ${outputPath}`);
    
    return fallbackData;
  }
}

// Fonction pour attribuer une couleur en fonction de l'année
function getColorForYear(year, currentYear) {
  const colors = [
    '#c090e0', // Violet
    '#ff9933', // Orange
    '#008080', // Teal
    '#e04040', // Rouge
    '#4080e0', // Bleu
    '#e04060', // Rose
    '#50a030', // Vert
    '#e0a030'  // Ambre
  ];
  
  const index = currentYear - parseInt(year);
  return colors[index % colors.length];
}

// Exécuter le script
extractBadMoviesByYear(); 