import { loadDataFromJSON } from './imdb-data.js';

// Configuration du globe
const width = 800;
const height = 600;
const sensitivity = 90; // Augmenté pour une rotation plus fluide
const initialScale = 280; // Augmenté pour une meilleure visibilité
const initialRotation = [40, -30, 0]; // Rotation initiale plus intéressante
const rotationSpeed = 0.5; // Vitesse de rotation automatique
let autoRotate = true; // Rotation automatique activée par défaut

// Création du SVG
const svg = d3.select('#globe-visualization')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

// Ajout d'un cercle pour l'océan
svg.append('circle')
    .attr('cx', width / 2)
    .attr('cy', height / 2)
    .attr('r', initialScale)
    .attr('class', 'ocean')
    .style('fill', '#b3d9ff');

// Configuration de la projection
const projection = d3.geoOrthographic()
    .scale(initialScale)
    .center([0, 0])
    .rotate(initialRotation)
    .translate([width / 2, height / 2]);

// Création du path generator
const path = d3.geoPath().projection(projection);

// Création du groupe pour le globe
const globe = svg.append('g');

// Variables pour la rotation
let m0, v0, o0;
let lastTime = d3.now();
let rotateTimer;
let currentRotation = initialRotation;
let inertia = [0, 0, 0];
let isDragging = false;

// Fonction pour obtenir la couleur en fonction du nombre de mauvais films
function getColor(count) {
    if (count > 200) return '#ff0000';     // Rouge vif: Plus de 200 films
    if (count > 100) return '#ff3333';     // Rouge clair: 101-200 films
    if (count > 50) return '#ff6600';      // Orange: 51-100 films
    if (count > 20) return '#ff9933';      // Orange clair: 21-50 films
    if (count > 10) return '#ffcc99';      // Pêche: 11-20 films
    return '#ffe6e6';                      // Rose très clair: 1-10 films
}

// Fonction pour convertir les codes pays ISO en noms de pays
function getCountryNameFromCode(code) {
    const countryCodes = {
        'US': 'United States',
        'GB': 'United Kingdom',
        'FR': 'France',
        'DE': 'Germany',
        'CA': 'Canada',
        'AU': 'Australia',
        'JP': 'Japan',
        'IT': 'Italy',
        'ES': 'Spain',
        'CN': 'China',
        'IN': 'India',
        'BR': 'Brazil',
        'MX': 'Mexico',
        'RU': 'Russia',
        'KR': 'South Korea',
        'ZA': 'South Africa',
        // Ajoutez d'autres codes au besoin
    };
    
    return countryCodes[code] || code;
}

// Fonction pour dessiner le globe
async function drawGlobe() {
    // Récupération des données à partir des fichiers IMDB
    console.log("Récupération des données IMDB...");
    const badMoviesData = await loadDataFromJSON();
    
    console.log("Données récupérées:", badMoviesData);
    
    // Chargement des données géographiques
    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
        .then(data => {
            // Conversion des données TopoJSON en GeoJSON
            const countries = topojson.feature(data, data.objects.countries);

            // Dessin des pays
            globe.selectAll('path')
                .data(countries.features)
                .enter()
                .append('path')
                .attr('class', 'country')
                .attr('d', path)
                .style('fill', d => {
                    // Trouver tous les codes pays qui pourraient correspondre
                    const matchingCodes = Object.keys(badMoviesData).filter(code => {
                        const countryName = getCountryNameFromCode(code);
                        return countryName.includes(d.properties.name) ||
                               d.properties.name.includes(countryName);
                    });
                    
                    // Somme des films des codes trouvés
                    const count = matchingCodes.reduce((sum, code) => sum + badMoviesData[code], 0);
                    return getColor(count);
                })
                .style('stroke', '#666')
                .style('stroke-width', 0.5)
                .on('mouseover', function(event, d) {
                    stopRotation(); // Arrêter la rotation lors du survol
                    showTooltip(event, d, badMoviesData);
                })
                .on('mouseout', function() {
                    hideTooltip();
                    // Redémarrer la rotation après un délai
                    setTimeout(startRotation, 1000);
                });

            // Ajout d'un cercle pour la limite du globe (plus esthétique)
            svg.append('circle')
                .attr('cx', width / 2)
                .attr('cy', height / 2)
                .attr('r', initialScale)
                .attr('class', 'globe-outline')
                .attr('fill', 'none')
                .attr('stroke', '#000')
                .attr('stroke-width', 1.5);

            // Ajout de la rotation
            svg.call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended));
                
            // Démarrer la rotation automatique
            startRotation();
        });
}

// Fonctions pour la rotation automatique
function startRotation() {
    if (autoRotate && !rotateTimer) {
        rotateTimer = d3.timer(rotateAnimation);
    }
}

function stopRotation() {
    if (rotateTimer) {
        rotateTimer.stop();
        rotateTimer = null;
    }
}

// Animation de rotation automatique
function rotateAnimation(elapsed) {
    if (isDragging) return;
    
    // Appliquer l'inertie si présente
    if (inertia[0] !== 0 || inertia[1] !== 0) {
        currentRotation[0] += inertia[0];
        currentRotation[1] += inertia[1];
        
        // Amortir l'inertie progressivement
        inertia[0] *= 0.9;
        inertia[1] *= 0.9;
        
        // Arrêter l'inertie si elle est très faible
        if (Math.abs(inertia[0]) < 0.01 && Math.abs(inertia[1]) < 0.01) {
            inertia = [0, 0, 0];
        }
    } else if (autoRotate) {
        // Rotation automatique fluide
        currentRotation[0] = (currentRotation[0] + rotationSpeed) % 360;
    }
    
    projection.rotate(currentRotation);
    updateGlobe();
}

// Fonctions pour la rotation du globe
function dragstarted(event) {
    stopRotation();
    isDragging = true;
    
    const r = projection.rotate();
    m0 = [event.x, event.y];
    o0 = [-r[0], -r[1]];
    v0 = [0, 0]; // Vitesse initiale
    lastTime = d3.now();
    
    event.sourceEvent.stopPropagation();
}

function dragged(event) {
    if (m0) {
        const now = d3.now();
        const deltaTime = now - lastTime;
        
        const m1 = [event.x, event.y];
        // Calculer le déplacement en fonction de la sensibilité
        const deltaX = (m1[0] - m0[0]) / sensitivity;
        const deltaY = (m1[1] - m0[1]) / sensitivity;
        
        // Calculer la vitesse instantanée pour l'inertie
        if (deltaTime > 0) {
            v0 = [
                deltaX * 1000 / deltaTime,
                deltaY * 1000 / deltaTime
            ];
        }
        
        // Mettre à jour la rotation
        currentRotation[0] = o0[0] - deltaX * 15;
        currentRotation[1] = o0[1] - deltaY * 15;
        
        // Limiter l'inclinaison verticale pour éviter de retourner le globe
        currentRotation[1] = Math.max(-90, Math.min(90, currentRotation[1]));
        
        projection.rotate(currentRotation);
        updateGlobe();
        
        lastTime = now;
    }
}

function dragended() {
    if (v0) {
        // Appliquer l'inertie basée sur la vitesse finale
        inertia = [v0[0] * 0.01, v0[1] * 0.01, 0];
    }
    
    m0 = null;
    v0 = null;
    isDragging = false;
    
    // Redémarrer la rotation après un délai
    setTimeout(startRotation, 1500);
}

// Fonction pour mettre à jour le globe
function updateGlobe() {
    globe.selectAll('.country').attr('d', path);
}

// Fonctions pour le tooltip
function showTooltip(event, d, badMoviesData) {
    const tooltip = d3.select('#globe-tooltip');
    tooltip.style('display', 'block')
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY + 10) + 'px');

    const countryName = d.properties.name;
    
    // Trouver tous les codes pays qui pourraient correspondre
    const matchingCodes = Object.keys(badMoviesData).filter(code => {
        const cName = getCountryNameFromCode(code);
        return cName.includes(countryName) || countryName.includes(cName);
    });
    
    // Somme des films des codes trouvés
    const count = matchingCodes.reduce((sum, code) => sum + badMoviesData[code], 0);
    
    tooltip.select('.country-name').text(countryName);
    tooltip.select('.country-stats').text(`Nombre de mauvais films : ${count}`);
}

function hideTooltip() {
    d3.select('#globe-tooltip').style('display', 'none');
}

// Initialisation du globe
drawGlobe(); 