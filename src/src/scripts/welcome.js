document.addEventListener('DOMContentLoaded', () => {
    // Configuration GSAP
    gsap.config({
        nullTargetWarn: false
    });

    // Timeline principale
    const mainTimeline = gsap.timeline({
        defaults: {
            ease: "power3.out"
        }
    });

    // Créer les éléments graphiques abstraits
    function createAbstractElements() {
        const container = document.querySelector('.abstract-elements');
        
        // Créer la fleur abstraite en vert néon
        const flower = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        flower.setAttribute("viewBox", "0 0 200 200");
        flower.setAttribute("class", "neon-shape");
        flower.style.width = "150px";
        flower.style.height = "150px";
        flower.style.position = "absolute";
        flower.style.top = "10%";
        flower.style.left = "5%";
        
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M100,10 C120,10 140,30 140,50 C140,70 120,90 100,90 C80,90 60,70 60,50 C60,30 80,10 100,10");
        flower.appendChild(path);
        container.appendChild(flower);

        // Créer les lignes noires avec effet néon
        for (let i = 0; i < 3; i++) {
            const line = document.createElement('div');
            line.className = 'abstract-line';
            line.style.top = `${30 + i * 20}%`;
            line.style.right = '10%';
            line.style.width = `${100 + i * 50}px`;
            line.style.transform = `rotate(${-45 + i * 15}deg)`;
            container.appendChild(line);
        }

        // Animation des éléments
        gsap.to('.neon-shape', {
            rotation: 360,
            duration: 20,
            repeat: -1,
            ease: "none"
        });

        gsap.to('.abstract-line', {
            scaleX: 1.2,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            stagger: 0.2
        });
    }

    // Fonction pour animer les éléments décoratifs en fonction du mouvement de la souris
    function setupMouseInteraction() {
        const decorativeElements = document.querySelectorAll('.wiggle, .pixel, .shape');
        const container = document.querySelector('.decorative-elements');
        const maxRotation = 15;
        const maxMovement = 30;

        if (!container) return;

        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const mouseX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
            const mouseY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

            decorativeElements.forEach((element, index) => {
                const depth = 0.1 + (index * 0.1);
                const rotationX = mouseY * maxRotation * depth;
                const rotationY = mouseX * maxRotation * depth;
                const translateX = mouseX * maxMovement * depth;
                const translateY = mouseY * maxMovement * depth;
                const translateZ = 50 * depth;

                gsap.to(element, {
                    rotationX: -rotationX,
                    rotationY: rotationY,
                    x: translateX,
                    y: translateY,
                    z: translateZ,
                    duration: 1,
                    ease: "power2.out"
                });
            });
        });

        container.addEventListener('mouseleave', () => {
            decorativeElements.forEach((element) => {
                gsap.to(element, {
                    rotationX: 0,
                    rotationY: 0,
                    x: 0,
                    y: 0,
                    z: 0,
                    duration: 1.5,
                    ease: "elastic.out(1, 0.3)"
                });
            });
        });
    }

    // Fonction pour animer le texte et le bouton
    function animateContent() {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from('.main-title', {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2
        })
        .from('.description', {
            y: 30,
            opacity: 0,
            duration: 0.8
        }, "-=0.4")
        .from('.next-button', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            scale: 0.9
        }, "-=0.4");

        return tl;
    }

    // Fonction pour animer les éléments décoratifs à l'entrée
    function animateDecorativeElements() {
        const elements = document.querySelectorAll('.wiggle, .pixel, .shape');
        
        elements.forEach((element, index) => {
            gsap.from(element, {
                opacity: 0,
                scale: 0,
                rotation: "random(-180, 180)",
                x: "random(-100, 100)",
                y: "random(-100, 100)",
                duration: 1.5,
                delay: 0.1 * index,
                ease: "elastic.out(1, 0.3)"
            });
        });
    }

    // Fonction pour gérer la navigation
    function setupNavigation() {
        const nextButton = document.querySelector('.next-button');
        const slides = document.querySelectorAll('.slide');
        let currentSlide = 0;

        if (!nextButton || !slides.length) return;

        nextButton.addEventListener('click', () => {
            // Animation de sortie
            gsap.to(slides[currentSlide], {
                opacity: 0,
                scale: 0.95,
                duration: 0.5,
                ease: "power2.in",
                onComplete: () => {
                    slides[currentSlide].classList.remove('active');
                    currentSlide = (currentSlide + 1) % slides.length;
                    slides[currentSlide].classList.add('active');
                    
                    // Animation d'entrée
                    gsap.fromTo(slides[currentSlide],
                        {
                            opacity: 0,
                            scale: 1.05
                        },
                        {
                            opacity: 1,
                            scale: 1,
                            duration: 0.5,
                            ease: "power2.out"
                        }
                    );
                }
            });
        });
    }

    // Fonction pour animer les points de navigation
    function animateNavDots() {
        const dots = document.querySelectorAll('.nav-dot');
        
        gsap.from(dots, {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(1.7)",
            delay: 1
        });
    }

    // Fonction d'initialisation
    function initAnimations() {
        createAbstractElements();
        animateContent();
        animateDecorativeElements();
        animateNavDots();
        setupNavigation();
    }

    // Démarrer les animations
    initAnimations();
});

// Configuration GSAP
gsap.registerPlugin(ScrollTrigger);

// Animation initiale des éléments
function initWelcomeAnimations() {
    // Timeline principale
    const tl = gsap.timeline();

    // Animation du titre
    tl.from('.main-title', {
        duration: 1.2,
        scale: 0.3,
        opacity: 0,
        rotation: 15,
        ease: "elastic.out(1, 0.3)"
    })
    
    // Animation de la description
    .from('.description', {
        duration: 0.8,
        y: 50,
        opacity: 0,
        ease: "back.out(1.7)"
    }, "-=0.5")
    
    // Animation du bouton
    .from('.next-button', {
        duration: 0.8,
        x: -50,
        opacity: 0,
        ease: "power2.out"
    }, "-=0.3");

    // Animation des éléments décoratifs
    gsap.from('.wiggle-1', {
        duration: 1.5,
        x: -200,
        y: -100,
        rotation: -180,
        opacity: 0,
        ease: "power2.out",
        delay: 0.5
    });

    gsap.from('.wiggle-2', {
        duration: 1.5,
        x: 200,
        y: 100,
        rotation: 180,
        opacity: 0,
        ease: "power2.out",
        delay: 0.7
    });

    gsap.from('.pixel-1', {
        duration: 1,
        scale: 0,
        opacity: 0,
        ease: "bounce.out",
        delay: 1
    });

    gsap.from('.pixel-2', {
        duration: 1,
        scale: 0,
        opacity: 0,
        ease: "bounce.out",
        delay: 1.2
    });

    gsap.from('.shape-1', {
        duration: 1.5,
        scale: 0.5,
        rotation: -360,
        opacity: 0,
        ease: "power2.out",
        delay: 0.8
    });
}

// Animation de transition vers la page suivante
function transitionToNextSlide() {
    const tl = gsap.timeline({
        onComplete: () => {
            // Changer de slide une fois l'animation terminée
            document.querySelector('.slide.active').classList.remove('active');
            document.querySelector('.slide:nth-child(2)').classList.add('active');
            
            // Réinitialiser la position de l'élément de transition
            gsap.set('.shape-1', {
                scale: 1,
                x: 'initial',
                y: 'initial',
                width: 'initial',
                height: 'initial',
                borderRadius: 'initial',
                position: 'absolute'
            });
        }
    });

    // Animation de transition avec la forme
    tl.to('.shape-1', {
        duration: 1,
        scale: 20,
        x: '50%',
        y: '50%',
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        borderRadius: '0',
        ease: "power2.inOut"
    })
    .to('.welcome-content, .decorative-elements > *:not(.shape-1)', {
        duration: 0.5,
        opacity: 0,
        scale: 0.8,
        ease: "power2.inOut"
    }, "-=1");
}

// Animations continues
function setupContinuousAnimations() {
    // Animation flottante pour les éléments décoratifs
    gsap.to('.wiggle-1, .wiggle-2', {
        y: "+=20",
        rotation: "+=5",
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
    });

    gsap.to('.pixel-1, .pixel-2', {
        scale: 1.2,
        duration: 1.5,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 0.2
    });

    gsap.to('.shape-1', {
        rotation: "+=360",
        duration: 20,
        repeat: -1,
        ease: "none"
    });
}

// Gestionnaire d'événements pour le bouton suivant
document.querySelector('.next-button').addEventListener('click', () => {
    transitionToNextSlide();
});

// Initialisation des animations au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    initWelcomeAnimations();
    setupContinuousAnimations();
});

// Animation au survol du bouton
const nextButton = document.querySelector('.next-button');
nextButton.addEventListener('mouseenter', () => {
    gsap.to(nextButton, {
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out"
    });
});

nextButton.addEventListener('mouseleave', () => {
    gsap.to(nextButton, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
    });
}); 