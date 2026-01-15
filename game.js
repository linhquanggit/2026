
const gameCtx = gameCanvas.getContext('2d');

gameCanvas.width = window.innerWidth;
gameCanvas.height = window.innerHeight;

let player, obstacles, score, gameOver;

const playerImg = new Image();
const obstacleImg = new Image();

let imagesToLoad = 2;

function imagesLoaded() {
    imagesToLoad--;
    if (imagesToLoad === 0) {
        // The startGame function is called from script.js
    }
}

playerImg.onload = imagesLoaded;
obstacleImg.onload = imagesLoaded;

playerImg.src = 'data:image/svg+xml,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="50" height="50">
    <defs>
        <filter id="neon-glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
    </defs>
    <circle cx="50" cy="50" r="45" fill="#00ffff" stroke="#00ffff" stroke-width="2" filter="url(#neon-glow)"/>
    <circle cx="35" cy="40" r="5" fill="black"/>
    <circle cx="65"cy="40" r="5" fill="black"/>
    <path d="M 30 60 Q 50 80 70 60" stroke="black" stroke-width="5" fill="none"/>
</svg>
`);

obstacleImg.src = 'data:image/svg+xml,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="50" height="50">
    <defs>
        <filter id="neon-glow-red">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
    </defs>
    <polygon points="50,0 100,50 50,100 0,50" fill="#ff00ff" stroke="#ff00ff" stroke-width="2" filter="url(#neon-glow-red)"/>
</svg>
`);

function startGame() {
    player = {
        x: gameCanvas.width / 2 - 25,
        y: gameCanvas.height - 60,
        width: 50,
        height: 50,
        speed: 20
    };
    obstacles = [];
    score = 0;
    gameOver = false;
    if (gameLoop) {
      gameLoop();
    }
}

function spawnObstacle() {
    const size = Math.random() * 30 + 20;
    const x = Math.random() * (gameCanvas.width - size);
    const speed = Math.random() * 3 + 2 + (score / 100);
    obstacles.push({
        x: x,
        y: -size,
        width: size,
        height: size,
        speed: speed
    });
}

function updateGame() {
    if (gameOver) return;

    for (let i = 0; i < obstacles.length; i++) {
        const obs = obstacles[i];
        obs.y += obs.speed;

        if (
            player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y
        ) {
            gameOver = true;
        }

        if (obs.y > gameCanvas.height) {
            obstacles.splice(i, 1);
            i--;
            score++;
        }
    }

    if (Math.random() < 0.05 + (score / 1000)) {
        spawnObstacle();
    }
}

function drawGame() {
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    gameCtx.drawImage(playerImg, player.x, player.y, player.width, player.height);

    for (const obs of obstacles) {
        gameCtx.drawImage(obstacleImg, obs.x, obs.y, obs.width, obs.height);
    }

    gameCtx.fillStyle = '#00ffff';
    gameCtx.font = '24px Arial';
    gameCtx.shadowColor = '#00ffff';
    gameCtx.shadowBlur = 10;
    gameCtx.fillText('Score: ' + score, 10, 30);

    if (gameOver) {
        gameCtx.font = '48px Arial';
        gameCtx.shadowColor = '#ff00ff';
        gameCtx.shadowBlur = 15;
        gameCtx.fillText('Game Over', gameCanvas.width / 2 - 120, gameCanvas.height / 2);
        gameCtx.font = '24px Arial';
        gameCtx.fillText('Press Enter to Restart', gameCanvas.width / 2 - 120, gameCanvas.height / 2 + 50);
    }
    gameCtx.shadowBlur = 0;
}

function gameLoop() {
    updateGame();
    drawGame();
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

window.addEventListener('keydown', (e) => {
    if (!player) return;
    if (gameOver) {
      if (e.key === 'Enter') {
        startGame();
      }
      return;
    }
    if (e.key === 'ArrowLeft' || e.key === 'a') {
        player.x -= player.speed;
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
        player.x += player.speed;
    }

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > gameCanvas.width) {
        player.x = gameCanvas.width - player.width;
    }
});

window.addEventListener('resize', () => {
    gameCanvas.width = window.innerWidth;
    gameCanvas.height = window.innerHeight;
    if(player) {
        player.y = gameCanvas.height - 60;
    }
});