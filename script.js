const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// Game Variables
let player = { x: 180, y: 500, width: 40, height: 60, speed: 7 };
let obstacles = [];
let gameOver = false;
let score = 0;
let speedMultiplier = 0.005;
let keys = {};
let gameStarted = false;
const roadLines = [];
const carImg = new Image();
carImg.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Circle-icons-car.svg/2048px-Circle-icons-car.svg.png";

// Handle Keyboard Input
window.addEventListener("keydown", (e) => keys[e.key] = true);
window.addEventListener("keyup", (e) => keys[e.key] = false);

// Handle Touch Input for Mobile
canvas.addEventListener("touchstart", handleTouch);

function handleTouch(e) {
    let touchX = e.touches[0].clientX;
    if (touchX < canvas.width / 2) {
        player.x -= player.speed;
    } else {
        player.x += player.speed;
    }
}

// Start Game
document.getElementById("start-button").addEventListener("click", startGame);

function startGame() {
    gameStarted = true;
    gameOver = false;
    score = 0;
    obstacles = [];
    player.x = 180;
    requestAnimationFrame(updateGame);
}

// Game Loop
function updateGame() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Player Car
    ctx.drawImage(carImg, player.x, player.y, player.width, player.height);

    // Move Player
    if (keys["ArrowLeft"] && player.x > 10) player.x -= player.speed;
    if (keys["ArrowRight"] && player.x < canvas.width - player.width - 10) player.x += player.speed;

    // Generate Obstacles
    if (Math.random() < 0.02) {
        let obsX = Math.random() * (canvas.width - 40);
        obstacles.push({ x: obsX, y: 0, width: 40, height: 60, speed: 2 + score * speedMultiplier });
    }

    // Move Obstacles
    obstacles.forEach((obs, index) => {
        obs.y += obs.speed;
        ctx.fillStyle = "red";
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

        // Collision Detection
        if (
            player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y
        ) {
            gameOver = true;
            alert(`Game Over! Score: ${score}`);
        }

        // Remove Off-Screen Obstacles
        if (obs.y > canvas.height) obstacles.splice(index, 1);
    });

    // Update Score
    score++;
    document.getElementById("score").textContent = score;

    requestAnimationFrame(updateGame);
}
