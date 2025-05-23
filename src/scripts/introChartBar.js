document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.querySelector('.main-cta');
    if (startButton) {
        startButton.addEventListener('click', () => {
            window.location.href = '../ChartBar.html';
            sessionStorage.setItem('currentSlideIndex', 1);
        });
    }
});