/*
Name: Saadat Baig
File: Pt2-main.js
Date: 01 August 2025
JavaScript logic for building a dynamic image gallery (Step 2 – DOM references and setup).
*/

// DOM element references
const displayedImage = document.querySelector('.full-img img');
const thumbBar = document.querySelector('.thumb-bar');
const btn = document.querySelector('button');
const overlay = document.querySelector('.overlay');

// Image file names and alt text
const imageList = [
  {
    src: 'images/pic1.jpg',
    alt: 'Closeup of a human eye'
  },
  {
    src: 'images/pic2.jpg',
    alt: 'Rock that looks like a wave'
  },
  {
    src: 'images/pic3.jpg',
    alt: 'Purple and white pansies'
  },
  {
    src: 'images/pic4.jpg',
    alt: 'Section of wall from a pharaoh’s tomb'
  },
  {
    src: 'images/pic5.jpg',
    alt: 'Large moth on a leaf'
  }
];