/*
Name: Saadat Baig
File: Pt2-main.js
Date: 02 August 2025
JavaScript for dynamic image gallery thumbnail handling and darken/lighten toggle.
*/

const displayedImage = document.querySelector('.displayed');
const thumbBar = document.querySelector('.thumb-bar');
const btn = document.querySelector('button');

// Array of image file names and alt texts
const images = [
  { src: 'Images/pic1.jpg', alt: 'Closeup of a human eye' },
  { src: 'Images/pic2.jpg', alt: 'Abstract orange flow lines' },
  { src: 'Images/pic3.jpg', alt: 'Purple and white flowers' },
  { src: 'Images/pic4.jpg', alt: 'Egyptian art figures' },
  { src: 'Images/pic5.jpg', alt: 'Butterfly on green leaf' }
];

// Dynamically generate thumbnail images
images.forEach(image => {
  const newImage = document.createElement('img');
  newImage.setAttribute('src', image.src);
  newImage.setAttribute('alt', image.alt);
  thumbBar.appendChild(newImage);

  newImage.addEventListener('click', () => {
    displayedImage.setAttribute('src', image.src);
    displayedImage.setAttribute('alt', image.alt);
  });
});

// Toggle darken/lighten body background
btn.addEventListener('click', () => {
  const btnClass = btn.getAttribute('class');
  if (btnClass === 'dark') {
    btn.setAttribute('class', 'light');
    btn.textContent = 'Lighten';
    document.body.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  } else {
    btn.setAttribute('class', 'dark');
    btn.textContent = 'Darken';
    document.body.style.backgroundColor = 'white';
  }
});