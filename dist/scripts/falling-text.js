// Configuration de l'animation
const config = {
    text: ["en chute libre", "Catégories"],
    duration: 2000, // durée de l'animation en ms
    bounceHeight: 100, // hauteur du rebond en pixels
    gravity: 0.5, // facteur de gravité
    dispersalDuration: 1500, // Duration for dispersal animation
    charWidth: 90, // Augmenté pour la nouvelle taille de police
    lineHeight: 220, // Augmenté pour la nouvelle taille de police
    fontSize: 200, // Nouvelle taille de police
    dispersalRange: 1200, // Augmenté pour un effet plus spectaculaire
    rotationRange: 1440 // Augmenté pour plus de rotation
};

// Création du SVG
const svg = d3.select("#falling-text")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%");

// Split text into letters and create individual text elements
// On inverse l'ordre des lignes pour que la première soit ajoutée en dernier (donc au-dessus)
const lettersData = config.text
    .map((line, lineIndex) => ({line, lineIndex}))
    .reverse() // Inverse l'ordre des lignes
    .flatMap(({line, lineIndex}, revIndex, arr) =>
        line.split("").map((char, i) => ({
            char,
            index: i,
            lineIndex: arr.length - 1 - revIndex, // On remet le bon index logique
            totalIndex: (arr.length - 1 - revIndex) * line.length + i
        }))
    );

const letterElements = svg.selectAll(".falling-text")
    .data(lettersData)
    .enter()
    .append("text")
    .attr("class", "falling-text")
    .attr("data-line", d => d.lineIndex)
    .text(d => d.char)
    .attr("font-size", config.fontSize + "px")
    .attr("text-anchor", "middle")
    .attr("y", -150);

// Fonction pour calculer la position Y en fonction du temps
function calculateY(t) {
    const windowHeight = window.innerHeight;
    const textHeight = config.fontSize; // Utilisation de la nouvelle taille de police
    const finalY = windowHeight - textHeight;
    
    // Interpolate y from start (-150) to finalY with acceleration
    const startY = -150; // Adjusted startY
    const y = startY + (finalY - startY) * Math.pow(t, 2);
    
    // Ajout d'un rebond si on atteint le bas
    if (y > finalY) {
        const bounce = Math.sin((y - finalY) / config.bounceHeight * Math.PI) * config.bounceHeight;
        return finalY - bounce;
    }
    
    return y;
}

// Animation de chute façon "pile de lettres"
function startFallingAnimation() {
    const maxLineLength = Math.max(...config.text.map(line => line.length));
    const centerX = (window.innerWidth / 2);
    const letterWidth = config.charWidth;
    const letterHeight = config.fontSize * 0.95;
    const pileBottom = window.innerHeight - 40; // Décalage du bas de la fenêtre

    // Pour chaque ligne, on va empiler les lettres
    let piles = config.text.map(line => []); // piles[lineIndex] = [{x, y, rotation}]

    letterElements.transition()
        .duration(config.duration)
        .ease(d3.easeQuadIn)
        .attrTween("transform", function(d, i) {
            // Position X de départ (centré)
            const line = config.text[d.lineIndex];
            const lineLength = line.length;
            const lineOffsetY = d.lineIndex * config.lineHeight;
            const letterXOffset = (d.index - (lineLength - 1) / 2) * letterWidth;
            const letterStartX = centerX + letterXOffset;
            return function(t) {
                // Animation verticale
                const y = -150 + (pileBottom - lineOffsetY + 150) * t;
                return `translate(${letterStartX}, ${y})`;
            };
        })
        .on("end", function(d, i) {
            // Calcul de la position finale dans la pile
            const line = config.text[d.lineIndex];
            const lineLength = line.length;
            const lineOffsetY = d.lineIndex * config.lineHeight;
            const letterXOffset = (d.index - (lineLength - 1) / 2) * letterWidth;
            let x = centerX + letterXOffset;
            let y = pileBottom - lineOffsetY;
            let rotation = (Math.random() - 0.5) * 60; // -30° à +30°

            // Décalage Y pour simuler l'empilement (chevauchement)
            // On regarde les lettres déjà posées sur cette ligne
            if (piles[d.lineIndex].length > 0) {
                // On décale la lettre vers le haut si elle "touche" une autre
                let overlap = false;
                do {
                    overlap = false;
                    for (const placed of piles[d.lineIndex]) {
                        if (Math.abs(x - placed.x) < letterWidth * 0.8 && Math.abs(y - placed.y) < letterHeight * 0.8) {
                            y = placed.y - letterHeight * 0.25; // Décale un peu vers le haut
                            overlap = true;
                        }
                    }
                } while (overlap);
            }
            piles[d.lineIndex].push({x, y, rotation});

            // Animation finale : effet "pile"
            d3.select(this)
                .transition()
                .duration(300)
                .attr("transform", `translate(${x}, ${y}) rotate(${rotation})`);
        });

    // Après l'animation, on place les lettres de la première ligne au-dessus
    setTimeout(() => {
        const svgNode = svg.node();
        const firstLineLetters = svgNode.querySelectorAll('text[data-line="0"]');
        firstLineLetters.forEach(el => svgNode.appendChild(el));
    }, config.duration + 350);
}

// Démarrer l'animation
// We need to wait for the initial layout to be ready to calculate accurate initial positions
window.addEventListener("load", function(){
     startFallingAnimation();
});


// Redimensionnement de la fenêtre
window.addEventListener("resize", function() {
    svg.attr("width", window.innerWidth)
       .attr("height", window.innerHeight);
    
    const maxLineLength = Math.max(...config.text.map(line => line.length));
    const startX = (window.innerWidth / 2);

    letterElements
        .attr("y", -150)
        .attr("transform", (d, i) => {
            const lineOffset = d.lineIndex * config.lineHeight;
            const letterXOffset = (d.index - (config.text[d.lineIndex].length - 1) / 2) * config.charWidth;
            const letterStartX = startX + letterXOffset;
            return `translate(${letterStartX}, ${-150 + lineOffset})`;
        });
    // Après le resize, on replace la première ligne au-dessus
    const svgNode = svg.node();
    const firstLineLetters = svgNode.querySelectorAll('text[data-line="0"]');
    firstLineLetters.forEach(el => svgNode.appendChild(el));
}); 