/*******************************************
 * script.js (Updated)
 * Speed Racer - Minimal with Car Shapes
 * 
 * - Uses Canvas API to render cars (not just rectangles).
 * - Player car has a windshield and wheels.
 * - Obstacle cars have a different color.
 * - Game logic remains the same.
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

// Player Car
const player = {
  width: 50, // Wider for a better look
  height: 80,
  x: W / 2 - 25,
  y: H - 120,
  speed: 6,
  color: "#00ff00" // Green player car
};

// Obstacles (Enemy Cars)
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
  // Reset game
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
  drawPlayerCar();
  drawObstacleCars();
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

// Draw Player Car
function drawPlayerCar() {
  ctx.fillStyle = player.color;
  
  // Rounded Rectangle (Car Body)
  drawRoundedRect(player.x, player.y, player.width, player.height, 10);

  // Windshield (Small Rectangle at Top)
  ctx.fillStyle = "#000";
  ctx.fillRect(player.x + 10, player.y + 10, player.width - 20, 10);

  // Wheels (Circles)
  ctx.fillStyle = "#222";
  drawWheel(player.x + 5, player.y + 20);
  drawWheel(player.x + player.width - 10, player.y + 20);
  drawWheel(player.x + 5, player.y + player.height - 20);
  drawWheel(player.x + player.width - 10, player.y + player.height - 20);
}

// Draw Enemy Cars
function drawObstacleCars() {
  for (let obs of obstacles) {
    ctx.fillStyle = "#ff0000"; // Red enemy car
    drawRoundedRect(obs.x, obs.y, obs.width, obs.height, 10);

    // Windshield
    ctx.fillStyle = "#000";
    ctx.fillRect(obs.x + 10, obs.y + 10, obs.width - 20, 10);

    // Wheels
    ctx.fillStyle = "#222";
    drawWheel(obs.x + 5, obs.y + 20);
    drawWheel(obs.x + obs.width - 10, obs.y + 20);
    drawWheel(obs.x + 5, obs.y + obs.height - 20);
    drawWheel(obs.x + obs.width - 10, obs.y + obs.height - 20);
  }
}

// Draw Rounded Rectangle (For Cars)
function drawRoundedRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.fill();
}

// Draw Wheels (Circles)
function drawWheel(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fill();
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
    height: obstacleHeight
  });
}

// Collision detection
function checkCollisions() {
  for (let i = 0; i < obstacles.length; i++) {
    if (isColliding(player, obstacles[i])) {
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
  if (e.key === "ArrowLeft" || e.key === "a") player.x = Math.max(0, player.x - player.speed);
  if (e.key === "ArrowRight" || e.key === "d") player.x = Math.min(W - player.width, player.x + player.speed);
});

// Start / Restart
document.getElementById("startButton").addEventListener("click", startGame);
document.getElementById("restartButton").addEventListener("click", startGame);
