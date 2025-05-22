document.addEventListener('DOMContentLoaded', () => {
    const nextButton = document.querySelector('.next-button');
    
    nextButton.addEventListener('click', () => {
        // Ici, vous pourrez ajouter la logique de navigation vers la page suivante
       window.location.href = './chartBar.html';
       sessionStorage.setItem('currentSlideIndex', 1); // Mettez à jour l'index de la diapositive actuelle
        // window.location.href = 'next-page.html';
    });
});