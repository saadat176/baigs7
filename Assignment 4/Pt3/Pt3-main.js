/*
Name: Saadat Baig
File: Pt3-main.js
Date: 02 August 2025
*/

// Canvas setup with dynamic resizing
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
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

// ------------------------
// Shape (superclass)
// ------------------------
class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}

// ------------------------
// Ball (extends Shape)
// ------------------------
class Ball extends Shape {
  constructor(x, y, velX, velY, color, size) {
    super(x, y, velX, velY);
    this.color = color;
    this.size = size;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    if ((this.x + this.size) >= width || (this.x - this.size) <= 0) {
      this.velX = -this.velX;
    }

    if ((this.y + this.size) >= height || (this.y - this.size) <= 0) {
      this.velY = -this.velY;
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect() {
    for (let i = 0; i < balls.length; i++) {
      if (!(this === balls[i])) {
        const dx = this.x - balls[i].x;
        const dy = this.y - balls[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + balls[i].size) {
          balls[i].color = this.color = randomRGB();
        }
      }
    }
  }
}

// ------------------------
// Create and populate balls
// ------------------------
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

// ------------------------
// Animation Loop
// ------------------------
function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
  }

  requestAnimationFrame(loop);
}

loop();