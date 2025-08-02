/*
Name: Saadat Baig
File: Pt4-main.js
Date: 03 August 2025
Commit 2 - Added score and lives system setup
*/

// Score and lives variables
let score = 0;
let lives = 3;

// DOM elements
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');

// Functions to update display
function updateScore(value) {
  score += value;
  scoreDisplay.textContent = `Score: ${score}`;
}

function updateLives(value) {
  lives += value;
  livesDisplay.textContent = `Lives: ${lives}`;
}

// Canvas setup
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let width, height;

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

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

    if ((this.x + this.size) >= width || (this.x - this.size) <= 0) {
      this.velX = -this.velX;
    }

    if ((this.y + this.size) >= height || (this.y - this.size) <= 0) {
      this.velY = -this.velY;
    }

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
    if ((this.x + this.size) >= width) this.x = width - this.size;
    if ((this.x - this.size) <= 0) this.x = this.size;
    if ((this.y + this.size) >= height) this.y = height - this.size;
    if ((this.y - this.size) <= 0) this.y = this.size;
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

// Create balls
const balls = [];
while (balls.length < 25) {
  const size = random(10, 20);
  const ball = new Ball(
    random(size, width - size),
    random(size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size
  );
  balls.push(ball);
}

// Create EvilCircle
const evilCircle = new EvilCircle(width / 2, height / 2);

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

  requestAnimationFrame(loop);
}

loop();