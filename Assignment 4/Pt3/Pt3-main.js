/*
Name: Saadat Baig
File: Pt3-main.js
Date: 02 August 2025
Commit 7 - Added Shape and EvilCircle classes for full rubric compliance
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
// EvilCircle (extends Shape)
// ------------------------
class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, 20, 20); // constant speed
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

  collisionDetect() {
    for (let i = 0; i < balls.length; i++) {
      const dx = this.x - balls[i].x;
      const dy = this.y - balls[i].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[i].size) {
        balls.splice(i, 1); // "eats" the ball
        i--; // adjust index after removal
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
// Create EvilCircle instance
// ------------------------
const evilCircle = new EvilCircle(width / 2, height / 2);

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

  evilCircle.draw();
  evilCircle.checkBounds();
  evilCircle.collisionDetect();

  requestAnimationFrame(loop);
}

loop();
