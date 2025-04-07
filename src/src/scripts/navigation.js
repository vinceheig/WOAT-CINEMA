document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.nav-dot');
    const prevArrows = document.querySelectorAll('.prev-arrow');
    const nextArrows = document.querySelectorAll('.next-arrow');
    const nextButtons = document.querySelectorAll('.next-button');
    let currentSlide = 0;

    // Fonction pour animer la transition entre les slides
    function animateTransition(fromSlide, toSlide, direction) {
        const tl = gsap.timeline();
        
        // Animation de sortie
        tl.to(fromSlide, {
            opacity: 0,
            x: direction === 'next' ? '-100%' : '100%',
            duration: 0.5,
            ease: "power2.inOut"
        });

        // Animation d'entrée
        tl.fromTo(toSlide,
            {
                opacity: 0,
                x: direction === 'next' ? '100%' : '-100%'
            },
            {
                opacity: 1,
                x: '0%',
                duration: 0.5,
                ease: "power2.inOut"
            },
            "-=0.3"
        );

        // Mettre à jour les classes active
        fromSlide.classList.remove('active');
        toSlide.classList.add('active');

        // Mettre à jour les points de navigation
        dots[currentSlide].classList.remove('active');
        dots[toSlide.dataset.index].classList.add('active');
    }

    // Fonction pour naviguer vers un slide spécifique
    function goToSlide(index, direction) {
        if (index < 0 || index >= slides.length || index === currentSlide) return;

        const fromSlide = slides[currentSlide];
        const toSlide = slides[index];

        animateTransition(fromSlide, toSlide, direction);
        currentSlide = index;
    }

    // Initialiser les index des slides
    slides.forEach((slide, index) => {
        slide.dataset.index = index;
    });

    // Event listeners pour les flèches de navigation
    prevArrows.forEach(arrow => {
        arrow.addEventListener('click', () => {
            goToSlide(currentSlide - 1, 'prev');
        });
    });

    nextArrows.forEach(arrow => {
        arrow.addEventListener('click', () => {
            goToSlide(currentSlide + 1, 'next');
        });
    });

    // Event listeners pour les boutons "Suivant"
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            goToSlide(currentSlide + 1, 'next');
        });
    });

    // Event listeners pour les points de navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const direction = index > currentSlide ? 'next' : 'prev';
            goToSlide(index, direction);
        });
    });

    // Navigation au clavier
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            goToSlide(currentSlide - 1, 'prev');
        } else if (e.key === 'ArrowRight') {
            goToSlide(currentSlide + 1, 'next');
        }
    });
}); 