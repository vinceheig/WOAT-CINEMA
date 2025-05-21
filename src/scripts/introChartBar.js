document.addEventListener('DOMContentLoaded', () => {
    const nextButton = document.querySelector('.next-button');
    
    nextButton.addEventListener('click', () => {
        // Ici, vous pourrez ajouter la logique de navigation vers la page suivante
        console.log('Navigation vers la page suivante');
        // window.location.href = 'next-page.html';
    });
});