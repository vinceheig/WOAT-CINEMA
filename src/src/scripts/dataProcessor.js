// Fonction pour lire et traiter les données IMDB
async function processIMDBData() {
    try {
        // Lire les fichiers TSV
        const ratingsData = await d3.tsv('src/data/IMDB_DATASET/title.ratings.tsv');
        const basicsData = await d3.tsv('src/data/IMDB_DATASET/title.basics.tsv');

        // Filtrer les films (pas les séries TV, etc.)
        const movies = basicsData.filter(item => item.titleType === 'movie');

        // Joindre les données de notation avec les informations de base des films
        const moviesWithRatings = movies.map(movie => {
            const rating = ratingsData.find(r => r.tconst === movie.tconst);
            return {
                ...movie,
                averageRating: rating ? parseFloat(rating.averageRating) : null,
                numVotes: rating ? parseInt(rating.numVotes) : 0
            };
        });

        // Filtrer les films avec un minimum de votes pour éviter les films obscurs
        const minVotes = 1000;
        const significantMovies = moviesWithRatings.filter(movie => 
            movie.numVotes >= minVotes && movie.averageRating !== null
        );

        // Trier par note moyenne (croissant)
        significantMovies.sort((a, b) => a.averageRating - b.averageRating);

        // Calculer les statistiques
        const stats = {
            worstMovie: significantMovies[0],
            averageRating: d3.mean(significantMovies, d => d.averageRating).toFixed(1),
            totalMovies: significantMovies.length,
            worstYear: significantMovies[0].startYear
        };

        return stats;
    } catch (error) {
        console.error('Erreur lors du traitement des données:', error);
        return null;
    }
}

// Fonction pour mettre à jour les statistiques dans la slide de récapitulation
async function updateRecapStats() {
    const stats = await processIMDBData();
    if (!stats) return;

    // Mettre à jour les valeurs dans le DOM
    document.querySelector('.stat-value.average').textContent = `${stats.averageRating}★`;
    document.querySelector('.stat-value.worst-movie').textContent = stats.worstMovie.primaryTitle;
    document.querySelector('.stat-value.year').textContent = stats.worstYear;

    // Ajouter une classe pour déclencher les animations
    document.querySelectorAll('.stat-item').forEach(item => item.classList.add('animate'));
    document.querySelector('.recap-title').classList.add('animate');
    document.querySelector('.recap-container').classList.add('animate');
}

// Appeler la fonction lorsque la troisième slide devient active
document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.id === 'recap-slide') {
                updateRecapStats();
            }
        });
    }, { threshold: 0.5 });

    const recapSlide = document.getElementById('recap-slide');
    if (recapSlide) {
        observer.observe(recapSlide);
    }
}); 