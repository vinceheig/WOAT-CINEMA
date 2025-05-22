// Données simplifiées avec des pourcentages qui s'additionnent à 100%
// const data = [ ... ]; // Supprimé

// Dimensions
const width = window.innerWidth;
const margin = { top: 220, right: 0, bottom: 0, left: 0 }; // Augmentation de la marge supérieure
const totalHeight = window.innerHeight;
const barAreaHeight = totalHeight - margin.top; // Hauteur totale disponible pour les barres

// Charger les données depuis le fichier JSON
d3.json("data/bad_movies_by_genre.json").then(function(loadedData) {

    let data = loadedData; // Utiliser les données chargées, changer de const à let

    // Limiter les données aux 4 premiers genres
    data = data.slice(0, 4);

    // Garder uniquement les 4 premiers genres (ou un autre nombre si l'utilisateur a changé manuellement)
    // Assurons-nous de prendre le nombre d'éléments actuel dans 'data' après la coupe
    const numberOfBars = data.length; // Obtenir le nombre actuel de barres

    // Recalculer la hauteur de chaque barre si le nombre a changé
    const dynamicBarHeight = barAreaHeight / numberOfBars; // Nouvelle hauteur pour chaque barre si elles étaient réparties également

    // Définir un tableau de couleurs pour les barres
    const barColors = ["#6CF65E", "#8C80FF", "#FF6054", "#9C03D8"]; // Nouvelles couleurs pour les barres

    // Calculer la valeur totale pour l'échelle des hauteurs et les pourcentages
    const totalValue = d3.sum(data, d => d.value);

    // Création d'une échelle pour la hauteur basée sur les valeurs
    const yScale = d3.scaleLinear()
        .domain([0, totalValue])
        .range([0, barAreaHeight]);

    // Calcul des positions Y et hauteurs des barres en fonction de leurs valeurs
    let currentY = margin.top;
    const barPositions = data.map(d => {
        const barHeight = yScale(d.value);
        const startY = currentY;
        currentY += barHeight;
        // Calculer le pourcentage pour l'affichage du label
        const percentage = (d.value / totalValue) * 100;
        return { ...d, startY: startY, barHeight: barHeight, percentage: percentage };
    });

    // Création du SVG
    const svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", width)
        .attr("height", totalHeight)
        .attr("class", "bar-chart")
        .style("display", "block");

    // Ajout du titre
    svg.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", margin.top / 2 + 40) // Centrer le titre un peu plus bas dans la nouvelle marge
        .attr("text-anchor", "middle")
        .style("font-size", "72px")
        .style("font-weight", "bold")
        .style("fill", "white")
        .text("Les genres les plus mal-aimés");

    // Ajout des barres avec animation
    const bars = svg.selectAll("rect")
        .data(barPositions)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", d => d.startY) // Utilise la position Y calculée
        .attr("height", d => d.barHeight) // Utilise la hauteur calculée
        .attr("width", 0) // Commence avec une largeur de 0
        .attr("fill", (d, i) => barColors[i % barColors.length]) // Utilise les couleurs du tableau, en cyclant si nécessaire
        .transition() // Ajoute une transition
        .duration(1000) // Durée de l'animation en ms
        .delay((d, i) => i * 200) // Délai entre chaque barre
        .attr("width", width); // Largeur finale

    // Ajout des titres des barres avec animation
    svg.selectAll(".bar-title")
        .data(barPositions)
        .enter()
        .append("text")
        .attr("class", "bar-title")
        .attr("x", 150) // Garde la position x à 150
        .attr("y", d => d.startY + 40) // Positionné près du haut de la barre (était centré verticalement)
        .attr("dy", "0.35em") // Garde l'alignement de base
        .style("text-anchor", "start") // Ancrage au début (aligné à gauche)
        .style("fill", "black")
        .style("font-size", "32px")
        .style("font-weight", "bold") // Garde le gras pour le genre lui-même
        .style("font-family", "Verdana, Geneva, sans-serif")
        .style("opacity", 0)
        // Ajoute le numéro (index + 1) avant le texte du genre
        .text((d, i) => (i + 1) + ". " + d.platform)
        .transition()
        .duration(1000)
        .delay((d, i) => i * 200 + 500)
        .style("opacity", 1);

    // Ajout des pourcentages avec animation
    svg.selectAll(".bar-label")
        .data(barPositions)
        .enter()
        .append("text")
        .attr("class", "bar-label")
        .attr("x", width - 250) // Garde la position x à width - 250
        .attr("y", d => d.startY + (d.barHeight / 2)) // Centré verticalement dans la barre
        .attr("dy", "0.35em")
        .style("text-anchor", "end") // Ancrage à la fin (aligné à droite)
        .style("fill", "black")
        .style("font-size", "72px")
        .style("font-family", "Verdana, Geneva, sans-serif")
        .style("font-weight", "normal") // Mis en normal (était bold)
        .style("opacity", 0)
        // Afficher le pourcentage calculé
        .text(d => d.percentage.toFixed(1).replace('.', ',') + "%")
        .transition()
        .duration(1000)
        .delay((d, i) => i * 200 + 500)
        .style("opacity", 1);

}).catch(function(error) {
    // Gérer les erreurs de chargement du fichier JSON
    console.error("Erreur lors du chargement des données JSON :", error);
});

