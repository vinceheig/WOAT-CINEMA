const container = document.getElementById("container");

// Configuration des slides
const slides = [
  { id: "slide0", file: "./index.html" },
  { id: "slide1", file: "./chartBar.html" },
  { id: "slide2", file: "./fallingText.html" },
  { id: "slide3", file: "./introBar.html" },
  { id: "slide4", file: "./BarGraphique.html" },
  { id: "slide5", file: "./TitleGlobeGraphique.html" },
  { id: "slide6", file: "./introGlobe.html" },
  { id: "slide7", file: "./globeGraphique.html" },
  { id: "slide9", file: "./conclusion.html" },
];

// Fonction pour obtenir l'index du slide actuel
function getCurrentSlideIndex() {
  const currentPath = window.location.pathname;
  const currentFile = currentPath.split("/").pop();
  console.log("Current file:", currentFile);

  const index = slides.findIndex((slide) => {
    const slideFile = slide.file.replace("./", "");
    return slideFile === currentFile;
  });

  console.log("Found index:", index);
  return index;
}

// Initialisation de l'index courant
const initialIndex = getCurrentSlideIndex();
// Utiliser l'index stocké dans sessionStorage s'il existe, sinon utiliser l'index déterminé par l'URL
let currentSlideIndex =
  sessionStorage.getItem("currentSlideIndex") !== null
    ? parseInt(sessionStorage.getItem("currentSlideIndex"))
    : initialIndex === -1
    ? 0
    : initialIndex;
console.log("Initial slide index:", currentSlideIndex);

// Fonction pour naviguer vers un slide spécifique
function navigateToSlide(index, direction) {
  if (index >= 0 && index < slides.length) {
    console.log(
      "Navigating from index",
      currentSlideIndex,
      "to index",
      index,
      "direction:",
      direction
    );

    // Mettre à jour l'index courant
    currentSlideIndex = index;
    sessionStorage.setItem("currentSlideIndex", currentSlideIndex);

    // Naviguer vers le fichier HTML correspondant
    const targetSlide = slides[index];
    window.location.href = targetSlide.file;
  } else {
    console.error("Index out of bounds:", index);
  }
}

// Fonction pour afficher un slide spécifique
function showSlide(index) {
  // Masquer tous les slides
  slides.forEach((slide) => {
    const slideElement = document.getElementById(slide.id);
    if (slideElement) {
      slideElement.classList.remove("active");
    }
  });

  // Afficher le slide actif
  const activeSlide = slides[index];
  const activeSlideElement = document.getElementById(activeSlide.id);
  if (activeSlideElement) {
    activeSlideElement.classList.add("active");
  }

  // Mettre à jour l'index courant
  currentSlideIndex = index;

  // Gérer la visibilité des flèches de navigation
  updateNavigationArrows();
}

// Fonction pour mettre à jour la visibilité des flèches de navigation
function updateNavigationArrows() {
  const prevArrows = document.querySelectorAll(".nav-prev, .left-arrow");
  const nextArrows = document.querySelectorAll(
    ".nav-arrow.nav-next, .right-arrow, .next-button"
  );

  prevArrows.forEach((arrow) => {
    arrow.style.display = currentSlideIndex === 0 ? "none" : "flex";
  });

  nextArrows.forEach((arrow) => {
    arrow.style.display =
      currentSlideIndex === slides.length - 1 ? "none" : "flex";
  });
}

// Gestionnaire d'événements pour les flèches de navigation
document.addEventListener("DOMContentLoaded", () => {
  const prevArrows = document.querySelectorAll(".nav-prev, .left-arrow");
  const nextArrows = document.querySelectorAll(
    ".nav-arrow.nav-next, .right-arrow, .next-button"
  );

  prevArrows.forEach((arrow) => {
    arrow.addEventListener("click", (e) => {
      e.preventDefault();
      const targetIndex = currentSlideIndex - 1;
      navigateToSlide(targetIndex, "previous");
    });
  });

  nextArrows.forEach((arrow) => {
    arrow.addEventListener("click", (e) => {
      e.preventDefault();
      const targetIndex = currentSlideIndex + 1;
      navigateToSlide(targetIndex, "next");
    });
  });

  // Gestion des touches clavier
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && currentSlideIndex > 0) {
      navigateToSlide(currentSlideIndex - 1, "previous");
    } else if (
      event.key === "ArrowRight" &&
      currentSlideIndex < slides.length - 1
    ) {
      navigateToSlide(currentSlideIndex + 1, "next");
    }
  });

  // Mettre à jour les flèches au chargement
  updateNavigationArrows();
});

const resetContainer = () => {
  if (container.innerHTML !== "") {
    document.getElementById("container").innerHTML = "";
  }
};
