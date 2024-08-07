const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");
const pauseBtn = document.getElementById("pauseBtn");
const menu = document.getElementById("menu");
const mainMenuBtn = document.getElementById("mainMenuBtn");
const resumeBtn = document.getElementById("resumeBtn");
const restartBtn = document.getElementById("restartBtn");

function resizeCanvas() {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.6;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const net = {
    x: canvas.width / 2 - 1,
    y: 0,
    width: 2,
    height: canvas.height,
    color: "#fff"
};

const player = {
    x: 0,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    color: "#fff",
    score: 0
};

const computer = {
    x: canvas.width - 10,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    color: "#fff",
    score: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: "#05edff"
};

const winningScore = 10;
let isGameOver = false;
let isPaused = false;

function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

function drawNet() {
    drawRect(net.x, net.y, net.width, net.height, net.color);
}

function drawText(text, x, y, color) {
    context.fillStyle = color;
    context.font = "45px Arial";
    context.fillText(text, x, y);
}

function render() {
    drawRect(0, 0, canvas.width, canvas.height, "rgba(0, 0, 0, 0.5)");
    drawNet();
    drawText(player.score, canvas.width / 4, canvas.height / 5, "#fff");
    drawText(computer.score, 3 * canvas.width / 4, canvas.height / 5, "#fff");
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(computer.x, computer.y, computer.width, computer.height, computer.color);
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

canvas.addEventListener("mousemove", movePaddle);
canvas.addEventListener("touchmove", movePaddleTouch);

function movePaddle(evt) {
    let rect = canvas.getBoundingClientRect();
    player.y = evt.clientY - rect.top - player.height / 2;

    if (player.y < 0) {
        player.y = 0;
    } else if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }
}

function movePaddleTouch(evt) {
    evt.preventDefault();
    let rect = canvas.getBoundingClientRect();
    player.y = evt.touches[0].clientY - rect.top - player.height / 2;

    if (player.y < 0) {
        player.y = 0;
    } else if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }
}

function collision(b, p) {
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}

function checkGameOver() {
    if (player.score >= winningScore || computer.score >= winningScore) {
        isGameOver = true;
        const message = player.score >= winningScore ? "Ganaste" : "Perdiste";
        document.getElementById("message").innerText = message;
    }
}

function update() {
    if (isGameOver || isPaused) return;

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    let playerPaddle = ball.x < canvas.width / 2 ? player : computer;

    if (collision(ball, playerPaddle)) {
        let collidePoint = (ball.y - (playerPaddle.y + playerPaddle.height / 2)) / (playerPaddle.height / 2);
        let angleRad = collidePoint * Math.PI / 4;
        let direction = ball.x < canvas.width / 2 ? 1 : -1;

        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        ball.speed += 0.1;
    }

    if (ball.x - ball.radius < 0) {
        computer.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        player.score++;
        resetBall();
    }

    computer.y += (ball.y - (computer.y + computer.height / 2)) * 0.1;

    checkGameOver();
}

function game() {
    render();
    update();
}

pauseBtn.addEventListener("click", () => {
    isPaused = true;
    menu.classList.remove("hidden");
});

resumeBtn.addEventListener("click", () => {
    isPaused = false;
    menu.classList.add("hidden");
});

restartBtn.addEventListener("click", () => {
    player.score = 0;
    computer.score = 0;
    resetBall();
    isPaused = false;
    isGameOver = false;
    document.getElementById("message").innerText = "";
    menu.classList.add("hidden");
});

mainMenuBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});

let framePerSecond = 50;
setInterval(game, 1000 / framePerSecond);
