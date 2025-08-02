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

// Functions to update display (will be used later)
function updateScore(value) {
  score += value;
  scoreDisplay.textContent = score;
}

function updateLives(value) {
  lives += value;
  livesDisplay.textContent = lives;
}