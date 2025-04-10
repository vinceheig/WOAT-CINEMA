// Création et animation du graphique
document.addEventListener('DOMContentLoaded', () => {
    // Configuration des dimensions
    const margin = { top: 60, right: 30, bottom: 50, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Création du SVG
    const svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Données de test (en attendant les vraies données IMDB)
    const testData = [
        { year: 2017, count: 67 },
        { year: 2018, count: 94 },
        { year: 2019, count: 148 },
        { year: 2020, count: 205 },
        { year: 2021, count: 223 },
        { year: 2022, count: 282 }
    ];

    // Fonction pour créer et animer le graphique
    function createChart() {
        // Échelles
        const x = d3.scaleBand()
            .range([0, width])
            .domain(testData.map(d => d.year))
            .padding(0.1); // Réduire l'espace entre les barres

        const y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(testData, d => d.count)]);

        // Couleurs pour les barres (correspondant à l'image)
        const colors = [
            '#E5B8FF', // violet clair
            '#FFA161', // orange
            '#47D7B3', // vert turquoise
            '#FF6B6B', // rouge
            '#61B3FF', // bleu
            '#FFB8B8'  // rose clair
        ];

        // Axes
        // Axe X
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .call(g => g.select(".domain").remove()) // Enlever la ligne de l'axe
            .selectAll("text")
            .style("text-anchor", "middle")
            .style("font-size", "12px")
            .style("fill", "#000000");

        // Axe Y
        svg.append("g")
            .call(d3.axisLeft(y))
            .call(g => g.select(".domain").remove()) // Enlever la ligne de l'axe
            .call(g => g.selectAll(".tick line").remove()) // Enlever les lignes des ticks
            .selectAll("text")
            .style("font-size", "12px")
            .style("fill", "#000000");

        // Titre du graphique
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -margin.top / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "24px")
            .style("fill", "#000000")
            .text("Nombre de mauvais films par année");

        // Sous-titre du graphique
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -margin.top / 2 + 30)
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .style("fill", "#000000")
            .text("Dans une période récente de 5 ans");

        // Ajuster les marges pour centrer le graphique
        const chartWidth = width + margin.left + margin.right;
        const chartHeight = height + margin.top + margin.bottom;
        
        // Centrer le conteneur SVG
        d3.select("#chart-container")
            .style("display", "flex")
            .style("justify-content", "center")
            .style("align-items", "center")
            .style("height", "100%");

        // Création des barres avec effet de dégradé
        const bars = svg.selectAll(".bar")
            .data(testData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.year))
            .attr("width", x.bandwidth())
            .attr("y", height)
            .attr("height", 0)
            .style("fill", (d, i) => colors[i])
            .style("opacity", 0.8)
            .style("cursor", "pointer")
            .on("click", function(event, d) {
                // Navigation vers la slide correspondante
                const slideIndex = d.year - 2017; // Calcul de l'index basé sur l'année
                goToSlide(slideIndex + 2); // +2 car on commence à la slide 2
            });

        // Ajout des valeurs sur les barres
        const labels = svg.selectAll(".label")
            .data(testData)
            .enter()
            .append("text")
            .attr("class", "label")
            .attr("x", d => x(d.year) + x.bandwidth() / 2)
            .attr("y", height)
            .attr("text-anchor", "middle")
            .style("fill", "#000000")
            .style("font-size", "20px")
            .style("font-weight", "bold")
            .text(d => d.count)
            .style("opacity", 0);

        // Animation des barres
        bars.transition()
            .duration(800)
            .delay((d, i) => i * 100)
            .attr("y", d => y(d.count))
            .attr("height", d => height - y(d.count));

        // Animation des labels
        labels.transition()
            .duration(800)
            .delay((d, i) => i * 100)
            .attr("y", d => y(d.count) - 10)
            .style("opacity", 1);

        // Interaction au survol
        bars.on('mouseover', function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .style("opacity", 1);
        })
        .on('mouseout', function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .style("opacity", 0.8);
        });
    }

    // Créer le graphique lorsque la slide devient active
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('active')) {
                createChart();
            }
        });
    });

    const chartSlide = document.getElementById('worst-movies-slide');
    observer.observe(chartSlide, {
        attributes: true,
        attributeFilter: ['class']
    });
}); 