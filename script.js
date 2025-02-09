/*******************************************
 * script.js
 * Minimal Speed Racer
 * 
 * - No external images or audio used.
 * - Rectangles for player and obstacles.
 * - Simple collision detection.
 * - Start and Game Over overlays.
 * - Score and localStorage best score.
 * - iPhone friendly with touch controls.
 *******************************************/

// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Dimensions
const W = canvas.width;
const H = canvas.height;

// Game state
let gameRunning = false;
let animationId = null;
let score = 0;
let bestScore = 0;
let frameCount = 0;

// Player
const player = {
  width: 40,
  height: 80,
  x: W / 2 - 20,
  y: H - 100,
  speed: 6,
  color: "#00ff00"
};

// Obstacles
let obstacles = [];
let obstacleSpeed = 5;
let spawnInterval = 100;

// Load best score from localStorage
function loadBestScore() {
  const saved = localStorage.getItem("bestScore");
  if (saved) bestScore = parseInt(saved, 10);
  document.getElementById("bestScoreValue").textContent = bestScore;
}
loadBestScore();

// Update best score
function updateBestScore() {
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("bestScore", bestScore);
    document.getElementById("bestScoreValue").textContent = bestScore;
  }
}

// Start Game
function startGame() {
  // Reset
  obstacles = [];
  score = 0;
  frameCount = 0;
  document.getElementById("scoreValue").textContent = score;

  // Reset player position
  player.x = W / 2 - player.width / 2;
  player.y = H - player.height - 20;

  // Hide Overlays
  document.getElementById("startScreen").classList.remove("active");
  document.getElementById("gameOverScreen").classList.remove("active");

  gameRunning = true;
  gameLoop();
}

// Stop Game
function stopGame() {
  gameRunning = false;
  cancelAnimationFrame(animationId);
  updateBestScore();

  // Show final score
  document.getElementById("finalScoreText").textContent = `Your final score: ${score}`;
  document.getElementById("gameOverScreen").classList.add("active");
}

// Game loop
function gameLoop() {
  if (!gameRunning) return;
  animationId = requestAnimationFrame(gameLoop);
  update();
  draw();
}

// Update
function update() {
  frameCount++;

  // Spawn obstacles
  if (frameCount % spawnInterval === 0) {
    createObstacle();
  }

  // Move obstacles
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].y += obstacleSpeed;
    if (obstacles[i].y > H) {
      // Off-screen
      obstacles.splice(i, 1);
      score++;
      document.getElementById("scoreValue").textContent = score;
    }
  }

  // Collision check
  checkCollisions();
}

// Draw
function draw() {
  ctx.clearRect(0, 0, W, H);
  drawBackground();
  drawPlayer();
  drawObstacles();
}

// Background
function drawBackground() {
  // Simple gradient
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "#333333");
  grad.addColorStop(1, "#666666");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Middle dashed line
  ctx.strokeStyle = "#ffffff";
  ctx.setLineDash([20, 10]);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(W / 2, 0);
  ctx.lineTo(W / 2, H);
  ctx.stroke();
  ctx.setLineDash([]);
}

// Player
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Obstacles
function createObstacle() {
  const obstacleWidth = 50;
  const obstacleHeight = 80;
  const randomX = Math.floor(Math.random() * (W - obstacleWidth));
  obstacles.push({
    x: randomX,
    y: -obstacleHeight,
    width: obstacleWidth,
    height: obstacleHeight,
    color: "#ff0000"
  });
}

function drawObstacles() {
  for (let obs of obstacles) {
    ctx.fillStyle = obs.color;
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  }
}

// Collision detection
function checkCollisions() {
  for (let i = 0; i < obstacles.length; i++) {
    if (isColliding(player, obstacles[i])) {
      // Game Over
      stopGame();
      break;
    }
  }
}

function isColliding(r1, r2) {
  return !(
    r1.x + r1.width < r2.x ||
    r1.x > r2.x + r2.width ||
    r1.y + r1.height < r2.y ||
    r1.y > r2.y + r2.height
  );
}

// Event Listeners (Keyboard)
document.addEventListener("keydown", e => {
  if (!gameRunning) return;
  switch (e.key) {
    case "ArrowLeft":
    case "a":
      player.x -= player.speed;
      if (player.x < 0) player.x = 0;
      break;
    case "ArrowRight":
    case "d":
      player.x += player.speed;
      if (player.x + player.width > W) player.x = W - player.width;
      break;
    case "ArrowUp":
    case "w":
      player.y -= player.speed;
      if (player.y < 0) player.y = 0;
      break;
    case "ArrowDown":
    case "s":
      player.y += player.speed;
      if (player.y + player.height > H) player.y = H - player.height;
      break;
  }
});

// Touch controls
function movePlayer(dx, dy) {
  player.x += dx * player.speed;
  player.y += dy * player.speed;
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > W) player.x = W - player.width;
  if (player.y < 0) player.y = 0;
  if (player.y + player.height > H) player.y = H - player.height;
}

document.getElementById("leftBtn").addEventListener("touchstart", () => {
  if (gameRunning) movePlayer(-1, 0);
});
document.getElementById("rightBtn").addEventListener("touchstart", () => {
  if (gameRunning) movePlayer(1, 0);
});
document.getElementById("upBtn").addEventListener("touchstart", () => {
  if (gameRunning) movePlayer(0, -1);
});
document.getElementById("downBtn").addEventListener("touchstart", () => {
  if (gameRunning) movePlayer(0, 1);
});

// Start / Restart
document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("restartButton").addEventListener("click", startGame);

// Home link - scroll to top
document.getElementById("homeLink").addEventListener("click", e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

