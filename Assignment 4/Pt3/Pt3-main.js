/*
Name: Saadat Baig
File: Pt3-main.js
Date: 01 August 2025
Starter JavaScript for object building practice (Part 3)
*/

// Canvas setup
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// Utility functions
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

// Ball constructor
function Ball(x, y, velX, velY, color, size) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.color = color;
  this.size = size;
}

// Draw method
Ball.prototype.draw = function () {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

// Update method
Ball.prototype.update = function () {
  if ((this.x + this.size) >= width || (this.x - this.size) <= 0) {
    this.velX = -this.velX;
  }

  if ((this.y + this.size) >= height || (this.y - this.size) <= 0) {
    this.velY = -this.velY;
  }

  this.x += this.velX;
  this.y += this.velY;
};

// Collision detection method
Ball.prototype.collisionDetect = function () {
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
};