document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const navDots = document.querySelectorAll('.nav-dot');
    const prevArrows = document.querySelectorAll('.prev-arrow');
    const nextArrows = document.querySelectorAll('.next-arrow');
    const nextButton = document.querySelector('.next-button');
    
    let currentSlideIndex = 0;
    
    // Fonction pour naviguer vers une slide spécifique
    function goToSlide(index) {
        // S'assurer que l'index est valide
        if (index < 0) index = 0;
        if (index >= slides.length) index = slides.length - 1;
        
        // Mettre à jour l'index courant
        currentSlideIndex = index;
        
        // Mettre à jour les classes des slides
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active');
                slide.style.opacity = '1';
                slide.style.visibility = 'visible';
            } else {
                slide.classList.remove('active');
                slide.style.opacity = '0';
                slide.style.visibility = 'hidden';
            }
        });
        
        // Mettre à jour les dots de navigation
        navDots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Fonction pour afficher une slide spécifique avec animations
    function showSlide(index) {
        const slides = document.querySelectorAll('.slide');
        slides.forEach(slide => {
            slide.classList.remove('active');
            // Réinitialiser les animations si nécessaire
            slide.querySelectorAll('.animate').forEach(el => {
                el.classList.remove('animate');
            });
        });
        
        slides[index].classList.add('active');
        
        // Ajouter les animations pour la slide 3
        if (slides[index].id === 'recap-slide') {
            const elements = slides[index].querySelectorAll('.recap-title, .recap-container, .stat-item');
            elements.forEach(el => el.classList.add('animate'));
        }
    }
    
    // Gestionnaire d'événements pour les dots de navigation
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
    // Gestionnaire d'événements pour les flèches précédentes
    prevArrows.forEach(arrow => {
        arrow.addEventListener('click', () => {
            goToSlide(currentSlideIndex - 1);
        });
    });
    
    // Gestionnaire d'événements pour les flèches suivantes
    nextArrows.forEach(arrow => {
        arrow.addEventListener('click', () => {
            goToSlide(currentSlideIndex + 1);
        });
    });
    
    // Gestionnaire d'événements pour le bouton "Suivant"
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            goToSlide(currentSlideIndex + 1);
        });
    }
    
    // Navigation au clavier
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            goToSlide(currentSlideIndex - 1);
        } else if (e.key === 'ArrowRight') {
            goToSlide(currentSlideIndex + 1);
        }
    });
    
    // Initialiser la première slide
    goToSlide(0);
    
    // Exposer la fonction goToSlide globalement pour qu'elle puisse être utilisée par d'autres scripts
    window.goToSlide = goToSlide;
});