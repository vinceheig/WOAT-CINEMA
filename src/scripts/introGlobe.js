document.addEventListener('DOMContentLoaded', () => {
    // SVG setup
    const svg = d3.select('#dots-container')
        .attr('width', '100%')
        .attr('height', '400')
        .style('display', 'block')
        .style('margin', '0 auto');

    // Create dot data (36 dots total, arranged in 6 rows of 6)
    const dotData = Array.from({ length: 36 }, (_, i) => ({
        id: i,
        filled: i < 32 // 32 dots filled (≈88%)
    }));

    // Define dimensions
    const dotSize = 35; // Increased dot size
    const gap = 20; // Increased gap slightly
    const rows = 6;
    const cols = 6;

    // Calculate total width and height for centering
    const totalWidth = cols * (dotSize * 2 + gap);
    const totalHeight = rows * (dotSize * 2 + gap);

    // Create container group and center it
    const container = svg.append('g')
        .attr('transform', `translate(${(svg.node().getBoundingClientRect().width / 2) - (totalWidth / 2)}, ${(svg.node().getBoundingClientRect().height / 1.4) - (totalHeight / 2)})`);

    // Create and position dots
    const dots = container.selectAll('circle')
        .data(dotData)
        .enter()
        .append('circle')
        .attr('r', 0)
        .attr('cx', (d, i) => (i % cols) * (dotSize * 2 + gap) + dotSize)
        .attr('cy', (d, i) => Math.floor(i / cols) * (dotSize * 2 + gap) + dotSize)
        .attr('fill', d => d.filled ? '#BCB0FF' : '#FFFFFF') // Changed filled dot color to light blue/purple
        .attr('stroke', '#BCB0FF') // Changed stroke color to light blue/purple
        .attr('stroke-width', 1.5);

    // Animate dots appearing
    dots.transition()
        .duration(1000)
        .delay((d, i) => i * 50)
        .attr('r', dotSize);

    // Style for the number display
    const numberContainer = d3.select('.number')
        .style('font-size', '72px') // Increased font size
        .style('font-weight', 'bold')
        .style('text-align', 'center')
        .style('margin-bottom', '30px');

    // Animate number counting up
    d3.selection.prototype.animateNumber = function(start, end, duration) {
        const format = d3.format(',d'); // Added thousands separator
        const interpolate = d3.interpolateNumber(start, end);
        
        return this.transition()
            .duration(duration)
            .tween('text', function() {
                return function(t) {
                    this.textContent = format(Math.round(interpolate(t))); // Removed %
                };
            });
    };

    // Animate to 8000
    d3.select('.number')
        .animateNumber(0, 8000, 2000);
});