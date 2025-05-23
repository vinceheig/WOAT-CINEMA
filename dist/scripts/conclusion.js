import * as d3 from "d3";

// Effet de fond : halo lumineux mouvant
const canvas = document.getElementById("bg-effect");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // Redimensionner aussi le canvas confettis si présent
  const confettiCanvas = document.getElementById("confetti-canvas");
  if (confettiCanvas) {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let t = 0;
function drawSpotlight() {
  // Fond violet
  ctx.fillStyle = "#400073";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Mouvement circulaire du halo
  const radius = Math.min(canvas.width, canvas.height) * 0.35;
  const x = canvas.width / 2 + Math.cos(t) * radius * 0.3;
  const y = canvas.height / 2 + Math.sin(t * 0.7) * radius * 0.2;

  // Dégradé radial pour le halo
  const grad = ctx.createRadialGradient(x, y, 0, x, y, radius * 0.7);
  grad.addColorStop(0, "rgba(255,255,255,0.18)");
  grad.addColorStop(0.3, "rgba(255,255,255,0.10)");
  grad.addColorStop(1, "rgba(64,0,115,0)");

  ctx.beginPath();
  ctx.arc(x, y, radius * 0.7, 0, 2 * Math.PI);
  ctx.fillStyle = grad;
  ctx.fill();

  t += 0.008;
  requestAnimationFrame(drawSpotlight);
}
drawSpotlight();

// === Effet confettis ===
// Ajout d'un canvas pour les confettis
let confettiCanvas = document.getElementById("confetti-canvas");
if (!confettiCanvas) {
  confettiCanvas = document.createElement("canvas");
  confettiCanvas.id = "confetti-canvas";
  confettiCanvas.style.position = "fixed";
  confettiCanvas.style.top = 0;
  confettiCanvas.style.left = 0;
  confettiCanvas.style.width = "100vw";
  confettiCanvas.style.height = "100vh";
  confettiCanvas.style.pointerEvents = "none";
  confettiCanvas.style.zIndex = 2;
  document.body.appendChild(confettiCanvas);
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
const cctx = confettiCanvas.getContext("2d");

const confettiColors = [
  "#fff",
  "#ffd700",
  "#ff69b4",
  "#00e6e6",
  "#ff6347",
  "#7cfc00",
  "#1e90ff",
];
const confettiCount = 80;
const confettis = d3.range(confettiCount).map(() => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: 6 + Math.random() * 8,
  color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
  speed: 1 + Math.random() * 2,
  angle: Math.random() * 2 * Math.PI,
  swing: 30 + Math.random() * 40,
  swingSpeed: 0.01 + Math.random() * 0.02,
}));

let confettiAnimationId;
function drawConfetti() {
  cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettis.forEach((c) => {
    cctx.save();
    cctx.beginPath();
    cctx.arc(c.x + Math.sin(c.angle) * c.swing, c.y, c.r, 0, 2 * Math.PI);
    cctx.fillStyle = c.color;
    cctx.globalAlpha = 0.85;
    cctx.fill();
    cctx.restore();
    c.y += c.speed;
    c.angle += c.swingSpeed;
    if (c.y > window.innerHeight + 20) {
      c.y = -10;
      c.x = Math.random() * window.innerWidth;
    }
  });
  confettiAnimationId = requestAnimationFrame(drawConfetti);
}
drawConfetti();

// Arrêter les confettis après 10 secondes
setTimeout(() => {
  cancelAnimationFrame(confettiAnimationId);
  cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
}, 10000);

// Animation du titre
d3.select(".conclusion-title")
  .transition()
  .duration(1000)
  .delay(500)
  .style("opacity", 1)
  .style("transform", "translateY(0)")
  .style("transform-origin", "center");

// Animation du texte
d3.selectAll(".conclusion-text p").each(function (d, i) {
  d3.select(this)
    .transition()
    .duration(800)
    .delay(1500 + i * 500) // Délai progressif pour chaque paragraphe
    .style("opacity", 1)
    .style("transform", "translateY(0)")
    .style("transform-origin", "center");
});

// Ajout d'un effet de survol sur le texte
d3.selectAll(".conclusion-text p")
  .on("mouseover", function () {
    d3.select(this)
      .transition()
      .duration(300)
      .style("transform", "scale(1.05)")
      .style("color", "#f0f0f0");
  })
  .on("mouseout", function () {
    d3.select(this)
      .transition()
      .duration(300)
      .style("transform", "scale(1)")
      .style("color", "white");
  });
document.querySelector(".recommencer").addEventListener("click", function (e) {
  console.log("Recommencer clicked");
  window.location.href = "index.html";
});
