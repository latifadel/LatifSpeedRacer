/*******************************************
 * script.js
 * Speed Racer Game
 * 
 * This script handles:
 *  1. Canvas rendering
 *  2. Game object definitions
 *  3. Event listeners (keyboard, touch)
 *  4. Main game loop (update & draw)
 *  5. Collision detection
 *  6. Score & localStorage best score
 *  7. PWA install prompt
 *******************************************/

// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Dimensions
const W = canvas.width;
const H = canvas.height;

// Global Game Variables
let gameRunning = false;
let animationId = null;
let score = 0;
let bestScore = 0;
let obstacleSpeed = 5;
let spawnInterval = 100; // frames between obstacle spawns
let frameCount = 0;

// Player Car Object
const player = {
  width: 40,
  height: 80,
  x: W / 2 - 20, // center horizontally
  y: H - 100,    // near bottom
  speed: 8,
  color: "#00ff00"
};

// List of obstacles
let obstacles = [];

/*******************************************
 * Utility Functions
 *******************************************/

/**
 * Get best score from local storage
 */
function loadBestScore() {
  const savedBest = localStorage.getItem("bestScore");
  if (savedBest) {
    bestScore = parseInt(savedBest, 10);
  } else {
    bestScore = 0;
  }
  document.getElementById("bestScoreValue").textContent = bestScore;
}

/**
 * Update best score in local storage if current score is higher
 */
function updateBestScore() {
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("bestScore", bestScore);
  }
}

/*******************************************
 * Obstacle Management
 *******************************************/

/**
 * Create a new obstacle at random x
 * with defined width, height, and color
 */
function createObstacle() {
  const obstacleWidth = 50;
  const obstacleHeight = 80;
  // random x, but ensure it stays within canvas bounds
  const randomX = Math.floor(Math.random() * (W - obstacleWidth));
  const obstacle = {
    x: randomX,
    y: -obstacleHeight,
    width: obstacleWidth,
    height: obstacleHeight,
    color: "red"
  };
  obstacles.push(obstacle);
}

/**
 * Update obstacles position
 */
function updateObstacles() {
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].y += obstacleSpeed;

    // If obstacle goes off canvas, remove it & increment score
    if (obstacles[i].y > H) {
      obstacles.splice(i, 1);
      score++;
      document.getElementById("scoreValue").textContent = score;
    }
  }
}

/*******************************************
 * Collision Detection
 *******************************************/

/**
 * Check if two rectangles overlap
 */
function isColliding(r1, r2) {
  return !(
    r1.x + r1.width < r2.x ||
    r1.x > r2.x + r2.width ||
    r1.y + r1.height < r2.y ||
    r1.y > r2.y + r2.height
  );
}

/**
 * Check for collisions between player and obstacles
 */
function checkCollisions() {
  for (let i = 0; i < obstacles.length; i++) {
    if (isColliding(player, obstacles[i])) {
      // Collision detected
      stopGame();
      break;
    }
  }
}

/*******************************************
 * Drawing Functions
 *******************************************/

/**
 * Clear the canvas
 */
function clearCanvas() {
  ctx.clearRect(0, 0, W, H);
}

/**
 * Draw the player car
 */
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

/**
 * Draw obstacles
 */
function drawObstacles() {
  obstacles.forEach(obstacle => {
    ctx.fillStyle = obstacle.color;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

/**
 * Draw road lines or background
 * (Optional: you could add a scrolling background here)
 */
function drawBackground() {
  // For a simple approach, draw a background color or gradient
  let grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "#333333");
  grad.addColorStop(1, "#666666");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Additional design for the road
  // (e.g., vertical road lines in the center)
  ctx.strokeStyle = "#ffffff";
  ctx.setLineDash([20, 10]); // dashed line
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(W / 2, 0);
  ctx.lineTo(W / 2, H);
  ctx.stroke();
  ctx.setLineDash([]);
}

/*******************************************
 * Main Update/Draw Loop
 *******************************************/
function update() {
  frameCount++;

  // Spawn new obstacles at intervals
  if (frameCount % spawnInterval === 0) {
    createObstacle();
  }

  // Update obstacle positions
  updateObstacles();

  // Check collisions
  checkCollisions();
}

function draw() {
  clearCanvas();
  drawBackground();
  drawPlayer();
  drawObstacles();
}

/**
 * Main Game Loop
 */
function gameLoop() {
  update();
  draw();
  if (gameRunning) {
    animationId = requestAnimationFrame(gameLoop);
  }
}

/*******************************************
 * Game Start/Stop
 *******************************************/
function startGame() {
  // Reset game variables
  obstacles = [];
  score = 0;
  document.getElementById("scoreValue").textContent = score;

  // Reset player position (center at bottom)
  player.x = W / 2 - player.width / 2;
  player.y = H - player.height - 20;

  // Hide start screen, show game
  document.getElementById("startScreen").classList.remove("active");
  document.getElementById("gameOverScreen").classList.remove("active");

  // Start loop
  gameRunning = true;
  frameCount = 0;
  gameLoop();
}

function stopGame() {
  gameRunning = false;
  cancelAnimationFrame(animationId);

  // Update best score
  updateBestScore();
  document.getElementById("bestScoreValue").textContent = bestScore;

  // Show final score
  document.getElementById("finalScoreText").textContent = `Your final score: ${score}`;

  // Show game over screen
  document.getElementById("gameOverScreen").classList.add("active");
}

/*******************************************
 * Event Listeners (Keyboard)
 *******************************************/
document.addEventListener("keydown", function (e) {
  if (!gameRunning) return;

  if (e.key === "ArrowLeft" || e.key === "a") {
    // Move left
    player.x -= player.speed;
    if (player.x < 0) player.x = 0;
  } else if (e.key === "ArrowRight" || e.key === "d") {
    // Move right
    player.x += player.speed;
    if (player.x + player.width > W) {
      player.x = W - player.width;
    }
  }
});

/*******************************************
 * Event Listeners (Touch Buttons)
 *******************************************/
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

if (leftBtn && rightBtn) {
  leftBtn.addEventListener("touchstart", () => {
    if (!gameRunning) return;
    player.x -= player.speed;
    if (player.x < 0) player.x = 0;
  });

  rightBtn.addEventListener("touchstart", () => {
    if (!gameRunning) return;
    player.x += player.speed;
    if (player.x + player.width > W) {
      player.x = W - player.width;
    }
  });
}

/*******************************************
 * Start / Restart Buttons
 *******************************************/
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);

/*******************************************
 * PWA Install Prompt
 *******************************************/
let deferredPrompt; 
const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  // Update UI notify the user they can install the PWA
  installBtn.hidden = false;

  installBtn.addEventListener("click", () => {
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      installBtn.hidden = true;
    });
  });
});

/*******************************************
 * On Window Load
 *******************************************/
window.onload = function () {
  loadBestScore();
  // Show the start screen
  document.getElementById("startScreen").classList.add("active");
};
