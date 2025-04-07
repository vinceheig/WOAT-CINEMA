// Création et animation du graphique
document.addEventListener('DOMContentLoaded', () => {
    // Configuration des dimensions
    const margin = { top: 40, right: 20, bottom: 40, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Données des films (à remplacer par vos données réelles)
    const data = [
        { title: "Plan 9 from Outer Space", rating: 2.1 },
        { title: "Troll 2", rating: 2.5 },
        { title: "Birdemic", rating: 1.8 },
        { title: "Jack and Jill", rating: 3.3 },
        { title: "Cats", rating: 2.7 }
    ];

    // Création du SVG
    const svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Échelles
    const x = d3.scaleLinear()
        .domain([0, 5])
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(data.map(d => d.title))
        .range([0, height])
        .padding(0.3);

    // Axes
    const xAxis = svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    const yAxis = svg.append("g")
        .attr("class", "axis y-axis")
        .call(d3.axisLeft(y));

    // Création des barres
    const bars = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", d => y(d.title))
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .attr("width", d => x(d.rating));

    // Animation des éléments lors de l'apparition de la slide
    function animateChart() {
        const chartSlide = document.getElementById('worst-movies-slide');
        if (!chartSlide.classList.contains('active')) return;

        // Animer le titre
        document.querySelector('.chart-title').classList.add('animate');

        // Animer le conteneur
        document.querySelector('.chart-container').classList.add('animate');

        // Animer les barres avec délai
        bars.each(function(d, i) {
            const bar = d3.select(this);
            setTimeout(() => {
                bar.classed('animate', true);
            }, i * 100);
        });

        // Animer les textes des axes
        svg.selectAll('.axis text').each(function(d, i) {
            setTimeout(() => {
                d3.select(this).classed('animate', true);
            }, i * 50);
        });
    }

    // Observer les changements de slide
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains('active')) {
                animateChart();
            }
        });
    });

    const chartSlide = document.getElementById('worst-movies-slide');
    observer.observe(chartSlide, {
        attributes: true,
        attributeFilter: ['class']
    });

    // Interaction à la souris pour les barres
    bars.on('mouseover', function() {
        const bar = d3.select(this);
        gsap.to(bar.node(), {
            scaleY: 1.1,
            duration: 0.3,
            ease: "power2.out"
        });
    }).on('mouseout', function() {
        const bar = d3.select(this);
        gsap.to(bar.node(), {
            scaleY: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    // Animation des éléments décoratifs
    const decorativeElements = document.querySelectorAll('#worst-movies-slide .decorative-elements img');
    
    decorativeElements.forEach((element, index) => {
        gsap.from(element, {
            opacity: 0,
            scale: 0,
            rotation: "random(-180, 180)",
            x: "random(-100, 100)",
            y: "random(-100, 100)",
            duration: 1.5,
            delay: 0.1 * index,
            ease: "elastic.out(1, 0.3)",
            scrollTrigger: {
                trigger: "#worst-movies-slide",
                start: "top center",
                toggleActions: "play none none reverse"
            }
        });
    });
}); 