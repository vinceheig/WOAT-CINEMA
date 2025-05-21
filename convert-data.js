// Script pour exécuter la conversion de données TSV vers JSON
import { spawn } from 'child_process';
import { resolve, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

console.log('===== CONVERSION DES DONNÉES IMDB EN JSON =====');
console.log('Ce script va convertir les fichiers TSV IMDB en JSON pour le graphique.');
console.log('Attention: les fichiers IMDB sont volumineux et le traitement peut prendre plusieurs minutes.');
console.log('============================================');

// Créer le dossier data s'il n'existe pas
const dataDir = join('src', 'data');
if (!existsSync(dataDir)) {
  console.log(`Création du dossier ${dataDir}...`);
  mkdirSync(dataDir, { recursive: true });
} else {
  console.log(`Le dossier ${dataDir} existe déjà.`);
}

// Vérifier la présence des fichiers IMDB
const imdbDir = join('asset', 'IMDB_DATASET');
if (!existsSync(imdbDir)) {
  console.error(`ERREUR: Le dossier ${imdbDir} n'existe pas!`);
  console.error('Veuillez vérifier que les fichiers IMDB sont bien présents dans ce dossier.');
  process.exit(1);
}

const requiredFiles = [
  join(imdbDir, 'title.basics.tsv'),
  join(imdbDir, 'title.ratings.tsv')
];

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    console.error(`ERREUR: Le fichier ${file} n'existe pas!`);
    console.error('Veuillez télécharger les données IMDB depuis https://datasets.imdbws.com/');
    process.exit(1);
  } else {
    console.log(`Fichier trouvé: ${file}`);
  }
}

// Exécuter le script de conversion
console.log('\nDémarrage de la conversion des données...');
const convertProcess = spawn('node', ['src/scripts/tsv-to-json.js'], {
  stdio: 'inherit'
});

convertProcess.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Conversion terminée avec succès !');
    console.log('Pour visualiser le graphique, exécutez:');
    console.log('  npm run dev');
    console.log('\nPuis ouvrez votre navigateur à l\'adresse: http://localhost:3000');
  } else {
    console.error(`\n❌ La conversion a échoué avec le code de sortie ${code}`);
    console.error('Vérifiez les messages d\'erreur ci-dessus pour plus d\'informations.');
  }
}); 