# WOAT-CINEMA
- **Contexte : d'où viennent les données, qui les a créées et dans quel contexte**

Les données recensées proviennent principalement de sites spécialisés dans le cinéma tels qu'IMDb et Rotten Tomatoes, afin d’identifier les tendances et les échecs cinématographiques. Certaines de ces sources sont également utilisées pour l’entraînement des intelligences artificielles, notamment sur des plateformes comme Kaggle.

- **Sources de données envisagées**

**Tableau contexte:**

| **Source** | **Origine & Contexte** | **Structure & Format des Données** | **Lien** |
| --- | --- | --- | --- |
| **The Movies Dataset - Kaggle** | Créé par Rounak Banik, contient des métadonnées sur 45 000+ films et 26M de notes. | Plusieurs fichiers CSV (films, notes, crédits, mots-clés, etc.), colonnes pour titres, genres, votes... | <https://www.kaggle.com/datasets/rounakbanik/the-movies-dataset/datax> |
| **TMDB Movies Daily Updates - Kaggle** | Notebook Kaggle utilisant l’API TMDB pour récupérer des mises à jour quotidiennes. | Format JSON avec attributs : titre, date de sortie, casting, synopsis... | <https://www.kaggle.com/code/asaniczka/tmdb-movies-daily-updates/notebook> |
| **IMDb Non-Commercial Datasets** | Données fournies par IMDb pour usage personnel/non-commercial, mises à jour quotidiennement. | Fichiers TSV (films, notes, acteurs...), colonnes : ID, titre, année, genre, durée, notes... | <https://developer.imdb.com/non-commercial-datasets/> |
| **Rotten Tomatoes APIs (via RapidAPI)** | API permettant d’accéder aux critiques et scores de Rotten Tomatoes. | Réponses JSON incluant scores critiques/public, synopsis, date de sortie... | <https://rapidapi.com/collection/rotten-tomatoes-api> |
| **TMDB API** | API officielle de The Movie Database pour accéder aux données films/séries/acteurs. | Réponses JSON structurées avec titres, synopsis, genres, images, casting... | [https://developer.themoviedb.org](https://developer.themoviedb.org/) |

**Tableau description :**

| **Source** | **Format des Données** | **Attributs Principaux** | **Type de Données** | **Lien** |
| --- | --- | --- | --- | --- |
| **The Movies Dataset - Kaggle** | CSV | Titre, genres, date de sortie, budget, recettes, notes utilisateurs, casting | Texte, numérique, catégoriel | <https://www.kaggle.com/datasets/rounakbanik/the-movies-dataset/data> |
| **TMDB Movies Daily Updates - Kaggle** | JSON | Titre, date de sortie, synopsis, casting, popularité, notes | Texte, numérique, catégoriel | <https://www.kaggle.com/code/asaniczka/tmdb-movies-daily-updates/notebook> |
| **IMDb Non-Commercial Datasets** | TSV | ID IMDb, titre, année, genre, durée, notes, acteurs | Texte, numérique, catégoriel | <https://developer.imdb.com/non-commercial-datasets/> |
| **Rotten Tomatoes APIs (via RapidAPI)** | JSON | Titre, score critiques, score public, synopsis, date de sortie | Texte, numérique | <https://rapidapi.com/collection/rotten-tomatoes-api> |
| **TMDB API** | JSON | Titre, synopsis, genre, casting, images, note moyenne, date de sortie | Texte, numérique, images | [https://developer.themoviedb.org](https://developer.themoviedb.org/) |

**Références**

| **Source** | **Utilisation pour notre projet** | **Qui d'autre a utilisé ces données et pourquoi ?** | **Lien** |
| --- | --- | --- | --- |
| **The Movies Dataset - Kaggle** | Analyser les tendances des films les plus mal notés, identifier les studios et acteurs les plus impliqués dans les échecs | Chercheurs en data science et IA pour l’analyse des tendances cinématographiques et les systèmes de recommandation | <https://www.kaggle.com/datasets/rounakbanik/the-movies-dataset/data> |
| **TMDB Movies Daily Updates - Kaggle** | Suivre en temps réel les films en baisse de popularité, observer les tendances actuelles des films mal notés | Développeurs et analystes pour suivre la popularité des films en temps réel | <https://www.kaggle.com/code/asaniczka/tmdb-movies-daily-updates/notebook> |
| **IMDb Non-Commercial Datasets** | Explorer les notes historiques pour analyser l’évolution des films mal notés et comparer leur succès critique et commercial | Journalistes et cinéphiles pour rédiger des analyses sur l’évolution du cinéma et les performances d’acteurs | <https://developer.imdb.com/non-commercial-datasets/> |
| **Rotten Tomatoes APIs (via RapidAPI)** | Comparer les scores critiques et publics pour voir si un film mal noté est aussi un échec commercial | Sites critiques et plateformes de streaming pour enrichir leurs recommandations et comparer critiques vs public | <https://rapidapi.com/collection/rotten-tomatoes-api> |
| **TMDB API** | Obtenir des informations sur les films, casting et studios responsables des plus gros échecs | Applications et entreprises de médias pour créer des interfaces interactives et personnaliser les recommandations | [https://developer.themoviedb.org](https://developer.themoviedb.org/) |

- **But : qu'est-ce que vous voulez découvrir ? Des tendances ? Vous voulez explorer ou expliquer ?**

Ce projet de visualisation des données vise à explorer l’histoire des pires films du cinéma en s’appuyant sur des critères critiques et commerciaux. Il explore les tendances et les facteurs d’échec en mettant en lumière les acteurs, genres et studios les plus concernés. L’étude portera sur l’évolution des films mal notés au fil du temps, l’impact des choix de carrière de certains acteurs, la relation entre succès critique et commercial, ainsi que les genres et catégories les plus représentés parmi ces échecs.

- **Références : Qui d'autre dans le web ou dans la recherche a utilisé ces données ? Dans quel but ?**

Ces données sont aussi utilisées par les spectateurs pour se renseigner sur les films avant de les voir et affiner leurs choix en fonction des avis critiques et populaires.

Beaucoup d'inspirations pour notre sujet peuvent être trouvée sur le site de Tableau https://www.tableau.com/gallery/data-plus-movies

Voici d'autres inspirations pour les visuel envisagés:
![https://public.tableau.com/static/images/Da/DataPlusMoviesStarterDashboard_16996607947340/AdamSandlerFilmography/4_3.png](https://github.com/vinceheig/WOAT-CINEMA/blob/main/inspirations/4_3.jpg?raw=true)
![https://public.tableau.com/static/images/AL/ALLABOUTPEDRO/TSP/4_3_hd.png](https://github.com/vinceheig/WOAT-CINEMA/blob/main/inspirations/4_3_hd.jpg?raw=true)
