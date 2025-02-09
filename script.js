const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// Game Variables
let player = { x: 180, y: 500, width: 40, height: 60, speed: 7 };
let obstacles = [];
let gameOver = false;
let score = 0;
let gameStarted = false;

// Handle Keyboard Input
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" && player.x > 10) player.x -= player.speed;
    if (e.key === "ArrowRight" && player.x < canvas.width - player.width - 10) player.x += player.speed;
});

// Handle Touch Input for Mobile
canvas.addEventListener("touchstart", (e) => {
    let touchX = e.touches[0].clientX;
    if (touchX < canvas.width / 2) {
        player.x -= player.speed;
    } else {
        player.x += player.speed;
    }
});

// Start Game When Button is Clicked
document.getElementById("start-button").addEventListener("click", function () {
    if (!gameStarted) {
        gameStarted = true;
        gameOver = false;
        score = 0;
        obstacles = [];
        player.x = 180;
        requestAnimationFrame(updateGame);
    }
});

// Game Loop
function updateGame() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Player Car
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Generate Obstacles
    if (Math.random() < 0.02) {
        let obsX = Math.random() * (canvas.width - 40);
        obstacles.push({ x: obsX, y: 0, width: 40, height: 60, speed: 3 });
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
            gameStarted = false;
        }

        // Remove Off-Screen Obstacles
        if (obs.y > canvas.height) obstacles.splice(index, 1);
    });

    // Update Score
    score++;
    document.getElementById("score").textContent = score;

    requestAnimationFrame(updateGame);
}
