const title = "CARTOGRAPHIE\nDU FLOP";
const container = d3.select("#animated-title");
const width = window.innerWidth;
const height = window.innerHeight;

// Configuration de l'animation
const config = {
    duration: 3000,
    fontSize: 120,
    containerWidth: "80vw"
};

// Création du conteneur principal
const main = container.append("main")
    .style("width", config.containerWidth)
    .style("margin", "auto")
    .style("white-space", "nowrap");

// Création des éléments de texte
const lines = title.split("\n");
lines.forEach((line, lineIndex) => {
    const lineContainer = main.append("div")
        .style("display", "flex")
        .style("justify-content", "center")
        .style("margin-bottom", lineIndex === 0 ? "20px" : "0");

    // Animation de la première ligne
    if (lineIndex === 0) {
        const firstPart = line.slice(0, 6); // "CARTOG"
        const secondPart = line.slice(6);   // "RAPHIE"

        // Première partie avec animation
        lineContainer.append("div")
            .style("font-family", "Inconsolata")
            .style("font-size", `${config.fontSize}px`)
            .style("color", "white")
            .style("font-variation-settings", '"wght" 275, "wdth" 50')
            .text(firstPart)
            .transition()
            .duration(config.duration)
            .ease(d3.easeCubic)
            .styleTween("font-variation-settings", () => {
                return function(t) {
                    const weight = Math.round(275 + (900 - 275) * Math.sin(t * Math.PI));
                    const width = Math.round(50 + (200 - 50) * Math.sin(t * Math.PI));
                    return `"wght" ${weight}, "wdth" ${width}`;
                };
            })
            .transition()
            .duration(config.duration)
            .ease(d3.easeCubic)
            .styleTween("font-variation-settings", () => {
                return function(t) {
                    const weight = Math.round(900 - (900 - 275) * Math.sin(t * Math.PI));
                    const width = Math.round(200 - (200 - 50) * Math.sin(t * Math.PI));
                    return `"wght" ${weight}, "wdth" ${width}`;
                };
            });

        // Deuxième partie avec animation inverse
        lineContainer.append("div")
            .style("font-family", "Inconsolata")
            .style("font-size", `${config.fontSize}px`)
            .style("color", "white")
            .style("font-variation-settings", '"wght" 900, "wdth" 200')
            .text(secondPart)
            .transition()
            .duration(config.duration)
            .ease(d3.easeCubic)
            .styleTween("font-variation-settings", () => {
                return function(t) {
                    const weight = Math.round(900 - (900 - 275) * Math.sin(t * Math.PI));
                    const width = Math.round(200 - (200 - 50) * Math.sin(t * Math.PI));
                    return `"wght" ${weight}, "wdth" ${width}`;
                };
            })
            .transition()
            .duration(config.duration)
            .ease(d3.easeCubic)
            .styleTween("font-variation-settings", () => {
                return function(t) {
                    const weight = Math.round(275 + (900 - 275) * Math.sin(t * Math.PI));
                    const width = Math.round(50 + (200 - 50) * Math.sin(t * Math.PI));
                    return `"wght" ${weight}, "wdth" ${width}`;
                };
            });
    } else {
        // Deuxième ligne avec animation statique
        lineContainer.append("div")
            .style("font-family", "Inconsolata")
            .style("font-size", `${config.fontSize}px`)
            .style("color", "white")
            .style("font-variation-settings", '"wght" 900, "wdth" 200')
            .text(line);
    }
});
