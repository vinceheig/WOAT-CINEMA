// Charger les données depuis le fichier JSON
async function loadData() {
    try {
        // Essayer de charger les données depuis le fichier JSON
        const response = await fetch('../data/bad_movies_by_year.json');
        if (!response.ok) {
            throw new Error(`Erreur lors du chargement des données: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        // Utiliser des données de repli en cas d'erreur
        return [
            { year: '2019', value: 67, color: '#c090e0' },   // Violet
            { year: '2020', value: 94, color: '#ff9933' },   // Orange
            { year: '2021', value: 98, color: '#008080' },   // Teal
            { year: '2022', value: 205, color: '#e04040' },  // Rouge
            { year: '2023', value: 223, color: '#4080e0' },  // Bleu
            { year: '2024', value: 282, color: '#e04060' }   // Rose
        ];
    }
}

// Créer le graphique à barres
async function createBarChart() {
    // Charger les données
    const chartData = await loadData();
    
    // Set up chart dimensions
    const margin = { top: 40, right: 20, bottom: 70, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    // Create SVG element
    const svg = d3.select('#bar-chart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Create X scale
    const x = d3.scaleBand()
        .domain(chartData.map(d => d.year))
        .range([0, width])
        .padding(0.3);
    
    // Create Y scale
    const y = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => d.value) * 1.1]) // Add 10% padding
        .range([height, 0]);
    
    // Axe X avec animation
    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .style('font-size', '12px')
        .style('fill', '#fff')
        .style('opacity', 0)
        .transition()
        .duration(1000)
        .delay((d, i) => i * 200)
        .style('opacity', 1);
    
    // Axe Y avec animation
    svg.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(y).ticks(5))
        .selectAll('text')
        .style('fill', '#fff')
        .style('opacity', 0)
        .transition()
        .duration(1000)
        .delay((d, i) => i * 200)
        .style('opacity', 1);
    
    // Labels des axes avec animation
    svg.append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('y', -margin.left + 20)
        .attr('x', -height / 2)
        .attr('text-anchor', 'middle')
        .style('fill', '#fff')
        .style('opacity', 0)
        .text('Nombres de mauvais films (< 3)')
        .transition()
        .duration(1000)
        .delay(1000)
        .style('opacity', 1);
    
    svg.append('text')
        .attr('class', 'axis-label')
        .attr('y', height + margin.bottom - 10)
        .attr('x', width / 2)
        .attr('text-anchor', 'middle')
        .style('fill', '#fff')
        .style('opacity', 0)
        .text('Année')
        .transition()
        .duration(1000)
        .delay(1000)
        .style('opacity', 1);
    
    // Barres avec animation
    svg.selectAll('.bar')
        .data(chartData)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.year))
        .attr('width', x.bandwidth())
        .attr('y', height)
        .attr('height', 0)
        .attr('fill', d => d.color)
        .transition()
        .duration(1000)
        .delay((d, i) => i * 200)
        .attr('y', d => y(d.value))
        .attr('height', d => height - y(d.value));
    
    // Valeurs au-dessus des barres avec animation
    svg.selectAll('.bar-value')
        .data(chartData)
        .enter()
        .append('text')
        .attr('class', 'bar-value')
        .attr('x', d => x(d.year) + x.bandwidth() / 2)
        .attr('y', height)
        .attr('text-anchor', 'middle')
        .style('fill', '#fff')
        .style('font-size', '12px')
        .style('opacity', 0)
        .text(d => d.value)
        .transition()
        .duration(1000)
        .delay((d, i) => i * 200 + 500)
        .attr('y', d => y(d.value) - 10)
        .style('opacity', 1);
    
    // Add interactivity
    setTimeout(() => {
        // Hover effects for bars
        svg.selectAll('.bar')
            .on('mouseover', function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('opacity', 1)
                    .attr('stroke', '#000')
                    .attr('stroke-width', 2);
            })
            .on('mouseout', function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('opacity', 0.9)
                    .attr('stroke', 'none');
            });
    
    }, 2000);
}

// Initialize chart
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        createBarChart();
    }, 500);
});
