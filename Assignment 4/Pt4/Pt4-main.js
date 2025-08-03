/*
Name: Saadat Baig
File: Pt4-main.js
Date: 02 August 2025
*/

// Score and lives variables
let score = 0;
let lives = 3;
let gameOver = false;

// DOM elements
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');

// Canvas setup
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let width, height;

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);

// Functions to update display
function updateScore(value) {
  score += value;
  scoreDisplay.textContent = `Score: ${score}`;
}

function updateLives(value) {
  lives += value;
  if (lives < 0) lives = 0;
  livesDisplay.textContent = `Lives: ${lives}`;
  if (lives === 0 && !gameOver) {
    gameOver = true;
    displayGameOver();
  }
}

function displayGameOver() {
  ctx.fillStyle = 'red';
  ctx.font = '48px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', width / 2, height / 2);
  ctx.font = '20px sans-serif';
  ctx.fillText('Press R to Restart', width / 2, height / 2 + 40);
}

// Utility functions
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomRGB() {
  return `rgb(${random(0,255)},${random(0,255)},${random(0,255)})`;
}

// Shape superclass
class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}

// Ball class
class Ball extends Shape {
  constructor(x, y, velX, velY, color, size) {
    super(x, y, velX, velY);
    this.color = color;
    this.size = size;
    this.exists = true;
  }

  draw() {
    if (!this.exists) return;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    if (!this.exists) return;
    if ((this.x + this.size) >= width || (this.x - this.size) <= 0) this.velX = -this.velX;
    if ((this.y + this.size) >= height || (this.y - this.size) <= 0) this.velY = -this.velY;
    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect(balls) {
    for (let i = 0; i < balls.length; i++) {
      const other = balls[i];
      if (this !== other && other.exists) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.size + other.size) {
          other.color = this.color = randomRGB();
        }
      }
    }
  }
}

// EvilCircle class
class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, 20, 20);
    this.color = 'white';
    this.size = 25;
    this.setControls();
  }

  draw() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  checkBounds() {
    const outLeft = (this.x - this.size) <= 0;
    const outRight = (this.x + this.size) >= width;
    const outTop = (this.y - this.size) <= 0;
    const outBottom = (this.y + this.size) >= height;

    if (outLeft || outRight || outTop || outBottom) {
      updateLives(-1);
      this.x = random(this.size, width - this.size);
      this.y = random(this.size, height - this.size);
    }
  }

  collisionDetect(balls) {
    for (let i = 0; i < balls.length; i++) {
      const ball = balls[i];
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.size + ball.size) {
          ball.exists = false;
          updateScore(1);
        }
      }
    }
  }

  setControls() {
    window.addEventListener('keydown', (e) => {
      if (gameOver && (e.key === 'r' || e.key === 'R')) {
        restartGame();
        return;
      }
      if (gameOver) return;

      switch (e.key) {
        case 'a':
        case 'ArrowLeft':
          this.x -= this.velX;
          break;
        case 'd':
        case 'ArrowRight':
          this.x += this.velX;
          break;
        case 'w':
        case 'ArrowUp':
          this.y -= this.velY;
          break;
        case 's':
        case 'ArrowDown':
          this.y += this.velY;
          break;
      }
    });
  }
}

// Game logic setup
let balls = [];
let evilCircle;

function createBalls() {
  balls = [];
  while (balls.length < 25) {
    const size = random(10, 20);
    balls.push(new Ball(
      random(size, width - size),
      random(size, height - size),
      random(-7, 7),
      random(-7, 7),
      randomRGB(),
      size
    ));
  }
}

function restartGame() {
  score = 0;
  lives = 3;
  gameOver = false;
  updateScore(0);
  updateLives(0);
  createBalls();

  evilCircle = new EvilCircle(
    random(25, width - 25),
    random(25, height - 25)
  );

  loop();
}

// MAIN START POINT — SAFE SPAWN AFTER RESIZE
window.addEventListener('load', () => {
  resizeCanvas();
  createBalls();
  evilCircle = new EvilCircle(
    random(25, width - 25),
    random(25, height - 25)
  );
  loop();
});

// Animation loop
function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);

  for (const ball of balls) {
    ball.draw();
    ball.update();
    ball.collisionDetect(balls);
  }

  evilCircle.draw();
  evilCircle.checkBounds();
  evilCircle.collisionDetect(balls);

  if (!gameOver) requestAnimationFrame(loop);
  else displayGameOver();
}
