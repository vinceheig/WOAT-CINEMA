document.addEventListener('DOMContentLoaded', () => {
    const svg = d3.select('#circle-container');
    const container = document.querySelector('.container');
    
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    
    svg.attr('width', width)
       .attr('height', height);

    // Créer un groupe pour les transformations
    const group = svg.append('g')
        .attr('transform', `translate(${width * 0.7}, ${height * 0.5})`);

    // Fonction pour créer un effet de vague
    function createWaveEffect() {
        const baseRadius = Math.min(width, height) * 0.28;
        const points = 50;
        const path = d3.range(points).map((d, i) => {
            const angle = (i / points) * 2 * Math.PI;
            const radius = baseRadius + Math.sin(angle * 3 + Date.now() / 1000) * 10;
            return [
                radius * Math.cos(angle),
                radius * Math.sin(angle)
            ];
        });
        return 'M' + path.join('L') + 'Z';
    }

    // Créer directement le path avec l'effet de vague
    const path = group.append('path')
        .attr('fill', '#6CF65E')
        .attr('d', createWaveEffect());

    // Animation continue
    function animate() {
        path
            .transition()
            .duration(2000)
            .attr('d', createWaveEffect())
            .on('end', animate);
    }
    animate();

    // Animation de rotation du groupe
    function rotate() {
        group
            .transition()
            .duration(20000)
            .attrTween('transform', function() {
                return function(t) {
                    return `translate(${width * 0.7}, ${height * 0.5}) rotate(${t * 360})`;
                };
            })
            .on('end', rotate);
    }
    rotate();
});